/**
 * Companies Page
 * Design Philosophy: Minimalist Enterprise
 * - Clean table layout with sortable columns
 * - Quick create and edit actions
 * - Responsive design for mobile
 */

import { useEffect, useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Mail, Phone, MapPin, Trash2 } from 'lucide-react';
import { companyApi, Company, CreateCompanyDto } from '@/lib/api';
import { toast } from 'sonner';

export default function Companies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<CreateCompanyDto>({
    name: '',
    address: '',
    phoneNumber: '',
    email: '',
    country: '',
    city: '',
  });

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
      setFormData({
        name: '',
        address: '',
        phoneNumber: '',
        email: '',
        country: '',
        city: '',
      });
      setIsDialogOpen(false);
      fetchCompanies();
    } catch (error) {
      console.error('Failed to create company:', error);
      toast.error('Failed to create company');
    }
  };

  const handleDeleteCompany = async (id: number) => {
    if (!confirm('Are you sure you want to delete this company?')) return;
    try {
      await companyApi.delete(id);
      toast.success('Company deleted successfully');
      fetchCompanies();
    } catch (error) {
      console.error('Failed to delete company:', error);
      toast.error('Failed to delete company');
    }
  };

  return (
    <MainLayout
      title="Companies"
      description="Manage your organizations and their details"
    >
      {/* Header with Create Button */}
      <div className="flex justify-between items-center mb-6">
        <div />
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Company
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Company</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateCompany} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Company Name</label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Acme Corporation"
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
                    placeholder="contact@company.com"
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
              <div>
                <label className="text-sm font-medium">Address</label>
                <Input
                  required
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder="123 Business Street"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">City</label>
                  <Input
                    required
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    placeholder="New York"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Country</label>
                  <Input
                    required
                    value={formData.country}
                    onChange={(e) =>
                      setFormData({ ...formData, country: e.target.value })
                    }
                    placeholder="USA"
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
                <Button type="submit">Create Company</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Companies List */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading companies...</p>
        </div>
      ) : companies.length === 0 ? (
        <Card className="card-minimal p-12 text-center">
          <p className="text-muted-foreground mb-4">No companies yet</p>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Create Your First Company
              </Button>
            </DialogTrigger>
          </Dialog>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies.map((company) => (
            <Card key={company.id} className="card-minimal p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-foreground">
                  {company.name}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteCompany(company.id)}
                  className="text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <a href={`mailto:${company.email}`} className="hover:text-accent">
                    {company.email}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <a href={`tel:${company.phoneNumber}`} className="hover:text-accent">
                    {company.phoneNumber}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{company.city}, {company.country}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </MainLayout>
  );
}
