# AI Resume Analyzer

A full-stack web application that analyzes resumes for ATS (Applicant Tracking System) compatibility, provides AI-powered improvement suggestions, and helps job seekers optimize their resumes.

## Features

- **ATS Score Analysis**: Get instant feedback on your resume's ATS compatibility
- **Skill Detection**: Automatically identify skills in your resume
- **AI Suggestions**: Receive personalized recommendations for improvement
- **Missing Skills**: Discover skills that could improve your ATS score
- **Job Keywords Finder**: Find important keywords for your target roles
- **LaTeX Resume Generator**: Create professional ATS-friendly resumes with LaTeX templates
- **User Authentication**: Secure email/password authentication with NextAuth
- **Resume History**: Track and manage multiple resume versions

## Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS, TypeScript
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth v5 with credentials provider
- **UI Components**: Shadcn/ui
- **Form Handling**: React Hook Form with Zod validation

## Getting Started

### Prerequisites

- Node.js 18+ with pnpm
- MongoDB instance (local or Atlas)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd resume-analyzer
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Update `.env.local` with your MongoDB connection string and NextAuth secret:
```
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/resume-analyzer
AUTH_SECRET=your-random-secret-key
```

4. Start the development server:
```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
/app
  /(auth)
    /login         - Login page
    /signup        - Sign up page
    /layout.tsx    - Auth layout wrapper
  /(dashboard)
    /dashboard     - Main dashboard
    /upload        - Resume upload page
    /analysis/[id] - Resume analysis results
    /latex         - LaTeX generator
    /keywords      - Job keywords finder
    /layout.tsx    - Dashboard layout with sidebar
  /api
    /auth/[...nextauth] - NextAuth authentication endpoints
    /auth/signup        - User registration
    /upload-resume      - Resume upload endpoint
    /analyze-resume     - Resume analysis endpoint
    /job-keywords       - Job keywords endpoint
    /user/profile       - User profile endpoint
  /layout.tsx        - Root layout
  /page.tsx          - Landing page

/components
  /forms
    /LoginForm.tsx   - Login form component
    /SignupForm.tsx  - Sign up form component
  /dashboard
    /Sidebar.tsx     - Navigation sidebar
    /Header.tsx      - Dashboard header with user menu
  /ui                - Shadcn/ui components

/lib
  /mongodb.ts        - MongoDB connection utility
  /validation.ts     - Zod schemas for validation
  /mock-data.ts      - Mock data for demo
  /utils.ts          - Utility functions

/models
  /User.ts           - User schema
  /Resume.ts         - Resume schema
  /AnalysisResult.ts - Analysis result schema

/middleware.ts       - NextAuth middleware
/auth.config.ts      - NextAuth configuration
/auth.ts             - NextAuth instance
```

## API Routes

### Authentication
- `POST /api/auth/signin` - Sign in with credentials
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/signout` - Sign out

### Resume Management
- `POST /api/upload-resume` - Upload a resume
- `POST /api/analyze-resume` - Analyze uploaded resume
- `GET /api/job-keywords` - Get job keywords for a role

### User
- `GET /api/user/profile` - Get user profile

## Mock Data

The application currently uses mock data for demonstration purposes. To integrate with real AI services:

1. **ATS Analysis**: Replace mock scores with actual AI API calls (e.g., OpenAI, Claude)
2. **File Storage**: Integrate with cloud storage (e.g., Vercel Blob, AWS S3)
3. **Resume Parsing**: Use a resume parsing library or API for skill extraction

## Database Schema

### User
```typescript
{
  email: string (unique)
  password: string (hashed)
  name: string
  createdAt: Date
  updatedAt: Date
}
```

### Resume
```typescript
{
  userId: ObjectId (ref: User)
  fileName: string
  fileUrl: string
  type: string ('pdf' | 'docx')
  uploadedAt: Date
}
```

### AnalysisResult
```typescript
{
  resumeId: ObjectId (ref: Resume)
  atsScore: number (0-100)
  suggestions: string[]
  missingSkills: string[]
  keywords: string[]
  analyzedAt: Date
}
```

## Authentication

The application uses NextAuth v5 with:
- Email/password authentication
- Session-based authentication
- Protected routes requiring authentication
- Automatic redirect to login for unauthenticated users

### Creating an Account

1. Visit the signup page
2. Enter your name, email, and password
3. Confirm your password
4. You'll be automatically logged in and redirected to the dashboard

## Deployment

The application can be deployed to Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel project settings:
   - `MONGODB_URI`
   - `AUTH_SECRET`
4. Deploy

For other platforms, ensure Node.js 18+ is available and install dependencies with `pnpm install`.

## Future Enhancements

- [ ] AI-powered resume improvement suggestions using LLMs
- [ ] Real resume file upload and parsing
- [ ] Resume version comparison
- [ ] Job application tracking
- [ ] Integration with job posting APIs
- [ ] Dark mode support
- [ ] Export analysis results as PDF
- [ ] Collaboration features for resume review

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Support

For issues and questions, please open an issue on GitHub.
