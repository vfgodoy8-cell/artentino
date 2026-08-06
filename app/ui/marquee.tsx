import { getSiteConfig } from '@/app/lib/site-config'

const DEFAULT_ITEMS = [
  "COMPRA POR UNIDAD",
  "PACK & LOTE MAYORISTA",
  "CUOTAS SIN INTERÉS",
  "ENVÍOS A TODO EL PAÍS",
];

function Track({ items, hidden }: { items: string[]; hidden?: boolean }) {
  return (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.flatMap((item, i) => [
        <span
          key={`item-${i}`}
          className="whitespace-nowrap text-xs font-bold uppercase tracking-[0.2em] text-white"
        >
          {item}
        </span>,
        <span
          key={`sep-${i}`}
          className="mx-6 shrink-0 text-xs"
          style={{ color: "#0eb1c3" }}
        >
          ◆
        </span>,
      ])}
    </div>
  );
}

export default async function Marquee() {
  const siteConfig = await getSiteConfig()

  if (!siteConfig.marqueeEnabled) return null

  const items = siteConfig.marqueeItems.length > 0 ? siteConfig.marqueeItems : DEFAULT_ITEMS

  return (
    <div className="overflow-hidden py-2.5" style={{ backgroundColor: "#1E1E1E" }}>
      <div
        className="flex"
        style={{ animation: "marquee 35s linear infinite" }}
      >
        <Track items={items} />
        <Track items={items} hidden />
      </div>
    </div>
  );
}
