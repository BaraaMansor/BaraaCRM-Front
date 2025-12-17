/**
 * API Service Module
 * Handles all communication with the BaraaCRM ASP.NET Core backend API
 * 
 * Design Philosophy: Minimalist Enterprise
 * - Clear, predictable API structure
 * - Consistent error handling
 * - Type-safe responses
 */

const API_BASE_URL = import.meta.env.VITE_FRONTEND_FORGE_API_URL || 'https://localhost:7005/api';

// Type definitions for API responses
export interface Company {
  id: number;
  name: string;
  address: string;
  phoneNumber: string;
  email: string;
  country: string;
  city: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Branch {
  id: number;
  companyId: number;
  name: string;
  address: string;
  phoneNumber: string;
  email: string;
  city: string;
  country: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Employee {
  id: number;
  branchId: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  jobTitle: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  id: number;
  companyId: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  jobTitle: string;
  contactType: 'Lead' | 'Customer' | 'Partner';
  address: string;
  city: string;
  country: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Create request/response types
export interface CreateCompanyDto {
  name: string;
  address: string;
  phoneNumber: string;
  email: string;
  country: string;
  city: string;
}

export interface CreateBranchDto {
  companyId: number;
  name: string;
  address: string;
  phoneNumber: string;
  email: string;
  city: string;
  country: string;
}

export interface CreateEmployeeDto {
  branchId: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  jobTitle: string;
}

export interface CreateContactDto {
  companyId: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  jobTitle: string;
  contactType: 'Lead' | 'Customer' | 'Partner';
  address: string;
  city: string;
  country: string;
}

// API error handling
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Helper function for API requests
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        response.status,
        `API Error: ${response.statusText}`,
        errorData
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, 'Network error or invalid response', error);
  }
}

// Company API endpoints
export const companyApi = {
  getAll: () => apiRequest<Company[]>('/company'),
  getById: (id: number) => apiRequest<Company>(`/company/${id}`),
  create: (data: CreateCompanyDto) =>
    apiRequest<Company>('/company', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    apiRequest<void>(`/company/${id}`, {
      method: 'DELETE',
    }),
};

// Branch API endpoints
export const branchApi = {
  getAll: () => apiRequest<Branch[]>('/branch'),
  getById: (id: number) => apiRequest<Branch>(`/branch/${id}`),
  create: (data: CreateBranchDto) =>
    apiRequest<Branch>('/branch', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: number, data: Partial<CreateBranchDto>) =>
    apiRequest<Branch>(`/branch/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    apiRequest<void>(`/branch/${id}`, {
      method: 'DELETE',
    }),
};

// Employee API endpoints
export const employeeApi = {
  getAll: () => apiRequest<Employee[]>('/employee'),
  getById: (id: number) => apiRequest<Employee>(`/employee/${id}`),
  getByBranch: (branchId: number) =>
    apiRequest<Employee[]>(`/employee/branch/${branchId}`),
  create: (data: CreateEmployeeDto) =>
    apiRequest<Employee>('/employee', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: number, data: Partial<CreateEmployeeDto>) =>
    apiRequest<Employee>(`/employee/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    apiRequest<void>(`/employee/${id}`, {
      method: 'DELETE',
    }),
};

// Contact API endpoints
export const contactApi = {
  getAll: () => apiRequest<Contact[]>('/contact'),
  getById: (id: number) => apiRequest<Contact>(`/contact/${id}`),
  getByCompany: (companyId: number) =>
    apiRequest<Contact[]>(`/contact/company/${companyId}`),
  getByType: (contactType: 'Lead' | 'Customer' | 'Partner') =>
    apiRequest<Contact[]>(`/contact/type/${contactType}`),
  create: (data: CreateContactDto) =>
    apiRequest<Contact>('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: number, data: Partial<CreateContactDto>) =>
    apiRequest<Contact>(`/contact/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    apiRequest<void>(`/contact/${id}`, {
      method: 'DELETE',
    }),
};
