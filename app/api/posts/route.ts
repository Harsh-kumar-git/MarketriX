import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const createPostSchema = z.object({
  title: z.string().min(1, 'Post title is required'),
  content: z.string().optional(),
  platform: z.enum(['instagram', 'facebook', 'twitter', 'linkedin', 'tiktok', 'pinterest', 'youtube']),
  clientId: z.string().min(1, 'Client ID is required'),
  socialAccountId: z.string().optional(),
  scheduledDate: z.string().datetime().optional(),
  mediaUrls: z.array(z.string().url()).optional(),
  hashtags: z.array(z.string()).optional(),
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
    const platform = searchParams.get('platform') as string
    const status = searchParams.get('status') as string
    const clientId = searchParams.get('clientId') as string

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {
      client: {
        userId: session.user.id,
      },
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { content: { contains: search, mode: 'insensitive' } },
        ]
      }),
      ...(platform && { platform }),
      ...(status && { status }),
      ...(clientId && { clientId }),
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          client: {
            select: {
              id: true,
              name: true,
              logo: true,
            }
          },
          socialAccount: {
            select: {
              id: true,
              platform: true,
              handle: true,
            }
          },
          mediaFiles: true,
          analytics: {
            take: 1,
            orderBy: { date: 'desc' }
          },
          _count: {
            select: {
              mediaFiles: true,
              analytics: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.post.count({ where })
    ])

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      }
    })

  } catch (error) {
    console.error('Get posts error:', error)
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
      title,
      content,
      platform,
      clientId,
      socialAccountId,
      scheduledDate,
      mediaUrls,
      hashtags
    } = createPostSchema.parse(body)

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

    // If socialAccountId is provided, verify it belongs to the client
    if (socialAccountId) {
      const socialAccount = await prisma.socialAccount.findFirst({
        where: {
          id: socialAccountId,
          clientId: clientId,
          platform: platform,
        }
      })

      if (!socialAccount) {
        return NextResponse.json(
          { error: 'Social account not found or does not match platform' },
          { status: 404 }
        )
      }
    }

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

    // Count posts this month
    const currentMonth = new Date()
    currentMonth.setDate(1)
    const nextMonth = new Date(currentMonth)
    nextMonth.setMonth(nextMonth.getMonth() + 1)

    const currentMonthPosts = await prisma.post.count({
      where: {
        client: {
          userId: session.user.id,
        },
        createdAt: {
          gte: currentMonth,
          lt: nextMonth,
        },
      }
    })

    const planLimits = {
      free: 10,
      pro: 100,
      business: Infinity,
    }

    const maxPosts = planLimits[user.subscriptionPlan as keyof typeof planLimits]

    if (currentMonthPosts >= maxPosts) {
      return NextResponse.json(
        {
          error: 'Post limit reached',
          message: `Your ${user.subscriptionPlan} plan allows a maximum of ${maxPosts} posts per month. Please upgrade your plan to create more posts.`
        },
        { status: 403 }
      )
    }

    // Create post
    const postData: any = {
      title,
      content,
      platform,
      clientId,
      mediaUrls: mediaUrls || [],
      hashtags: hashtags || [],
      status: scheduledDate ? 'scheduled' : 'draft',
    }

    if (socialAccountId) {
      postData.socialAccountId = socialAccountId
    }

    if (scheduledDate) {
      postData.scheduledDate = new Date(scheduledDate)
    }

    const post = await prisma.post.create({
      data: postData,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            logo: true,
          }
        },
        socialAccount: {
          select: {
            id: true,
            platform: true,
            handle: true,
          }
        },
        mediaFiles: true,
      }
    })

    return NextResponse.json({
      message: 'Post created successfully',
      post
    }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Create post error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}