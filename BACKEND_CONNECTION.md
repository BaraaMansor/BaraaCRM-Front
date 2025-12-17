# Backend Connection Guide

## ✅ Setup Complete!

Your frontend is now configured to connect to the BaraaCRM backend.

## 📋 Configuration Summary

- **Backend URL:** `https://localhost:7005/api`
- **Environment File:** `.env`
- **API Service:** `client/src/lib/api.ts`

## 🚀 Starting the Application

### 1. Start the Backend (ASP.NET Core)

In your BaraaCRM backend directory:

```bash
cd BaraaCRM/BaraaCRM.API
dotnet run
```

The backend should start on:

- HTTPS: `https://localhost:7005`
- HTTP: `http://localhost:5000`

### 2. Start the Frontend (React)

In this directory:

```bash
pnpm dev
```

The frontend will start on `http://localhost:3000`

## 🧪 Testing the Connection

### Quick Test in Browser Console

Once your app is running, open the browser console (F12) and run:

```javascript
// Test fetching companies
fetch("https://localhost:7005/api/company")
  .then(res => res.json())
  .then(data => console.log("Companies:", data))
  .catch(err => console.error("Error:", err));
```

### Using the API Service

In your React components:

```typescript
import { companyApi, contactApi } from "@/lib/api";

// Fetch all companies
const companies = await companyApi.getAll();

// Create a new contact
const newContact = await contactApi.create({
  companyId: 1,
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  phoneNumber: "+1234567890",
  jobTitle: "Manager",
  contactType: "Customer",
  address: "123 Main St",
  city: "Boston",
  country: "USA",
});
```

## ⚠️ Common Issues & Solutions

### Issue 1: SSL Certificate Error

**Error:** `net::ERR_CERT_AUTHORITY_INVALID`

**Solution A - Trust the certificate:**

```bash
dotnet dev-certs https --trust
```

**Solution B - Use HTTP:**
Update `.env`:

```env
VITE_FRONTEND_FORGE_API_URL=http://localhost:5000/api
```

### Issue 2: CORS Error

**Error:** `Access to fetch has been blocked by CORS policy`

**Check:**

1. Make sure the backend is running
2. Verify CORS is configured in backend `Program.cs`:
   ```csharp
   builder.Services.AddCors(options => {
       options.AddDefaultPolicy(policy => {
           policy.WithOrigins("http://localhost:3000")
                 .AllowAnyMethod()
                 .AllowAnyHeader();
       });
   });
   ```

### Issue 3: Connection Refused

**Error:** `Failed to fetch` or `Connection refused`

**Check:**

1. Backend is running: `dotnet run`
2. Backend URL is correct in `.env`
3. Ports are not blocked by firewall

### Issue 4: 404 Not Found on API Endpoints

**Check:**

1. API endpoint paths match backend routes
2. Database migrations are applied:
   ```bash
   dotnet ef database update --project BaraaCRM.DataAccess --startup-project BaraaCRM.API
   ```

## 📝 Environment Variables

Current configuration (`.env`):

```env
VITE_FRONTEND_FORGE_API_URL=https://localhost:7005/api
```

**Note:** After changing `.env`, restart the dev server:

```bash
# Stop with Ctrl+C, then:
pnpm dev
```

## 🔗 API Endpoints Available

All endpoints are prefixed with `https://localhost:7005/api`

### Companies

- `GET /company` - List all companies
- `GET /company/{id}` - Get company by ID
- `POST /company` - Create company
- `DELETE /company/{id}` - Delete company

### Branches

- `GET /branch` - List all branches
- `GET /branch/{id}` - Get branch by ID
- `POST /branch` - Create branch
- `PUT /branch/{id}` - Update branch
- `DELETE /branch/{id}` - Delete branch

### Employees

- `GET /employee` - List all employees
- `GET /employee/{id}` - Get employee by ID
- `GET /employee/branch/{branchId}` - Get employees by branch
- `POST /employee` - Create employee
- `PUT /employee/{id}` - Update employee
- `DELETE /employee/{id}` - Delete employee

### Contacts

- `GET /contact` - List all contacts
- `GET /contact/{id}` - Get contact by ID
- `GET /contact/company/{companyId}` - Get contacts by company
- `GET /contact/type/{type}` - Get contacts by type (Lead/Customer/Partner)
- `POST /contact` - Create contact
- `PUT /contact/{id}` - Update contact
- `DELETE /contact/{id}` - Delete contact

## 📚 Next Steps

1. ✅ Backend running
2. ✅ Frontend running
3. ✅ Environment configured
4. 🚧 Build your UI components
5. 🚧 Implement data fetching in pages
6. 🚧 Add error handling

## 🆘 Need Help?

- Check backend Swagger UI: `https://localhost:7005`
- Review backend logs for errors
- Check browser console for frontend errors
- Verify database connection in backend `appsettings.json`
