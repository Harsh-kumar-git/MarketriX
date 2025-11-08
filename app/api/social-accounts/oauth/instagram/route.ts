import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Instagram OAuth configuration
const INSTAGRAM_CONFIG = {
  clientId: process.env.FACEBOOK_APP_ID!,
  clientSecret: process.env.FACEBOOK_APP_SECRET!,
  redirectUri: `${process.env.NEXTAUTH_URL}/api/social-accounts/oauth/instagram/callback`,
  scope: 'instagram_basic,instagram_content_publish,pages_show_list',
  authUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
  tokenUrl: 'https://graph.facebook.com/v18.0/oauth/access_token',
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
    const clientId = searchParams.get('clientId')

    if (!clientId) {
      return NextResponse.json(
        { error: 'Client ID is required' },
        { status: 400 }
      )
    }

    // Generate state parameter for security
    const state = Buffer.from(JSON.stringify({
      userId: session.user.id,
      clientId: clientId,
      timestamp: Date.now(),
    })).toString('base64')

    // Build Instagram OAuth URL
    const authUrl = new URL(INSTAGRAM_CONFIG.authUrl)
    authUrl.searchParams.set('client_id', INSTAGRAM_CONFIG.clientId)
    authUrl.searchParams.set('redirect_uri', INSTAGRAM_CONFIG.redirectUri)
    authUrl.searchParams.set('scope', INSTAGRAM_CONFIG.scope)
    authUrl.searchParams.set('response_type', 'code')
    authUrl.searchParams.set('state', state)

    return NextResponse.json({
      authUrl: authUrl.toString(),
      state,
    })

  } catch (error) {
    console.error('Instagram OAuth error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}