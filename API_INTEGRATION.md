# API Integration Guide

This Resume Analyzer frontend is ready for you to connect your own backend APIs. Below is a guide for each endpoint you need to implement.

## Authentication Endpoints

### 1. Login API
**Endpoint:** `POST /api/login`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com"
  }
}
```

**Integration Location:** `app/login/page.tsx` (line ~30)

---

### 2. Signup API
**Endpoint:** `POST /api/signup`

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Account created successfully",
  "token": "jwt_token_here"
}
```

**Integration Location:** `app/signup/page.tsx` (line ~33)

---

## Resume Feature Endpoints

### 3. Resume Upload API
**Endpoint:** `POST /api/upload`

**Request:** FormData with file
```
file: <binary PDF/DOC file>
```

**Response:**
```json
{
  "resumeId": "resume_id",
  "fileName": "resume.pdf",
  "uploadedAt": "2024-01-15T10:30:00Z"
}
```

**Integration Location:** `app/dashboard/upload/page.tsx` (line ~31)

---

### 4. Resume Analysis API
**Endpoint:** `GET /api/analysis` or `POST /api/analyze`

**Request (Optional):**
```json
{
  "resumeId": "resume_id"
}
```

**Response:**
```json
{
  "atsScore": 78,
  "detectedSkills": [
    "JavaScript",
    "React",
    "TypeScript",
    "Node.js",
    "SQL"
  ],
  "missingSkills": [
    "AWS",
    "Docker",
    "Kubernetes",
    "Go"
  ],
  "suggestions": [
    "Add more technical keywords related to cloud services",
    "Include quantifiable achievements in your experience",
    "Improve formatting to be ATS-friendly"
  ]
}
```

**Integration Location:** `app/dashboard/analysis/page.tsx` (line ~14)

---

### 5. Job Keywords API
**Endpoint:** `POST /api/keywords`

**Request:**
```json
{
  "jobTitle": "Senior Frontend Developer"
}
```

**Response:**
```json
{
  "jobTitle": "Senior Frontend Developer",
  "essential": [
    "JavaScript",
    "React",
    "TypeScript",
    "Node.js",
    "REST API",
    "Git"
  ],
  "desirable": [
    "AWS",
    "Docker",
    "Testing",
    "CI/CD",
    "GraphQL",
    "MongoDB"
  ],
  "trending": [
    "AI/ML",
    "Cloud Native",
    "Serverless",
    "Microservices",
    "WebAssembly"
  ]
}
```

**Integration Location:** `app/dashboard/keywords/page.tsx` (line ~17)

---

## Implementation Steps

1. **Replace API endpoints** in the relevant page files with your actual backend URLs
2. **Add authentication header** to requests if needed:
   ```javascript
   const token = localStorage.getItem('token')
   const response = await fetch('/api/endpoint', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       'Authorization': `Bearer ${token}`
     },
     body: JSON.stringify(data)
   })
   ```

3. **Handle errors** gracefully with user-friendly messages
4. **Add loading states** for better UX during API calls
5. **Store authentication tokens** securely (consider using httpOnly cookies instead of localStorage)

## Testing API Endpoints

You can test each endpoint using tools like:
- **Postman** - for manual API testing
- **cURL** - for command-line testing
- **Thunder Client** - VS Code extension
- **REST Client** - VS Code extension

## Security Considerations

- Never expose API keys in frontend code
- Use environment variables for API URLs
- Implement proper CORS policies on your backend
- Validate all user inputs
- Use HTTPS for all API calls
- Store tokens securely (preferably httpOnly cookies)
- Implement rate limiting to prevent abuse

## Sample Environment Variables

Create a `.env.local` file in the project root:

```
NEXT_PUBLIC_API_URL=https://your-api.com
NEXT_PUBLIC_API_TIMEOUT=30000
```

Then use in your code:
```javascript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
const response = await fetch(`${API_URL}/login`, { ... })
```
