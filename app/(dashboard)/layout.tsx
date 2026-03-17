import { ReactNode } from 'react';
import { auth } from '@/auth';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Dashboard - Resume Analyzer',
  description: 'Manage your resumes and analysis results',
};

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-1 flex-col md:ml-64">
        <Header userName={session.user.name || 'User'} userEmail={session.user.email || ''} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
