# Backend API Requirements for BaraaCRM Frontend

## Progress Status

✅ **Contacts** - COMPLETE (camelCase serialization, CORS, validation implemented)  
⚠️ **Companies** - NEEDS FIX (apply same pattern as Contacts)  
⚠️ **Branches** - NEEDS FIX (apply same pattern as Contacts)  
⚠️ **Employees** - NEEDS FIX (apply same pattern as Contacts)

---

## Overview

This document specifies the exact API response formats required by the frontend application. All endpoints should return JSON with proper `Content-Type: application/json` headers.

## Base URL

- Development: `https://localhost:7005/api`
- Configured in frontend via `.env` file: `VITE_FRONTEND_FORGE_API_URL`

## CORS Configuration ✅

The backend MUST allow requests from:

- `http://localhost:3001` (current frontend dev server) - ✅ **IMPLEMENTED**
- Methods: `GET`, `POST`, `PUT`, `DELETE`
- Headers: `Content-Type`, `Authorization`

---

## API Endpoints

### 1. Companies ⚠️ NEEDS FIX

**Status:** Need to apply same fixes as Contacts endpoint

#### GET `/api/company`

**Description:** Get all companies

**Response Format:**

```json
[
  {
    "id": 1,
    "name": "Acme Corporation",
    "address": "123 Business St",
    "phoneNumber": "+1234567890",
    "email": "contact@acme.com",
    "country": "USA",
    "city": "New York",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
]
```

**CRITICAL REQUIREMENTS:**

- ✅ `id` MUST be a number (not null, not undefined, not string)
- ✅ `id` MUST be greater than 0
- ✅ All string fields should be strings (not null - use empty string "" if empty)
- ✅ Response MUST be an array (even if empty: `[]`)

**Common Issues:**

- ❌ DON'T send `id: null` or missing `id` field
- ❌ DON'T send C# property names like `Id` (use lowercase `id`)
- ❌ DON'T send `null` for empty arrays - send `[]`

#### POST `/api/company`

**Description:** Create a new company

**Request Body:**

```json
{
  "name": "New Company",
  "address": "456 Street",
  "phoneNumber": "+1234567890",
  "email": "info@company.com",
  "country": "USA",
  "city": "Boston"
}
```

**Response:** Same as GET single company (return the created company object)

#### DELETE `/api/company/{id}`

**Response:** 204 No Content or 200 OK with empty body

---

### 2. Branches ⚠️ NEEDS FIX

**Status:** Need to apply same fixes as Contacts endpoint

#### GET `/api/branch`

**Description:** Get all branches

**Response Format:**

```json
[
  {
    "id": 1,
    "companyId": 1,
    "name": "New York Branch",
    "address": "789 Branch Ave",
    "phoneNumber": "+1987654321",
    "email": "ny@acme.com",
    "city": "New York",
    "country": "USA",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
]
```

**CRITICAL REQUIREMENTS:**

- ✅ `id` MUST be a number > 0
- ✅ `companyId` MUST be a valid number matching an existing company
- ✅ Response MUST be an array

#### POST `/api/branch`

**Description:** Create a new branch

**Request Body:**

```json
{
  "companyId": 1,
  "name": "Boston Branch",
  "address": "456 Branch St",
  "phoneNumber": "+1234567890",
  "email": "boston@company.com",
  "city": "Boston",
  "country": "USA"
}
```

**IMPORTANT:**

- Frontend sends `companyId` as a number
- If `companyId` is 0, null, or invalid → Return **400 Bad Request** with error message
- Validate that the company exists before creating branch

**Response:** Return the created branch object (same format as GET)

#### DELETE `/api/branch/{id}`

**Response:** 204 No Content or 200 OK

---

### 3. Employees ⚠️ NEEDS FIX

**Status:** Need to apply same fixes as Contacts endpoint

#### GET `/api/employee`

**Description:** Get all employees

**Response Format:**

```json
[
  {
    "id": 1,
    "branchId": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@company.com",
    "phoneNumber": "+1234567890",
    "jobTitle": "Software Engineer",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
]
```

**CRITICAL REQUIREMENTS:**

- ✅ `id` MUST be a number > 0
- ✅ `branchId` MUST be a valid number matching an existing branch
- ✅ Response MUST be an array

