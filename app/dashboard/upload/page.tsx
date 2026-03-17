'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload } from 'lucide-react'

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || uploadSuccess) {
      setMessage('Please select a new file')
      return
    }

    setLoading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/upload-resume', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setMessage('Resume uploaded successfully! Redirecting to analysis...')
        setUploadSuccess(true)
        setTimeout(() => {
          router.push(`/dashboard/analysis?id=${data.resumeId}`)
        }, 1500)
      } else {
        const errorData = await response.json().catch(() => ({}))
        setMessage(errorData.message || 'Failed to upload resume')
      }
    } catch (err) {
      setMessage('An error occurred during upload')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="mx-auto max-w-2xl">
        <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Upload Resume</CardTitle>
            <CardDescription>Upload your resume to get started with analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div 
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-slate-600 hover:border-blue-500'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-input"
                />
                <label htmlFor="file-input" className="cursor-pointer">
                  <div className="flex flex-col items-center gap-2">
                    <Upload className={`h-8 w-8 ${isDragging ? 'text-blue-400' : 'text-slate-400'}`} />
                    <div className="text-sm text-slate-300">
                      {file ? file.name : 'Click to upload or drag and drop'}
                    </div>
                    <div className="text-xs text-slate-500">PDF, DOC, DOCX, or TXT</div>
                  </div>
                </label>
              </div>

              {message && (
                <div className={`p-3 rounded text-sm ${
                  message.includes('successfully')
                    ? 'bg-green-500/10 border border-green-500/50 text-green-400'
                    : 'bg-red-500/10 border border-red-500/50 text-red-400'
                }`}>
                  {message}
                </div>
              )}

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading || !file || uploadSuccess}>
                {loading ? 'Uploading...' : uploadSuccess ? 'Uploaded ✓' : 'Upload Resume'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
