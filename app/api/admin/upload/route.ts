import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import { prisma } from '@/lib/prisma'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const productId = formData.get('productId') as string | null

    if (!file || !productId) {
      return NextResponse.json({ error: 'Faltan file o productId' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const result = await new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            { folder: 'artentino/products', resource_type: 'image' },
            (error, res) => {
              if (error || !res) return reject(error ?? new Error('Upload failed'))
              resolve(res as { secure_url: string; public_id: string })
            },
          )
          .end(buffer)
      },
    )

    const image = await prisma.productImage.create({
      data: {
        productId,
        url: result.secure_url,
        filename: file.name,
        size: Math.round(file.size / 1024),
      },
    })

    // Set as main image only if product has none yet
    await prisma.product.updateMany({
      where: { id: productId, imageUrl: null },
      data: { imageUrl: result.secure_url },
    })

    return NextResponse.json(image, { status: 201 })
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: 'Error al subir la imagen' }, { status: 500 })
  }
}
