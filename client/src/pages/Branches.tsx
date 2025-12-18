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
  const [formData, setFormData] = useState<{
    companyId: number | "";
    name: string;
    address: string;
    phoneNumber: string;
    email: string;
    city: string;
    country: string;
  }>({
    companyId: "",
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
      console.log("Fetched companies RAW:", companiesData);

      // Filter out companies with invalid IDs
      const validCompanies = Array.isArray(companiesData)
        ? companiesData.filter(c => c && typeof c.id === "number" && c.id > 0)
        : [];

      console.log("Valid companies after filtering:", validCompanies);

      if (
        validCompanies.length === 0 &&
        Array.isArray(companiesData) &&
        companiesData.length > 0
      ) {
        console.error(
          "All companies have invalid IDs! Raw data:",
          companiesData
        );
        toast.error("Companies data is invalid - please check backend");
      }

      setBranches(Array.isArray(branchesData) ? branchesData : []);
      setCompanies(validCompanies);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Failed to load branches");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBranch = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate company selection
    const companyIdNum =
      typeof formData.companyId === "string"
        ? parseInt(formData.companyId, 10)
        : formData.companyId;

    if (!companyIdNum || isNaN(companyIdNum) || companyIdNum <= 0) {
      toast.error("Please select a company");
      return;
    }

    try {
      const branchData: CreateBranchDto = {
        companyId: companyIdNum,
        name: formData.name || "",
        address: formData.address || "",
        phoneNumber: formData.phoneNumber || "",
        email: formData.email || "",
        city: formData.city || "",
        country: formData.country || "",
      };
      console.log("Creating branch with data:", branchData);
      await branchApi.create(branchData);
      toast.success("Branch created successfully");
      setFormData({
        companyId: "",
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
              <p className="text-sm text-muted-foreground mt-1.5">
                Add a new branch location for a company
              </p>
            </DialogHeader>
            <form onSubmit={handleCreateBranch} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Company *</label>
                <select
                  id="company-select"
                  name="companyId"
                  required
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={String(formData.companyId)}
                  onChange={e => {
                    console.log("Event target:", e.target);
                    console.log("Event target tagName:", e.target.tagName);
                    console.log("Event target value:", e.target.value);
                    console.log("Selected index:", e.target.selectedIndex);
                    console.log(
                      "Selected option:",
                      e.target.options?.[e.target.selectedIndex]
                    );

                    const selectedOption =
                      e.target.options?.[e.target.selectedIndex];
                    const value = selectedOption?.value ?? e.target.value ?? "";

                    console.log("Final value:", value);

                    if (value === "") {
                      setFormData(prev => ({ ...prev, companyId: "" }));
                    } else {
                      const numValue = parseInt(value, 10);
                      console.log("Parsed value:", numValue);
                      setFormData(prev => ({ ...prev, companyId: numValue }));
                    }
                  }}
                >
                  <option value="">
                    {companies.length === 0
                      ? "No companies available"
                      : "Select a company"}
                  </option>
                  {companies.map(company => {
                    // Extra safety check
                    if (!company || typeof company.id !== "number") {
                      console.warn("Invalid company object:", company);
                      return null;
                    }
                    return (
                      <option key={company.id} value={company.id}>
                        {company.name || `Company #${company.id}`}
                      </option>
                    );
                  })}
                </select>
                <p className="text-xs text-muted-foreground mt-1">
                  Current value: {JSON.stringify(formData.companyId)} |
                  Companies loaded: {companies.length}
                </p>
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
