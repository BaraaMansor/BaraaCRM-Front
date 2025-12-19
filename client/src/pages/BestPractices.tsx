/**
 * Best Practices Page
 * Educational resource showcasing development patterns used in BaraaCRM
 * Design Philosophy: Teaching-focused with comprehensive examples
 */

import MainLayout from '@/components/MainLayout';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code, Database, Layers, Shield, BookOpen, GitBranch } from 'lucide-react';

export default function BestPractices() {
  return (
    <MainLayout
      title="Best Practices"
      description="Learn the architectural patterns and best practices used in BaraaCRM"
    >
      <div className="space-y-6">
        {/* Introduction */}
        <Card className="p-6 bg-gradient-to-r from-accent/10 to-accent/5 border-accent/20">
          <div className="flex items-start gap-4">
            <BookOpen className="w-8 h-8 text-accent mt-1" />
            <div>
              <h2 className="text-xl font-semibold mb-2">Design Philosophy: Minimalist Enterprise</h2>
              <p className="text-muted-foreground leading-relaxed">
                BaraaCRM follows a minimalist enterprise architecture that emphasizes clean code,
                separation of concerns, and maintainability. This page demonstrates the key patterns
                and practices used across both frontend (React + TypeScript) and backend (ASP.NET Core 8).
              </p>
            </div>
          </div>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="frontend" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="frontend">Frontend Best Practices</TabsTrigger>
            <TabsTrigger value="backend">Backend Best Practices</TabsTrigger>
          </TabsList>

          {/* Frontend Tab */}
          <TabsContent value="frontend" className="space-y-6">
            {/* API Service Pattern */}
            <PracticeSection
              icon={<Code className="w-6 h-6" />}
              title="API Service Layer Pattern"
              description="Centralized API communication with type-safe responses and consistent error handling"
              points={[
                'Single source of truth for all API endpoints',
                'TypeScript interfaces for request/response types',
                'Custom error handling with ApiError class',
                'Reusable request helper functions'
              ]}
              codeExample={`// Type-safe API service with error handling
export interface Company {
  id: number;
  name: string;
  email: string;
  // ... other properties
}

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

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = \`\${API_BASE_URL}\${endpoint}\`;
  
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
        errorData.message || \`API Error: \${response.statusText}\`,
        errorData
      );
    }

    return response.json();
  } catch (error) {
    // Handle network errors
    throw new ApiError(500, 'Network error', error);
  }
}

// Organized API endpoints by resource
export const companyApi = {
  getAll: () => apiRequest<Company[]>('/company'),
  getById: (id: number) => apiRequest<Company>(\`/company/\${id}\`),
  create: (data: CreateCompanyDto) =>
    apiRequest<Company>('/company', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};`}
            />

            {/* Component Pattern */}
            <PracticeSection
              icon={<Layers className="w-6 h-6" />}
              title="Component Composition Pattern"
              description="Clean, reusable components with single responsibility"
              points={[
                'React functional components with hooks',
                'Separation of concerns (UI, business logic, data fetching)',
                'TypeScript for type safety',
                'Consistent error handling and loading states'
              ]}
              codeExample={`export default function Companies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const data = await companyApi.getAll();
      setCompanies(data);
    } catch (error) {
      console.error('Failed to fetch companies:', error);
      toast.error('Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await companyApi.create(formData);
      toast.success('Company created successfully');
      setIsDialogOpen(false);
      fetchCompanies(); // Refresh data
    } catch (error) {
      toast.error('Failed to create company');
    }
  };

  return (
    <MainLayout title="Companies">
      {loading ? (
        <LoadingState />
      ) : companies.length === 0 ? (
        <EmptyState />
      ) : (
        <CompanyGrid companies={companies} />
      )}
    </MainLayout>
  );
}`}
            />

            {/* Context Pattern */}
            <PracticeSection
              icon={<Shield className="w-6 h-6" />}
              title="React Context for Global State"
              description="Efficient state management without prop drilling"
              points={[
                'Context API for application-wide state',
                'Custom hooks for easy context consumption',
                'Type-safe context with TypeScript',
                'LocalStorage integration for persistence'
              ]}
              codeExample={`type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme?: () => void;
  switchable: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children, defaultTheme = "light" }: Props) {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem("theme");
    return (stored as Theme) || defaultTheme;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook for consuming context
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}`}
            />

            {/* Form Validation */}
            <PracticeSection
              icon={<Shield className="w-6 h-6" />}
              title="Form Validation & Type Safety"
              description="Client-side validation with TypeScript type checking"
              points={[
                'TypeScript interfaces for form data',
                'HTML5 validation attributes',
                'Consistent form state management',
                'Toast notifications for user feedback'
              ]}
              codeExample={`interface CreateCompanyDto {
  name: string;
  address: string;
  phoneNumber: string;
  email: string;
  country: string;
  city: string;
}

export default function CompanyForm() {
  const [formData, setFormData] = useState<CreateCompanyDto>({
    name: '',
    address: '',
    phoneNumber: '',
    email: '',
    country: '',
    city: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Type safety ensures all required fields are present
    try {
      await companyApi.create(formData);
      toast.success('Company created successfully');
    } catch (error) {
      toast.error('Failed to create company');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        required
        type="email"
        value={formData.email}
        onChange={(e) =>
          setFormData({ ...formData, email: e.target.value })
        }
        placeholder="contact@company.com"
      />
    </form>
  );
}`}
            />
          </TabsContent>

          {/* Backend Tab */}
          <TabsContent value="backend" className="space-y-6">
            {/* Clean Architecture */}
            <PracticeSection
              icon={<Layers className="w-6 h-6" />}
              title="Clean Architecture & Separation of Concerns"
              description="Multi-layer architecture with clear responsibilities"
              points={[
                'API Layer: Controllers handle HTTP requests/responses',
                'Service Layer: Business logic and data operations',
                'Data Layer: Entity Framework Core and database models',
                'Contracts Layer: DTOs and service interfaces'
              ]}
              codeExample={`// Project Structure:
// BaraaCRM.API         -> Controllers (HTTP layer)
// BaraaCRM.Services    -> Business logic
// BaraaCRM.DataAccess  -> EF Core models
// BaraaCRM.Contracts   -> DTOs and interfaces

// Controller (API Layer)
[ApiController]
[Route("api/company")]
public class CompanyController : ControllerBase 
{
    private readonly ICompanyService _companyService;

    public CompanyController(ICompanyService companyService)
    {
        _companyService = companyService;
    }

    [HttpGet]
    public async Task<IActionResult> GetCompanies()
    {
        var companies = await _companyService.GetCompaniesAsync();
        var response = companies.Select(CompanyResponseDto.FromCompanyDto);
        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> AddCompany([FromBody] CreateCompanyDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new { message = "Invalid data", errors = ModelState });
        }

        var companyId = await _companyService.AddCompanyAsync(dto);
        var createdCompany = await _companyService.GetCompanyByIdAsync(companyId);
        
        return CreatedAtAction(
            nameof(GetCompanyById), 
            new { id = companyId }, 
            CompanyResponseDto.FromCompanyDto(createdCompany)
        );
    }
}`}
            />

            {/* Dependency Injection */}
            <PracticeSection
              icon={<GitBranch className="w-6 h-6" />}
              title="Dependency Injection"
              description="Loose coupling and testable code with DI container"
              points={[
                'Constructor injection for dependencies',
                'Service registration in Program.cs',
                'Interface-based programming',
                'Scoped lifetime for database contexts'
              ]}
              codeExample={`// Program.cs - Service Registration
var builder = WebApplication.CreateBuilder(args);

// Register DbContext
builder.Services.AddDbContext<BaraaCRMDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")
    )
);

// Register services (Single Responsibility Principle)
builder.Services.AddScoped<ICompanyService, CompanyService>();
builder.Services.AddScoped<IBranchService, BranchService>();
builder.Services.AddScoped<IEmployeeService, EmployeeService>();
builder.Services.AddScoped<IContactService, ContactService>();

// Service Implementation
public class CompanyService : ICompanyService
{
    private readonly BaraaCRMDbContext _context;

    // Dependencies injected via constructor
    public CompanyService(BaraaCRMDbContext context)
    {
        _context = context;
    }

    public async Task<List<CompanyDto>> GetCompaniesAsync()
    {
        return await _context.Companies
            .AsNoTracking()
            .Where(x => x.IsActive)
            .Select(comp => new CompanyDto(...))
            .ToListAsync();
    }
}`}
            />

            {/* DTO Pattern */}
            <PracticeSection
              icon={<Database className="w-6 h-6" />}
              title="DTO (Data Transfer Object) Pattern"
              description="Clean data contracts between layers"
              points={[
                'Record types for immutability',
                'Separate DTOs for create, update, and response',
                'Explicit mapping from entities to DTOs',
                'Clear API contracts'
              ]}
              codeExample={`// Domain Entity (Database Model)
public class Company
{
    public int CompanyId { get; set; }
    public string CompanyName { get; set; }
    public string LegalName { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    // ... other properties
}

// DTOs (Contracts Layer)
public record CompanyDto(
    int CompanyId,
    string Name,
    string Address,
    string PhoneNumber,
    string Email,
    string Country,
    string City,
    bool IsActive,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

public record CreateCompanyDto(
    string Name,
    string Address,
    string PhoneNumber,
    string Email,
    string Country,
    string City
);

public record CompanyResponseDto(
    int Id,
    string Name,
    // ... properties
)
{
    public static CompanyResponseDto FromCompanyDto(CompanyDto company)
    {
        return new CompanyResponseDto(
            company.CompanyId,
            company.Name,
            // ... map properties
        );
    }
}`}
            />

            {/* Async/Await Pattern */}
            <PracticeSection
              icon={<Code className="w-6 h-6" />}
              title="Async/Await Pattern"
              description="Non-blocking asynchronous operations"
              points={[
                'All I/O operations are async',
                'Proper use of async/await keywords',
                'Entity Framework async methods',
                'Better scalability and performance'
              ]}
              codeExample={`public class CompanyService : ICompanyService
{
    private readonly BaraaCRMDbContext _context;

    public CompanyService(BaraaCRMDbContext context)
    {
        _context = context;
    }

    public async Task<CompanyDto> GetCompanyByIdAsync(int id)
    {
        // Non-blocking database call
        var company = await _context.Companies
            .AsNoTracking()
            .Where(x => x.CompanyId == id)
            .Select(comp => new CompanyDto(
                comp.CompanyId,
                comp.CompanyName,
                comp.Address,
                comp.PhoneNumber,
                comp.Email,
                comp.Country,
                comp.City,
                comp.IsActive,
                comp.CreatedAt,
                comp.UpdatedAt
            ))
            .FirstOrDefaultAsync();

        return company;
    }

    public async Task<int> AddCompanyAsync(CreateCompanyDto companyDto)
    {
        var company = new Company
        {
            CompanyName = companyDto.Name,
            // ... map properties
            CreatedAt = DateTime.UtcNow
        };

        _context.Add(company);
        await _context.SaveChangesAsync();

        return company.CompanyId;
    }
}`}
            />

            {/* CORS Configuration */}
            <PracticeSection
              icon={<Shield className="w-6 h-6" />}
              title="CORS Configuration"
              description="Secure cross-origin resource sharing"
              points={[
                'Explicit origin whitelisting',
                'Proper header configuration',
                'Credentials support when needed',
                'Security-first approach'
              ]}
              codeExample={`// Program.cs - CORS Configuration
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
            "http://localhost:3000",
            "http://localhost:5173",
            "http://localhost:4200"
        )
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});

var app = builder.Build();

// Enable CORS middleware
app.UseCors("AllowFrontend");

// JSON serialization configuration
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = 
            JsonNamingPolicy.CamelCase;
    });`}
            />

            {/* Repository Pattern */}
            <PracticeSection
              icon={<Database className="w-6 h-6" />}
              title="Repository-like Pattern with EF Core"
              description="Clean data access with Entity Framework Core"
              points={[
                'DbContext as unit of work',
                'AsNoTracking for read-only queries',
                'Projection to DTOs in queries',
                'Soft delete pattern for data retention'
              ]}
              codeExample={`public class CompanyService : ICompanyService
{
    private readonly BaraaCRMDbContext _context;

    public CompanyService(BaraaCRMDbContext context)
    {
        _context = context;
    }

    // Read operations with AsNoTracking
    public async Task<List<CompanyDto>> GetCompaniesAsync()
    {
        return await _context.Companies
            .AsNoTracking()  // Better performance for read-only
            .Where(x => x.IsActive)  // Soft delete filter
            .Select(comp => new CompanyDto(...))  // Project to DTO
            .ToListAsync();
    }

    // Soft delete implementation
    public async Task<bool> DeleteCompanyAsync(int id)
    {
        var company = await _context.Companies
            .FirstOrDefaultAsync(x => x.CompanyId == id);

        if (company == null)
        {
            return false;
        }

        // Soft delete - don't remove from database
        company.IsActive = false;
        company.UpdatedAt = DateTime.UtcNow;

        int rows = await _context.SaveChangesAsync();
        return rows > 0;
    }
}`}
            />
          </TabsContent>
        </Tabs>

        {/* Additional Resources */}
        <Card className="p-6 bg-muted/50">
          <h3 className="text-lg font-semibold mb-4">Key Takeaways</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2 text-accent">Frontend Principles</h4>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Type safety with TypeScript</li>
                <li>Component composition over inheritance</li>
                <li>Centralized API service layer</li>
                <li>Error boundaries and loading states</li>
                <li>Context API for global state</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2 text-accent">Backend Principles</h4>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Clean architecture with separation of concerns</li>
                <li>Dependency injection for loose coupling</li>
                <li>DTO pattern for clean contracts</li>
                <li>Async/await for scalability</li>
                <li>Soft deletes and audit fields</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}

interface PracticeSectionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  points: string[];
  codeExample: string;
}

function PracticeSection({ icon, title, description, points, codeExample }: PracticeSectionProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start gap-4 mb-4">
        <div className="text-accent">{icon}</div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-muted-foreground mb-4">{description}</p>
          
          <div className="mb-4">
            <h4 className="font-medium mb-2">Key Points:</h4>
            <ul className="space-y-2">
              {points.map((point, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-accent mt-1">•</span>
                  <span className="text-sm text-muted-foreground">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-2">Code Example:</h4>
            <pre className="bg-muted/50 p-4 rounded-lg overflow-x-auto text-xs border border-border">
              <code>{codeExample}</code>
            </pre>
          </div>
        </div>
      </div>
    </Card>
  );
}
