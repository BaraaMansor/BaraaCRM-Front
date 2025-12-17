/**
 * Sidebar Navigation Component
 * Design Philosophy: Minimalist Enterprise
 * - Clear, icon-driven navigation
 * - Collapsible on mobile for space efficiency
 * - Consistent styling with slate blue primary color
 */

import { useState } from 'react';
import { Link } from 'wouter';
import {
  Menu,
  X,
  Building2,
  MapPin,
  Users,
  UserCheck,
  Home,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/',
    icon: <Home className="w-5 h-5" />,
  },
  {
    label: 'Companies',
    href: '/companies',
    icon: <Building2 className="w-5 h-5" />,
  },
  {
    label: 'Branches',
    href: '/branches',
    icon: <MapPin className="w-5 h-5" />,
  },
  {
    label: 'Employees',
    href: '/employees',
    icon: <UserCheck className="w-5 h-5" />,
  },
  {
    label: 'Contacts',
    href: '/contacts',
    icon: <Users className="w-5 h-5" />,
  },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white shadow-md"
        >
          {isOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </Button>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-64 bg-sidebar border-r border-sidebar-border
          transform transition-transform duration-200 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col
        `}
      >
        {/* Header */}
        <div className="p-6 border-b border-sidebar-border">
          <h1 className="text-2xl font-bold text-sidebar-primary">
            BaraaCRM
          </h1>
          <p className="text-sm text-sidebar-foreground/60 mt-1">
            Customer Management
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <a
                onClick={() => setIsOpen(false)}
                className="
                  flex items-center gap-3 px-4 py-3 rounded-lg
                  text-sidebar-foreground transition-smooth
                  hover:bg-sidebar-accent hover:text-sidebar-primary
                  active:bg-sidebar-primary active:text-sidebar-primary-foreground
                  group
                "
              >
                <span className="text-sidebar-foreground/70 group-hover:text-sidebar-primary transition-smooth">
                  {item.icon}
                </span>
                <span className="font-medium">{item.label}</span>
                {item.badge && (
                  <span className="ml-auto text-xs bg-sidebar-primary text-sidebar-primary-foreground px-2 py-1 rounded">
                    {item.badge}
                  </span>
                )}
              </a>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border">
          <p className="text-xs text-sidebar-foreground/50 text-center">
            BaraaCRM © 2024
          </p>
        </div>
      </aside>
    </>
  );
}
