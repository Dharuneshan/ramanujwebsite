# 🚀 Quick Setup Commands

## Before You Start - Run These Commands

### 1. Create Environment Files
```bash
# Create backend environment file
echo "PORT=8080
SESSION_SECRET=ramanuj_secure_session_2025_change_this_secret
ADMIN_EMAIL=admin@ramanuj.com
ADMIN_PASSWORD=RamanujAdmin2025!
DATABASE_PATH=/app/data/app.db
NODE_ENV=production
FRONTEND_URL=https://ramanuj-website.vercel.app" > backend/.env

# Create frontend environment file
echo "VITE_API_URL=https://ramanuj-backend.railway.app" > app/.env
```

### 2. Create .gitignore
```bash
echo "# Environment variables
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
Thumbs.db" > .gitignore
```

### 3. Initialize Git and Push to GitHub
```bash
# Initialize git repository
git init
git add .
git commit -m "Initial commit - Ramanuj website ready for deployment"

# Add your GitHub repository (replace YOUR_USERNAME with your actual GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/ramanuj-website.git
git branch -M main
git push -u origin main
```

## After GitHub Setup - Follow the Main Guide

Once you've pushed to GitHub, follow the **COMPLETE_HOSTING_GUIDE.md** for the deployment steps.

## Important Notes:

1. **Replace YOUR_USERNAME** with your actual GitHub username
2. **Change the passwords** in the .env files to something more secure
3. **Update the URLs** after you get your actual deployment URLs from Railway and Vercel
