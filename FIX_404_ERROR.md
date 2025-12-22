# ?? Cloudflare Pages 404 Error - Fix Guide

## Problem: "This page can't be found" (HTTP 404)

If you see this error when accessing `https://baraacrm-front.pages.dev`, it's a **build configuration issue**.

## ? **Solution: Update and Redeploy**

### Step 1: Verify Changes Were Made

The following files have been updated:
- ? `vite.config.ts` - Changed output from `dist/public` to `dist`
- ? `wrangler.toml` - Updated build directory to `dist`
- ? `client/public/_redirects` - Added for client-side routing

### Step 2: Commit and Push Changes

```bash
cd C:\Projects\baracrm_frontend
git add .
git commit -m "Fix Cloudflare Pages 404 - Update build output directory"
git push origin main
```

### Step 3: Wait for Cloudflare to Rebuild

1. Go to https://dash.cloudflare.com
2. Navigate to **Workers & Pages** ? Your project
3. Watch the **Deployments** tab
4. Wait ~2-3 minutes for new deployment
5. Try accessing your site again

### Step 4: Verify Build Settings in Cloudflare

In Cloudflare Pages dashboard ? Settings ? Builds and deployments:

```
Framework preset: Vite
Build command: pnpm run build
Build output directory: dist
Root directory: /
```

?? **If "Build output directory" shows anything other than `dist`, change it to `dist`**

## ?? **Alternative: Manual Rebuild**

If auto-deploy doesn't work:

1. Go to Cloudflare Pages ? Your project
2. Click **Deployments** tab
3. Find latest deployment
4. Click **"···"** (three dots) ? **Retry deployment**

## ?? **Understanding the Issue**

### What Was Wrong:
```
vite.config.ts: build.outDir = "dist/public"  ?
Cloudflare Pages: Looking for files in "dist" ?
Result: 404 because files are in wrong location
```

### What's Fixed:
```
vite.config.ts: build.outDir = "dist"  ?
Cloudflare Pages: Looking for files in "dist" ?
Result: Files found, app loads! ?
```

## ?? **Checklist After Redeployment**

- [ ] Changes committed and pushed to GitHub
- [ ] Cloudflare detected the push and started new build
- [ ] Build completed successfully (check Deployments tab)
- [ ] Can access `https://baraacrm-front.pages.dev`
- [ ] See login/dashboard page (not 404)
- [ ] Browser console shows no errors

## ?? **Still Getting 404?**

### Check Build Logs:

1. Cloudflare Pages ? Your project ? Deployments
2. Click latest deployment
3. Click **"View build log"**
4. Look for errors in the output

### Common Issues:

**1. Build Output Directory Still Wrong:**
```
Fix: In Cloudflare dashboard ? Settings ? Build settings
Change "Build output directory" to: dist
```

**2. Build Command Failed:**
```
Check logs for:
- Missing dependencies
- TypeScript errors
- Vite build errors
```

**3. Environment Variables Missing:**
```
Fix: Settings ? Environment Variables
Add: VITE_FRONTEND_FORGE_API_URL=https://your-backend.up.railway.app/api
```

**4. Files Not in Git:**
```bash
git status  # Check if files are tracked
git add .
git commit -m "Fix build"
git push
```

## ?? **Test Locally First**

Before redeploying, test the build locally:

```bash
cd C:\Projects\baracrm_frontend

# Build
pnpm run build

# Check output
ls dist
# Should show: index.html, assets/, etc.

# Preview build
pnpm run preview
# Open http://localhost:4173
```

If local preview works, Cloudflare deployment will work too!

## ?? **Expected File Structure After Build**

```
dist/
??? index.html          ? Main HTML file
??? assets/
?   ??? index-abc123.js ? JavaScript bundle
?   ??? index-xyz789.css ? CSS bundle
??? _redirects          ? Routing configuration
```

## ?? **Correct URLs**

| What | URL | Purpose |
|------|-----|---------|
| **Frontend** | `https://baraacrm-front.pages.dev` | React app (UI) |
| **Backend** | `https://YOUR-APP.up.railway.app` | API server |
| **API Endpoint** | `https://YOUR-APP.up.railway.app/api/company` | Test API |

?? **Don't confuse frontend URL with backend URL!**

## ? **After Fix is Deployed**

1. **Test Frontend:**
   ```
   https://baraacrm-front.pages.dev
   ```
   Should see: Dashboard or login page

2. **Test Backend:**
   ```
   https://YOUR-APP.up.railway.app/api/company
   ```
   Should see: `[]` or list of companies

3. **Test Integration:**
   - Open frontend
   - Open DevTools (F12) ? Console
   - Should see no CORS errors
   - Try creating a company

## ?? **Need More Help?**

1. Share the **build log** from Cloudflare Pages
2. Share the **deployment log** from Railway
3. Share any **browser console errors**
4. Check `ls dist` output after running `pnpm run build`

---

**After pushing changes, allow 2-3 minutes for Cloudflare to rebuild and deploy!**
