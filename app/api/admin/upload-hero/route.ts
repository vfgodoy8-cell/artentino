import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'Falta el archivo' }, { status: 400 })

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const result = await new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            { folder: 'artentino/hero', resource_type: 'image' },
            (error, res) => {
              if (error || !res) return reject(error ?? new Error('Upload failed'))
              resolve(res as { secure_url: string; public_id: string })
            },
          )
          .end(buffer)
      },
    )

    return NextResponse.json({ url: result.secure_url }, { status: 201 })
  } catch (err) {
    console.error('[upload-hero] error:', err)
    return NextResponse.json({ error: 'Error al subir la imagen' }, { status: 500 })
  }
}
