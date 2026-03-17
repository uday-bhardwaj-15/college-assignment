export const MOCK_ATS_SUGGESTIONS = [
  'Add more quantifiable achievements to your work experience sections',
  'Include specific technical skills that match your target job description',
  'Highlight leadership experience and project management skills',
  'Use action verbs at the start of each bullet point',
  'Include certifications and continuous learning achievements',
];

export const MOCK_MISSING_SKILLS = [
  'Cloud Computing (AWS/Azure)',
  'Machine Learning',
  'DevOps',
  'GraphQL',
  'Kubernetes',
];

export const MOCK_KEYWORDS = [
  'Full Stack Developer',
  'React',
  'Node.js',
  'TypeScript',
  'Database Design',
  'REST APIs',
  'Problem Solving',
  'Team Leadership',
];

export const MOCK_JOB_ROLES = [
  { title: 'Senior Software Engineer', match: 85 },
  { title: 'Full Stack Developer', match: 82 },
  { title: 'Tech Lead', match: 78 },
  { title: 'Solutions Architect', match: 75 },
  { title: 'Engineering Manager', match: 70 },
];

export const MOCK_RESUME_DATA = [
  {
    id: '1',
    fileName: 'John_Doe_Resume.pdf',
    uploadedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    atsScore: 85,
    status: 'analyzed',
  },
  {
    id: '2',
    fileName: 'John_Doe_Resume_v2.pdf',
    uploadedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    atsScore: 92,
    status: 'analyzed',
  },
  {
    id: '3',
    fileName: 'John_Doe_Resume_Updated.pdf',
    uploadedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    atsScore: 88,
    status: 'analyzed',
  },
];

export const MOCK_LATEX_TEMPLATES = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean and modern design with ATS-friendly formatting',
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Traditional professional layout',
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Modern design with visual elements',
  },
];

export const MOCK_JOB_KEYWORDS_DATA = {
  softwareDeveloper: {
    essential: ['Programming', 'Problem-solving', 'Version Control', 'Testing'],
    desirable: ['Cloud platforms', 'Containerization', 'CI/CD', 'Microservices'],
    trending: ['AI/ML integration', 'WebAssembly', 'Edge computing'],
  },
  dataScientist: {
    essential: ['Python', 'SQL', 'Statistics', 'Data Visualization'],
    desirable: ['Machine Learning', 'Deep Learning', 'Big Data'],
    trending: ['LLMs', 'Generative AI', 'Prompt Engineering'],
  },
  productManager: {
    essential: ['Product Strategy', 'User Research', 'Analytics', 'Communication'],
    desirable: ['Roadmapping', 'A/B Testing', 'Agile'],
    trending: ['AI-powered products', 'Data-driven decisions'],
  },
};
