/**
 * Branches Page
 * Design Philosophy: Minimalist Enterprise
 * - Manage company branch locations
 * - Associate branches with companies
 * - Quick create and delete actions
 */

import { useEffect, useState } from "react";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Mail, Phone, MapPin, Trash2 } from "lucide-react";
import {
  branchApi,
  Branch,
  CreateBranchDto,
  companyApi,
  Company,
} from "@/lib/api";
import { toast } from "sonner";

export default function Branches() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<CreateBranchDto>({
    companyId: 0,
    name: "",
    address: "",
    phoneNumber: "",
    email: "",
    city: "",
    country: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [branchesData, companiesData] = await Promise.all([
        branchApi.getAll(),
        companyApi.getAll(),
      ]);
      console.log("Fetched branches:", branchesData);
      console.log("Fetched companies:", companiesData);
      setBranches(Array.isArray(branchesData) ? branchesData : []);
      setCompanies(Array.isArray(companiesData) ? companiesData : []);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Failed to load branches");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await branchApi.create(formData);
      toast.success("Branch created successfully");
      setFormData({
        companyId: 0,
        name: "",
        address: "",
        phoneNumber: "",
        email: "",
        city: "",
        country: "",
      });
      setIsDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error("Failed to create branch:", error);
      toast.error("Failed to create branch");
    }
  };

  const handleDeleteBranch = async (id: number) => {
    if (!confirm("Are you sure you want to delete this branch?")) return;
    try {
      await branchApi.delete(id);
      toast.success("Branch deleted successfully");
      fetchData();
    } catch (error) {
      console.error("Failed to delete branch:", error);
      toast.error("Failed to delete branch");
    }
  };

  const getCompanyName = (companyId: number) => {
    return companies.find(c => c.id === companyId)?.name || "Unknown Company";
  };

  return (
    <MainLayout
      title="Branches"
      description="Manage your company branch locations"
    >
      {/* Header with Create Button */}
      <div className="flex justify-between items-center mb-6">
        <div />
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Branch
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Branch</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateBranch} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Company *</label>
                <select
                  required
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.companyId}
                  onChange={e => {
                    const value = parseInt(e.target.value, 10);
                    setFormData({ ...formData, companyId: value });
                  }}
                >
                  <option value={0} disabled>
                    {companies.length === 0
                      ? "No companies available"
                      : "Select a company"}
                  </option>
                  {companies.map(company => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Branch Name</label>
                <Input
                  required
                  value={formData.name}
                  onChange={e =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="New York Office"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="ny@company.com"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Phone</label>
                  <Input
                    required
                    value={formData.phoneNumber}
                    onChange={e =>
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
                  onChange={e =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder="456 Business Avenue"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">City</label>
                  <Input
                    required
                    value={formData.city}
                    onChange={e =>
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
                    onChange={e =>
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
                <Button type="submit">Create Branch</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Branches List */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading branches...</p>
        </div>
      ) : branches.length === 0 ? (
        <Card className="card-minimal p-12 text-center">
          <p className="text-muted-foreground mb-4">No branches yet</p>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Create Your First Branch
              </Button>
            </DialogTrigger>
          </Dialog>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {branches.map(branch => {
            if (!branch?.id) return null;
            return (
              <Card key={branch.id} className="card-minimal p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {branch.name || "Unnamed Branch"}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {getCompanyName(branch.companyId)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteBranch(branch.id)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <a
                      href={`mailto:${branch.email}`}
                      className="hover:text-accent"
                    >
                      {branch.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <a
                      href={`tel:${branch.phoneNumber}`}
                      className="hover:text-accent"
                    >
                      {branch.phoneNumber}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {branch.city}, {branch.country}
                    </span>
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
