/**
 * Employees Page
 * Design Philosophy: Minimalist Enterprise
 * - Manage internal team members
 * - Associate employees with branches
 * - Quick create and delete actions
 */

import { useEffect, useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Mail, Phone, Briefcase, Trash2, MapPin } from 'lucide-react';
import { employeeApi, Employee, CreateEmployeeDto, branchApi, Branch, companyApi, Company } from '@/lib/api';
import { toast } from 'sonner';

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<CreateEmployeeDto>({
    branchId: 0,
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    jobTitle: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [employeesData, branchesData, companiesData] = await Promise.all([
        employeeApi.getAll(),
        branchApi.getAll(),
        companyApi.getAll(),
      ]);
      setEmployees(employeesData);
      setBranches(branchesData);
      setCompanies(companiesData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast.error('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await employeeApi.create(formData);
      toast.success('Employee created successfully');
      setFormData({
        branchId: 0,
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        jobTitle: '',
      });
      setIsDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error('Failed to create employee:', error);
      toast.error('Failed to create employee');
    }
  };

  const handleDeleteEmployee = async (id: number) => {
    if (!confirm('Are you sure you want to delete this employee?')) return;
    try {
      await employeeApi.delete(id);
      toast.success('Employee deleted successfully');
      fetchData();
    } catch (error) {
      console.error('Failed to delete employee:', error);
      toast.error('Failed to delete employee');
    }
  };

  const getBranchInfo = (branchId: number) => {
    const branch = branches.find((b) => b.id === branchId);
    const company = companies.find((c) => c.id === branch?.companyId);
    return {
      branchName: branch?.name || 'Unknown Branch',
      companyName: company?.name || 'Unknown Company',
    };
  };

  return (
    <MainLayout
      title="Employees"
      description="Manage your internal team members"
    >
      {/* Header with Create Button */}
      <div className="flex justify-between items-center mb-6">
        <div />
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Employee
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Employee</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateEmployee} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Branch</label>
                <Select
                  value={formData.branchId.toString()}
                  onValueChange={(value) =>
                    setFormData({ ...formData, branchId: parseInt(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((branch) => {
                      const company = companies.find((c) => c.id === branch.companyId);
                      return (
                        <SelectItem key={branch.id} value={branch.id.toString()}>
                          {branch.name} ({company?.name})
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">First Name</label>
                  <Input
                    required
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Last Name</label>
                  <Input
                    required
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    placeholder="Doe"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Job Title</label>
                <Input
                  required
                  value={formData.jobTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, jobTitle: e.target.value })
                  }
                  placeholder="Sales Manager"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="john@company.com"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Phone</label>
                  <Input
                    required
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, phoneNumber: e.target.value })
                    }
                    placeholder="+1234567890"
                  />
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Create Employee</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Employees List */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading employees...</p>
        </div>
      ) : employees.length === 0 ? (
        <Card className="card-minimal p-12 text-center">
          <p className="text-muted-foreground mb-4">No employees yet</p>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Create Your First Employee
              </Button>
            </DialogTrigger>
          </Dialog>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {employees.map((employee) => {
            const branchInfo = getBranchInfo(employee.branchId);
            return (
              <Card key={employee.id} className="card-minimal p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {employee.firstName} {employee.lastName}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {branchInfo.companyName}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteEmployee(employee.id)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Briefcase className="w-4 h-4" />
                    <span>{employee.jobTitle}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{branchInfo.branchName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <a href={`mailto:${employee.email}`} className="hover:text-accent">
                      {employee.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <a href={`tel:${employee.phoneNumber}`} className="hover:text-accent">
                      {employee.phoneNumber}
                    </a>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </MainLayout>
  );
}
