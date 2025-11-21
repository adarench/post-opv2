import React from 'react';
import { CommandBar } from './CommandBar';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-text-primary">
      <CommandBar />
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}
