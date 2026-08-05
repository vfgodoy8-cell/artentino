/**
 * Script de diagnóstico standalone (NO es un test formal de Playwright).
 * Levanta el server de test en :3001 contra la DB de test, visita cada ruta
 * pública en 3 viewports mobile/tablet, detecta problemas de responsividad,
 * y vuelca todo en mobile-audit-report.md + screenshots.
 *
 * Uso: npx tsx e2e/mobile-audit.ts
 */
import { chromium, type Browser, type Page } from '@playwright/test'
import { spawn, execSync, type ChildProcessWithoutNullStreams } from 'child_process'
import path from 'path'
import fs from 'fs'
import { config as loadEnv } from 'dotenv'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../app/generated/prisma/client'

loadEnv({ path: path.resolve(__dirname, '../.env.test'), override: true })

const BASE_URL = 'http://localhost:3001'
const SCREENSHOT_DIR = path.resolve(__dirname, 'mobile-audit-screenshots')
const REPORT_PATH = path.resolve(__dirname, '../mobile-audit-report.md')
const ROOT = path.resolve(__dirname, '..')

const VIEWPORTS = [
  { name: '375x667 (iPhone SE)', width: 375, height: 667, slug: '375' },
  { name: '390x844 (iPhone estándar)', width: 390, height: 844, slug: '390' },
  { name: '768x1024 (tablet)', width: 768, height: 1024, slug: '768' },
] as const

type Severity = 'crítico' | 'medio' | 'menor'

type Finding = {
  severity: Severity
  category: string
  selector: string
  detail: string
}

type RouteAudit = {
  route: string
  label: string
  viewport: string
  findings: Finding[]
  screenshot?: string
}

const results: RouteAudit[] = []
const skipped: { route: string; reason: string }[] = []

// ─────────────────────────────────────────────────────────────────────────
// Setup: reset + seed test DB (mismo patrón que e2e/global-setup.ts)
// ─────────────────────────────────────────────────────────────────────────
function resetAndSeedDb() {
  const testDbUrl = process.env.DATABASE_URL_TEST
  if (!testDbUrl) {
    throw new Error('DATABASE_URL_TEST no está configurado en .env.test')
  }
  const env = {
    ...process.env,
    DATABASE_URL: testDbUrl,
    PRISMA_USER_CONSENT_FOR_DANGEROUS_AI_ACTION: 'si',
  }
  console.log('[setup] Reseteando base de datos de test...')
  execSync(`npx prisma db push --force-reset --url "${testDbUrl}"`, { env, cwd: ROOT, stdio: 'inherit' })
  console.log('[setup] Ejecutando seed de test...')
  execSync('npx tsx prisma/seed-test.ts', { env, cwd: ROOT, stdio: 'inherit' })
  console.log('[setup] Base de datos lista.\n')
}

async function fetchSeedIds() {
  const testDbUrl = process.env.DATABASE_URL_TEST!
  const adapter = new PrismaPg(testDbUrl)
  const prisma = new PrismaClient({ adapter })
  const [productA, productB, order] = await Promise.all([
    prisma.product.findUnique({ where: { slug: 'espejo-led-touch-60cm' } }),
    prisma.product.findUnique({ where: { slug: 'lampara-de-pie-negra' } }),
    prisma.order.findFirst(),
  ])
  await prisma.$disconnect()
  if (!productA || !productB || !order) {
    throw new Error('No se pudieron resolver los IDs sembrados (producto/orden) — revisar seed-test.ts')
  }
  return { productAId: productA.id, productBId: productB.id, orderId: order.id }
}

