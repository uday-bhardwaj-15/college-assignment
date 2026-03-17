'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  BarChart3,
  Zap,
  Search,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Resume Analyzer</h1>
            <div className="flex gap-4">
              <Link href="/login">
                <Button variant="outline" className="border-white text-white hover:bg-white/10">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-blue-600 hover:bg-blue-700">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="mb-4 text-5xl font-bold text-white md:text-6xl">
            Optimize Your Resume for ATS Success
          </h2>
          <p className="mb-8 text-xl text-slate-300">
            Get real-time feedback, ATS score analysis, and AI-powered suggestions to land your dream job
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Start Free <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="border-slate-400 text-white hover:bg-slate-700">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h3 className="mb-12 text-center text-3xl font-bold text-white">Powerful Features</h3>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Feature 1 */}
          <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-8 backdrop-blur-sm">
            <BarChart3 className="mb-4 h-12 w-12 text-blue-400" />
            <h4 className="mb-2 text-xl font-semibold text-white">ATS Score Analysis</h4>
            <p className="text-slate-300">
              Get an instant ATS compatibility score and understand how your resume ranks against job requirements
            </p>
          </div>

          {/* Feature 2 */}
          <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-8 backdrop-blur-sm">
            <Zap className="mb-4 h-12 w-12 text-yellow-400" />
            <h4 className="mb-2 text-xl font-semibold text-white">AI Suggestions</h4>
            <p className="text-slate-300">
              Receive personalized recommendations to improve your resume and increase your chances of being selected
            </p>
          </div>

          {/* Feature 3 */}
          <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-8 backdrop-blur-sm">
            <Search className="mb-4 h-12 w-12 text-green-400" />
            <h4 className="mb-2 text-xl font-semibold text-white">Job Keywords Finder</h4>
            <p className="text-slate-300">
              Discover important keywords for your target roles and optimize your resume accordingly
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <h3 className="mb-8 text-center text-3xl font-bold text-white">Why Choose Resume Analyzer?</h3>
        <div className="space-y-4">
          {[
            'Instant ATS compatibility analysis',
            'AI-powered improvement suggestions',
            'Professional LaTeX resume templates',
            'Job market insights and trends',
            'Track resume performance over time',
            'Export and share your analysis',
          ].map((benefit) => (
            <div key={benefit} className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 flex-shrink-0 text-green-400" />
              <span className="text-lg text-slate-300">{benefit}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h3 className="mb-4 text-3xl font-bold text-white">Ready to Optimize Your Resume?</h3>
        <p className="mb-8 text-lg text-slate-300">
          Join thousands of professionals who have already improved their resumes
        </p>
        <Link href="/signup">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-slate-400">
            © 2024 Resume Analyzer. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
