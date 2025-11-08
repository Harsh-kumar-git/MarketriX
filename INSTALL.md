# MarketriX Installation Guide

## Quick Setup

### 1. Install Dependencies

```bash
# Navigate to the project directory
cd MarketriX

# Install all required packages
npm install

# Note: Some packages may require additional setup
# If you encounter permission errors, try:
sudo npm install
```

### 2. Environment Configuration

```bash
# Copy the environment template
cp .env.example .env.local

# Edit the environment file
nano .env.local
```

**Minimum required for local development:**
```env
# Database (use SQLite for local development)
DATABASE_URL="file:./dev.db"

# NextAuth.js
NEXTAUTH_SECRET="development-secret-key-change-in-production"
NEXTAUTH_URL="http://localhost:3000"

# Optional: Add your actual API keys when ready
# GOOGLE_CLIENT_ID=""
# GOOGLE_CLIENT_SECRET=""
# OPENAI_API_KEY=""
```

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Create database (for SQLite)
npx prisma db push

# Or create migrations for PostgreSQL
npx prisma migrate dev
```

### 4. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Detailed Setup

### Database Options

**Option 1: SQLite (Easiest for local development)**
```env
DATABASE_URL="file:./dev.db"
```

**Option 2: PostgreSQL (Recommended for production)**
```env
DATABASE_URL="postgresql://username:password@localhost:5432/marketrix_db"
```

### Social Media Integration

To enable social media connections, add these to `.env.local`:

```env
# Facebook/Instagram
FACEBOOK_APP_ID="your-app-id"
FACEBOOK_APP_SECRET="your-app-secret"

# Twitter/X
TWITTER_API_KEY="your-api-key"
TWITTER_API_SECRET="your-api-secret"
TWITTER_ACCESS_TOKEN="your-access-token"
TWITTER_ACCESS_TOKEN_SECRET="your-access-token-secret"

# LinkedIn
LINKEDIN_CLIENT_ID="your-client-id"
LINKEDIN_CLIENT_SECRET="your-client-secret"
```

### AI Integration

For AI content generation:

```env
# OpenAI (Recommended)
OPENAI_API_KEY="sk-..."

# Alternative AI providers
ANTHROPIC_API_KEY="..."
GOOGLE_AI_API_KEY="..."
COHERE_API_KEY="..."
```

### File Storage

For production file storage:

```env
# AWS S3
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
AWS_REGION="us-east-1"
AWS_S3_BUCKET="your-bucket-name"

# Alternative: Cloudinary
CLOUDINARY_URL="cloudinary://..."
```

### Payment Processing

For subscription management:

```env
# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

### Email Service

For email notifications:

```env
# SendGrid
SENDGRID_API_KEY="SG...."

# Alternative: Resend
RESEND_API_KEY="re_..."
```

## Troubleshooting

### Common Issues

**1. Database Connection Errors**
```bash
# Reset database
npx prisma migrate reset
npx prisma db push
```

**2. Module Not Found Errors**
```bash
# Clear npm cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**3. TypeScript Errors**
```bash
# Regenerate types
npx prisma generate
npm run build
```

**4. Authentication Issues**
- Check that NEXTAUTH_SECRET is set
- Verify NEXTAUTH_URL matches your domain
- Clear browser cookies and cache

### Development Tips

**1. Use SQLite for initial development**
- Faster setup
- No external dependencies
- Easy to reset

**2. Test with mock data first**
- The app includes mock data for demonstration
- Works without external API keys
- Easy to understand the flow

**3. Gradually add integrations**
1. Start with basic authentication
2. Add one social media platform
3. Enable AI generation
4. Configure payments
5. Set up file storage

### Port Conflicts

If port 3000 is in use:
```bash
# Use a different port
npm run dev -- -p 3001

# Or update the environment variable
PORT=3001 npm run dev
```

## Production Deployment

### Environment Variables Required for Production

```env
# Database
DATABASE_URL="postgresql://..."

# Authentication
NEXTAUTH_SECRET="strong-random-string"
NEXTAUTH_URL="https://yourdomain.com"

# Social Media APIs
FACEBOOK_APP_ID="..."
FACEBOOK_APP_SECRET="..."

# AI Services
OPENAI_API_KEY="..."

# Payments
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# File Storage
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."

# Email
SENDGRID_API_KEY="..."
```

### Recommended Hosting

- **Frontend**: Vercel (seamless Next.js integration)
- **Backend**: Railway, Heroku, or AWS
- **Database**: Supabase, Heroku Postgres, or AWS RDS
- **Files**: AWS S3 or Cloudinary
- **Email**: SendGrid or Resend

## Security Notes

1. **Never commit `.env.local` to version control**
2. **Use strong secrets for production**
3. **Enable HTTPS in production**
4. **Validate all user inputs**
5. **Implement rate limiting**
6. **Keep dependencies updated**

## Support

This is a demonstration project. For production use:

1. Test thoroughly in staging environment
2. Implement proper error monitoring
3. Set up logging and analytics
4. Create backup strategies
5. Monitor API usage and costs

## Next Steps After Setup

1. ✅ Verify the application loads correctly
2. ✅ Test user registration and login
3. ✅ Create a test client
4. ✅ Create and schedule a test post
5. 🔄 Configure social media OAuth
6. 🔄 Add AI API keys
7. 🔄 Set up payment processing
8. 🔄 Configure file storage

Enjoy using MarketriX! 🚀