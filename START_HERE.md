# ?? BaraaCRM Quick Start Guide

## Prerequisites
- ? .NET 8 SDK installed
- ? Node.js 18+ installed
- ? pnpm installed (`npm install -g pnpm`)
- ? SQL Server LocalDB installed

## Start in 3 Steps

### Step 1: Start Backend API
```powershell
cd C:\Users\mrboo\source\repos\BaraaCRM\BaraaCRM.API
dotnet run
```

Wait for: **"Now listening on: https://localhost:7005"**

### Step 2: Start Frontend (NEW WINDOW)
```powershell
cd C:\Projects\baracrm_frontend
pnpm dev
```

Wait for: **"Local: http://localhost:3000/"**

### Step 3: Open Browser
Navigate to: **http://localhost:3000**

## First Time Setup

### Initialize Database
```powershell
cd C:\Users\mrboo\source\repos\BaraaCRM
dotnet ef database update --project BaraaCRM.DataAccess --startup-project BaraaCRM.API
```

### Trust SSL Certificate (if using HTTPS)
```powershell
dotnet dev-certs https --trust
```

### Install Frontend Dependencies (if needed)
```powershell
cd C:\Projects\baracrm_frontend
pnpm install
```

## URLs

- **Frontend:** http://localhost:3000
- **Backend API:** https://localhost:7005
- **Swagger UI:** https://localhost:7005

## Quick Test

Open browser console (F12) and run:
```javascript
fetch('https://localhost:7005/api/company')
  .then(r => r.json())
  .then(d => console.log('? Backend connected:', d));
```

## Troubleshooting

If you see errors, check:
1. Both terminals are running (backend + frontend)
2. No port conflicts (7005, 5000, 3000)
3. SSL certificate is trusted

For detailed troubleshooting, see: **TROUBLESHOOTING.md**

## Stop Services

Press **Ctrl+C** in each terminal window.