// ─────────────────────────────────────────────────────────────────────────
// Server lifecycle
// ─────────────────────────────────────────────────────────────────────────
function startServer(): ChildProcessWithoutNullStreams {
  const testEnv: NodeJS.ProcessEnv = {
    ...process.env,
    DATABASE_URL: process.env.DATABASE_URL_TEST ?? '',
    NEXTAUTH_URL: BASE_URL,
    NEXT_PUBLIC_BASE_URL: BASE_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ?? 'artentino-test-secret-minimo-32-chars!!',
  }
  for (const key of ['MP_ACCESS_TOKEN', 'CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET', 'RESEND_API_KEY']) {
    testEnv[key] = process.env[key] ?? 'test-placeholder'
  }

  console.log('[setup] Arrancando next dev --port 3001...')
  const child = spawn('npx', ['next', 'dev', '--port', '3001'], {
    cwd: ROOT,
    env: testEnv,
    shell: true,
  })
  child.stdout.on('data', () => {})
  child.stderr.on('data', (d: Buffer) => {
    const text = d.toString()
    if (/error/i.test(text)) console.error('[next dev]', text)
  })
  return child
}

async function waitForServer(timeoutMs = 90_000) {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(BASE_URL)
      if (res.ok || res.status < 500) return
    } catch {
      // todavía no está arriba
    }
    await new Promise((r) => setTimeout(r, 1000))
  }
  throw new Error('El server de test no levantó a tiempo')
}

