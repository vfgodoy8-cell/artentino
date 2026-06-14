import { execSync } from 'child_process'
import path from 'path'
import { config } from 'dotenv'

config({ path: path.resolve(__dirname, '../.env.test'), override: true })

export default async function globalSetup() {
  const testDbUrl = process.env.DATABASE_URL_TEST
  if (!testDbUrl) {
    throw new Error(
      'DATABASE_URL_TEST no está configurado. Creá el archivo .env.test con DATABASE_URL_TEST=<url-de-tu-db-de-test>',
    )
  }

  const env = {
    ...process.env,
    DATABASE_URL: testDbUrl,
    // Required for Prisma 7's AI-agent safety guard when running --force-reset
    PRISMA_USER_CONSENT_FOR_DANGEROUS_AI_ACTION: 'si',
  }
  const cwd = path.resolve(__dirname, '..')

  console.log('\n[setup] Reseteando base de datos de test...')
  execSync(`npx prisma db push --force-reset --url "${testDbUrl}"`, { env, cwd, stdio: 'inherit' })

  console.log('[setup] Ejecutando seed de test...')
  execSync('npx tsx prisma/seed-test.ts', { env, cwd, stdio: 'inherit' })

  console.log('[setup] Base de datos lista.\n')
}
