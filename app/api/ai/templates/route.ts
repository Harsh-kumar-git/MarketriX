import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

// Mock content templates
const mockTemplates = [
  {
    id: '1',
    name: 'Product Launch Announcement',
    description: 'Perfect for announcing new products or services',
    category: 'Product Launch',
    content: '🚀 BIG NEWS! We\'re excited to introduce our latest {product_name}! \n\n✨ {key_feature_1}\n✨ {key_feature_2}\n✨ {key_feature_3}\n\nReady to experience the difference? Click the link in our bio to learn more! \n\n#NewProduct #Launch #{brand_name} #Innovation',
    variables: ['product_name', 'key_feature_1', 'key_feature_2', 'key_feature_3', 'brand_name'],
    platform: 'instagram' as const,
  },
  {
    id: '2',
    name: 'Behind the Scenes',
    description: 'Show your audience the human side of your brand',
    category: 'Behind the Scenes',
    content: 'Behind every great product is a passionate team! 👥\n\nHere\'s a sneak peek of what we\'ve been working on lately. Can you guess what\'s coming next? 🤔\n\n#BehindTheScenes #TeamWork #{company_name} #Innovation',
    variables: ['company_name'],
    platform: 'instagram' as const,
  },
  {
    id: '3',
    name: 'Customer Testimonial',
    description: 'Share customer success stories and build trust',
    category: 'Testimonial',
    content: 'Nothing makes us happier than seeing our customers succeed! ❤️\n\n"{customer_quote}" - {customer_name}, {customer_title}\n\nThank you for trusting us with your {service_type} journey! \n\n#CustomerSuccess #Testimonial #HappyClient #{brand_name}',
    variables: ['customer_quote', 'customer_name', 'customer_title', 'service_type', 'brand_name'],
    platform: 'facebook' as const,
  },
  {
    id: '4',
    name: 'Industry Insight',
    description: 'Share valuable industry knowledge and position yourself as an expert',
    category: 'Thought Leadership',
    content: '📊 Industry Insight: {industry_trend}\n\nBased on our recent analysis, {key_insight} is becoming increasingly important for businesses in {industry}. \n\nHere\'s what this means for you:\n• {implication_1}\n• {implication_2}\n• {implication_3}\n\nWant to learn how to adapt to these changes? We\'ve helped companies like yours navigate industry shifts successfully. Link in bio to learn more.\n\n#IndustryInsights #ExpertAnalysis #{industry} #BusinessStrategy',
    variables: ['industry_trend', 'key_insight', 'industry', 'implication_1', 'implication_2', 'implication_3'],
    platform: 'linkedin' as const,
  },
  {
    id: '5',
    name: 'Quick Tip',
    description: 'Share valuable tips that help your audience',
    category: 'Educational',
    content: '💡 Quick Tip: {tip_category}\n\n{specific_tip}\n\nThis simple strategy can help you achieve {benefit}. Try it out and let us know how it works for you! 👇\n\n#ProTip #{industry} #BusinessTips #LifeHacks',
    variables: ['tip_category', 'specific_tip', 'benefit', 'industry'],
    platform: 'twitter' as const,
  },
  {
    id: '6',
    name: 'Limited Time Offer',
    description: 'Create urgency for your promotions',
    category: 'Promotion',
    content: '⏰ LIMITED TIME: {offer_details}\n\nDon\'t miss out on {discount}% off! This offer ends in {timeframe}. \n\nShop now: {link}\n\n#LimitedOffer #Sale #Discount #FlashSale #{brand_name}',
    variables: ['offer_details', 'discount', 'timeframe', 'link', 'brand_name'],
    platform: 'instagram' as const,
  },
  {
    id: '7',
    name: 'Team Introduction',
    description: 'Introduce team members and build human connection',
    category: 'Team',
    content: 'Meet {name}, our {role}! 👋\n\n{name} has been with us for {time_period} and specializes in {expertise}. \n\nFavorite thing about working here: "{fun_fact}"\n\nSay hi to {name} in the comments! 👇\n\n#TeamIntroduction #MeetTheTeam #{company_name} #Workplace',
    variables: ['name', 'role', 'time_period', 'expertise', 'fun_fact', 'company_name'],
    platform: 'instagram' as const,
  },
  {
    id: '8',
    name: 'How-To Guide',
    description: 'Provide step-by-step instructions',
    category: 'Educational',
    content: 'HOW TO: {task_title}\n\nStep 1: {step_1}\nStep 2: {step_2}\nStep 3: {step_3}\nStep 4: {step_4}\n\nPro tip: {pro_tip}\n\nSave this post for later and follow us for more {category} tips! 💡\n\n#HowTo #Tutorial #DIY #{category} #LifeHacks',
    variables: ['task_title', 'step_1', 'step_2', 'step_3', 'step_4', 'pro_tip', 'category'],
    platform: 'instagram' as const,
  },
];

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
    const category = searchParams.get('category')
    const platform = searchParams.get('platform')
    const search = searchParams.get('search') || ''

    let filteredTemplates = mockTemplates

    if (category) {
      filteredTemplates = filteredTemplates.filter(template =>
        template.category.toLowerCase().includes(category.toLowerCase())
      )
    }

    if (platform) {
      filteredTemplates = filteredTemplates.filter(template =>
        template.platform === platform || template.platform === 'instagram' // Instagram templates work for most platforms
      )
    }

    if (search) {
      filteredTemplates = filteredTemplates.filter(template =>
        template.name.toLowerCase().includes(search.toLowerCase()) ||
        template.description.toLowerCase().includes(search.toLowerCase()) ||
        template.category.toLowerCase().includes(search.toLowerCase())
      )
    }

    return NextResponse.json({
      templates: filteredTemplates,
      total: filteredTemplates.length,
    })

  } catch (error) {
    console.error('Get templates error:', error)
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

    const createTemplateSchema = z.object({
      name: z.string().min(1, 'Template name is required'),
      description: z.string().optional(),
      category: z.string().min(1, 'Category is required'),
      content: z.string().min(1, 'Content is required'),
      variables: z.array(z.string()).default([]),
      platform: z.enum(['instagram', 'facebook', 'twitter', 'linkedin', 'tiktok', 'pinterest', 'youtube']).default('instagram'),
      isPublic: z.boolean().default(false),
    })

    const body = await request.json()
    const templateData = createTemplateSchema.parse(body)

    // For now, return a mock response since we don't have database setup for templates
    const newTemplate = {
      id: (mockTemplates.length + 1).toString(),
      ...templateData,
      createdBy: session.user.id,
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json({
      message: 'Template created successfully',
      template: newTemplate
    }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Create template error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}