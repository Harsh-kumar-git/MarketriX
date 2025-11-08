import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Mock analytics data - in production, this would come from your database and social media APIs
function generateMockAnalytics(userId: string) {
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  // Generate daily data for the last 30 days
  const dailyData = []
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    dailyData.push({
      date: date.toISOString().split('T')[0],
      impressions: Math.floor(Math.random() * 5000) + 1000,
      engagement: Math.floor(Math.random() * 500) + 50,
      clicks: Math.floor(Math.random() * 200) + 20,
      followers: Math.floor(Math.random() * 100) + 10,
    })
  }

  // Platform breakdown
  const platformData = [
    { platform: 'instagram', impressions: 15420, engagement: 2340, clicks: 890, followers: 1240 },
    { platform: 'facebook', impressions: 12300, engagement: 1890, clicks: 650, followers: 890 },
    { platform: 'twitter', impressions: 8900, engagement: 1560, clicks: 430, followers: 560 },
    { platform: 'linkedin', impressions: 6700, engagement: 890, clicks: 340, followers: 430 },
  ]

  // Top performing posts
  const topPosts = [
    {
      id: 'post_1',
      title: 'Product Launch Announcement',
      platform: 'instagram',
      impressions: 5400,
      engagement: 890,
      clicks: 230,
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'post_2',
      title: 'Behind the Scenes',
      platform: 'facebook',
      impressions: 3200,
      engagement: 670,
      clicks: 180,
      publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'post_3',
      title: 'Customer Testimonial',
      platform: 'linkedin',
      impressions: 2100,
      engagement: 450,
      clicks: 120,
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]

  // Client performance
  const clientPerformance = [
    {
      clientId: 'client_1',
      clientName: 'Tech Startup Inc.',
      totalImpressions: 23400,
      totalEngagement: 3450,
      totalClicks: 980,
      postsPublished: 12,
      averageEngagementRate: 14.7,
    },
    {
      clientId: 'client_2',
      clientName: 'Fashion Brand Co.',
      totalImpressions: 18900,
      totalEngagement: 2890,
      totalClicks: 760,
      postsPublished: 8,
      averageEngagementRate: 15.3,
    },
    {
      clientId: 'client_3',
      clientName: 'Restaurant Group',
      totalImpressions: 12300,
      totalEngagement: 1890,
      totalClicks: 540,
      postsPublished: 15,
      averageEngagementRate: 15.4,
    },
  ]

  return {
    overview: {
      totalImpressions: dailyData.reduce((sum, day) => sum + day.impressions, 0),
      totalEngagement: dailyData.reduce((sum, day) => sum + day.engagement, 0),
      totalClicks: dailyData.reduce((sum, day) => sum + day.clicks, 0),
      totalFollowers: dailyData.reduce((sum, day) => sum + day.followers, 0),
      averageEngagementRate: 12.5,
      postsPublished: 35,
    },
    dailyData,
    platformData,
    topPosts,
    clientPerformance,
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
    const dateRange = searchParams.get('dateRange') || '30d' // 7d, 30d, 90d
    const clientId = searchParams.get('clientId')
    const platform = searchParams.get('platform')

    const analytics = generateMockAnalytics(session.user.id)

    // Filter based on query parameters
    if (platform) {
      analytics.platformData = analytics.platformData.filter(p => p.platform === platform)
    }

    if (clientId) {
      analytics.clientPerformance = analytics.clientPerformance.filter(c => c.clientId === clientId)
    }

    // Adjust date range (simplified for mock data)
    if (dateRange === '7d') {
      analytics.dailyData = analytics.dailyData.slice(-7)
    } else if (dateRange === '90d') {
      // For 90 days, we'd generate more data in a real implementation
      analytics.dailyData = analytics.dailyData
    }

    return NextResponse.json({
      analytics,
      dateRange,
      generatedAt: new Date().toISOString(),
    })

  } catch (error) {
    console.error('Get dashboard analytics error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}