import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const createClientSchema = z.object({
  name: z.string().min(1, 'Client name is required'),
  website: z.string().url().optional().or(z.literal('')),
  industry: z.string().optional(),
  logo: z.string().url().optional().or(z.literal('')),
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
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') as string

    const skip = (page - 1) * limit

    const where = {
      userId: session.user.id,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { industry: { contains: search, mode: 'insensitive' as const } },
          { website: { contains: search, mode: 'insensitive' as const } },
        ]
      }),
      ...(status && { status: status as any }),
    }

    const [clients, total] = await Promise.all([
      prisma.client.findMany({
        where,
        include: {
          _count: {
            select: {
              posts: true,
              socialAccounts: true,
              teamMembers: true,
            }
          },
          socialAccounts: {
            select: {
              platform: true,
              handle: true,
              followers: true,
              isConnected: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.client.count({ where })
    ])

    return NextResponse.json({
      clients,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      }
    })

  } catch (error) {
    console.error('Get clients error:', error)
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
    const { name, website, industry, logo } = createClientSchema.parse(body)

    // Check user's subscription plan limits
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { subscriptionPlan: true }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const currentClientCount = await prisma.client.count({
      where: { userId: session.user.id }
    })

    const planLimits = {
      free: 1,
      pro: 5,
      business: Infinity,
    }

    const maxClients = planLimits[user.subscriptionPlan as keyof typeof planLimits]

    if (currentClientCount >= maxClients) {
      return NextResponse.json(
        {
          error: 'Client limit reached',
          message: `Your ${user.subscriptionPlan} plan allows a maximum of ${maxClients} clients. Please upgrade your plan to add more clients.`
        },
        { status: 403 }
      )
    }

    const client = await prisma.client.create({
      data: {
        name,
        website: website || null,
        industry: industry || null,
        logo: logo || null,
        userId: session.user.id,
      },
      include: {
        _count: {
          select: {
            posts: true,
            socialAccounts: true,
            teamMembers: true,
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Client created successfully',
      client
    }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Create client error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}