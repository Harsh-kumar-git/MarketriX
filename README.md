# MarketriX - Social Media Marketing Agency Platform

A comprehensive SMMA platform built with Next.js 13, TypeScript, and modern web technologies.

## 🚀 Features

### ✅ Completed Implementation
- **Authentication System**: NextAuth.js with multiple providers (credentials, Google OAuth)
- **Database Schema**: Complete Prisma schema with all necessary models
- **API Infrastructure**: Full REST API with authentication, validation, and error handling
- **Client Management**: CRUD operations for client management
- **Post Management**: Create, schedule, and manage social media posts
- **AI Content Generation**: Mock AI content generation system (ready for OpenAI integration)
- **Social Account Integration**: OAuth flow for Instagram/Facebook connection
- **Media Upload**: File upload system for images and videos
- **Analytics Dashboard**: Mock analytics data and reporting
- **Subscription Management**: Basic subscription system with plan limits
- **Responsive UI**: Complete frontend with dark mode support

### 🛠️ Tech Stack

**Frontend:**
- Next.js 13.5.1 with App Router
- TypeScript
- Tailwind CSS + shadcn/ui components
- Radix UI primitives
- Recharts for data visualization
- NextAuth.js for authentication

**Backend:**
- Next.js API Routes
- Prisma ORM
- PostgreSQL database schema
- Zod for validation
- NextAuth.js with adapters

**Infrastructure:**
- File upload system (local storage, ready for AWS S3)
- Mock AI generation (ready for OpenAI integration)
- OAuth integration framework
- Subscription management system

## 📋 Setup Instructions

### Prerequisites
- Node.js 18+
- npm or yarn
- PostgreSQL database (or use SQLite for development)

### Installation

1. **Clone and install dependencies:**
```bash
cd MarketriX
npm install
```

2. **Environment setup:**
```bash
cp .env.example .env.local
# Fill in your environment variables
```

3. **Database setup:**
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push
```

4. **Start development server:**
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 📁 Project Structure

```
MarketriX/
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── clients/              # Client management
│   │   ├── posts/                # Post management
│   │   ├── social-accounts/      # Social media accounts
│   │   ├── ai/                   # AI content generation
│   │   ├── media/                # File upload
│   │   ├── analytics/            # Analytics data
│   │   └── subscription/         # Subscription management
│   ├── (auth)/                   # Authentication pages
│   ├── (dashboard)/              # Dashboard pages
│   └── layout.tsx               # Root layout
├── components/                   # Reusable components
│   ├── ui/                      # shadcn/ui components
│   ├── landing/                 # Landing page components
│   └── dashboard/               # Dashboard components
├── context/                     # React contexts
├── lib/                         # Utilities and configurations
├── prisma/                      # Database schema and migrations
├── types/                       # TypeScript type definitions
└── public/                      # Static assets
```

## 🔐 Authentication

The platform supports multiple authentication methods:

1. **Email/Password**: Traditional authentication with bcrypt hashing
2. **Google OAuth**: Social login via Google
3. **Session Management**: Secure JWT tokens with refresh rotation

## 📊 Core Features

### Client Management
- Add, edit, and delete clients
- Track client performance metrics
- Manage social media accounts per client
- Team member collaboration

### Post Management
- Create posts for multiple platforms
- Schedule posts for automatic publishing
- Media upload and management
- Hashtag and content optimization

### AI Content Generation
- Generate captions and content ideas
- Improve existing content
- Platform-specific optimization
- Template library

### Analytics
- Performance metrics across platforms
- Engagement tracking
- Client reporting
- Growth analytics

### Social Media Integration
Currently supports Instagram/Facebook OAuth integration. Framework is ready for:
- Twitter/X API
- LinkedIn API
- TikTok API
- Pinterest API
- YouTube API

## 💳 Subscription Plans

- **Free**: 1 client, 10 posts/month, basic AI (100 tokens)
- **Pro**: $29/month - 5 clients, 100 posts/month, advanced AI (1000 tokens)
- **Business**: $99/month - Unlimited everything, team collaboration, API access

## 🔧 Development Notes

### Database Schema
The Prisma schema includes all necessary models:
- Users, Clients, SocialAccounts, Posts
- MediaFiles, Analytics, TeamMembers
- Subscriptions, ContentTemplates, ScheduledPosts

### API Standards
- RESTful design with proper HTTP methods
- Consistent error handling
- Request validation with Zod
- Authentication middleware
- Rate limiting ready

### Frontend Architecture
- Server-side rendering where appropriate
- Client components for interactivity
- Responsive design with Tailwind CSS
- Dark mode support
- Component-based architecture

## 🚀 Deployment

### Environment Variables
Key environment variables needed for production:

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="https://yourdomain.com"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
OPENAI_API_KEY="..."
STRIPE_SECRET_KEY="..."
AWS_ACCESS_KEY_ID="..."
```

### Recommended Platforms
- **Frontend**: Vercel
- **Backend**: Railway/Heroku
- **Database**: Heroku Postgres/Supabase
- **Files**: AWS S3/Cloudinary
- **Queue**: Redis Cloud

## 🔄 Next Steps

### Immediate Improvements
1. Install missing dependencies
2. Set up real database connection
3. Configure OAuth providers
4. Integrate OpenAI API
5. Set up file storage (AWS S3)
6. Configure Stripe payments

### Future Enhancements
1. Complete social media platform integrations
2. Real-time notifications with WebSockets
3. Advanced analytics and reporting
4. Team collaboration features
5. Mobile app development
6. Advanced AI features
7. White-label customization

## 📄 License

This project is a demonstration of a modern web application architecture.

## 🤝 Contributing

This is a demonstration project. Feel free to use it as a reference for your own projects.

---

Built with ❤️ using Next.js, TypeScript, and modern web technologies.