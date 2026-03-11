# Deployment Guide

Deploy your Ultimate Tic-Tac-Toe game to the web!

## Deployment Options

### Option 1: Vercel (Recommended - Easiest)

**Why Vercel?**
- ✅ Free tier available
- ✅ Automatic deployments from Git
- ✅ Perfect for Vite projects
- ✅ Instant preview URLs

**Steps:**

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ultimate Tic-Tac-Toe initial commit"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to https://vercel.com/dashboard
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Click "Deploy"

3. **Configure Environment Variables**
   - In Vercel dashboard → Settings → Environment Variables
   - Add:
     ```
     VITE_SUPABASE_URL=your_url
     VITE_SUPABASE_ANON_KEY=your_key
     ```
   - Redeploy to apply

4. **Done!**
   - Your game is live at `https://your-project.vercel.app`

---

### Option 2: Netlify

**Steps:**

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy**
   - Go to https://app.netlify.com
   - Drag and drop the `dist` folder
   - OR connect your GitHub repository
   
3. **Add Environment Variables**
   - Site settings → Build & deploy → Environment
   - Add your Supabase credentials

---

### Option 3: GitHub Pages

**Steps:**

1. **Update vite.config.js**
   ```javascript
   export default defineConfig({
     base: '/Ultimate-tic-tac-toe/', // Your repo name
     // ... rest of config
   });
   ```

2. **Build & Deploy**
   ```bash
   npm run build
   cd dist
   ```

3. **Push to gh-pages branch**
   ```bash
   git add dist -f
   git commit -m "Deploy to GitHub Pages"
   git push origin `git subtree split --prefix dist main`:gh-pages --force
   ```

4. **Enable Pages**
   - Repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` / `/ (root)`
   - Your game is live at `https://username.github.io/Ultimate-tic-tac-toe/`

---

### Option 4: Docker + Any Cloud

**Dockerfile:**

```dockerfile
# Build stage
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Runtime stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Deploy to:**
- AWS Elastic Beanstalk
- Google Cloud Run
- Azure App Service
- DigitalOcean App Platform
- Railway
- Render

---

## Production Checklist

- [ ] **Environment Variables**: Set Supabase credentials in production
- [ ] **SSL/HTTPS**: Enabled by default on most platforms
- [ ] **CORS**: Configure Supabase CORS settings for your domain
- [ ] **Database Backups**: Enable Supabase automated backups
- [ ] **RLS Policies**: Implement proper security policies (see SETUP.md)
- [ ] **Monitor Performance**: Set up error tracking (Sentry, etc.)
- [ ] **Analytics**: Track user engagement
- [ ] **Scaling**: Monitor Supabase compute usage

---

## Production Security Considerations

### 1. Row Level Security (RLS)

Current demo setup is **NOT secure for production**. Implement proper policies:

```sql
-- Allow users to only access games they created
CREATE POLICY "users_own_games" ON public.games
  FOR ALL
  USING (auth.uid() = created_by_user_id)
  WITH CHECK (auth.uid() = created_by_user_id);
```

### 2. Add Authentication

```javascript
// supabaseClient.js
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

// Add authentication UI to your app
```

### 3. Environment Variable Management

```bash
# Never commit .env files!
echo ".env.local" >> .gitignore

# Use platform-specific secret management:
# - Vercel: Project Settings → Environment Variables
# - Netlify: Site Settings → Build & Deploy → Environment
# - Docker: Use secrets/vaults
```

### 4. Rate Limiting

Add rate limiting to prevent abuse:

```javascript
// Example: Supabase Edge Functions for rate limiting
// Or use a proxy service
```

### 5. Content Security Policy

Add CSP headers in your backend:

```
Content-Security-Policy: 
  default-src 'self';
  script-src 'self' 'unsafe-inline' *.supabase.co;
  connect-src 'self' *.supabase.co;
```

---

## Performance Optimization

### 1. Enable Compression

Most platforms do this automatically. Verify:
```javascript
// vite.config.js
import compression from 'vite-plugin-compression';

export default {
  plugins: [compression()]
};
```

### 2. Optimize Bundle

```bash
npm install --save-dev rollup-plugin-visualizer
```

### 3. Cache Strategy

```javascript
// service-worker.js or platform-specific config
// Cache game assets for offline play
```

### 4. Database Indexing

Already included in SETUP.md SQL:
```sql
CREATE INDEX idx_games_status ON public.games(status);
CREATE INDEX idx_games_created_at ON public.games(created_at DESC);
```

---

## Monitoring & Logging

### Set Up Error Tracking

**Sentry Example:**

```bash
npm install @sentry/react
```

```javascript
// main.jsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: import.meta.env.MODE
});
```

### Monitor Database

- Supabase Dashboard → Database → Logs
- Monitor query performance
- Watch for unusual patterns

---

## Scaling Strategy

As your game grows:

1. **Database Scaling**
   - Supabase: Upgrade compute instance
   - Consider caching with Redis

2. **API Throttling**
   - Implement rate limits per IP
   - Monitor Realtime subscriptions

3. **CDN**
   - Most platforms include CDN (Vercel, Netlify)
   - Static assets cached globally

4. **Realtime Limits**
   - Supabase: 100 concurrent connections per project
   - Consider connection pooling

---

## Rollback Strategy

If something breaks in production:

```bash
# With Vercel
vercel rollback  # View previous deployments
vercel --prod    # Redeploy latest

# With Git-based platforms
git revert <commit-hash>
git push
```

---

## Troubleshooting Deployment

### "Page not found" after deploy
- Check base path in `vite.config.js`
- Verify dist folder was built correctly

### Supabase connection fails in production
- Check CORS settings: https://app.supabase.com → API → CORS
- Add your domain to allowed origins
- Verify environment variables are set

### Game state not syncing
- Check Supabase Realtime is enabled
- Verify RLS policies allow read/write
- Monitor database logs for errors

### Slow performance
- Check bundle size: `npm run build` and inspect dist
- Monitor Supabase query performance
- Enable Vercel/Netlify analytics

---

## Domain Setup

To use a custom domain:

**Vercel:**
- Project Settings → Domains
- Add your domain
- Update DNS records (Vercel provides guide)

**Netlify:**
- Domain settings → Custom domains
- Point your DNS

**GitHub Pages:**
- Repository Settings → Pages → Custom domain
- Update DNS CNAME record

---

## Backup & Recovery

Supabase handles automatic backups, but:

1. **Enable point-in-time recovery** (Supabase Pro plan)
2. **Export game data periodically**:
   ```javascript
   const { data } = await supabase
     .from('games')
     .select('*');
   
   // Save locally or to backup service
   ```

3. **Test restore process** regularly

---

## What's Next?

- 📊 Add analytics (Google Analytics, Mixpanel)
- 🎯 Implement player accounts & rankings
- 💬 Add chat/messaging between players
- 🎮 Add AI opponent
- 📱 Create mobile app wrapper
- 🌍 Implement internationalization (i18n)

---

**Questions?** Check platform-specific documentation:
- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com)
- [Supabase Security](https://supabase.com/docs/guides/realtime/security)

Happy deploying! 🚀
