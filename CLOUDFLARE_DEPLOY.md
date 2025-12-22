# Cloudflare Pages Deployment Guide

## ?? Deploying to Cloudflare Pages

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Ready for Cloudflare Pages"
git push origin main
```

### Step 2: Create Cloudflare Pages Project

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Click **Workers & Pages**
3. Click **Create application** ? **Pages** ? **Connect to Git**
4. Select your repository: `BaraaCRM-Front`

### Step 3: Configure Build Settings

Use these exact settings:

| Setting | Value |
|---------|-------|
| Framework preset | **Vite** |
| Build command | `pnpm run build` |
| Build output directory | `dist` |
| Root directory | `/` |

### Step 4: Set Environment Variables

In **Settings ? Environment Variables**, add:

**Production and Preview:**
```
VITE_FRONTEND_FORGE_API_URL=https://your-backend.up.railway.app/api
```

?? **Replace** `your-backend.up.railway.app` with your actual Railway backend URL!

### Step 5: Deploy

1. Click **Save and Deploy**
2. Wait 2-3 minutes for build to complete
3. Your app will be live at: `https://[your-project].pages.dev`

## ?? Automatic Deployments

Cloudflare Pages automatically deploys on every push to `main` branch:

```bash
git add .
git commit -m "Update feature"
git push origin main
# Cloudflare auto-deploys in ~2 minutes
```

## ?? Custom Domain (Optional)

### Add a Custom Domain:
1. Go to your Cloudflare Pages project
2. Click **Custom domains** ? **Set up a custom domain**
3. Enter your domain (e.g., `baracrm.com`)
4. Follow DNS instructions
5. SSL certificate auto-provisions

### Update Backend CORS:
After adding a custom domain, update your Railway backend:
```
PRODUCTION_FRONTEND_URLS=https://baracrm.pages.dev,https://baracrm.com
```

## ?? Features

? **Unlimited bandwidth** (no overage charges)
? **Automatic HTTPS** (SSL certificate included)
? **Global CDN** (fast everywhere)
? **Preview deployments** (for pull requests)
? **Atomic deployments** (instant rollbacks)
? **Analytics** (built-in page views)

## ?? Monitoring

### Build Logs:
- Dashboard ? Your Project ? Deployments
- Click any deployment to view logs

### Real-time Analytics:
- Dashboard ? Your Project ? Analytics
- See page views, bandwidth, requests

## ?? Troubleshooting

### Build fails with "command not found"?
**Fix:** Cloudflare uses `pnpm` by default. Make sure `pnpm-lock.yaml` is committed.

### "Cannot find module" error?
**Fix:** Verify all dependencies are in `package.json` and committed.

### Backend API calls fail?
**Fix:** 
1. Check environment variable is set correctly
2. Verify Railway backend URL is accessible
3. Check browser console for CORS errors
4. Ensure Railway CORS includes your Pages URL

### Environment variables not working?
**Fix:**
1. Must start with `VITE_` prefix
2. Redeploy after changing env vars
3. Clear browser cache

## ?? Preview Deployments

Every pull request gets its own preview URL:
- `https://[branch].[your-project].pages.dev`
- Test changes before merging
- Share with team for review

## ?? Production Best Practices

1. **Always test locally first**
   ```bash
   pnpm dev
   ```

2. **Build locally to catch errors**
   ```bash
   pnpm run build
   ```

3. **Use preview deployments** for new features

4. **Monitor analytics** for performance

5. **Keep environment variables secure** (never commit `.env`)

## ? Performance

Cloudflare Pages is globally distributed:
- **50+ data centers** worldwide
- **HTTP/3** and **QUIC** support
- **Brotli compression** enabled
- **Smart caching** for assets

## ?? Useful Links

- **Cloudflare Pages Docs:** https://developers.cloudflare.com/pages/
- **Dashboard:** https://dash.cloudflare.com/pages
- **Status:** https://www.cloudflarestatus.com/
- **Community:** https://community.cloudflare.com/

---

**Need help?** Check the [main DEPLOYMENT.md](../../BaraaCRM/DEPLOYMENT.md) guide or Railway logs.
