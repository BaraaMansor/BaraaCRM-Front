/**
 * Contacts Page
 * Design Philosophy: Minimalist Enterprise
 * - Manage customer contacts, leads, and partners
 * - Filter by contact type
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
import { Badge } from "@/components/ui/badge";
import { Plus, Mail, Phone, Briefcase, Trash2 } from "lucide-react";
import {
  contactApi,
  Contact,
  CreateContactDto,
  companyApi,
  Company,
} from "@/lib/api";
import { toast } from "sonner";

type ContactType = "Lead" | "Customer" | "Partner";

export default function Contacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filterType, setFilterType] = useState<ContactType | "All">("All");
  const [formData, setFormData] = useState<
    Partial<CreateContactDto> & { companyId: number | "" }
  >({
    companyId: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    jobTitle: "",
    contactType: "Customer",
    address: "",
    city: "",
    country: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [contactsData, companiesData] = await Promise.all([
        contactApi.getAll(),
        companyApi.getAll(),
      ]);
      setContacts(Array.isArray(contactsData) ? contactsData : []);
      setCompanies(Array.isArray(companiesData) ? companiesData : []);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Failed to load contacts");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateContact = async (e: React.FormEvent) => {
    e.preventDefault();

    const companyIdNum =
      typeof formData.companyId === "string"
        ? parseInt(formData.companyId, 10)
        : formData.companyId;

    if (!companyIdNum || isNaN(companyIdNum) || companyIdNum <= 0) {
      toast.error("Please select a company");
      return;
    }

    try {
      const contactData: CreateContactDto = {
        companyId: companyIdNum,
        firstName: formData.firstName || "",
        lastName: formData.lastName || "",
        email: formData.email || "",
        phoneNumber: formData.phoneNumber || "",
        jobTitle: formData.jobTitle || "",
        contactType: formData.contactType || "Customer",
        address: formData.address || "",
        city: formData.city || "",
        country: formData.country || "",
      };
      console.log("Creating contact with data:", contactData);
      await contactApi.create(contactData);
      toast.success("Contact created successfully");
      setFormData({
        companyId: "",
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        jobTitle: "",
        contactType: "Customer",
        address: "",
        city: "",
        country: "",
      });
      setIsDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error("Failed to create contact:", error);
      toast.error("Failed to create contact");
    }
  };

  const handleDeleteContact = async (id: number) => {
    if (!confirm("Are you sure you want to delete this contact?")) return;
    try {
      await contactApi.delete(id);
      toast.success("Contact deleted successfully");
      fetchData();
    } catch (error) {
      console.error("Failed to delete contact:", error);
      toast.error("Failed to delete contact");
    }
  };

  const filteredContacts =
    filterType === "All"
      ? contacts
      : contacts.filter(c => c.contactType === filterType);

  const getContactTypeColor = (type: ContactType) => {
    switch (type) {
      case "Lead":
        return "bg-blue-100 text-blue-800";
      case "Customer":
        return "bg-green-100 text-green-800";
      case "Partner":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <MainLayout
      title="Contacts"
      description="Manage your customer contacts, leads, and partners"
    >
      {/* Header with Create Button and Filter */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex gap-2">
          <Button
            variant={filterType === "All" ? "default" : "outline"}
            onClick={() => setFilterType("All")}
          >
            All
          </Button>
          <Button
            variant={filterType === "Lead" ? "default" : "outline"}
            onClick={() => setFilterType("Lead")}
          >
            Leads
          </Button>
          <Button
            variant={filterType === "Customer" ? "default" : "outline"}
            onClick={() => setFilterType("Customer")}
          >
            Customers
          </Button>
          <Button
            variant={filterType === "Partner" ? "default" : "outline"}
            onClick={() => setFilterType("Partner")}
          >
            Partners
          </Button>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Contact
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Contact</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateContact} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">First Name</label>
                  <Input
                    required
                    value={formData.firstName}
                    onChange={e =>
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
                    onChange={e =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    placeholder="Doe"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Company *</label>
                <select
                  required
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.companyId}
                  onChange={e => {
                    const value =
                      e.target.value === "" ? "" : parseInt(e.target.value, 10);
                    setFormData({ ...formData, companyId: value });
                  }}
                >
                  <option value="" disabled>
                    {companies.length === 0
                      ? "No companies available"
                      : "Select a company"}
                  </option>
                  {companies.map(company => {
                    if (!company?.id) return null;
                    return (
                      <option key={company.id} value={company.id}>
                        {company.name || "Unnamed Company"}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Contact Type</label>
                <Select
                  value={formData.contactType}
                  onValueChange={value =>
                    setFormData({
                      ...formData,
                      contactType: value as ContactType,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Lead">Lead</SelectItem>
                    <SelectItem value="Customer">Customer</SelectItem>
                    <SelectItem value="Partner">Partner</SelectItem>
                  </SelectContent>
                </Select>
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
                    placeholder="john@example.com"
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
                <label className="text-sm font-medium">Job Title</label>
                <Input
                  required
                  value={formData.jobTitle}
                  onChange={e =>
                    setFormData({ ...formData, jobTitle: e.target.value })
                  }
                  placeholder="Sales Manager"
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
                <Button type="submit">Create Contact</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Contacts List */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading contacts...</p>
        </div>
      ) : filteredContacts.length === 0 ? (
        <Card className="card-minimal p-12 text-center">
          <p className="text-muted-foreground mb-4">No contacts found</p>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Create Your First Contact
              </Button>
            </DialogTrigger>
          </Dialog>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContacts.map(contact => {
            if (!contact?.id) return null;
            return (
              <Card key={contact.id} className="card-minimal p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {contact.firstName} {contact.lastName}
                    </h3>
                    <Badge
                      className={`mt-2 ${getContactTypeColor(contact.contactType)}`}
                    >
                      {contact.contactType}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteContact(contact.id)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Briefcase className="w-4 h-4" />
                    <span>{contact.jobTitle}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <a
                      href={`mailto:${contact.email}`}
                      className="hover:text-accent"
                    >
                      {contact.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <a
                      href={`tel:${contact.phoneNumber}`}
                      className="hover:text-accent"
                    >
                      {contact.phoneNumber}
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