// ─────────────────────────────────────────────────────────────────────────
// Auditoría de una página ya cargada
//
// IMPORTANTE: esto se pasa a page.evaluate() como STRING PLANO, no como una
// función TS. tsx (>=4.15) inyecta un helper __name() en cualquier función
// que compila —nombrada, arrow, anidada, da igual— y ese helper no existe
// una vez que Playwright serializa la función y la corre aislada en el
// browser (ReferenceError: __name is not defined). Un string nunca pasa por
// el compilador de TS, así que nunca lo sufre. Bug conocido:
// https://github.com/esbuild-kit/tsx/issues/113
// ─────────────────────────────────────────────────────────────────────────
const AUDIT_SCRIPT_SOURCE = `
function (vpWidth) {
  function cssPath(el) {
    var parts = [];
    var node = el;
    var depth = 0;
    while (node && node.nodeType === 1 && depth < 4) {
      var part = node.tagName.toLowerCase();
      if (node.id) {
        part += '#' + node.id;
        parts.unshift(part);
        break;
      }
      var cls = (node.className && typeof node.className === 'string' ? node.className : '')
        .split(/\\s+/).filter(Boolean).slice(0, 2).join('.');
      if (cls) part += '.' + cls;
      parts.unshift(part);
      node = node.parentElement;
      depth++;
    }
    return parts.join(' > ');
  }

  function isVisible(el) {
    var rect = el.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return false;
    var style = window.getComputedStyle(el);
    return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
  }

  // El elemento arranca fuera de la franja horizontal visible (rect.left >= vpWidth) —
  // típico de paneles off-canvas cerrados (cart drawer, menú mobile) posicionados con
  // translate-x-full a propósito. Distinto de "excede el viewport": acá NI EMPIEZA
  // a verse, no es un caso de layout roto. No confundir con position:fixed en general
  // (el layout fijo de /admin y el overlay de /login también son fixed pero SÍ están
  // en pantalla, con rect.left=0 — por eso se chequea la posición real, no la propiedad).
  function isOffScreenHorizontally(rect) {
    return rect.right <= 0 || rect.left >= vpWidth;
  }

  // Si algún ancestro recorta con overflow:hidden/clip, el contenido interno más ancho
  // que el viewport nunca genera scroll real (ej. el ticker del Marquee, ancho a
  // propósito para el efecto de scroll infinito) — no es un bug de layout. Solo aplica
  // al chequeo de "excede el viewport": overflow:hidden también se usa muchísimo para
  // redondear esquinas de tarjetas/imágenes sin ocultar nada, así que no lo uso para
  // descartar touch-target/texto-chico.
  function isClippedByAncestor(el) {
    var node = el.parentElement;
    while (node && node !== document.body) {
      var style = window.getComputedStyle(node);
      if (style.overflow === 'hidden' || style.overflowX === 'hidden' || style.overflow === 'clip') return true;
      node = node.parentElement;
    }
    return false;
  }

  var findings = [];

  var scrollWidth = document.documentElement.scrollWidth;
  if (scrollWidth > vpWidth + 1) {
    findings.push({
      category: 'overflow-documento',
      selector: 'html',
      detail: 'scrollWidth=' + scrollWidth + 'px excede el viewport (' + vpWidth + 'px) por ' + (scrollWidth - vpWidth) + 'px',
    });
  }

  var all = Array.prototype.slice.call(document.querySelectorAll('body *'));
  var overflowing = [];
  for (var i = 0; i < all.length; i++) {
    var el1 = all[i];
    if (!isVisible(el1)) continue;
    var rect1 = el1.getBoundingClientRect();
    if (isOffScreenHorizontally(rect1)) continue;
    if (rect1.right > vpWidth + 1 && rect1.width > 0 && !isClippedByAncestor(el1)) {
      overflowing.push({ el: el1, overshoot: Math.round(rect1.right - vpWidth) });
    }
  }
  overflowing.sort(function (a, b) { return b.overshoot - a.overshoot; });
  overflowing.slice(0, 12).forEach(function (o) {
    findings.push({
      category: 'elemento-excede-viewport',
      selector: cssPath(o.el),
      detail: 'right=' + Math.round(o.el.getBoundingClientRect().right) + 'px, excede por ' + o.overshoot + 'px',
    });
  });
  if (overflowing.length > 12) {
    findings.push({
      category: 'elemento-excede-viewport',
      selector: '(resumen)',
      detail: (overflowing.length - 12) + ' elementos adicionales excediendo el viewport, no listados individualmente',
    });
  }

  var interactive = Array.prototype.slice.call(
    document.querySelectorAll('button, a, input[type="submit"], input[type="button"], [role="button"]'),
  );
  var tooSmall = [];
  for (var j = 0; j < interactive.length; j++) {
    var el2 = interactive[j];
    if (!isVisible(el2)) continue;
    var rect2 = el2.getBoundingClientRect();
    if (isOffScreenHorizontally(rect2)) continue;
    if (rect2.width === 0 || rect2.height === 0) continue;
    if (rect2.width < 44 || rect2.height < 44) {
      tooSmall.push({ el: el2, w: Math.round(rect2.width), h: Math.round(rect2.height) });
    }
  }
  tooSmall.slice(0, 12).forEach(function (o) {
    var text = (o.el.textContent || '').trim().slice(0, 30);
    findings.push({
      category: 'touch-target-chico',
      selector: cssPath(o.el),
      detail: o.w + 'x' + o.h + 'px (mínimo recomendado 44x44) — texto: "' + text + '"',
    });
  });
  if (tooSmall.length > 12) {
    findings.push({
      category: 'touch-target-chico',
      selector: '(resumen)',
      detail: (tooSmall.length - 12) + ' elementos interactivos adicionales < 44x44px, no listados individualmente',
    });
  }

  var textEls = Array.prototype.slice.call(document.querySelectorAll('body *')).filter(function (el3) {
    if (!isVisible(el3) || isOffScreenHorizontally(el3.getBoundingClientRect())) return false;
    var childNodes = Array.prototype.slice.call(el3.childNodes);
    return childNodes.some(function (n) { return n.nodeType === 3 && (n.textContent || '').trim().length > 0; });
  });
  var tinyText = [];
  for (var k = 0; k < textEls.length; k++) {
    var el4 = textEls[k];
    var size = parseFloat(window.getComputedStyle(el4).fontSize);
    if (size < 12) tinyText.push({ el: el4, size: size });
  }
  tinyText.slice(0, 12).forEach(function (o) {
    var text2 = (o.el.textContent || '').trim().slice(0, 30);
    findings.push({
      category: 'texto-chico',
      selector: cssPath(o.el),
      detail: 'font-size=' + o.size + 'px — texto: "' + text2 + '"',
    });
  });
  if (tinyText.length > 12) {
    findings.push({
      category: 'texto-chico',
      selector: '(resumen)',
      detail: (tinyText.length - 12) + ' elementos de texto adicionales < 12px, no listados individualmente',
    });
  }

  return findings;
}
`

