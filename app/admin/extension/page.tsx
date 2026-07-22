import { prisma } from '@/lib/prisma'
import { getSiteConfig } from '@/app/lib/site-config'
import ExtensionClient from './extension-client'

export default async function AdminExtensionPage() {
  const [expressZone, siteConfig] = await Promise.all([
    prisma.shippingZone.findUnique({ where: { type: 'EXPRESS' } }),
    getSiteConfig(),
  ])

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-[#1E1E1E]">Extensión</h1>
        <p className="mt-1 text-sm text-gray-400">
          Zonas de envío Express, métodos habilitados y estado de la integración con Zipnova.
        </p>
      </div>
      <ExtensionClient
        initialLocalities={expressZone?.localities ?? []}
        initialExpressEnabled={siteConfig.expressShippingEnabled}
        initialZipnovaEnabled={siteConfig.zipnovaShippingEnabled}
        mockMode={process.env.ZIPNOVA_MOCK_MODE === 'true'}
      />
    </div>
  )
}
