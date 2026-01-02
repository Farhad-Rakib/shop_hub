# Database Configuration Guide

This project supports both Supabase and PostgreSQL Neon Serverless databases.

## Current Setup: Supabase

The project is currently configured to use Supabase as the database provider.

### Configuration

Create a `.env` file in the root directory with the following variables:

```env
DB_PROVIDER=supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Future Setup: PostgreSQL Neon Serverless

To switch to PostgreSQL Neon Serverless database:

### Step 1: Install Dependencies

```bash
npm install pg @types/pg
```

### Step 2: Update .env File

```env
DB_PROVIDER=neon
DATABASE_URL=postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
```

### Step 3: Update Database Configuration

The `lib/database.ts` file already supports both providers. When `DB_PROVIDER` is set to `neon`, the application will use the PostgreSQL connection.

### Getting Neon Database URL

1. Sign up at [Neon](https://neon.tech)
2. Create a new project
3. Copy the connection string from the Neon dashboard
4. Add it to your `.env` file as `DATABASE_URL`

### Database Schema

The following tables are expected in your database:

- `categories` - Product categories
- `products` - Product catalog
- `orders` - Customer orders
- `order_items` - Order line items

### Switching Between Providers

Simply change the `DB_PROVIDER` environment variable and restart the development server:

```bash
# To use Supabase
DB_PROVIDER=supabase npm run dev

# To use Neon
DB_PROVIDER=neon npm run dev
```

## Database Client Usage

Import and use the database client in your code:

```typescript
import { supabase, getDatabaseClient } from '@/lib/database';

// Direct Supabase access
const { data } = await supabase.from('products').select('*');

// Access based on current provider
const client = getDatabaseClient();
```

## Notes

- The current implementation uses Supabase SDK for all database operations
- To fully support Neon, you'll need to migrate queries to use the `pg` client
- Consider using an ORM like Prisma or Drizzle for easier multi-provider support
