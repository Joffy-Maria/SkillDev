'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import '@/styles/globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { StudentSidebar } from '@/components/layout/StudentSidebar';
import { Navbar } from '@/components/layout/Navbar';
import { CommandPalette } from '@/components/ui/command-palette';

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/signup' || pathname === '/register' || pathname === '/unauthorized';
  const isAdminPage = pathname.startsWith('/admin');

  if (isAuthPage) {
    return <div className="min-h-screen bg-[#09090B] text-[#FAFAFA]">{children}</div>;
  }

  if (isAdminPage) {
    return <div className="min-h-screen bg-[#09090B] text-[#FAFAFA]">{children}</div>;
  }

  // Student Portal Layout
  return (
    <div className="min-h-screen bg-[#09090B] text-[#FAFAFA]">
      <div className="flex min-h-screen">
        <StudentSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar />
          <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">{children}</main>
        </div>
      </div>
    </div>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <title>SkillDev | Placement Preparation Platform</title>
      </head>
      <body className="bg-[#09090B] text-[#FAFAFA] antialiased selection:bg-[#C9A227] selection:text-black">
        <AuthProvider>
          <LayoutContent>{children}</LayoutContent>
          <CommandPalette />
        </AuthProvider>
      </body>
    </html>
  );
}
