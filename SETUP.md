# Setup Guide

## Fixing Checkout Error

If you're getting a checkout error, it's likely because database tables haven't been created yet or RLS policies are not configured. Follow these steps to set up your database:

### Step 1: Configure Supabase

1. Go to [Supabase](https://supabase.com) and create an account
2. Create a new project
3. Wait for project to be ready (about 2 minutes)
4. Go to Settings → API
5. Copy following:
   - Project URL
   - anon public key

### Step 2: Update .env File

Create or update your `.env` file in project root:

```env
DB_PROVIDER=supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Replace `your-supabase-project-url` and `your-supabase-anon-key` with your actual values.

### Step 3: Run Database Migration

You need to run SQL migration to create required tables. There are two ways to do this:

#### Option A: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Click "New Query"
4. Copy contents of `supabase/migrations/20260102104743_create_ecommerce_schema.sql`
5. Paste it into the SQL editor
6. Click "Run" to execute the migration

#### Option B: Using Supabase CLI (if installed)

```bash
supabase db push
```

### Step 4: Fix RLS Policies (IMPORTANT!)

If you're getting "new row violates row-level security policy" error, you need to fix the RLS policies:

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Click "New Query"
4. Copy contents of `supabase/migrations/20260102120000_fix_rls_policies.sql`
5. Paste it into the SQL editor
6. Click "Run" to execute the migration

This will fix permissions to allow inserting orders and order items.

### Step 5: Verify Tables Are Created

1. In Supabase dashboard, go to "Table Editor"
2. You should see these tables:
   - `categories`
   - `products`
   - `orders`
   - `order_items`

### Step 6: Verify RLS Policies

1. In Supabase dashboard, go to "Authentication" → "Policies"
2. Click on "orders" table
3. You should see policies for INSERT and SELECT
4. Do the same for "order_items" table

### Step 7: Restart the Development Server

```bash
npm run dev
```

## Common Issues

### Issue: "new row violates row-level security policy for table "orders""

**Solution:** Run the RLS policy fix from Step 4 above. This is the most common issue.

### Issue: "Table does not exist"

**Solution:** Make sure you ran the migration script in Step 3.

### Issue: "Permission denied"

**Solution:** Check that Row Level Security (RLS) policies are set correctly. Run the RLS fix migration.

### Issue: "Invalid API key"

**Solution:** Double-check your `.env` file and make sure:
- The URL is correct (no extra spaces)
- The anon key is copied correctly
- The file is saved properly

### Issue: Database connection failed

**Solution:**
- Verify your Supabase project is active
- Check that you copied the correct URL (it should start with `https://`)
- Make sure your network is working

## Testing the Checkout

1. Add some products to your cart
2. Go to `/cart`
3. Click "Proceed to Checkout"
4. Fill in the form and submit
5. If successful, you should be redirected to `/order-confirmation/[id]`

## Debugging Tips

If you're still having issues:

1. Open the browser console (F12)
2. Try to checkout
3. Look for error messages in the console
4. The checkout page now logs detailed error information

You can also check Supabase logs:
1. Go to your Supabase dashboard
2. Navigate to Logs
3. Filter for "POST" requests to see any database errors

## Alternative: Disable RLS (Not Recommended)

If you still have issues, you can temporarily disable RLS (not recommended for production):

```sql
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;
```

**Warning:** This makes your data publicly accessible. Only use this for local development.

