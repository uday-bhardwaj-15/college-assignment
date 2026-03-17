'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

interface KeywordsByCategory {
  essential: string[]
  desirable: string[]
  trending: string[]
}

export default function KeywordsPage() {
  const [jobTitle, setJobTitle] = useState('Software Engineer')
  const [keywords, setKeywords] = useState<KeywordsByCategory | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // TODO: Replace with your own keywords API endpoint
      // For now, showing sample data
      const sampleKeywords: KeywordsByCategory = {
        essential: ['JavaScript', 'React', 'TypeScript', 'Node.js', 'REST API', 'Git'],
        desirable: ['AWS', 'Docker', 'Testing', 'CI/CD', 'GraphQL', 'MongoDB'],
        trending: ['AI/ML', 'Cloud Native', 'Serverless', 'Microservices', 'WebAssembly'],
      }
      setKeywords(sampleKeywords)
    } catch (err) {
      console.error('Failed to fetch keywords')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Search Form */}
        <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Job Keywords Finder</CardTitle>
            <CardDescription>Find relevant keywords for any job title</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                placeholder="Enter job title (e.g., Senior Frontend Developer)"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
                {loading ? 'Searching...' : 'Search'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Keywords */}
        {keywords && (
          <>
            {/* Essential Keywords */}
            <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Essential Keywords</CardTitle>
                <CardDescription>Must-have skills for this role</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {keywords.essential.map((keyword) => (
                    <Badge key={keyword} className="bg-red-600 text-white">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Desirable Keywords */}
            <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Desirable Keywords</CardTitle>
                <CardDescription>Nice-to-have skills that increase competitiveness</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {keywords.desirable.map((keyword) => (
                    <Badge key={keyword} variant="outline" className="border-blue-500 text-blue-400">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Trending Keywords */}
            <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Trending Keywords</CardTitle>
                <CardDescription>Emerging technologies in this field</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {keywords.trending.map((keyword) => (
                    <Badge key={keyword} variant="outline" className="border-green-500 text-green-400">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
