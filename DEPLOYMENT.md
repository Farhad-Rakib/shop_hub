# Vercel Deployment Guide

This guide will help you deploy your ShopHub e-commerce application to Vercel.

## Prerequisites

Before deploying, make sure you have:

1. **Supabase Project**: Create one at [supabase.com](https://supabase.com)
2. **GitHub Repository**: Push your code to GitHub
3. **Vercel Account**: Create one at [vercel.com](https://vercel.com)

## Step 1: Database Setup

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up / Sign in
3. Click "New Project"
4. Choose your organization
5. Set project name (e.g., `shophub`)
6. Set database password (save this securely!)
7. Select a region closest to your users
8. Click "Create new project"
9. Wait for project to be ready (~2 minutes)

### 1.2 Run Database Migrations

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **"New Query"**
3. Copy contents of `supabase/migrations/20260102104743_create_ecommerce_schema.sql`
4. Paste and click **"Run"**
5. Repeat with `supabase/migrations/20260102120000_fix_rls_policies.sql`

### 1.3 Get Supabase Credentials

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL**
   - **anon public key**

## Step 2: Update .env.example

Make sure your `.env.example` file is up to date:

```env
DB_PROVIDER=supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Step 3: Push to GitHub

### 3.1 Initialize Git (if not already done)

```bash
git init
git add .
git commit -m "Initial commit - ShopHub e-commerce app"
```

### 3.2 Create GitHub Repository

1. Go to GitHub
2. Create a new repository (e.g., `shophub`)
3. Don't initialize with README (you already have one)

### 3.3 Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/shophub.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

## Step 4: Deploy to Vercel

### 4.1 Connect Vercel to GitHub

1. Go to [vercel.com](https://vercel.com)
2. Sign up / Sign in
3. Click **"Add New..."** → **"Project"**
4. Click **"Import Git Repository"**
5. Install Vercel for GitHub if prompted
6. Select your `shophub` repository

### 4.2 Configure Project Settings

Vercel will detect this is a Next.js project. Configure:

#### Framework Preset
- **Framework**: Next.js
- **Root Directory**: `./` (default)
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default)

#### Environment Variables

Add these environment variables:

1. **DB_PROVIDER**
   - Key: `DB_PROVIDER`
   - Value: `supabase`
   - Environment: Production, Preview, Development

2. **NEXT_PUBLIC_SUPABASE_URL**
   - Key: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: Your Supabase Project URL
   - Environment: Production, Preview, Development

3. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - Key: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Value: Your Supabase Anon Key
   - Environment: Production, Preview, Development

⚠️ **Important**: Make sure to add these to ALL environments (Production, Preview, Development)!

### 4.3 Deploy

1. Click **"Deploy"**
2. Wait for deployment to complete (~2-3 minutes)
3. You'll get a URL like: `https://shophub.vercel.app`

## Step 5: Post-Deployment Setup

### 5.1 Verify Deployment

1. Visit your Vercel URL
2. Check if products load from Supabase
3. Test adding items to cart
4. Test checkout flow

### 5.2 Custom Domain (Optional)

1. Go to Vercel project **Settings** → **Domains**
2. Add your custom domain
3. Update DNS records as instructed by Vercel

### 5.3 Update Production Environment

If you want to use a separate Supabase project for production:

1. Create a new Supabase project for production
2. Run migrations on production database
3. Update environment variables in Vercel:
   - Go to **Settings** → **Environment Variables**
   - Update `NEXT_PUBLIC_SUPABASE_URL`
   - Update `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Click **Redeploy**

## Continuous Deployment

Now whenever you push to your main branch:

1. Vercel automatically detects the push
2. Builds your application
3. Deploys to production

### Deploy Preview Branches

Every time you push to a non-main branch:

1. Vercel creates a preview deployment
2. You get a unique URL to test changes
3. No impact on production
4. Great for testing and code reviews!

## Troubleshooting

### Build Fails

**Error**: `Build failed`

**Solutions**:
- Check Vercel deployment logs
- Ensure all dependencies are in package.json
- Run `npm run build` locally first
- Check TypeScript errors with `npm run typecheck`

### Environment Variables Not Working

**Error**: Environment variables undefined

**Solutions**:
- Verify variables are set in Vercel dashboard
- Check variable names match exactly (case-sensitive)
- Ensure variables are added to correct environments
- Variables starting with `NEXT_PUBLIC_` are accessible in browser

### Database Connection Issues

**Error**: Failed to connect to Supabase

**Solutions**:
- Verify Supabase project is active
- Check URL format: `https://xxx.supabase.co`
- Verify anon key is correct
- Check Supabase logs for connection errors

### RLS Policy Errors

**Error**: "new row violates row-level security policy"

**Solutions**:
- Run RLS policy fix migration in Supabase
- Check policies are set for `anon` role
- Verify tables have correct RLS policies

### Images Not Loading

**Error**: Images fail to load

**Solutions**:
- Check image URLs are accessible
- Verify remote patterns in `next.config.js`
- Ensure CORS is configured (if using external images)

## Performance Optimization

### Enable Image Optimization

Update `next.config.js` to use Supabase storage:

```javascript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'xxx.supabase.co',
      port: '',
      pathname: '/storage/v1/object/**',
    },
  ],
}
```

### Enable Caching

Vercel automatically caches static assets. For dynamic content:

1. Use Next.js `revalidate` in `fetch()`
2. Set appropriate cache headers
3. Use ISR (Incremental Static Regeneration)

## Monitoring

### Vercel Analytics

1. Go to Vercel project dashboard
2. Click **"Analytics"**
3. View page views, visitor data, performance

### Supabase Logs

1. Go to Supabase dashboard
2. Click **"Logs"**
3. Monitor database queries, errors

## Security Checklist

Before going live:

- [ ] Remove test data from database
- [ ] Set up database backups
- [ ] Enable authentication (if needed)
- [ ] Configure CORS settings in Supabase
- [ ] Set up custom domain with HTTPS
- [ ] Enable rate limiting (if needed)
- [ ] Review RLS policies
- [ ] Remove development-only code
- [ ] Set up error monitoring (Sentry, etc.)
- [ ] Enable security headers in Vercel

## Production Best Practices

1. **Always test preview deployments** before merging to main
2. **Keep dependencies updated**: `npm update`
3. **Monitor build times**: Slow builds may indicate issues
4. **Set up alerts**: Configure Vercel notifications
5. **Use environment-specific databases**: Dev, Staging, Production
6. **Enable Analytics**: Track performance and user behavior
7. **Regular backups**: Supabase does this automatically
8. **Test checkout flow**: Regularly test payment/order flow

## Need Help?

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)

## Quick Reference

### Useful Vercel Commands

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from command line
vercel

# Link to existing project
vercel link

# View logs
vercel logs

# Pull environment variables
vercel env pull .env.local
```

### Environment Variables Template

```env
# Database
DB_PROVIDER=supabase

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Future: Payment Gateway
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_xxx
STRIPE_SECRET_KEY=sk_xxx
```

---

🎉 **Congratulations!** Your ShopHub is now deployed on Vercel!
