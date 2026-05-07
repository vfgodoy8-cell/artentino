const items = [
  "COMPRA POR UNIDAD",
  "PACK & LOTE MAYORISTA",
  "CUOTAS SIN INTERÉS",
  "ENVÍOS A TODO EL PAÍS",
  "SHOWROOM COLEGIALES CABA",
];

function Track({ hidden }: { hidden?: boolean }) {
  return (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.flatMap((item, i) => [
        <span
          key={`item-${i}`}
          className="whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.2em] text-white"
        >
          {item}
        </span>,
        <span
          key={`sep-${i}`}
          className="mx-6 shrink-0 text-xs"
          style={{ color: "#2BBCB0" }}
        >
          ◆
        </span>,
      ])}
    </div>
  );
}

export default function Marquee() {
  return (
    <div className="overflow-hidden py-2.5" style={{ backgroundColor: "#1E1E1E" }}>
      <div
        className="flex"
        style={{ animation: "marquee 35s linear infinite" }}
      >
        <Track />
        <Track hidden />
      </div>
    </div>
  );
}
