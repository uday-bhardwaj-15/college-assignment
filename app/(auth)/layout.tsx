import { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">Resume Analyzer</h1>
          <p className="mt-2 text-gray-400">Optimize your resume for ATS success</p>
        </div>
        {children}
      </div>
    </div>
  );
}