async function auditPage(page: Page, viewportWidth: number): Promise<Finding[]> {
  const raw = (await page.evaluate(`(${AUDIT_SCRIPT_SOURCE})(${viewportWidth})`)) as {
    category: string
    selector: string
    detail: string
  }[]

  return raw.map((f) => {
    let severity: Severity = 'menor'
    if (f.category === 'overflow-documento' || f.category === 'elemento-excede-viewport') severity = 'crítico'
    else if (f.category === 'touch-target-chico') severity = 'medio'
    else if (f.category === 'texto-chico') severity = 'menor'
    return { severity, category: f.category, selector: f.selector, detail: f.detail }
  })
}

async function auditAndRecord(page: Page, route: string, label: string, viewport: (typeof VIEWPORTS)[number], takeScreenshot: boolean) {
  const findings = await auditPage(page, viewport.width)
  let screenshot: string | undefined
  if (takeScreenshot && viewport.slug === '375') {
    const filename = `${label.replace(/[^a-z0-9_-]/gi, '_')}.png`
    const filepath = path.join(SCREENSHOT_DIR, filename)
    await page.screenshot({ path: filepath, fullPage: true })
    screenshot = `e2e/mobile-audit-screenshots/${filename}`
  }
  results.push({ route, label, viewport: viewport.name, findings, screenshot })
  const crit = findings.filter((f) => f.severity === 'crítico').length
  const med = findings.filter((f) => f.severity === 'medio').length
  const menor = findings.filter((f) => f.severity === 'menor').length
  console.log(`  [${viewport.slug}] ${label} — crítico:${crit} medio:${med} menor:${menor}`)
}

// ─────────────────────────────────────────────────────────────────────────
// Login helpers (UI real, para no depender de mecanismos internos de NextAuth)
// ─────────────────────────────────────────────────────────────────────────
async function loginAsUser(page: Page, email: string, password: string) {
  await gotoAndSettle(page, `${BASE_URL}/login`)
  await page.fill('input[name="email"]', email)
  await page.fill('input[name="password"]', password)
  await page.click('button[type="submit"]')
  await page.waitForURL(BASE_URL + '/', { timeout: 15_000 }).catch(() => {})
}