#### POST `/api/employee`

**Request Body:**

```json
{
  "branchId": 1,
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@company.com",
  "phoneNumber": "+1234567890",
  "jobTitle": "Manager"
}
```

**Response:** Return the created employee object

#### DELETE `/api/employee/{id}`

**Response:** 204 No Content or 200 OK

---

### 4. Contacts ✅ COMPLETE

**Status:** All requirements implemented correctly!

#### GET `/api/contact`

**Description:** Get all contacts

**Response Format:**

```json
[
  {
    "id": 1,
    "companyId": 1,
    "firstName": "Alice",
    "lastName": "Johnson",
    "email": "alice@client.com",
    "phoneNumber": "+1234567890",
    "jobTitle": "CEO",
    "contactType": "Customer",
    "address": "123 Client St",
    "city": "Boston",
    "country": "USA",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
]
```

**CRITICAL REQUIREMENTS:**

- ✅ `id` MUST be a number > 0
- ✅ `companyId` MUST be a valid number
- ✅ `contactType` MUST be one of: `"Lead"`, `"Customer"`, `"Partner"` (exact case)
- ✅ Response MUST be an array

#### POST `/api/contact`

**Request Body:**

```json
{
  "companyId": 1,
  "firstName": "Bob",
  "lastName": "Wilson",
  "email": "bob@client.com",
  "phoneNumber": "+1234567890",
  "jobTitle": "CTO",
  "contactType": "Lead",
  "address": "456 Contact Ave",
  "city": "New York",
  "country": "USA"
}
```

**Response:** Return the created contact object

#### DELETE `/api/contact/{id}`

**Response:** 204 No Content or 200 OK

---

## ✅ Contacts Implementation Reference

The Contacts endpoint has been successfully implemented! Use it as a template for Companies, Branches, and Employees.

**What was done for Contacts:**

1. **Program.cs** - JSON serialization and CORS (already done, applies to all endpoints)

   ```csharp
   builder.Services.AddControllers()
       .AddJsonOptions(options =>
       {
           options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
       });

   builder.Services.AddCors(options =>
   {
       options.AddDefaultPolicy(policy =>
       {
           policy.WithOrigins("http://localhost:3001", "http://localhost:3000")
                 .AllowAnyHeader()
                 .AllowAnyMethod();
       });
   });
   ```

2. **ContactDto.cs** - Added `ContactResponseDto` with proper field mapping

3. **ContactService.cs** - Ensured all queries include `isActive`, `createdAt`, `updatedAt`

4. **ContactController.cs** - Added validation, proper error responses, 204 for DELETE

**To-Do: Apply the same pattern to:**

- [ ] CompanyController + CompanyDto + CompanyService
- [ ] BranchController + BranchDto + BranchService
- [ ] EmployeeController + EmployeeDto + EmployeeService

---

## Common Backend Issues to Fix

### 1. **Property Name Casing** ✅ COMPLETE

ASP.NET Core by default serializes properties in PascalCase (`Id`, `Name`), but JavaScript expects camelCase (`id`, `name`).

**Fix in ASP.NET Core Startup/Program.cs:** ✅ **IMPLEMENTED**

```csharp
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    });
```

This is now working for all endpoints!

### 2. **Null ID Fields**

If entities have null or 0 IDs (possibly due to EF Core tracking), ensure you're returning the saved entity:

```csharp
[HttpPost]
public async Task<ActionResult<Company>> CreateCompany(CreateCompanyDto dto)
{
    var company = new Company { /* map properties */ };
    _context.Companies.Add(company);
    await _context.SaveChangesAsync(); // This populates the ID

    return CreatedAtAction(nameof(GetCompany), new { id = company.Id }, company);
}
```

### 3. **CORS Configuration** ✅ COMPLETE

In `Program.cs`: ✅ **IMPLEMENTED**

```csharp
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:3001", "http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// After app.Build():
app.UseCors();
```

CORS is now configured correctly!

### 4. **Validation for Foreign Keys**

Always validate that related entities exist:

```csharp
[HttpPost]
public async Task<ActionResult<Branch>> CreateBranch(CreateBranchDto dto)
{
    // Validate company exists
    if (!await _context.Companies.AnyAsync(c => c.Id == dto.CompanyId))
    {
        return BadRequest(new { message = "Company not found" });
    }

    // Validate companyId is valid
    if (dto.CompanyId <= 0)
    {
        return BadRequest(new { message = "Invalid company ID" });
    }

    var branch = new Branch { /* map */ };
    // ... rest of logic
}
```

### 5. **Error Response Format**

For 400/500 errors, return consistent JSON:

```json
{
  "message": "Invalid company ID",
  "errors": {
    "companyId": ["Company ID must be greater than 0"]
  }
}
```

---

## Testing Checklist

Use this checklist to verify backend is working:

### Companies

- [ ] `GET /api/company` returns array with valid IDs
- [ ] `POST /api/company` creates and returns company with ID
- [ ] `DELETE /api/company/{id}` removes company
- [ ] All property names are camelCase

### Branches

- [ ] `GET /api/branch` returns array with valid IDs and companyIds
- [ ] `POST /api/branch` validates companyId exists
- [ ] `POST /api/branch` rejects companyId = 0 or null
- [ ] Created branch has valid ID in response

### Employees

- [ ] `GET /api/employee` returns array with valid IDs and branchIds
- [ ] `POST /api/employee` validates branchId exists
- [ ] Created employee has valid ID in response

### Contacts

- [ ] `GET /api/contact` returns array with valid IDs and companyIds
- [ ] `POST /api/contact` validates companyId exists
- [ ] `contactType` is exactly "Lead", "Customer", or "Partner"
- [ ] Created contact has valid ID in response

### CORS

- [ ] Requests from `http://localhost:3001` are allowed
- [ ] Preflight OPTIONS requests return 200 OK

---

## Example Test Request

You can test using curl or Postman:

```bash
# Get all companies
curl https://localhost:7005/api/company

# Expected response:
# [{"id":1,"name":"Test Company","address":"123 St",...}]

# Create a branch
curl -X POST https://localhost:7005/api/branch \
  -H "Content-Type: application/json" \
  -d '{"companyId":1,"name":"Test Branch","address":"456 St","phoneNumber":"+1234567890","email":"test@test.com","city":"Boston","country":"USA"}'

# Expected: 200 OK with created branch object containing valid id
```

---

## Next Steps for Backend Team

### ✅ COMPLETED

- [x] JSON camelCase serialization (Program.cs)
- [x] CORS configuration for localhost:3001
- [x] Contacts endpoint fully implemented

### ⚠️ REMAINING WORK

Apply the **exact same pattern** used for Contacts to these endpoints:

#### 1. Companies Endpoint

- [ ] Create `CompanyResponseDto` with proper field mapping
- [ ] Update `CompanyController` route to `[Route("api/company")]`
- [ ] Add validation for required fields
- [ ] Ensure `isActive`, `createdAt`, `updatedAt` are included in responses
- [ ] Return 204 No Content for DELETE operations
- [ ] Add proper error response format

#### 2. Branches Endpoint

- [ ] Create `BranchResponseDto` with proper field mapping
- [ ] Update `BranchController` route to `[Route("api/branch")]`
- [ ] Add validation: `companyId > 0` and company exists
- [ ] Ensure `isActive`, `createdAt`, `updatedAt` are included
- [ ] Return 204 No Content for DELETE operations
- [ ] Add proper error response format

#### 3. Employees Endpoint

- [ ] Create `EmployeeResponseDto` with proper field mapping
- [ ] Update `EmployeeController` route to `[Route("api/employee")]`
- [ ] Add validation: `branchId > 0` and branch exists
- [ ] Ensure `isActive`, `createdAt`, `updatedAt` are included
- [ ] Return 204 No Content for DELETE operations
- [ ] Add proper error response format

### 🔍 Testing After Implementation

Once all endpoints are updated, test with:

```bash
# Test Companies
curl https://localhost:7005/api/company

# Test Branches
curl https://localhost:7005/api/branch

# Test Employees
curl https://localhost:7005/api/employee

# All should return arrays with camelCase property names
```

---

**Frontend Contact:** [Your Name]  
**Last Updated:** December 18, 2025

**Latest Backend Update:** Contacts endpoint successfully implemented with all requirements!
