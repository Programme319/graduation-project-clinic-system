# Clinic Management System - Quick Start Guide

## 🚀 What's Been Built

Your clinic management system has been completely converted from Laravel to a modern Node.js stack:

### Technology Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (via Neon)
- **ORM**: Drizzle ORM
- **Authentication**: Better Auth
- **AI Chatbot**: Ollama Cloud API
- **Deployment**: Vercel

### Key Features
✅ User authentication (sign up, sign in, session management)  
✅ Patient management (create, read, update, delete)  
✅ Medical investigations tracking  
✅ Medications management  
✅ AI chatbot with patient context  
✅ RESTful API endpoints  
✅ Production-ready build  

## 🔧 Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.development.local` file:

```env
DATABASE_URL=postgresql://user:password@host:5432/clinic_db
BETTER_AUTH_SECRET=your-secret-key-here
OLLAMA_CLOUD_API_URL=https://api.ollama.cloud
OLLAMA_CLOUD_API_KEY=your-api-key-here
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

**To generate `BETTER_AUTH_SECRET`:**
```bash
openssl rand -base64 32
```

### 3. Initialize Database

```bash
npm run db:push
```

This creates all tables in your PostgreSQL database.

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see your application.

## 📦 Project Structure

```
/app
  /api                          # API routes
    /auth/[...all]             # Authentication endpoints
    /patients                   # Patient management
    /patients/[id]             # Individual patient operations
    /investigations            # Medical investigations
    /medications               # Medications management
    /chat                      # AI chatbot
  globals.css                   # Global styles
  layout.tsx                    # Root layout
  page.tsx                      # Homepage

/lib
  /db
    client.ts                  # Database connection
    schema.ts                  # Drizzle ORM schema
  auth.ts                       # Better Auth configuration

/scripts
  migrate.mjs                   # Database migration runner

/public                         # Static assets
```

## 🌐 API Endpoints

### Authentication
```
POST   /api/auth/sign-up        Sign up with email
POST   /api/auth/sign-in        Sign in
GET    /api/auth/session        Get current session
```

### Patients
```
GET    /api/patients            List all patients
POST   /api/patients            Create new patient
GET    /api/patients/[id]       Get patient with investigations & medications
PUT    /api/patients/[id]       Update patient
DELETE /api/patients/[id]       Delete patient
```

### Investigations & Medications
```
POST   /api/investigations      Add investigation
POST   /api/medications         Add medication
```

### Chatbot
```
POST   /api/chat                Send message to AI
```

## 🚀 Deploy to Vercel

### 1. Push to GitHub

The code is already on the `node-js-backend` branch. Push it to your GitHub repository.

### 2. Create Vercel Project

- Go to [vercel.com](https://vercel.com)
- Click "Import Project"
- Select your GitHub repository
- Choose the `node-js-backend` branch

### 3. Add Environment Variables

In Vercel project settings → Environment Variables, add:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Your Neon PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Generated secret key |
| `OLLAMA_CLOUD_API_URL` | `https://api.ollama.cloud` |
| `OLLAMA_CLOUD_API_KEY` | Your Ollama API key |
| `NEXT_PUBLIC_API_URL` | Your Vercel domain + `/api` (e.g., `https://your-app.vercel.app/api`) |

### 4. Deploy

Click "Deploy" and watch your app go live!

Your application will automatically:
- Install dependencies
- Build with Next.js
- Deploy to Vercel's edge network
- Be accessible at your custom domain

## 📊 Database

The system uses PostgreSQL with these main tables:

- **users** - User accounts and authentication
- **patients** - Patient records with medical history
- **patient_investigations** - Medical test results
- **patient_medications** - Current and past medications
- **chat_history** - Chatbot conversation logs
- **sessions** - User sessions (Better Auth)
- **accounts** - OAuth accounts (Better Auth)

## 🔒 Security

- User authentication via Better Auth
- Password hashing and session management built-in
- SQL injection prevention via parameterized queries
- Environment variables for sensitive data
- Row-level authorization checks on all endpoints

## 📝 Next Steps

1. **Connect Frontend**: Update your React frontend to use the new API endpoints
2. **Test APIs**: Use Postman or similar tools to test the endpoints
3. **Configure Database**: Set up your Neon PostgreSQL database
4. **Add Ollama Key**: Get an API key from Ollama Cloud
5. **Deploy**: Follow the Vercel deployment steps above

## 🆘 Troubleshooting

### Database Connection Issues
- Verify DATABASE_URL format
- Check Neon connection pooling is enabled
- Ensure firewall allows Vercel IPs

### Build Failures
- Check all environment variables are set
- Verify Node.js 18+ is being used
- Run `npm install` to ensure dependencies are installed

### API Errors
- Check authentication token is being sent
- Verify request headers include `Authorization: Bearer <token>`
- Check console logs for detailed error messages

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Drizzle ORM Docs](https://orm.drizzle.team)
- [Better Auth Docs](https://www.better-auth.com)
- [Neon Documentation](https://neon.com/docs)
- [Vercel Deployment Guide](https://vercel.com/docs)

## 📞 Support

For detailed deployment instructions, see `DEPLOYMENT.md`.

Happy coding! 🎉
