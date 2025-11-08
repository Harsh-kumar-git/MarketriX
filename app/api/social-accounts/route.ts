import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const connectAccountSchema = z.object({
  platform: z.enum(['instagram', 'facebook', 'twitter', 'linkedin', 'tiktok', 'pinterest', 'youtube']),
  clientId: z.string().min(1, 'Client ID is required'),
  accessToken: z.string().min(1, 'Access token is required'),
  refreshToken: z.string().optional(),
  handle: z.string().min(1, 'Handle is required'),
  externalId: z.string().optional(),
  username: z.string().optional(),
  followers: z.number().int().min(0).default(0),
})

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
    const clientId = searchParams.get('clientId')
    const platform = searchParams.get('platform')

    const where: any = {
      client: {
        userId: session.user.id,
      },
      ...(clientId && { clientId }),
      ...(platform && { platform }),
    }

    const socialAccounts = await prisma.socialAccount.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            logo: true,
          }
        },
        _count: {
          select: {
            posts: true,
            analytics: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ socialAccounts })

  } catch (error) {
    console.error('Get social accounts error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      platform,
      clientId,
      accessToken,
      refreshToken,
      handle,
      externalId,
      username,
      followers
    } = connectAccountSchema.parse(body)

    // Verify client belongs to user
    const client = await prisma.client.findFirst({
      where: {
        id: clientId,
        userId: session.user.id,
      }
    })

    if (!client) {
      return NextResponse.json(
        { error: 'Client not found or access denied' },
        { status: 404 }
      )
    }

    // Check if account already exists for this platform and client
    const existingAccount = await prisma.socialAccount.findFirst({
      where: {
        platform,
        clientId,
      }
    })

    if (existingAccount) {
      return NextResponse.json(
        { error: 'Social account already connected for this platform and client' },
        { status: 409 }
      )
    }

    // Create social account
    const socialAccount = await prisma.socialAccount.create({
      data: {
        platform,
        clientId,
        accessToken,
        refreshToken: refreshToken || null,
        handle,
        externalId: externalId || null,
        username: username || null,
        followers: followers || 0,
        isConnected: true,
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            logo: true,
          }
        },
        _count: {
          select: {
            posts: true,
            analytics: true,
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Social account connected successfully',
      socialAccount
    }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Connect social account error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}