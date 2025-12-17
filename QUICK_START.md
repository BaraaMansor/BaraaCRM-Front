# ✅ Quick Start Checklist

Use this checklist to ensure everything is set up correctly for development.

## Backend Setup (BaraaCRM ASP.NET Core)

- [ ] Backend repository cloned
- [ ] .NET 8 SDK installed
- [ ] SQL Server LocalDB installed
- [ ] Database migrations applied:
  ```bash
  cd BaraaCRM.API
  dotnet ef database update --project ../BaraaCRM.DataAccess
  ```
- [ ] Backend running:
  ```bash
  cd BaraaCRM.API
  dotnet run
  ```
- [ ] Swagger UI accessible at: https://localhost:7005 or http://localhost:5000

## Frontend Setup (This Project)

- [ ] Node.js 18+ installed
- [ ] pnpm installed (or npm/yarn)
- [ ] Dependencies installed:
  ```bash
  pnpm install
  ```
- [ ] `.env` file created with correct backend URL:
  ```env
  VITE_FRONTEND_FORGE_API_URL=https://localhost:7005/api
  ```
- [ ] Frontend running:
  ```bash
  pnpm dev
  ```
- [ ] App accessible at: http://localhost:3000

## Testing the Connection

### Method 1: Browser Console Test

1. Open http://localhost:3000
2. Open browser DevTools (F12)
3. Go to Console tab
4. Run:
   ```javascript
   fetch("https://localhost:7005/api/company")
     .then(r => r.json())
     .then(d => console.log("✅ Connected!", d))
     .catch(e => console.error("❌ Error:", e));
   ```

### Method 2: Test in Your React Component

```typescript
import { useEffect } from 'react';
import { logApiHealth } from '@/lib/apiHealth';

function MyComponent() {
  useEffect(() => {
    logApiHealth(); // Check console for results
  }, []);

  return <div>Check console for API health status</div>;
}
```

### Method 3: Direct API Call

```typescript
import { companyApi } from "@/lib/api";

// In your component or effect
const companies = await companyApi.getAll();
console.log("Companies:", companies);
```

## Common Issues

### ❌ SSL Certificate Error

**Fix:** Trust the certificate or use HTTP

```bash
# Option 1: Trust certificate
dotnet dev-certs https --trust

# Option 2: Use HTTP in .env
VITE_FRONTEND_FORGE_API_URL=http://localhost:5000/api
```

### ❌ CORS Error

**Check:**

- Backend is running on port 7005 (HTTPS) or 5000 (HTTP)
- Frontend is running on port 3000
- Backend CORS allows http://localhost:3000

### ❌ Connection Refused

**Check:**

- Backend is actually running (`dotnet run`)
- No firewall blocking ports
- Correct URL in `.env`

### ❌ Database Errors

**Fix:** Apply migrations

```bash
cd BaraaCRM.API
dotnet ef database update --project ../BaraaCRM.DataAccess
```

## 🎉 Success Criteria

You're ready to develop when:

- ✅ Backend runs without errors
- ✅ Frontend runs without errors
- ✅ No CORS errors in browser console
- ✅ API calls return data (even if empty arrays)
- ✅ Swagger UI shows all endpoints

## 📚 Documentation

- Backend API Documentation: https://localhost:7005 (Swagger UI)
- Frontend Connection Guide: [BACKEND_CONNECTION.md](./BACKEND_CONNECTION.md)
- Full README: [README.md](./README.md)

## 🚀 Next Steps

Once everything is working:

1. Create/fetch some test data via Swagger UI
2. Build out your React components
3. Implement data fetching in pages
4. Add forms for creating/editing data
5. Add error handling and loading states

---

**Need Help?**

- Check browser console (F12) for errors
- Check backend terminal for errors
- Review [BACKEND_CONNECTION.md](./BACKEND_CONNECTION.md)
