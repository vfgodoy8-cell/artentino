import { normalizeText } from './normalize-text'

export type SearchableProduct = {
  name: string
  sku: string | null
  category: {
    name: string
    category?: { name: string } | null
  }
}

/** Normaliza y parte una búsqueda en palabras — lista vacía si no hay texto. */
export function getSearchWords(query: string): string[] {
  const trimmed = query.trim()
  if (!trimmed) return []
  return normalizeText(trimmed).split(/\s+/).filter(Boolean)
}

/** Todas las palabras tienen que estar presentes en nombre + SKU + subcategoría + categoría. */
export function matchesSearch(product: SearchableProduct, words: string[]): boolean {
  if (words.length === 0) return true
  const haystack = normalizeText(
    [product.name, product.sku ?? '', product.category.name, product.category.category?.name ?? ''].join(' '),
  )
  return words.every((word) => haystack.includes(word))
}

/** Subconjunto de matchesSearch — usado para priorizar resultados que matchean por nombre. */
export function matchesName(product: Pick<SearchableProduct, 'name'>, words: string[]): boolean {
  if (words.length === 0) return true
  const haystack = normalizeText(product.name)
  return words.every((word) => haystack.includes(word))
}

/** Filtra una lista ya cargada (misma lógica que usa /api/buscar) sin pegarle a la DB de nuevo. */
export function filterProducts<T extends SearchableProduct>(products: T[], query: string): T[] {
  const words = getSearchWords(query)
  if (words.length === 0) return products
  return products.filter((p) => matchesSearch(p, words))
}
