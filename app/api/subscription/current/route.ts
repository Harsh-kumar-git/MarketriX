import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Mock subscription data
const mockSubscriptions = {
  free: {
    plan: 'free',
    status: 'active',
    currentPeriodEnd: null,
    limits: {
      clients: 1,
      postsPerMonth: 10,
      aiTokens: 100,
    },
    usage: {
      clients: 1,
      postsThisMonth: 7,
      aiTokensUsed: 45,
    },
  },
  pro: {
    plan: 'pro',
    status: 'active',
    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    limits: {
      clients: 5,
      postsPerMonth: 100,
      aiTokens: 1000,
    },
    usage: {
      clients: 3,
      postsThisMonth: 42,
      aiTokensUsed: 234,
    },
  },
  business: {
    plan: 'business',
    status: 'active',
    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    limits: {
      clients: -1, // Unlimited
      postsPerMonth: -1,
      aiTokens: -1,
    },
    usage: {
      clients: 8,
      postsThisMonth: 156,
      aiTokensUsed: 1200,
    },
  },
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

    // Mock data - in production, fetch from database based on user's subscription
    const userSubscriptionPlan = session.user.subscriptionPlan || 'free'
    const subscription = mockSubscriptions[userSubscriptionPlan as keyof typeof mockSubscriptions]

    if (!subscription) {
      return NextResponse.json(
        { error: 'Subscription plan not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      subscription: {
        ...subscription,
        canUpgrade: userSubscriptionPlan !== 'business',
        availablePlans: [
          { id: 'free', name: 'Free', price: 0, features: ['1 client', '10 posts/month', 'Basic AI'] },
          { id: 'pro', name: 'Pro', price: 29, features: ['5 clients', '100 posts/month', 'Advanced AI', 'Priority support'] },
          { id: 'business', name: 'Business', price: 99, features: ['Unlimited everything', 'Team collaboration', 'API access', 'White-label'] },
        ],
      }
    })

  } catch (error) {
    console.error('Get subscription error:', error)
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
    const { plan, paymentMethodId } = body

    if (!plan || !['free', 'pro', 'business'].includes(plan)) {
      return NextResponse.json(
        { error: 'Invalid plan' },
        { status: 400 }
      )
    }

    // Mock upgrade process - in production, integrate with Stripe
    await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate payment processing

    const newSubscription = mockSubscriptions[plan as keyof typeof mockSubscriptions]

    return NextResponse.json({
      message: `Successfully upgraded to ${plan} plan`,
      subscription: newSubscription,
    })

  } catch (error) {
    console.error('Upgrade subscription error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}