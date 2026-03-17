'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Copy } from 'lucide-react'

const LATEX_TEMPLATES = {
  modern: `\\documentclass[11pt]{article}
\\usepackage{geometry}
\\geometry{margin=0.5in}
\\usepackage{hyperref}

\\title{\\textbf{Your Name}}
\\author{}
\\date{}

\\begin{document}
\\maketitle

\\section*{PROFESSIONAL SUMMARY}
Brief overview of your professional background and key strengths.

\\section*{EXPERIENCE}
\\textbf{Job Title} \\hfill \\textit{Company Name} \\\\
\\textit{Month Year -- Month Year}
\\begin{itemize}
  \\item Achievement or responsibility
  \\item Achievement or responsibility
\\end{itemize}

\\section*{SKILLS}
\\textbf{Technical:} JavaScript, React, TypeScript, Node.js, SQL

\\section*{EDUCATION}
\\textbf{Degree Name} \\hfill \\textit{University Name} \\\\
\\textit{Year}

\\end{document}`,
  academic: `\\documentclass[11pt]{article}
\\usepackage{geometry}
\\usepackage{hyperref}

\\title{\\Large Your Name}
\\author{}
\\date{}

\\begin{document}
\\maketitle

\\section{Education}
\\textbf{Degree}, University Name, Year

\\section{Experience}
\\subsection{Position Title}
Company Name, Date Range
\\begin{itemize}
  \\item Key responsibility
\\end{itemize}

\\section{Skills}
Programming, Technical Skills

\\end{document}`,
  simple: `\\documentclass{article}
\\usepackage[margin=1in]{geometry}
\\begin{document}

\\textbf{\\Large Your Name}

\\textbf{Contact:} email@example.com | Phone | LinkedIn

\\section*{Summary}
Professional summary here.

\\section*{Experience}
\\textbf{Position} at Company (Years)
\\begin{itemize}
  \\item Achievement
\\end{itemize}

\\section*{Skills}
Skill 1, Skill 2, Skill 3

\\end{document}`,
}

export default function LatexPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<keyof typeof LATEX_TEMPLATES>('modern')
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(LATEX_TEMPLATES[selectedTemplate])
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="mx-auto max-w-4xl">
        <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>LaTeX Resume Templates</CardTitle>
            <CardDescription>Professional LaTeX resume templates ready to customize</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedTemplate} onValueChange={(val) => setSelectedTemplate(val as keyof typeof LATEX_TEMPLATES)}>
              <TabsList className="grid w-full grid-cols-3 bg-slate-700">
                <TabsTrigger value="modern">Modern</TabsTrigger>
                <TabsTrigger value="academic">Academic</TabsTrigger>
                <TabsTrigger value="simple">Simple</TabsTrigger>
              </TabsList>

              {Object.entries(LATEX_TEMPLATES).map(([key, code]) => (
                <TabsContent key={key} value={key}>
                  <div className="space-y-4 mt-4">
                    <pre className="bg-slate-900 border border-slate-600 rounded p-4 overflow-auto max-h-96 text-xs text-slate-300">
                      {code}
                    </pre>
                    <Button
                      onClick={handleCopy}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      {copied ? 'Copied!' : 'Copy LaTeX Code'}
                    </Button>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
