/**
 * Dashboard Page
 * Design Philosophy: Minimalist Enterprise
 * - Overview of key metrics
 * - Quick access to main features
 * - Clean, scannable layout
 */

import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import MainLayout from '@/components/MainLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Building2, MapPin, Users, UserCheck, ArrowRight } from 'lucide-react';
import { companyApi, branchApi, employeeApi, contactApi } from '@/lib/api';
import { toast } from 'sonner';

interface MetricCard {
  label: string;
  value: number;
  icon: React.ReactNode;
  href: string;
  color: string;
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    companies: 0,
    branches: 0,
    employees: 0,
    contacts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const [companies, branches, employees, contacts] = await Promise.all([
          companyApi.getAll(),
          branchApi.getAll(),
          employeeApi.getAll(),
          contactApi.getAll(),
        ]);

        setMetrics({
          companies: companies.length,
          branches: branches.length,
          employees: employees.length,
          contacts: contacts.length,
        });
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
        toast.error('Failed to load dashboard metrics');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  const metricCards: MetricCard[] = [
    {
      label: 'Companies',
      value: metrics.companies,
      icon: <Building2 className="w-8 h-8" />,
      href: '/companies',
      color: 'text-blue-600',
    },
    {
      label: 'Branches',
      value: metrics.branches,
      icon: <MapPin className="w-8 h-8" />,
      href: '/branches',
      color: 'text-cyan-600',
    },
    {
      label: 'Employees',
      value: metrics.employees,
      icon: <UserCheck className="w-8 h-8" />,
      href: '/employees',
      color: 'text-indigo-600',
    },
    {
      label: 'Contacts',
      value: metrics.contacts,
      icon: <Users className="w-8 h-8" />,
      href: '/contacts',
      color: 'text-teal-600',
    },
  ];

  return (
    <MainLayout
      title="Dashboard"
      description="Welcome to BaraaCRM. Here's an overview of your business data."
    >
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metricCards.map((metric) => (
          <Link key={metric.href} href={metric.href}>
            <a className="block">
              <Card className="card-minimal p-6 cursor-pointer">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {metric.label}
                    </p>
                    <p className="text-3xl font-bold text-foreground mt-2">
                      {loading ? '-' : metric.value}
                    </p>
                  </div>
                  <div className={`${metric.color} opacity-80`}>
                    {metric.icon}
                  </div>
                </div>
              </Card>
            </a>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Getting Started */}
        <Card className="card-minimal p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Getting Started
          </h2>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Start by creating your first company to organize your business structure.
            </p>
            <Link href="/companies">
              <a>
                <Button className="w-full gap-2">
                  Create Company
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </a>
            </Link>
          </div>
        </Card>

        {/* Features Overview */}
        <Card className="card-minimal p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Key Features
          </h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-accent rounded-full" />
              Manage companies and their details
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-accent rounded-full" />
              Track branches across locations
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-accent rounded-full" />
              Organize employee information
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-accent rounded-full" />
              Manage customer contacts and leads
            </li>
          </ul>
        </Card>
      </div>
    </MainLayout>
  );
}
