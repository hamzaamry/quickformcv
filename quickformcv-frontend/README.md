# QuickForm CV

## Environment Variables Setup

### 🚨 Important Security Note
**Never commit actual `.env` files to Git!** This repository only includes example files.

### Local Development Setup

1. **Copy the example files:**
   ```bash
   cd quickformcv-frontend
   cp .env.example .env.development.local
   ```

2. **Edit the files with your local values:**
   ```bash
   # .env.development.local
   NEXT_PUBLIC_API_URL=http://localhost:8000/api/v0
   NEXTAUTH_URL=http://localhost:3000
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

### Production Deployment

1**Create production environment file:**
   ```bash
   # Frontend production config
   cd quickformcv-frontend
   cp .env.production.example .env.production
   nano .env.production  # Edit with your domain
   ```

2**Set your production values:**
   ```bash
   # .env.production
   NEXT_PUBLIC_API_URL=https://yourdomain.com/api-server
   NEXTAUTH_URL=https://yourdomain.com
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   ```