// Reemplaza waitUntil:'networkidle' (colgaba bajo next dev, saturando el pool de Prisma
// con navegaciones seguidas) por domcontentloaded + un settle corto, con un reintento.
async function gotoAndSettle(page: Page, url: string, settleMs = 500) {
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25_000 })
      await page.waitForTimeout(settleMs)
      return
    } catch (err) {
      if (attempt === 2) throw err
      await page.waitForTimeout(1000)
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Persistencia parcial por etapa (para poder correr public/user/admin en
// invocaciones separadas y no pisar el límite de tiempo de una sola corrida)
// ─────────────────────────────────────────────────────────────────────────
type Stage = 'public' | 'user' | 'admin'
const STAGES: Stage[] = ['public', 'user', 'admin']

function partialPath(stage: Stage) {
  return path.join(__dirname, `.mobile-audit-partial-${stage}.json`)
}

function savePartial(stage: Stage) {
  fs.writeFileSync(partialPath(stage), JSON.stringify({ results, skipped }, null, 2), 'utf-8')
  console.log(`[${stage}] Resultados parciales guardados en ${partialPath(stage)}`)
}

function loadAllPartials() {
  for (const stage of STAGES) {
    const p = partialPath(stage)
    if (!fs.existsSync(p)) {
      console.warn(`[merge] falta ${p} — corré esa etapa antes de mergear`)
      continue
    }
    const data = JSON.parse(fs.readFileSync(p, 'utf-8')) as { results: RouteAudit[]; skipped: typeof skipped }
    results.push(...data.results)
    skipped.push(...data.skipped)
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────
async function main() {
  const stageArg = process.argv[2] as Stage | 'merge' | undefined
  if (!stageArg || !['public', 'user', 'admin', 'merge'].includes(stageArg)) {
    console.error('Uso: npx tsx e2e/mobile-audit.ts <public|user|admin|merge>')
    process.exit(1)
  }

  if (stageArg === 'merge') {
    loadAllPartials()
    writeReport()
    return
  }

  const stage = stageArg
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true })

  resetAndSeedDb()
  const seedIds = await fetchSeedIds()
  const server = startServer()

  let browser: Browser | undefined
  try {
    await waitForServer()
    browser = await chromium.launch()

    // ── Rutas públicas (guest, sin carrito) ──────────────────────────────
    if (stage === 'public') {
    const publicRoutes: { route: string; label: string }[] = [
      { route: '/', label: 'home' },
      { route: '/catalogo', label: 'catalogo' },
      { route: `/catalogo/espejo-led-touch-60cm`, label: 'catalogo-producto-espejo' },
      { route: `/catalogo/lampara-de-pie-negra`, label: 'catalogo-producto-lampara' },
      { route: '/turnos', label: 'turnos' },
      { route: '/contacto', label: 'contacto' },
      { route: '/faq', label: 'faq' },
      { route: '/privacidad', label: 'privacidad' },
      { route: '/terminos', label: 'terminos' },
      { route: '/login', label: 'login' },
      { route: '/registro', label: 'registro' },
      { route: '/recuperar-contrasena', label: 'recuperar-contrasena' },
      { route: '/restablecer-contrasena?token=invalid-token-audit', label: 'restablecer-contrasena' },
      { route: '/arrepentimiento', label: 'arrepentimiento' },
      { route: '/checkout', label: 'checkout-carrito-vacio' },
      { route: '/checkout/success', label: 'checkout-success' },
      { route: '/checkout/failure', label: 'checkout-failure' },
      { route: '/checkout/pending', label: 'checkout-pending' },
      { route: '/checkout/confirmado?method=cash', label: 'checkout-confirmado' },
    ]

    for (const viewport of VIEWPORTS) {
      console.log(`\n=== Rutas públicas — viewport ${viewport.name} ===`)
      const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } })
      const page = await context.newPage()
      for (const { route, label } of publicRoutes) {
        try {
          await gotoAndSettle(page, `${BASE_URL}${route}`)
          await auditAndRecord(page, route, label, viewport, true)
        } catch (err) {
          skipped.push({ route: `${route} @ ${viewport.name}`, reason: String(err) })
        }
        await page.waitForTimeout(150)
      }

      // Interacción: menú mobile (solo en viewports donde el hamburger es visible, md:hidden → <768)
      if (viewport.width < 768) {
        try {
          await gotoAndSettle(page, `${BASE_URL}/`)
          await page.click('button[aria-label="Abrir menú"]')
          await page.waitForTimeout(400)
          await auditAndRecord(page, '/', 'home-menu-mobile-abierto', viewport, true)
        } catch (err) {
          skipped.push({ route: `/ (menú mobile abierto) @ ${viewport.name}`, reason: String(err) })
        }
      }

      // Interacción: carrito abierto (agregar producto B — sin variante de color — y abrir el drawer)
      try {
        await gotoAndSettle(page, `${BASE_URL}/catalogo/lampara-de-pie-negra`)
        await page.click('button:has-text("Agregar al carrito")')
        await page.waitForTimeout(500)
        await page.click('button[aria-label="Ver carrito"]')
        await page.waitForTimeout(400)
        await auditAndRecord(page, '/catalogo/lampara-de-pie-negra', 'cart-drawer-abierto', viewport, true)
      } catch (err) {
        skipped.push({ route: `cart-drawer @ ${viewport.name}`, reason: String(err) })
      }

      // Interacción: stepper de checkout, paso a paso (mismo carrito con 1 item de la interacción anterior)
      try {
        await gotoAndSettle(page, `${BASE_URL}/checkout`)
        await auditAndRecord(page, '/checkout', 'checkout-step0-contacto', viewport, true)

        // Nombre, Apellido, Email, Teléfono, DNI — en ese orden dentro del Step 0
        await page.locator('input[type="text"]').nth(0).fill('Test').catch(() => {})
        await page.locator('input[type="text"]').nth(1).fill('Auditoria').catch(() => {})
        await page.locator('input[type="email"]').fill('mobile-audit@artentino.test').catch(() => {})
        await page.locator('input[type="tel"]').fill('1122334455').catch(() => {})
        await page.locator('input[type="text"]').nth(2).fill('20123456').catch(() => {})
        await page.click('button:has-text("Continuar")')
        await page.waitForTimeout(400)
        await auditAndRecord(page, '/checkout', 'checkout-step1-envio', viewport, true)

        // Pickup ya viene seleccionado por default — pasar directo a Pago
        await page.click('button:has-text("Continuar")')
        await page.waitForTimeout(400)
        await auditAndRecord(page, '/checkout', 'checkout-step2-pago', viewport, true)

        await page.click('button:has-text("Ver resumen")')
        await page.waitForTimeout(400)
        await auditAndRecord(page, '/checkout', 'checkout-step3-resumen', viewport, true)
      } catch (err) {
        skipped.push({ route: `checkout stepper @ ${viewport.name}`, reason: String(err) })
      }

      await context.close()
    }
    }

    // ── Rutas de usuario logueado ─────────────────────────────────────────
    if (stage === 'user') {
    const userRoutes: { route: string; label: string }[] = [
      { route: '/perfil', label: 'perfil' },
      { route: '/perfil/pedidos', label: 'perfil-pedidos' },
      { route: `/perfil/pedidos/${seedIds.orderId}`, label: 'perfil-pedido-detalle' },
    ]
    for (const viewport of VIEWPORTS) {
      console.log(`\n=== Rutas de usuario — viewport ${viewport.name} ===`)
      const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } })
      const page = await context.newPage()
      try {
        await loginAsUser(page, 'user@artentino.test', 'User1234!')
        for (const { route, label } of userRoutes) {
          try {
            await gotoAndSettle(page, `${BASE_URL}${route}`)
            await auditAndRecord(page, route, label, viewport, true)
          } catch (err) {
            skipped.push({ route: `${route} @ ${viewport.name}`, reason: String(err) })
          }
          await page.waitForTimeout(150)
        }
      } catch (err) {
        skipped.push({ route: `login user @ ${viewport.name}`, reason: String(err) })
      }
      await context.close()
    }
    }

    // ── Rutas de admin ─────────────────────────────────────────────────────
    if (stage === 'admin') {
    const adminRoutes: { route: string; label: string }[] = [
      { route: '/admin', label: 'admin-dashboard' },
      { route: '/admin/productos', label: 'admin-productos' },
      { route: '/admin/productos/nuevo', label: 'admin-productos-nuevo' },
      { route: `/admin/productos/${seedIds.productAId}/editar`, label: 'admin-producto-editar' },
      { route: '/admin/categorias', label: 'admin-categorias' },
      { route: '/admin/atributos', label: 'admin-atributos' },
      { route: '/admin/destacados', label: 'admin-destacados' },
      { route: '/admin/pedidos', label: 'admin-pedidos' },
      { route: `/admin/pedidos/${seedIds.orderId}`, label: 'admin-pedido-detalle' },
      { route: '/admin/turnos', label: 'admin-turnos' },
      { route: '/admin/contactos', label: 'admin-contactos' },
      { route: '/admin/home', label: 'admin-home' },
      { route: '/admin/emails', label: 'admin-emails' },
      { route: '/admin/instagram', label: 'admin-instagram' },
      { route: '/admin/extension', label: 'admin-extension' },
      { route: '/admin/administradores', label: 'admin-administradores' },
      { route: '/admin/auditoria', label: 'admin-auditoria' },
    ]
    skipped.push({
      route: '/admin/turnos/[id]',
      reason: 'excluida — seed-test.ts no crea ningún Appointment, no hay un id real para resolver',
    })

    for (const viewport of VIEWPORTS) {
      console.log(`\n=== Rutas de admin — viewport ${viewport.name} ===`)
      const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } })
      const page = await context.newPage()
      try {
        await loginAsUser(page, 'admin@artentino.test', 'Admin1234!')
        for (const { route, label } of adminRoutes) {
          try {
            await gotoAndSettle(page, `${BASE_URL}${route}`)
            await auditAndRecord(page, route, label, viewport, true)
          } catch (err) {
            skipped.push({ route: `${route} @ ${viewport.name}`, reason: String(err) })
          }
          await page.waitForTimeout(150)
        }

        // Interacción: sidebar del admin (fixed, siempre presente) — audit en la misma pasada,
        // no requiere una acción extra ya que no hay hamburger propio en el layout de admin.
      } catch (err) {
        skipped.push({ route: `login admin @ ${viewport.name}`, reason: String(err) })
      }
      await context.close()
    }
    }
  } finally {
    if (browser) await browser.close()
    server.kill()
    console.log('\n[cleanup] Server de test detenido.')
  }
  savePartial(stage)
}

