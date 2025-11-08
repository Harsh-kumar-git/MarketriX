import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Instagram OAuth callback handler
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    if (error) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/dashboard?error=${encodeURIComponent(error)}`
      )
    }

    if (!code || !state) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/dashboard?error=missing_parameters`
      )
    }

    // Decode and verify state
    let stateData
    try {
      stateData = JSON.parse(Buffer.from(state, 'base64').toString())
    } catch (e) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/dashboard?error=invalid_state`
      )
    }

    // Check if state is recent (prevent replay attacks)
    if (Date.now() - stateData.timestamp > 10 * 60 * 1000) { // 10 minutes
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/dashboard?error=expired_state`
      )
    }

    // Exchange authorization code for access token
    const tokenResponse = await exchangeCodeForToken(code)

    if (!tokenResponse.access_token) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/dashboard?error=token_exchange_failed`
      )
    }

    // Get Instagram user info
    const userInfo = await getInstagramUserInfo(tokenResponse.access_token)

    if (!userInfo) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/dashboard?error=user_info_failed`
      )
    }

    // Verify client belongs to user
    const client = await prisma.client.findFirst({
      where: {
        id: stateData.clientId,
        userId: stateData.userId,
      }
    })

    if (!client) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/dashboard?error=client_not_found`
      )
    }

    // Check if account already exists
    const existingAccount = await prisma.socialAccount.findFirst({
      where: {
        platform: 'instagram',
        clientId: stateData.clientId,
      }
    })

    if (existingAccount) {
      // Update existing account
      await prisma.socialAccount.update({
        where: { id: existingAccount.id },
        data: {
          accessToken: tokenResponse.access_token,
          refreshToken: tokenResponse.refresh_token,
          handle: userInfo.username,
          username: userInfo.username,
          externalId: userInfo.id,
          followers: userInfo.followers_count || 0,
          isConnected: true,
        }
      })
    } else {
      // Create new account
      await prisma.socialAccount.create({
        data: {
          platform: 'instagram',
          clientId: stateData.clientId,
          accessToken: tokenResponse.access_token,
          refreshToken: tokenResponse.refresh_token,
          handle: userInfo.username,
          username: userInfo.username,
          externalId: userInfo.id,
          followers: userInfo.followers_count || 0,
          isConnected: true,
        }
      })
    }

    // Redirect to dashboard with success message
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/dashboard?success=instagram_connected`
    )

  } catch (error) {
    console.error('Instagram OAuth callback error:', error)
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/dashboard?error=oauth_failed`
    )
  }
}

async function exchangeCodeForToken(code: string) {
  try {
    const tokenUrl = 'https://graph.facebook.com/v18.0/oauth/access_token'
    const params = new URLSearchParams({
      client_id: process.env.FACEBOOK_APP_ID!,
      client_secret: process.env.FACEBOOK_APP_SECRET!,
      redirect_uri: `${process.env.NEXTAUTH_URL}/api/social-accounts/oauth/instagram/callback`,
      code,
    })

    const response = await fetch(`${tokenUrl}?${params}`)
    const data = await response.json()

    return data
  } catch (error) {
    console.error('Token exchange error:', error)
    return {}
  }
}

async function getInstagramUserInfo(accessToken: string) {
  try {
    // First get the user's Facebook pages
    const pagesResponse = await fetch(
      `https://graph.facebook.com/v18.0/me/accounts?access_token=${accessToken}`
    )
    const pagesData = await pagesResponse.json()

    if (!pagesData.data || pagesData.data.length === 0) {
      console.error('No Facebook pages found')
      return null
    }

    // Get Instagram account connected to the first page
    const pageId = pagesData.data[0].id
    const instagramResponse = await fetch(
      `https://graph.facebook.com/v18.0/${pageId}?fields=instagram_business_account&access_token=${accessToken}`
    )
    const instagramData = await instagramResponse.json()

    if (!instagramData.instagram_business_account) {
      console.error('No Instagram business account found')
      return null
    }

    // Get Instagram user details
    const userInfoResponse = await fetch(
      `https://graph.facebook.com/v18.0/${instagramData.instagram_business_account.id}?fields=username,followers_count,media_count&access_token=${accessToken}`
    )
    const userInfo = await userInfoResponse.json()

    return userInfo
  } catch (error) {
    console.error('Get Instagram user info error:', error)
    return null
  }
}