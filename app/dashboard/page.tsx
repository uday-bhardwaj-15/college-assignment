'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LogOut } from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const [userName, setUserName] = useState('')
  const [isChecking, setIsChecking] = useState(true)

  const [metrics, setMetrics] = useState({
    total: 0,
    avgAts: '--',
    lastAnalyzed: 'No analyses yet'
  })

  useEffect(() => {
    // Check if user is authenticated by verifying token in localStorage
    const token = localStorage.getItem('token')
    if (!token) {
      router.replace('/login')
    } else {
      // Decode user data loosely from token payload if possible or fetch profile
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.email) setUserName(payload.email.split('@')[0]);
        else setUserName('User');
      } catch (e) {
        setUserName('User')
      }

      // Fetch resume data
      fetch('/api/user/resumes', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const total = data.length;
          
          let totalScore = 0;
          let scoredCount = 0;
          let latestDate = new Date(0);

          data.forEach((r: any) => {
             if (r.atsScore !== null && r.atsScore !== undefined) {
               totalScore += r.atsScore;
               scoredCount++;
             }
             const rDate = new Date(r.uploadedAt);
             if (rDate > latestDate) {
               latestDate = rDate;
             }
          });

          setMetrics({
            total,
            avgAts: scoredCount > 0 ? Math.round(totalScore / scoredCount).toString() : '--',
            lastAnalyzed: latestDate.getTime() > 0 ? latestDate.toLocaleDateString() : 'No analyses yet'
          });
        }
      })
      .catch(err => console.error("Error fetching metrics:", err))
      .finally(() => setIsChecking(false));
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/')
  }

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white">Loading Dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <nav className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Resume Analyzer</h1>
            <div className="flex items-center gap-4">
              <span className="text-slate-300">Welcome, <span className="text-blue-400 capitalize">{userName}</span></span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="border-slate-500 text-white hover:bg-slate-700 backdrop-blur-md bg-slate-800/50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <h2 className="mb-8 text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400">Your Dashboard</h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card className="border-slate-700/50 bg-slate-800/40 backdrop-blur-xl shadow-xl hover:border-blue-500/50 transition-colors">
            <CardHeader>
              <CardTitle className="text-slate-200">Resumes Analyzed</CardTitle>
              <CardDescription>Total resumes you've uploaded</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-bold text-blue-400 drop-shadow-md">{metrics.total}</div>
            </CardContent>
          </Card>

          <Card className="border-slate-700/50 bg-slate-800/40 backdrop-blur-xl shadow-xl hover:border-green-500/50 transition-colors">
            <CardHeader>
              <CardTitle className="text-slate-200">Average ATS Score</CardTitle>
              <CardDescription>Your average ATS compatibility</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-bold text-green-400 drop-shadow-md">{metrics.avgAts}{metrics.avgAts !== '--' ? '%' : ''}</div>
            </CardContent>
          </Card>

          <Card className="border-slate-700/50 bg-slate-800/40 backdrop-blur-xl shadow-xl hover:border-purple-500/50 transition-colors">
            <CardHeader>
              <CardTitle className="text-slate-200">Last Analyzed</CardTitle>
              <CardDescription>Most recent analysis date</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-300 drop-shadow-md mt-2">{metrics.lastAnalyzed}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8 border-slate-700/50 bg-slate-800/40 backdrop-blur-xl shadow-xl overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
          <CardHeader>
            <CardTitle className="text-2xl text-slate-200">Ready to Improve Your Profile?</CardTitle>
            <CardDescription className="text-base text-slate-400">Upload your resume to begin a comprehensive AI analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg text-md px-8 py-6 rounded-xl transition-all hover:scale-[1.02]" onClick={() => router.push('/dashboard/upload')}>
              Upload New Resume
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