// ─────────────────────────────────────────────────────────────────────────
// Reporte
// ─────────────────────────────────────────────────────────────────────────
function writeReport() {
  const totalCrit = results.reduce((n, r) => n + r.findings.filter((f) => f.severity === 'crítico').length, 0)
  const totalMed = results.reduce((n, r) => n + r.findings.filter((f) => f.severity === 'medio').length, 0)
  const totalMenor = results.reduce((n, r) => n + r.findings.filter((f) => f.severity === 'menor').length, 0)

  // ── Deduplicar hallazgos "globales": el mismo Header/Footer/etc. aparece
  // idéntico en casi todas las páginas (son componentes compartidos del layout,
  // no problemas de una página puntual) — se listan una sola vez por viewport
  // en vez de repetirse en cada ruta.
  const labelsByViewport = new Map<string, Set<string>>()
  for (const r of results) {
    if (!labelsByViewport.has(r.viewport)) labelsByViewport.set(r.viewport, new Set())
    labelsByViewport.get(r.viewport)!.add(r.label)
  }
  const occurrence = new Map<string, { count: Set<string>; finding: Finding; viewport: string }>()
  for (const r of results) {
    for (const f of r.findings) {
      if (f.selector === '(resumen)') continue
      const key = `${r.viewport}|${f.category}|${f.selector}|${f.detail}`
      if (!occurrence.has(key)) occurrence.set(key, { count: new Set(), finding: f, viewport: r.viewport })
      occurrence.get(key)!.count.add(r.label)
    }
  }
  const globalKeys = new Set<string>()
  const globalByViewport = new Map<string, { finding: Finding; routeCount: number; totalRoutes: number }[]>()
  for (const [key, { count, finding, viewport }] of occurrence) {
    const totalForViewport = labelsByViewport.get(viewport)?.size ?? 0
    if (totalForViewport >= 4 && count.size >= Math.max(4, Math.ceil(totalForViewport * 0.5))) {
      globalKeys.add(key)
      if (!globalByViewport.has(viewport)) globalByViewport.set(viewport, [])
      globalByViewport.get(viewport)!.push({ finding, routeCount: count.size, totalRoutes: totalForViewport })
    }
  }

  let md = `# Auditoría mobile — Artentino\n\n`
  md += `Generado: ${new Date().toISOString()}\n\n`
  md += `## Resumen\n\n`
  md += `| Severidad | Cantidad |\n|---|---|\n`
  md += `| 🔴 Crítico | ${totalCrit} |\n`
  md += `| 🟡 Medio | ${totalMed} |\n`
  md += `| ⚪ Menor | ${totalMenor} |\n\n`
  md += `Viewports auditados: ${VIEWPORTS.map((v) => v.name).join(', ')}\n\n`
  md += `Rutas/pasadas auditadas: ${results.length} · Rutas/pasos con error (no auditados): ${skipped.length}\n\n`
  md += `**Nota metodológica:** los hallazgos que se repiten idénticos en la mitad o más de las páginas de un mismo viewport (típicamente Header/Footer/Marquee, que están en el layout raíz) se agrupan en la sección "Hallazgos globales" en vez de listarse una vez por cada ruta.\n\n`
  md += `---\n\n`

  if (globalByViewport.size > 0) {
    md += `## Hallazgos globales (Header/Footer/layout compartido)\n\n`
    for (const [viewport, findings] of globalByViewport) {
      md += `### Viewport ${viewport}\n\n`
      md += `| Severidad | Categoría | Selector | Detalle | Aparece en |\n|---|---|---|---|---|\n`
      for (const { finding: f, routeCount, totalRoutes } of findings) {
        const sevIcon = f.severity === 'crítico' ? '🔴' : f.severity === 'medio' ? '🟡' : '⚪'
        md += `| ${sevIcon} ${f.severity} | ${f.category} | \`${f.selector.replace(/\|/g, '\\|')}\` | ${f.detail.replace(/\|/g, '\\|')} | ${routeCount}/${totalRoutes} rutas |\n`
      }
      md += `\n`
    }
    md += `---\n\n`
  }

  // Agrupar por label de ruta
  const byLabel = new Map<string, RouteAudit[]>()
  for (const r of results) {
    if (!byLabel.has(r.label)) byLabel.set(r.label, [])
    byLabel.get(r.label)!.push(r)
  }

  for (const [label, audits] of byLabel) {
    const route = audits[0].route
    const perRouteAudits = audits.map((a) => ({
      ...a,
      findings: a.findings.filter((f) => !globalKeys.has(`${a.viewport}|${f.category}|${f.selector}|${f.detail}`)),
    }))
    const totalFindings = perRouteAudits.reduce((n, a) => n + a.findings.length, 0)
    md += `## ${label}\n\n`
    md += `Ruta: \`${route}\`\n\n`
    if (totalFindings === 0) {
      md += `Sin hallazgos específicos de esta página (más allá de los globales de arriba). ✅\n\n`
    }
    for (const a of perRouteAudits) {
      if (a.findings.length === 0) continue
      md += `### Viewport ${a.viewport}\n\n`
      if (a.screenshot) md += `Screenshot: \`${a.screenshot}\`\n\n`
      md += `| Severidad | Categoría | Selector | Detalle |\n|---|---|---|---|\n`
      for (const f of a.findings) {
        const sevIcon = f.severity === 'crítico' ? '🔴' : f.severity === 'medio' ? '🟡' : '⚪'
        md += `| ${sevIcon} ${f.severity} | ${f.category} | \`${f.selector.replace(/\|/g, '\\|')}\` | ${f.detail.replace(/\|/g, '\\|')} |\n`
      }
      md += `\n`
    }
    md += `---\n\n`
  }

  if (skipped.length > 0) {
    md += `## Rutas/pasos no auditados (error o excluidos)\n\n`
    md += `| Ruta | Motivo |\n|---|---|\n`
    for (const s of skipped) {
      md += `| ${s.route} | ${s.reason.replace(/\|/g, '\\|').slice(0, 200)} |\n`
    }
    md += `\n`
  }

  fs.writeFileSync(REPORT_PATH, md, 'utf-8')
  console.log(`\n[reporte] Escrito en ${REPORT_PATH}`)
  console.log(`[reporte] Totales — crítico: ${totalCrit}, medio: ${totalMed}, menor: ${totalMenor}`)
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('FATAL:', err)
    process.exit(1)
  })
