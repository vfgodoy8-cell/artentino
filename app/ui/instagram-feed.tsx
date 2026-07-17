const INSTAGRAM_URL = 'https://instagram.com/artentino'

// TODO: reemplazar por fotos reales de Instagram (URLs de Cloudinary)
const PLACEHOLDER_IMAGES = [
  { id: 1, alt: 'Publicación de Instagram @artentino' },
  { id: 2, alt: 'Publicación de Instagram @artentino' },
  { id: 3, alt: 'Publicación de Instagram @artentino' },
  { id: 4, alt: 'Publicación de Instagram @artentino' },
]

// Mosaico asimétrico: 2 tiles grandes + 2 chicas, en grid-cols-4 grid-rows-2
const TILE_SPANS = [
  'sm:col-span-2 sm:row-span-2',
  'sm:col-span-1 sm:row-span-1',
  'sm:col-span-1 sm:row-span-1',
  'sm:col-span-2 sm:row-span-1',
]

export default function InstagramFeed() {
  return (
    <section style={{ backgroundColor: '#F0FBFC' }} className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <h2
            className="font-script text-4xl text-[#1E1E1E] sm:text-5xl"
            style={{ fontFamily: 'var(--font-script)' }}
          >
            Así se ve en casa
          </h2>
          <p className="mt-2 text-sm font-black uppercase tracking-widest text-[#0eb1c3]">
            @artentino
          </p>
        </div>

        {/* Mosaico */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:grid-rows-2 sm:h-[560px] sm:gap-4">
          {PLACEHOLDER_IMAGES.map((img, i) => (
            <a
              key={img.id}
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Ver en Instagram"
              className={`group relative aspect-square overflow-hidden rounded-2xl bg-gray-200 sm:aspect-auto ${TILE_SPANS[i]}`}
            >
              {/* Placeholder gris — reemplazar por <img src={img.url}> con fotos reales */}
              <span className="sr-only">{img.alt}</span>
              <div className="absolute inset-0 flex items-center justify-center bg-[#1E1E1E]/40 opacity-0 transition-opacity duration-[260ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:opacity-100">
                <div className="flex flex-col items-center gap-2 text-white">
                  <InstagramGlyph className="h-7 w-7" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Ver en Instagram
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-[#0eb1c3] px-6 py-3 text-sm font-bold text-[#0eb1c3] transition-colors hover:bg-[#0eb1c3] hover:text-white"
          >
            Seguinos @artentino →
          </a>
        </div>
      </div>
    </section>
  )
}

function InstagramGlyph({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}
