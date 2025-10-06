# Production Setup Checklist

## Required Changes Before Deployment

### 1. Security Updates

#### Backend Security (backend/src/server.js):
```javascript
// Update CORS for production
app.use(cors({ 
  origin: process.env.FRONTEND_URL || 'https://your-frontend-domain.vercel.app',
  credentials: true 
}));

// Update session secret
secret: process.env.SESSION_SECRET || 'dev_secret_change_me',
```

#### Environment Variables (.env):
```env
PORT=8080
SESSION_SECRET=generate_a_secure_random_string_here
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your_secure_password_here
DATABASE_PATH=/app/data/app.db
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

### 2. Frontend Configuration

#### Update API calls in RamanujWebsite.tsx:
Replace hardcoded localhost URLs with environment variables:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
```

#### Add to app/.env:
```env
VITE_API_URL=https://your-backend-domain.railway.app
```

### 3. Database Considerations

The current SQLite setup works for small to medium applications. For production:

**Option A: Keep SQLite (Recommended for small projects)**
- Railway provides persistent storage
- No additional setup needed
- Perfect for portfolios and small business sites

**Option B: Upgrade to PostgreSQL (For larger applications)**
- Railway offers free PostgreSQL
- Better for high-traffic applications
- Requires database migration

### 4. File Upload Handling

Current setup stores files locally. For production:

**Option A: Keep local storage (Railway)**
- Railway provides persistent file storage
- Simple and cost-effective

**Option B: Use cloud storage (AWS S3, Cloudinary)**
- Better for scalability
- Requires additional setup and costs

## Deployment Commands

### Backend (Railway):
```bash
# No build step needed for Node.js
# Railway will run: npm start
```

### Frontend (Vercel):
```bash
npm run build
# Vercel will serve the dist folder
```

## Testing Checklist

Before going live, test:
- [ ] Contact form submission
- [ ] Job application with file upload
- [ ] Admin login functionality
- [ ] All API endpoints
- [ ] File upload/download
- [ ] Mobile responsiveness
- [ ] HTTPS redirects
- [ ] Error handling

## Monitoring

Set up monitoring for:
- Server uptime
- Error logs
- Database performance
- File upload success rates

## Backup Strategy

- Database: Railway provides automatic backups
- Files: Consider cloud storage for important uploads
- Code: GitHub provides version control

## Performance Optimization

- Enable gzip compression
- Optimize images
- Use CDN for static assets
- Implement caching headers

