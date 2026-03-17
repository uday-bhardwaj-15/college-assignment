'use client';

import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';

interface HeaderProps {
  userEmail?: string;
  userName?: string;
}

export function Header({ userEmail = 'user@example.com', userName = 'User' }: HeaderProps) {
  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="hidden md:block">
          <h2 className="text-lg font-semibold text-gray-900">Resume Analyzer</h2>
        </div>

        <div className="ml-auto flex items-center gap-4">
          <button
            onClick={() => signOut({ redirectTo: '/login' })}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}
