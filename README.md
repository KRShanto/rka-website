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
Copy the environment example file and update the values:
```bash
cp .env.example .env.local
```

Update the following variables in your `.env.local` file:
- `NEXT_PUBLIC_APPWRITE_ENDPOINT`: Your Appwrite API endpoint
- `NEXT_PUBLIC_APPWRITE_PROJECT_ID`: Your Appwrite project ID

### Appwrite Setup
1. Create an Appwrite project in the [Appwrite Console](https://cloud.appwrite.io/console)
2. Enable Email/Password authentication in the "Auth" settings
3. Create a Web App platform in "Settings" → "Platforms" with your development/production hostname

#### Important Platform Configuration
To avoid the "User (role: guests) missing scope (account)" error:

1. Go to your Appwrite Console → Project Settings → Platforms
2. Click on "Add Platform" → "Web App"
3. Enter your app name
4. In the Hostname field, add these values one at a time (add a new platform for each):
   - `localhost` (for local development)
   - Your production domain (if applicable)
5. Make sure you're accessing your app from one of these registered hostnames

### Creating Users in Appwrite
When creating users in Appwrite for this app, follow these guidelines:

1. Each user ID must be created with a valid email format: `[userId]@bwkd.app`
2. The `userId` part must follow Appwrite's rules:
   - Maximum 36 characters
   - Only use alphanumeric characters, periods, hyphens, and underscores (a-z, A-Z, 0-9, ., -, _)
   - Cannot start with a special character
   
For example:
- To create a user with ID "33939393", use email "33939393@bwkd.app"
- To create a user with ID "student_01", use email "student01@bwkd.app" (avoid starting with underscore)

### Running the Development Server
```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Troubleshooting

### Permission Errors
If you see the error **"User (role: guests) missing scope (account)"**, this means your app doesn't have permission to access Appwrite's account API. Fix it by:

1. Make sure your platform is correctly registered in Appwrite (see "Important Platform Configuration" above)
2. Verify you're accessing the app from the registered hostname (e.g., `localhost` not `127.0.0.1`)
3. Clear your browser cookies and cache
4. Make sure your `.env.local` file has the correct `NEXT_PUBLIC_APPWRITE_PROJECT_ID`

## Features
- User authentication with Appwrite
- Student/member dashboard
- Event management
- Responsive design for all devices 