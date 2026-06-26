# Clinic Management System - Deployment Guide

This is a Node.js/Next.js backend for the Clinic Management System, built to run on Vercel with PostgreSQL via Neon.

## Prerequisites

- Node.js 18+ installed
- Neon PostgreSQL database
- Vercel account (for deployment)
- Ollama Cloud API credentials (for AI chatbot)

## Local Development Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Environment Variables

Create a `.env.development.local` file with:

```env
DATABASE_URL=postgresql://user:password@host:5432/clinic_db
BETTER_AUTH_SECRET=your-secret-key-here
OLLAMA_CLOUD_API_URL=https://api.ollama.cloud
OLLAMA_CLOUD_API_KEY=your-api-key-here
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

To generate `BETTER_AUTH_SECRET`:
```bash
openssl rand -base64 32
```

### 3. Generate Database Migrations

```bash
npm run db:push
```

This will create all tables in your PostgreSQL database based on the Drizzle schema.

### 4. Run Development Server

```bash
npm run dev
```

The server will start at `http://localhost:3000`

## Deployment to Vercel

### 1. Connect GitHub Repository

- Push your code to GitHub on the `node-js-backend` branch
- Go to [Vercel Dashboard](https://vercel.com/dashboard)
- Click "Import Project" and select your GitHub repository
- Select the `node-js-backend` branch

### 2. Set Environment Variables in Vercel

In Vercel project settings, add these environment variables:

- **DATABASE_URL**: Your Neon PostgreSQL connection string
  - Get from Neon Dashboard: Connection String (include connection pooling)
  - Example: `postgresql://user:password@ep-host.us-east-1.neon.tech/clinic_db`

- **BETTER_AUTH_SECRET**: Generate with `openssl rand -base64 32`

- **OLLAMA_CLOUD_API_URL**: `https://api.ollama.cloud`

- **OLLAMA_CLOUD_API_KEY**: Your Ollama Cloud API key

- **NEXT_PUBLIC_API_URL**: Your Vercel deployment URL + `/api`
  - Example: `https://your-app.vercel.app/api`

### 3. Configure Build & Start Commands

In Vercel project settings → Build & Development Settings:
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Output Directory**: `.next`

### 4. Deploy

Click "Deploy" in Vercel. The deployment will:
1. Install dependencies
2. Build Next.js application
3. Deploy to Vercel edge network
4. Automatically run database migrations (optional - can be manual)

## Database Migrations

### Manual Migration (if needed)

```bash
npm run db:migrate
```

This runs migrations from the `drizzle` folder against your database.

### Generate New Migrations

After modifying schema in `lib/db/schema.ts`:

```bash
npm run db:push
```

### View Database in Studio (Development)

```bash
npm run db:studio
```

Opens Drizzle Studio to inspect your database tables.

## API Endpoints

All endpoints require authentication via Bearer token in the `Authorization` header.

### Authentication
- `POST /api/auth/sign-up` - Create new account
- `POST /api/auth/sign-in` - Sign in with email
- `GET /api/auth/session` - Get current session

### Patients
- `GET /api/patients` - List all patients
- `POST /api/patients` - Create new patient
- `GET /api/patients/[id]` - Get patient details with investigations and medications
- `PUT /api/patients/[id]` - Update patient
- `DELETE /api/patients/[id]` - Delete patient

### Investigations
- `POST /api/investigations` - Add investigation for a patient

### Medications
- `POST /api/medications` - Add medication for a patient

### Chatbot
- `POST /api/chat` - Send message to AI chatbot
  - Request: `{ message: string, patientId?: number }`
  - Response: `{ userMessage, aiResponse, context }`

## Troubleshooting

### Database Connection Issues
- Verify DATABASE_URL format includes all required parameters
- Check Neon connection pooling is enabled
- Ensure firewall allows Vercel IPs

### Authentication Failures
- Regenerate `BETTER_AUTH_SECRET` if uncertain
- Verify token is sent in Authorization header
- Check token hasn't expired

### Ollama API Errors
- Verify API credentials are correct
- Check API endpoint is accessible
- Review Ollama Cloud API documentation

### Build Failures
- Check Node.js version compatibility (18+)
- Verify all environment variables are set
- Check for TypeScript errors: `npm run build`

## Project Structure

```
/app
  /api                    - API routes
    /auth                 - Authentication endpoints
    /patients             - Patient management
    /investigations       - Medical investigations
    /medications          - Medications management
    /chat                 - AI chatbot
/lib
  /db
    client.ts             - Database client setup
    schema.ts             - Drizzle ORM schema
  auth.ts                 - Better Auth configuration
/scripts
  migrate.mjs             - Database migration runner
/drizzle                  - Generated migrations (auto-generated)
```

## Performance Tips

1. Use connection pooling in DATABASE_URL
2. Enable caching for patient data queries
3. Implement rate limiting for chat API
4. Monitor API response times in Vercel Analytics

## Security Considerations

1. Never commit `.env` files
2. Use environment variables for all secrets
3. Implement CORS policies for frontend
4. Validate all user input server-side
5. Use HTTPS only in production

## Support

For issues or questions:
1. Check Vercel documentation
2. Review Drizzle ORM docs
3. Check Better Auth documentation
4. Review Neon PostgreSQL docs
