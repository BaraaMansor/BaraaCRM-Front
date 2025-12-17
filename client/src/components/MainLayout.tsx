/**
 * Main Layout Component
 * Design Philosophy: Minimalist Enterprise
 * - Sidebar navigation with responsive design
 * - Consistent spacing and typography
 * - Clean, professional appearance
 */

import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export default function MainLayout({
  children,
  title,
  description,
}: MainLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <main className="flex-1 lg:ml-0">
        {/* Header */}
        {(title || description) && (
          <div className="border-b border-border bg-card p-6 lg:p-8">
            {title && (
              <h1 className="text-3xl font-bold text-foreground">{title}</h1>
            )}
            {description && (
              <p className="text-muted-foreground mt-2">{description}</p>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
