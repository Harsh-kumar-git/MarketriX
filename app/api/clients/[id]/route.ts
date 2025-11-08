import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const updateClientSchema = z.object({
  name: z.string().min(1, 'Client name is required').optional(),
  website: z.string().url().optional().or(z.literal('')),
  industry: z.string().optional(),
  logo: z.string().url().optional().or(z.literal('')),
  status: z.enum(['active', 'inactive', 'pending']).optional(),
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

    const client = await prisma.client.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        socialAccounts: {
          include: {
            _count: {
              select: { posts: true }
            }
          }
        },
        posts: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            analytics: {
              take: 1,
              orderBy: { date: 'desc' }
            }
          }
        },
        teamMembers: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
                image: true,
              }
            }
          }
        },
        _count: {
          select: {
            posts: true,
            socialAccounts: true,
            teamMembers: true,
          }
        }
      }
    })

    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ client })

  } catch (error) {
    console.error('Get client error:', error)
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
    const updateData = updateClientSchema.parse(body)

    // Check if client exists and belongs to user
    const existingClient = await prisma.client.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      }
    })

    if (!existingClient) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      )
    }

    const client = await prisma.client.update({
      where: { id: params.id },
      data: {
        ...updateData,
        website: updateData.website || null,
        industry: updateData.industry || null,
        logo: updateData.logo || null,
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
      message: 'Client updated successfully',
      client
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Update client error:', error)
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

    // Check if client exists and belongs to user
    const existingClient = await prisma.client.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        _count: {
          select: { posts: true }
        }
      }
    })

    if (!existingClient) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      )
    }

    // Soft delete by changing status to inactive
    await prisma.client.update({
      where: { id: params.id },
      data: { status: 'inactive' }
    })

    return NextResponse.json({
      message: 'Client deleted successfully',
      client: existingClient
    })

  } catch (error) {
    console.error('Delete client error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}