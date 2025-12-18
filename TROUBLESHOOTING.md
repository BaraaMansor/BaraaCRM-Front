# BaraaCRM Frontend-Backend Troubleshooting Guide

## ? Recent Fixes Applied

### 1. API Error Handling (FIXED)
- ? Fixed DELETE operations returning 204 No Content
- ? Added proper error messages for network failures
- ? Added handling for empty response bodies

### 2. JSON Serialization (FIXED)
- ? Backend now returns camelCase properties (id, companyId, etc.)
- ? All response DTOs properly mapped with Id fields

### 3. Foreign Key Validation (FIXED)
- ? Company validation for branches
- ? Branch validation for employees
- ? Proper error messages for invalid IDs

## ?? How to Start the Application

### Step 1: Start the Backend

Open PowerShell in the backend directory:

```powershell
cd C:\Users\mrboo\source\repos\BaraaCRM\BaraaCRM.API
dotnet run
```

You should see:
```
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: https://localhost:7005
      Now listening on: http://localhost:5000
```

### Step 2: Start the Frontend

Open a NEW PowerShell window in the frontend directory:

```powershell
cd C:\Projects\baracrm_frontend
pnpm dev
```

You should see:
```
VITE v7.x.x  ready in xxx ms

?  Local:   http://localhost:3000/
?  Network: use --host to expose
```

### Step 3: Open Browser

Navigate to: **http://localhost:3000**

## ?? Common Issues & Solutions

### Issue 1: SSL Certificate Error (ERR_CERT_AUTHORITY_INVALID)

**Symptoms:**
- Browser shows "Your connection is not private"
- Console error: `net::ERR_CERT_AUTHORITY_INVALID`

**Solution A - Trust the Certificate (Recommended):**
```powershell
dotnet dev-certs https --trust
```

Then restart the backend.

**Solution B - Use HTTP:**
1. Edit `C:\Projects\baracrm_frontend\.env`
2. Change:
   ```env
   VITE_FRONTEND_FORGE_API_URL=http://localhost:5000/api
   ```
3. Restart frontend: Stop (Ctrl+C) and run `pnpm dev` again

### Issue 2: CORS Error

**Symptoms:**
- Console error: `Access to fetch at 'https://localhost:7005/api/company' from origin 'http://localhost:3000' has been blocked by CORS policy`

**Verification:**
1. Make sure backend is running
2. Check backend console shows: "Now listening on: https://localhost:7005"
3. CORS is already configured for port 3000

**Fix (if needed):**
Backend `Program.cs` should have:
```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:3001")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// ... later in the file ...
app.UseCors("AllowFrontend");
```

### Issue 3: Database Connection Error

**Symptoms:**
- Backend error: `A network-related or instance-specific error occurred`
- Console shows database errors

**Solution:**
```powershell
# Navigate to backend directory
cd C:\Users\mrboo\source\repos\BaraaCRM

# Apply migrations
dotnet ef database update --project BaraaCRM.DataAccess --startup-project BaraaCRM.API
```

### Issue 4: "Failed to load companies" Toast Message

**Symptoms:**
- Red toast notification appears
- Console shows API errors

**Debugging Steps:**

1. **Check if backend is running:**
   - Open: https://localhost:7005 in browser
   - You should see Swagger UI

2. **Test API directly:**
   - Open browser console (F12)
   - Run:
     ```javascript
     fetch('https://localhost:7005/api/company')
       .then(r => r.json())
       .then(d => console.log('Companies:', d))
       .catch(e => console.error('Error:', e));
     ```

3. **Check browser console for specific errors:**
   - Press F12 ? Console tab
   - Look for red error messages

4. **Common causes:**
   - Backend not running ? Start backend
   - Wrong URL in .env ? Verify VITE_FRONTEND_FORGE_API_URL
   - SSL certificate issue ? Trust certificate or use HTTP

### Issue 5: Port Already in Use

**Symptoms:**
- Backend error: `Address already in use`
- Frontend error: `Port 3000 is already in use`

**Solution:**

For backend (port 7005):
```powershell
# Find process using port
netstat -ano | findstr :7005

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F
```

For frontend (port 3000):
```powershell
# Find process using port
netstat -ano | findstr :3000

# Kill the process
taskkill /PID <PID> /F
```

Or just use a different port by updating `vite.config.ts`:
```typescript
server: {
  port: 3001, // Change to another port
}
```

### Issue 6: Invalid Company IDs (id: null or undefined)

