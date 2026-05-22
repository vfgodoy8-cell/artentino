'use client'

import { useState } from 'react'
import TabInfo from './tab-info'
import TabAtributos from './tab-atributos'
import TabStock from './tab-stock'
import TabImagenes from './tab-imagenes'

const TABS = [
  { id: 'info', label: 'Información' },
  { id: 'atributos', label: 'Atributos' },
  { id: 'stock', label: 'Stock' },
  { id: 'imagenes', label: 'Imágenes' },
] as const

type TabId = (typeof TABS)[number]['id']

type EditFormProps = {
  product: {
    id: string
    name: string
    stock: number
    categoryId: string
    conditionId: string | null
    description: string | null
    additionalData: string | null
    price: number
    comparePrice: number | null
    cost: number | null
    videoUrl: string | null
    showPrice: boolean
    active: boolean
    sortOrder: number
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
  conditions: { id: string; name: string }[]
  attributes: {
    id: string
    name: string
    values: { id: string; value: string }[]
  }[]
  productAttributes: {
    id: string
    attributeValueId: string
    attributeValue: {
      id: string
      value: string
      attribute: { id: string; name: string }
    }
  }[]
  productStocks: {
    id: string
    stock: number
    sortOrder: number
    attributeValueId: string
    attributeValue: {
      id: string
      value: string
      attribute: { id: string; name: string }
    }
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
              className={`border-b-2 px-6 py-3 text-sm font-bold transition-colors ${
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

      {/* Tab content */}
      <div>
        {activeTab === 'info' && (
          <TabInfo
            product={props.product}
            comboPrices={props.comboPrices}
            categories={props.categories}
            conditions={props.conditions}
          />
        )}
        {activeTab === 'atributos' && (
          <TabAtributos
            productId={props.product.id}
            attributes={props.attributes}
            initial={props.productAttributes}
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
