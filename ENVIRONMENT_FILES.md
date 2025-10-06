# Environment Files You Need to Create

## 1. Create `backend/.env` file

Create this file in your `backend` folder:

```env
PORT=8080
SESSION_SECRET=ramanuj_secure_session_2025_change_this_secret
ADMIN_EMAIL=admin@ramanuj.com
ADMIN_PASSWORD=RamanujAdmin2025!
DATABASE_PATH=/app/data/app.db
NODE_ENV=production
FRONTEND_URL=https://ramanuj-website.vercel.app
```

## 2. Create `app/.env` file

Create this file in your `app` folder:

```env
VITE_API_URL=https://ramanuj-backend.railway.app
```

## 3. Update your .gitignore

Add these lines to your `.gitignore` file (create it if it doesn't exist):

```gitignore
# Environment variables
.env
.env.local
.env.production

# Dependencies
node_modules/
*/node_modules/

# Build outputs
dist/
build/

# Database files
*.db
*.db-shm
*.db-wal

# Logs
*.log
npm-debug.log*

# OS generated files
.DS_Store
Thumbs.db
```

## Important Notes:

1. **Never commit .env files to GitHub** - they contain sensitive information
2. **Update the URLs** in these files after you get your actual deployment URLs
3. **Change the passwords** to something more secure before going live
4. **The SESSION_SECRET** should be a long, random string for security
