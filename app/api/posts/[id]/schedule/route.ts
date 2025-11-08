import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const schedulePostSchema = z.object({
  scheduledDate: z.string().datetime(),
  timezone: z.string().optional().default('UTC'),
})

// Mock scheduling queue - in production, use Bull Queue with Redis
const scheduledPosts = new Map<string, any>()

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { scheduledDate, timezone } = schedulePostSchema.parse(body)

    // Check if post exists and belongs to user
    const post = await prisma.post.findFirst({
      where: {
        id: params.id,
        client: {
          userId: session.user.id,
        },
      },
      include: {
        client: true,
        socialAccount: true,
      }
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Validate scheduled date is in the future
    const scheduledTime = new Date(scheduledDate)
    if (scheduledTime <= new Date()) {
      return NextResponse.json(
        { error: 'Scheduled date must be in the future' },
        { status: 400 }
      )
    }

    // Update post with scheduled date and status
    const updatedPost = await prisma.post.update({
      where: { id: params.id },
      data: {
        scheduledDate: scheduledTime,
        status: 'scheduled',
        errorMessage: null, // Clear any previous errors
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            logo: true,
          }
        },
        socialAccount: true,
      }
    })

    // Add to mock scheduling queue
    const jobId = `job_${params.id}_${Date.now()}`
    scheduledPosts.set(jobId, {
      postId: params.id,
      scheduledDate: scheduledTime,
      status: 'pending',
      createdAt: new Date(),
      userId: session.user.id,
    })

    // In production, you would:
    // 1. Add job to Bull Queue with Redis
    // 2. Set up proper error handling and retries
    // 3. Configure timezone handling
    // 4. Set up monitoring and alerts

    return NextResponse.json({
      message: 'Post scheduled successfully',
      post: updatedPost,
      scheduledAt: scheduledTime,
      jobId,
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Schedule post error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if post exists and belongs to user
    const post = await prisma.post.findFirst({
      where: {
        id: params.id,
        client: {
          userId: session.user.id,
        },
      }
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    if (post.status !== 'scheduled') {
      return NextResponse.json(
        { error: 'Only scheduled posts can be unscheduled' },
        { status: 400 }
      )
    }

    // Update post status back to draft
    const updatedPost = await prisma.post.update({
      where: { id: params.id },
      data: {
        scheduledDate: null,
        status: 'draft',
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            logo: true,
          }
        }
      }
    })

    // Remove from mock scheduling queue
    for (const [jobId, job] of scheduledPosts.entries()) {
      if (job.postId === params.id) {
        scheduledPosts.delete(jobId)
        break
      }
    }

    return NextResponse.json({
      message: 'Post unscheduled successfully',
      post: updatedPost,
    })

  } catch (error) {
    console.error('Unschedule post error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}