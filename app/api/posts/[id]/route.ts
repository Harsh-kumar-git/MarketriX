import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const updatePostSchema = z.object({
  title: z.string().min(1, 'Post title is required').optional(),
  content: z.string().optional(),
  platform: z.enum(['instagram', 'facebook', 'twitter', 'linkedin', 'tiktok', 'pinterest', 'youtube']).optional(),
  scheduledDate: z.string().datetime().optional().or(z.literal('')),
  status: z.enum(['draft', 'scheduled', 'published', 'failed']).optional(),
  mediaUrls: z.array(z.string().url()).optional(),
  hashtags: z.array(z.string()).optional(),
  errorMessage: z.string().optional(),
})

export async function GET(
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

    const post = await prisma.post.findFirst({
      where: {
        id: params.id,
        client: {
          userId: session.user.id,
        },
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
        mediaFiles: true,
        analytics: {
          orderBy: { date: 'desc' },
          take: 30, // Last 30 days of analytics
        }
      }
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ post })

  } catch (error) {
    console.error('Get post error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
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
    const updateData = updatePostSchema.parse(body)

    // Check if post exists and belongs to user
    const existingPost = await prisma.post.findFirst({
      where: {
        id: params.id,
        client: {
          userId: session.user.id,
        },
      }
    })

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Prevent editing published posts
    if (existingPost.status === 'published' && !updateData.errorMessage) {
      return NextResponse.json(
        { error: 'Cannot edit published posts' },
        { status: 400 }
      )
    }

    const postData: any = { ...updateData }

    // Handle scheduledDate
    if ('scheduledDate' in updateData) {
      postData.scheduledDate = updateData.scheduledDate ? new Date(updateData.scheduledDate) : null
    }

    // Update post status based on scheduled date
    if (postData.scheduledDate && postData.status !== 'scheduled') {
      postData.status = 'scheduled'
    } else if (!postData.scheduledDate && postData.status === 'scheduled') {
      postData.status = 'draft'
    }

    const post = await prisma.post.update({
      where: { id: params.id },
      data: postData,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            logo: true,
          }
        },
        socialAccount: true,
        mediaFiles: true,
      }
    })

    return NextResponse.json({
      message: 'Post updated successfully',
      post
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Update post error:', error)
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
    const existingPost = await prisma.post.findFirst({
      where: {
        id: params.id,
        client: {
          userId: session.user.id,
        },
      },
      include: {
        socialAccount: true,
      }
    })

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Prevent deletion of published posts that were posted to social media
    if (existingPost.status === 'published' && existingPost.publishedDate) {
      return NextResponse.json(
        { error: 'Cannot delete published posts' },
        { status: 400 }
      )
    }

    await prisma.post.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      message: 'Post deleted successfully',
      post: existingPost
    })

  } catch (error) {
    console.error('Delete post error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}