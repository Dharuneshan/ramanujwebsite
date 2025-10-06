# 🚀 Complete Step-by-Step Hosting Guide for Ramanuj Website

## 📋 Prerequisites Checklist
- [ ] GitHub account (free at github.com)
- [ ] Railway account (free at railway.app)
- [ ] Vercel account (free at vercel.com)
- [ ] Your project code ready

---

## 🎯 STEP 1: Prepare Your Project for Production

### 1.1 Create Environment Files

**Create `backend/.env` file:**
```env
PORT=8080
SESSION_SECRET=ramanuj_secure_session_2025_change_this_secret
ADMIN_EMAIL=admin@ramanuj.com
ADMIN_PASSWORD=RamanujAdmin2025!
DATABASE_PATH=/app/data/app.db
NODE_ENV=production
FRONTEND_URL=https://ramanuj-website.vercel.app
```

**Create `app/.env` file:**
```env
VITE_API_URL=https://ramanuj-backend.railway.app
```

### 1.2 Update Backend Security Settings

**Update `backend/src/server.js` - Find this line (around line 47):**
```javascript
app.use(cors({ origin: true, credentials: true }));
```

**Replace with:**
```javascript
app.use(cors({ 
  origin: process.env.FRONTEND_URL || 'https://ramanuj-website.vercel.app',
  credentials: true 
}));
```

### 1.3 Update Frontend API Calls

**In `app/src/RamanujWebsite.tsx`, find all API calls and update them:**

Find this pattern (around line 1500-1600):
```typescript
const response = await fetch('http://127.0.0.1:8080/api/contacts', {
```

