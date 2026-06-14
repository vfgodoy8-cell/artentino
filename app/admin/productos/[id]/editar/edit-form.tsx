'use client'

import { useState } from 'react'
import TabInfo from './tab-info'
import TabStock from './tab-stock'
import TabImagenes from './tab-imagenes'

const TABS = [
  { id: 'info', label: 'Información' },
  { id: 'stock', label: 'Stock' },
  { id: 'imagenes', label: 'Imágenes' },
] as const

type TabId = (typeof TABS)[number]['id']

type EditFormProps = {
  product: {
    id: string
    sku: string
    slug: string
    name: string
    categoryId: string
    description: string | null
    additionalData: string | null
    price: number
    comparePrice: number | null
    cost: number | null
    videoUrl: string | null
    active: boolean
    height: number | null
    width: number | null
    length: number | null
    weight: number | null
  }
  comboPrices: {
    id: string
    price: number
    quantity: number
    startDate: string | null
    endDate: string | null
  }[]
  categories: { id: string; name: string }[]
  attributes: { id: string; name: string }[]
  productStocks: {
    id: string
    stock: number
    attributeId: string
    attribute: { id: string; name: string; hidden: boolean }
    value: string
  }[]
  productImages: {
    id: string
    url: string
    filename: string
    size: number
  }[]
}

export default function EditForm(props: EditFormProps) {
  const [activeTab, setActiveTab] = useState<TabId>('info')

  return (
    <div>
      {/* Tab bar */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex gap-0">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`border-b-2 px-6 py-3 text-sm font-bold transition-[transform,color,border-color] duration-[160ms] [transition-timing-function:var(--ease-out)] active:scale-[0.97] ${
                activeTab === tab.id
                  ? 'border-[#0eb1c3] text-[#0eb1c3]'
                  : 'border-transparent text-gray-400 hover:text-[#1E1E1E]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div key={activeTab} className="animate-tab-enter">
        {activeTab === 'info' && (
          <TabInfo
            product={props.product}
            comboPrices={props.comboPrices}
            categories={props.categories}
          />
        )}
        {activeTab === 'stock' && (
          <TabStock
            productId={props.product.id}
            attributes={props.attributes}
            initial={props.productStocks}
          />
        )}
        {activeTab === 'imagenes' && (
          <TabImagenes
            productId={props.product.id}
            initial={props.productImages}
          />
        )}
      </div>
    </div>
  )
}
