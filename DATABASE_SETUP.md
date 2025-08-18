# Database Setup Guide

## PostgreSQL Setup

1. **Install PostgreSQL** (if not already installed):

   ```bash
   # macOS with Homebrew
   brew install postgresql
   brew services start postgresql

   # Or use Docker
   docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres
   ```

2. **Create Database**:
   ```bash
   createdb taskify
   ```

## Environment Configuration

Create a `.env.local` file in your project root with:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/taskify"

# Authentication
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

Replace `username:password` with your actual PostgreSQL credentials.

## Database Migration

1. **Generate migration files**:

   ```bash
   npm run db:generate
   ```

2. **Apply migrations to database**:

   ```bash
   npm run db:push
   ```

3. **View database in Drizzle Studio**:
   ```bash
   npm run db:studio
   ```

## Files Created

- `src/lib/db.ts` - Database connection with Drizzle
- `src/lib/auth.ts` - Better-auth configuration
- `src/lib/schema.ts` - Database schema definitions
- `drizzle.config.ts` - Drizzle configuration

## Next Steps

1. Set up your `.env.local` file with proper database credentials
2. Run `npm run db:generate` to create migration files
3. Run `npm run db:push` to apply migrations
4. Start your development server with `npm run dev`

Your authentication system is now ready to use with PostgreSQL and Drizzle ORM!


