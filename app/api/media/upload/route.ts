import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

// Mock file upload for development - in production, use AWS S3 or Cloudinary
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'video/mp4',
  'video/avi',
  'video/mov',
  'video/webm',
]

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'File type not allowed' },
        { status: 400 }
      )
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const fileExtension = file.name.split('.').pop()
    const filename = `${timestamp}_${randomString}.${fileExtension}`
    const filepath = join(uploadsDir, filename)

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filepath, buffer)

    // Create media file record (mock for now since we don't have full DB setup)
    const mediaFile = {
      id: `media_${timestamp}_${randomString}`,
      filename: file.name,
      url: `/uploads/${filename}`,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
      uploadedBy: session.user.id,
    }

    return NextResponse.json({
      message: 'File uploaded successfully',
      mediaFile,
    }, { status: 201 })

  } catch (error) {
    console.error('File upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const type = searchParams.get('type') // 'image' or 'video'

    // Mock response since we don't have database setup
    const mockMediaFiles = [
      {
        id: 'media_1',
        filename: 'product-photo.jpg',
        url: '/uploads/sample-image-1.jpg',
        size: 1024000,
        type: 'image/jpeg',
        uploadedAt: new Date().toISOString(),
      },
      {
        id: 'media_2',
        filename: 'team-photo.png',
        url: '/uploads/sample-image-2.png',
        size: 2048000,
        type: 'image/png',
        uploadedAt: new Date(Date.now() - 86400000).toISOString(),
      }
    ]

    let filteredFiles = mockMediaFiles
    if (type) {
      filteredFiles = mockMediaFiles.filter(file => file.type.startsWith(type))
    }

    return NextResponse.json({
      mediaFiles: filteredFiles,
      pagination: {
        page,
        limit,
        total: filteredFiles.length,
        pages: Math.ceil(filteredFiles.length / limit),
      }
    })

  } catch (error) {
    console.error('Get media files error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}