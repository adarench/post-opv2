import React from 'react';
import { CommandBar } from './CommandBar';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-text-primary">
      {/* Command Bar - System Status & Controls */}
      <CommandBar />

      {/* Main Console Surface */}
      <div className="flex-1 flex">
        {/* Main Monitoring Surface - Patient Feed */}
        <main className="flex-1 min-h-0 p-4 bg-surface-gradient">
          <div className="h-full overflow-auto">
            {children}
          </div>
        </main>

        {/* Context Panel - Detail View */}
        <aside className="w-96 border-l border-border bg-surface shadow-inner-subtle overflow-y-auto">
          {/* Context panel content will be rendered by individual views */}
        </aside>
      </div>
    </div>
  );
}