**Symptoms:**
- Frontend console shows: "All companies have invalid IDs!"
- Dropdowns show "No companies available"

**This should be FIXED now**, but if it still occurs:

1. **Check backend response:**
   ```powershell
   curl https://localhost:7005/api/company
   ```
   
   Should show:
   ```json
   [
     {
       "id": 1,
       "name": "Test Company",
       ...
     }
   ]
   ```

2. **If IDs are null, check backend:**
   - Make sure `CompanyResponseDto` is being used
   - Verify `SaveChangesAsync()` is called before returning

### Issue 7: Creating Items Fails with Validation Error

**Symptoms:**
- "Invalid company ID" when creating branches
- "Invalid branch ID" when creating employees

**This is EXPECTED behavior** for invalid data. Make sure:
1. Companies exist before creating branches
2. Branches exist before creating employees
3. No null or 0 values for foreign keys

## ?? Testing the API

### Test Companies Endpoint
```javascript
// In browser console (F12)
fetch('https://localhost:7005/api/company')
  .then(r => r.json())
  .then(d => console.log('Companies:', d));
```

### Test Creating a Company
```javascript
fetch('https://localhost:7005/api/company', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Test Company',
    address: '123 Test St',
    phoneNumber: '+1234567890',
    email: 'test@company.com',
    country: 'USA',
    city: 'Boston'
  })
})
  .then(r => r.json())
  .then(d => console.log('Created:', d));
```

## ?? Checking Backend Logs

Backend logs appear in the PowerShell window where you ran `dotnet run`.

Look for:
- ? `Now listening on: https://localhost:7005` - Backend started
- ?? SQL errors - Database connection issues
- ?? Exception messages - Application errors

## ?? Checking Frontend Logs

Open browser DevTools (F12):

### Console Tab
- Shows JavaScript errors
- Shows API call results
- Shows validation messages

### Network Tab
- Click on failed requests (red)
- Check "Response" to see backend error
- Check "Headers" to verify request format

## ?? Development Workflow

### Making Backend Changes

1. Stop backend (Ctrl+C)
2. Make code changes
3. Run `dotnet run`
4. Backend restarts automatically

### Making Frontend Changes

Frontend hot-reloads automatically when you save files.

If you change `.env`:
1. Stop frontend (Ctrl+C)
2. Run `pnpm dev` again

## ?? Verification Checklist

Before reporting issues, verify:

- [ ] Backend is running (`dotnet run` in BaraaCRM.API)
- [ ] Frontend is running (`pnpm dev` in baracrm_frontend)
- [ ] Database is created (run migrations if needed)
- [ ] Browser is open to http://localhost:3000
- [ ] Browser console (F12) is open to see errors
- [ ] Backend console is showing "Now listening on..."

## ?? Still Having Issues?

If problems persist:

1. **Copy errors from:**
   - Browser console (F12 ? Console tab)
   - Backend PowerShell window
   - Network tab (F12 ? Network ? Failed request ? Response)

2. **Check:**
   - .NET SDK version: `dotnet --version` (should be 8.x)
   - Node version: `node --version` (should be 18+ or 20+)
   - pnpm version: `pnpm --version`

3. **Try clean restart:**
   ```powershell
   # Backend
   cd C:\Users\mrboo\source\repos\BaraaCRM\BaraaCRM.API
   dotnet clean
   dotnet build
   dotnet run

   # Frontend (in new window)
   cd C:\Projects\baracrm_frontend
   pnpm install
   pnpm dev
   ```

## ?? Expected Behavior

### When Everything Works:

1. **Frontend loads at http://localhost:3000**
2. **Companies page shows:**
   - Empty state with "Create Your First Company" button, OR
   - List of companies if you've created some
3. **Creating a company:**
   - Opens dialog
   - Submit creates company
   - Company appears in list immediately
4. **No console errors**
5. **Backend shows successful requests:**
   ```
   info: Microsoft.AspNetCore.Hosting.Diagnostics[1]
         Request starting HTTP/2 GET https://localhost:7005/api/company
   info: Microsoft.AspNetCore.Hosting.Diagnostics[2]
         Request finished HTTP/2 GET https://localhost:7005/api/company - 200
   ```

## ?? Additional Resources

- Backend Swagger: https://localhost:7005
- Frontend Dev Server: http://localhost:3000
- Backend Code: `C:\Users\mrboo\source\repos\BaraaCRM`
- Frontend Code: `C:\Projects\baracrm_frontend`
