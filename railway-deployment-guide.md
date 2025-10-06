# Railway Deployment Guide for Ramanuj Website

## Prerequisites
1. GitHub account
2. Railway account (free at railway.app)
3. Your project pushed to GitHub

## Step 1: Prepare Environment Variables

Create a `.env` file in the backend directory with:

```env
PORT=8080
SESSION_SECRET=your_very_secure_session_secret_here_change_this
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your_secure_admin_password_here
DATABASE_PATH=/app/data/app.db
NODE_ENV=production
```

## Step 2: Update Backend for Production

### Update server.js CORS settings:
```javascript
// Change this line in server.js:
app.use(cors({ origin: true, credentials: true }));

// To this for production:
app.use(cors({ 
  origin: process.env.FRONTEND_URL || 'https://your-frontend-domain.vercel.app',
  credentials: true 
}));
```

### Add production build script to backend/package.json:
```json
{
  "scripts": {
    "dev": "node src/server.js",
    "start": "node src/server.js",
    "init": "node src/db/migrate.js",
    "build": "echo 'No build step needed for Node.js'"
  }
}
```

## Step 3: Update Frontend for Production

### Update vite.config.ts:
```typescript
export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom']
  },
  optimizeDeps: {
    include: ['react', 'react-dom']
  },
  server: {
    host: '127.0.0.1',
    port: 5177,
    strictPort: true,
    open: true,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://127.0.0.1:8080',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
```

### Create .env file in app directory:
```env
VITE_API_URL=https://your-backend-domain.railway.app
```

## Step 4: Deploy to Railway

1. **Connect GitHub:**
   - Go to railway.app
   - Sign up with GitHub
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository

2. **Configure Backend Service:**
   - Railway will auto-detect it's a Node.js project
   - Set Root Directory to: `backend`
   - Add environment variables in Railway dashboard:
     - `PORT`: 8080
     - `SESSION_SECRET`: [generate a secure random string]
     - `ADMIN_EMAIL`: [your admin email]
     - `ADMIN_PASSWORD`: [secure password]
     - `NODE_ENV`: production

3. **Deploy:**
   - Railway will automatically build and deploy
   - You'll get a URL like: `https://your-project.railway.app`

## Step 5: Deploy Frontend to Vercel

1. **Connect to Vercel:**
   - Go to vercel.com
   - Sign up with GitHub
   - Import your repository

2. **Configure Build Settings:**
   - Framework Preset: Vite
   - Root Directory: `app`
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Environment Variables:**
   - Add `VITE_API_URL` with your Railway backend URL

4. **Deploy:**
   - Vercel will build and deploy automatically
   - You'll get a URL like: `https://your-project.vercel.app`

## Step 6: Update CORS and Test

1. Update your Railway backend CORS to allow your Vercel domain
2. Test all functionality:
   - Contact form
   - Job applications
   - Admin login
   - File uploads

## Cost: FREE
- Railway: $5/month credit (free tier)
- Vercel: Free for personal projects
- Total: $0/month

## Alternative: Single Platform Deployment

If you prefer one platform, use **Railway** for both frontend and backend:

1. Deploy backend as above
2. Add a second service in Railway for frontend:
   - Root Directory: `app`
   - Build Command: `npm run build`
   - Start Command: `npx serve dist -s -l 3000`
   - Add `serve` to frontend dependencies

This keeps everything on one platform for easier management.