**Replace with:**
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8080';
const response = await fetch(`${API_BASE_URL}/api/contacts`, {
```

Do this for ALL API calls in the file (contacts, jobs, applications).

---

## 🎯 STEP 2: Push to GitHub

### 2.1 Initialize Git Repository
```bash
# In your project root directory (E:\Ramanuj_Website)
git init
git add .
git commit -m "Initial commit - Ramanuj website ready for deployment"
```

### 2.2 Create GitHub Repository
1. Go to [github.com](https://github.com)
2. Click "New repository"
3. Name: `ramanuj-website`
4. Make it **Public** (required for free hosting)
5. Don't initialize with README
6. Click "Create repository"

### 2.3 Push Your Code
```bash
git remote add origin https://github.com/YOUR_USERNAME/ramanuj-website.git
git branch -M main
git push -u origin main
```

---

## 🎯 STEP 3: Deploy Backend to Railway

### 3.1 Sign Up for Railway
1. Go to [railway.app](https://railway.app)
2. Click "Login" → "Login with GitHub"
3. Authorize Railway to access your GitHub

### 3.2 Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your `ramanuj-website` repository
4. Click "Deploy Now"

### 3.3 Configure Backend Service
1. Railway will auto-detect your project
2. Click on the service that was created
3. Go to "Settings" tab
4. Set **Root Directory** to: `backend`
5. Click "Save"

### 3.4 Add Environment Variables
1. In Railway dashboard, go to "Variables" tab
2. Add these variables one by one:

```
PORT = 8080
SESSION_SECRET = ramanuj_secure_session_2025_change_this_secret
ADMIN_EMAIL = admin@ramanuj.com
ADMIN_PASSWORD = RamanujAdmin2025!
DATABASE_PATH = /app/data/app.db
NODE_ENV = production
FRONTEND_URL = https://ramanuj-website.vercel.app
```

### 3.5 Deploy Backend
1. Go to "Deployments" tab
2. Click "Deploy" if not already deploying
3. Wait for deployment to complete (2-3 minutes)
4. Copy the generated URL (something like: `https://ramanuj-backend-production-xxxx.up.railway.app`)

---

## 🎯 STEP 4: Deploy Frontend to Vercel

### 4.1 Sign Up for Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up" → "Continue with GitHub"
3. Authorize Vercel to access your GitHub

### 4.2 Import Project
1. Click "New Project"
2. Find your `ramanuj-website` repository
3. Click "Import"

### 4.3 Configure Frontend Build
1. **Framework Preset**: Select "Vite"
2. **Root Directory**: Change to `app`
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. **Install Command**: `npm install`

### 4.4 Add Environment Variables
1. In "Environment Variables" section
2. Add:
```
VITE_API_URL = https://your-railway-backend-url.railway.app
```
(Replace with your actual Railway backend URL from Step 3.5)

### 4.5 Deploy Frontend
1. Click "Deploy"
2. Wait for deployment (1-2 minutes)
3. Copy the generated URL (something like: `https://ramanuj-website.vercel.app`)

---

## 🎯 STEP 5: Connect Frontend and Backend

### 5.1 Update Railway Environment Variable
1. Go back to Railway dashboard
2. Go to "Variables" tab
3. Update `FRONTEND_URL` with your actual Vercel URL
4. Click "Save"

### 5.2 Update Vercel Environment Variable
1. Go to Vercel dashboard
2. Go to your project → "Settings" → "Environment Variables"
3. Update `VITE_API_URL` with your actual Railway backend URL
4. Click "Save"

### 5.3 Redeploy Both Services
1. **Railway**: Go to "Deployments" → "Redeploy"
2. **Vercel**: Go to "Deployments" → Click the 3 dots → "Redeploy"

---

## 🎯 STEP 6: Test Your Website

### 6.1 Test Frontend
1. Visit your Vercel URL
2. Check if the website loads properly
3. Test navigation between pages

### 6.2 Test Contact Form
1. Go to Contact page
2. Fill out and submit the form
3. Check if it submits successfully

### 6.3 Test Admin Panel
1. Go to: `https://your-railway-backend-url.railway.app/admin`
2. Login with:
   - Email: `admin@ramanuj.com`
   - Password: `RamanujAdmin2025!`
3. Check if you can access the dashboard

### 6.4 Test Job Applications
1. Go to Careers page
2. Try to apply for a job
3. Upload a PDF resume
4. Check if application submits

---

## 🎯 STEP 7: Custom Domain (Optional)

### 7.1 Add Custom Domain to Vercel
1. Go to Vercel dashboard → Your project → "Settings" → "Domains"
2. Add your domain (e.g., `ramanuj.com`)
3. Follow DNS configuration instructions

### 7.2 Add Custom Domain to Railway
1. Go to Railway dashboard → Your service → "Settings" → "Domains"
2. Add your subdomain (e.g., `api.ramanuj.com`)
3. Follow DNS configuration instructions

---

## 🎯 STEP 8: Final Configuration

### 8.1 Update Environment Variables with Custom Domains
If you added custom domains, update:
- Railway: `FRONTEND_URL` = your custom frontend domain
- Vercel: `VITE_API_URL` = your custom backend domain

### 8.2 Set Up Monitoring
1. **Railway**: Monitor logs in "Deployments" tab
2. **Vercel**: Monitor analytics in "Analytics" tab

---

## 🎯 STEP 9: Go Live Checklist

- [ ] Website loads on Vercel URL
- [ ] Contact form works
- [ ] Admin panel accessible
- [ ] Job applications work
- [ ] File uploads work
- [ ] All pages load correctly
- [ ] Mobile responsive
- [ ] HTTPS enabled (automatic)

---

## 🆘 Troubleshooting

### Common Issues:

**1. CORS Errors:**
- Check if `FRONTEND_URL` in Railway matches your Vercel URL exactly
- Redeploy both services after updating

**2. API Not Working:**
- Verify `VITE_API_URL` in Vercel matches your Railway URL
- Check Railway logs for errors

**3. Database Issues:**
- Railway automatically handles SQLite database
- Check Railway logs if database operations fail

**4. File Upload Issues:**
- Check Railway logs for file upload errors
- Verify upload directory permissions

### Getting Help:
- Railway: Check logs in "Deployments" tab
- Vercel: Check function logs in "Functions" tab
- Both platforms have excellent documentation

---

## 🎉 Congratulations!

Your Ramanuj website is now live and accessible to the world!

**Your URLs:**
- Frontend: `https://ramanuj-website.vercel.app`
- Backend: `https://ramanuj-backend.railway.app`
- Admin: `https://ramanuj-backend.railway.app/admin`

**Cost: $0/month** 🎯

**Next Steps:**
1. Share your website URL
2. Monitor performance
3. Add more content through admin panel
4. Consider custom domain for professional look

---

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review platform documentation
3. Check deployment logs
4. Ensure all environment variables are set correctly

**Remember:** Both Railway and Vercel have excellent free tiers that are perfect for your project!
