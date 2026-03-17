'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, AlertCircle, TrendingUp, Code, Wand2, Search, ExternalLink, Loader2, FileText, Briefcase, PlusCircle, Check } from 'lucide-react'

interface AnalysisResult {
  atsScore: number
  detectedSkills: string[]
  missingSkills: string[]
  suggestions: string[]
  latexCode?: string
}

// Stepper Component
function Stepper({ currentStep, setStep }: { currentStep: number, setStep: (step: number) => void }) {
  const steps = [
    { num: 1, label: 'Resume Health', icon: <TrendingUp className="w-4 h-4" /> },
    { num: 2, label: 'Refinement', icon: <Wand2 className="w-4 h-4" /> },
    { num: 3, label: 'Opportunities', icon: <Briefcase className="w-4 h-4" /> }
  ]

  return (
    <div className="w-full flex justify-center mb-8 relative">
      <div className="flex items-center justify-between w-full max-w-2xl relative z-10">
        {steps.map((step, idx) => (
          <div key={step.num} className="flex flex-col items-center gap-2">
            <button
              onClick={() => step.num <= currentStep ? setStep(step.num) : null}
              disabled={step.num > currentStep}
              className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-lg ${
                currentStep === step.num 
                  ? 'border-blue-500 bg-blue-500/20 text-blue-400 ring-4 ring-blue-500/30' 
                  : currentStep > step.num
                  ? 'border-green-500 bg-green-500/20 text-green-400 cursor-pointer'
                  : 'border-slate-700 bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              {currentStep > step.num ? <Check className="w-5 h-5" /> : step.icon}
            </button>
            <span className={`text-sm font-medium transition-colors ${
              currentStep === step.num ? 'text-blue-400' : currentStep > step.num ? 'text-green-400' : 'text-slate-500'
            }`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
      {/* Background linking line */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 w-full max-w-xl h-[2px] bg-slate-800 -z-10">
        <div 
          className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-500"
          style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
        />
      </div>
    </div>
  )
}


function AnalysisContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')
  
  // UI States
  const [currentStep, setCurrentStep] = useState(1);
  
  // State for editable LaTeX
  const [editableLatex, setEditableLatex] = useState('')
  
  // States for individual fix feature
  const [appliedSuggestions, setAppliedSuggestions] = useState<number[]>([])

  // States for Job Search feature
  const [jobsData, setJobsData] = useState<{ roles: string[], keywords: string[] } | null>(null)
  const [jobsLoading, setJobsLoading] = useState(false)

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          router.push('/login')
          return
        }

        let resumeId = searchParams.get('id')

        // If no ID is provided, try to fetch the most recent resume
        if (!resumeId) {
          const histRes = await fetch('/api/user/resumes', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
          
          if (histRes.ok) {
            const history = await histRes.json()
            if (history && history.length > 0) {
              resumeId = history[0].id
            }
          }
        }

        if (!resumeId) {
          setLoading(false)
          return
        }

        // Fetch the analysis using the Groq API route
        const response = await fetch('/api/analyze-resume', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ resumeId })
        })

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}))
          setErrorMsg(errData.message || 'Failed to analyze resume')
          setLoading(false)
          return
        }

        const data = await response.json()
        setAnalysis(data)
        if (data.latexCode) {
          setEditableLatex(data.latexCode)
        }

        // Fetch Job Keywords concurrently now that we have the resumeId
        fetchJobKeywords(resumeId, token)
      } catch (err) {
        setErrorMsg('An unexpected error occurred')
      } finally {
        setLoading(false)
      }
    }

    const fetchJobKeywords = async (resumeId: string, token: string) => {
      setJobsLoading(true)
      try {
        const response = await fetch('/api/job-keywords', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ resumeId })
        })
        if (response.ok) {
          const data = await response.json()
          setJobsData(data)
        }
      } catch (err) {
        console.error("Failed to load job keywords", err)
      } finally {
        setJobsLoading(false)
      }
    }

    fetchAnalysis()
  }, [searchParams, router])

  const toggleSuggestion = (idx: number) => {
    setAppliedSuggestions(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const generateJobSearchUrl = (role: string, platform: string) => {
    // Basic slugification for Internshala
    const slug = role.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const encodedRole = encodeURIComponent(role);
    
    switch (platform) {
      case 'Internshala':
        return `https://internshala.com/internships/work-from-home-${slug}-internships/`;
      case 'LinkedIn':
        return `https://www.linkedin.com/jobs/search/?keywords=${encodedRole}&f_WT=2`; // f_WT=2 is remote
      case 'Indeed':
        return `https://www.indeed.com/jobs?q=${encodedRole}&sc=0kf%3Aattr%28DSQF7%29%3B`; // remote filter
      case 'Wellfound':
        return `https://wellfound.com/jobs?search=${encodedRole}`;
      default:
        return '#';
    }
  };
  
  const handleDownloadLatex = () => {
    if (!editableLatex) return;
    const blob = new Blob([editableLatex], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume.tex';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent mb-4"></div>
        <p className="text-white text-lg font-medium">Analyzing with AI... this may take a moment.</p>
        <p className="text-slate-400 mt-2">Checking ATS compatibility and formatting LaTeX template.</p>
      </div>
    )
  }

  if (errorMsg) {
    return (
      <Card className="border-red-500/50 bg-red-500/10 backdrop-blur-sm max-w-2xl mx-auto mt-8">
        <CardContent className="pt-6">
          <p className="text-red-400 font-medium">Error: {errorMsg}</p>
        </CardContent>
      </Card>
    )
  }

  if (!analysis) {
    return (
      <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm max-w-2xl mx-auto mt-8">
        <CardContent className="pt-6 text-center">
          <p className="text-slate-300 mb-4">No analysis available. Please upload a resume first.</p>
          <Button onClick={() => router.push('/dashboard/upload')} className="bg-blue-600 hover:bg-blue-700">
            Go to Upload
          </Button>
        </CardContent>
      </Card>
    )
  }

  const allSuggestionsApplied = appliedSuggestions.length === analysis.suggestions.length && analysis.suggestions.length > 0;

  return (
    <div className="space-y-8 max-w-5xl mx-auto mt-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 mb-2">Resume AI Analysis</h1>
        <p className="text-slate-400">Review your automated insights and improve your profile</p>
      </div>

      <Stepper currentStep={currentStep} setStep={setCurrentStep} />

      {/* Step 1: Health & Skills */}
      <div className={`transition-all duration-500 ${currentStep === 1 ? 'opacity-100 translate-x-0' : 'opacity-0 hidden translate-x-8'}`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* ATS Score */}
          <Card className="border-slate-700/50 bg-slate-800/40 backdrop-blur-xl md:col-span-1 shadow-xl shadow-blue-900/10">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-slate-200">
                <TrendingUp className="h-5 w-5 text-blue-400" />
                ATS Match
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-700" />
                  <circle 
                    cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" 
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 45}`}
                    strokeDashoffset={`${2 * Math.PI * 45 * (1 - analysis.atsScore / 100)}`}
                    className={`transition-all duration-1000 ease-out ${
                      analysis.atsScore >= 75 ? 'text-green-500' : analysis.atsScore >= 50 ? 'text-yellow-500' : 'text-red-500'
                    }`} 
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-bold text-white">{analysis.atsScore}%</span>
                </div>
              </div>
              <p className="text-slate-400 text-sm mt-4 text-center">
                {analysis.atsScore >= 75 ? 'Excellent formatting & keywords.' : 'Needs optimization for ATS.'}
              </p>
            </CardContent>
          </Card>

          <div className="md:col-span-2 flex flex-col gap-6">
            {/* Detected Skills */}
            <Card className="border-slate-700/50 bg-slate-800/40 backdrop-blur-xl flex-1 shadow-xl shadow-green-900/10">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg text-slate-200">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  Strengths & Detected Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {analysis.detectedSkills.length > 0 ? analysis.detectedSkills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="bg-green-500/10 text-green-400 hover:bg-green-500/20 border-green-500/20">
                      {skill}
                    </Badge>
                  )) : <span className="text-slate-500">No major skills detected</span>}
                </div>
              </CardContent>
            </Card>

            {/* Missing Skills */}
            <Card className="border-slate-700/50 bg-slate-800/40 backdrop-blur-xl flex-1 shadow-xl shadow-yellow-900/10">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg text-slate-200">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                  Opportunities for Addition
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {analysis.missingSkills.length > 0 ? analysis.missingSkills.map((skill) => (
                    <Badge key={skill} variant="outline" className="border-yellow-500/30 text-yellow-400 bg-yellow-400/5">
                      + {skill}
                    </Badge>
                  )) : <span className="text-slate-500">Profile looks comprehensive!</span>}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="flex justify-end mt-8">
          <Button onClick={() => setCurrentStep(2)} className="bg-blue-600 hover:bg-blue-700">
            Next: Refine Content <TrendingUp className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Step 2: Refinement */}
      <div className={`transition-all duration-500 ${currentStep === 2 ? 'opacity-100 translate-x-0' : 'opacity-0 hidden translate-x-8'}`}>
        <Card className="border-slate-700/50 bg-slate-800/40 backdrop-blur-xl shadow-xl mb-6">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-slate-200">AI Rewriting Suggestions</CardTitle>
                <CardDescription>Select which AI-generated enhancements to incorporate into your resume.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {analysis.suggestions.length > 0 ? (
              <div className="space-y-4">
                <ul className="space-y-3">
                  {analysis.suggestions.map((suggestion, idx) => {
                    const isApplied = appliedSuggestions.includes(idx);
                    return (
                      <li 
                        key={idx} 
                        className={`group relative flex items-start gap-3 p-4 rounded-xl border transition-all duration-300 ${
                          isApplied 
                            ? 'bg-blue-900/20 border-blue-500/30' 
                            : 'bg-slate-900/60 border-slate-700/50 hover:border-slate-600'
                        }`}
                      >
                        <div className="flex-1">
                          <p className={`text-sm ${isApplied ? 'text-slate-300' : 'text-slate-300'}`}>
                            {suggestion}
                          </p>
                        </div>
                        <Button 
                          onClick={() => toggleSuggestion(idx)}
                          variant={isApplied ? "default" : "outline"}
                          size="sm"
                          className={`${
                            isApplied 
                              ? 'bg-blue-600 hover:bg-blue-700 text-white border-none shrink-0' 
                              : 'border-slate-600 text-slate-300 hover:bg-slate-800 shrink-0'
                          }`}
                        >
                          {isApplied ? (
                            <><CheckCircle className="mr-2 h-4 w-4" /> Applied</>
                          ) : (
                            <><PlusCircle className="mr-2 h-4 w-4" /> Apply</>
                          )}
                        </Button>
                      </li>
                    )
                  })}
                </ul>
                
                {allSuggestionsApplied && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-500/30 rounded-xl animate-in fade-in slide-in-from-bottom-4 flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-full">
                      <Wand2 className="h-5 w-5 text-blue-400" />
                    </div>
                    <p className="text-blue-200 text-sm">
                      <strong>Excellent!</strong> Experience optimized. You can proceed to the final LaTeX template below.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-slate-400">Your resume bullet points are looking great already.</p>
            )}
          </CardContent>
        </Card>

        {analysis.latexCode && (
          <Card className="border-slate-700/50 bg-slate-800/40 backdrop-blur-xl shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-slate-200">
                <span className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-purple-400" />
                  Source Code (LaTeX)
                </span>
                <Button 
                  onClick={handleDownloadLatex}
                  size="sm"
                  variant="outline"
                  className="bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Download .tex
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-700/50 focus-within:ring-1 focus-within:ring-purple-500/50 transition-all shadow-inner">
                <textarea 
                  value={editableLatex}
                  onChange={(e) => setEditableLatex(e.target.value)}
                  className="w-full bg-transparent text-slate-300 text-xs font-mono whitespace-pre-wrap outline-none resize-y min-h-[350px] custom-scrollbar"
                  spellCheck={false}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-4 justify-between border-t border-slate-700/50 pt-6">
               <Button variant="ghost" onClick={() => setCurrentStep(1)} className="text-slate-400 hover:text-white hover:bg-slate-800">
                 Back
               </Button>
               <div className="flex gap-4 w-full sm:w-auto">
                 <form action="https://www.overleaf.com/docs" method="post" target="_blank" className="flex-1 sm:flex-none">
                    <input type="hidden" name="snip_name" value="ATS Optimized Resume" />
                    <input type="hidden" name="snip" value={editableLatex} />
                    <Button 
                      type="submit"
                      className="w-full bg-green-600/90 hover:bg-green-600 text-white border-none"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open in Overleaf
                    </Button>
                  </form>
                  <Button onClick={() => setCurrentStep(3)} className="bg-blue-600 hover:bg-blue-700 flex-1 sm:flex-none">
                    Next: Job Opportunities <TrendingUp className="ml-2 w-4 h-4" />
                  </Button>
               </div>
            </CardFooter>
          </Card>
        )}
      </div>

      {/* Step 3: Jobs */}
      <div className={`transition-all duration-500 ${currentStep === 3 ? 'opacity-100 translate-x-0' : 'opacity-0 hidden translate-x-8'}`}>
         <JobSearchSection jobsData={jobsData} loading={jobsLoading} generateUrl={generateJobSearchUrl} />
         
         <div className="flex justify-between mt-8">
           <Button variant="ghost" onClick={() => setCurrentStep(2)} className="text-slate-400 hover:text-white hover:bg-slate-800">
             Back to Refinement
           </Button>
           <Button onClick={() => router.push('/dashboard')} variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
             Return to Dashboard
           </Button>
         </div>
      </div>
    </div>
  )
}

function JobSearchSection({ 
  jobsData, 
  loading,
  generateUrl 
}: { 
  jobsData: { roles: string[], keywords: string[] } | null, 
  loading: boolean,
  generateUrl: (role: string, platform: string) => string 
}) {
  if (loading) {
    return (
      <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm mt-6">
        <CardContent className="pt-6 flex flex-col items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
          <p className="text-slate-400">Finding the best job matches for your profile...</p>
        </CardContent>
      </Card>
    );
  }

  if (!jobsData || jobsData.roles.length === 0) return null;

  const platforms = ['Internshala', 'LinkedIn', 'Indeed', 'Wellfound'];

  return (
    <Card className="border-slate-700 bg-slate-800/80 backdrop-blur-sm mt-6 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5 text-blue-400" />
          Recommended Roles & Job Search
        </CardTitle>
        <CardDescription>
          Based on your skills and experience, we recommend these roles. Click to search directly on popular platforms.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {jobsData.roles.map((role, idx) => (
            <div key={idx} className="bg-slate-900/50 rounded-xl p-5 border border-slate-700/50 hover:border-slate-600 transition-colors">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                {role}
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {platforms.map(platform => (
                  <a
                    key={platform}
                    href={generateUrl(role, platform)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg p-2 text-sm font-medium text-slate-300 hover:text-white transition-all group"
                  >
                    {platform}
                    <ExternalLink className="h-3 w-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </a>
                ))}
              </div>
            </div>
          ))}

          {jobsData.keywords.length > 0 && (
             <div className="mt-6 pt-6 border-t border-slate-700/50">
               <h4 className="text-sm font-medium text-slate-400 mb-3">Top Search Keywords for these roles:</h4>
               <div className="flex flex-wrap gap-2">
                 {jobsData.keywords.map((kw, i) => (
                   <Badge key={i} variant="secondary" className="bg-slate-800 text-slate-300">
                     {kw}
                   </Badge>
                 ))}
               </div>
             </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default function AnalysisPage() {
  return (
    <div className="min-h-screen bg-[#020617] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] p-4 sm:p-8">
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <Loader2 className="h-10 w-10 animate-spin text-blue-500 mb-4" />
          <div className="text-white text-lg">Initializing Workspace...</div>
        </div>
      }>
        <AnalysisContent />
      </Suspense>
    </div>
  )
}
