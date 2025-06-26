# BWKD Website

This is the official website for Bangladesh Wadokai Karate Do (BWKD).

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm or pnpm

### Installation
1. Clone the repository
2. Install dependencies
   ```bash
   npm install
   # or
   pnpm install
   ```

### Environment Variables
Create a `.env.local` file in the root directory and add the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace the values with your actual Supabase project URL and anonymous key from your Supabase project dashboard.

### Supabase Setup
1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Go to your project dashboard and copy your project URL and anon key
3. Enable Email/Password authentication (enabled by default)

#### Database Setup
Run the following SQL commands in your Supabase SQL editor:

```sql
-- Create profiles table
CREATE TABLE public.profiles (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  name text,
  email text,
  phone text,
  mother_name text,
  father_name text,
  profile_image_url text,
  current_belt text,
  current_dan numeric,
  dan_exam_dates json,
  weight numeric,
  gender text,
  branch text,
  join_date timestamp without time zone DEFAULT now(),
  auth_id uuid,
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_auth_id_fkey FOREIGN KEY (auth_id) REFERENCES auth.users(id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = auth_id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = auth_id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = auth_id);
```

#### Storage Setup
1. Go to Storage in your Supabase dashboard
2. Create a new bucket named "profile-images"
3. Set the bucket to be public for easy image access
4. Configure upload restrictions as needed (5MB recommended for profile pictures)

### Creating Users in Supabase
Users can be created in several ways:

1. **Through the dashboard**: Go to Authentication → Users in your Supabase dashboard
2. **Self-registration**: Users can sign up directly through the app (if enabled)
3. **Email format**: Use the format `[username]@bwkd.app` for consistency

Example:
- Username: "student01" → Email: "student01@bwkd.app"
- Username: "instructor" → Email: "instructor@bwkd.app"

### Running the Development Server
```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Troubleshooting

### Authentication Issues
If you're having trouble with authentication:

1. Verify your Supabase project URL and anon key in `.env.local`
2. Check that your Supabase project is active and not paused
3. Ensure Row Level Security policies are properly configured
4. Clear browser cookies and local storage

### Database Connection Issues
If you can't connect to the database:

1. Confirm your Supabase project URL is correct
2. Check that the profiles table exists with the correct schema
3. Verify RLS policies allow the required operations

## Features
- User authentication with Supabase
- Student/member dashboard
- Event management
- Responsive design for all devices 