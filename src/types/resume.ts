export interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string; // Full-time, Remote, Hybrid
  minYearsExperience: number;
  educationRequired: string;
  description: string;
  requiredSkills: string[];
  preferredSkills: string[];
  createdAt: string;
}

export interface WorkExperience {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  highlights: string[];
}

export interface Education {
  degree: string;
  field: string;
  institution: string;
  graduationYear?: string;
}

export interface SkillMatchDetail {
  skill: string;
  evidence: string;
  matchType: 'exact' | 'semantic' | 'adjacent';
}

export interface MissingSkillDetail {
  skill: string;
  importance: 'required' | 'preferred';
  notes: string;
}

export interface ScreeningResult {
  jobId: string;
  screenedAt: string;
  overallScore: number; // 0-100
  skillsScore: number; // 0-100
  experienceScore: number; // 0-100
  educationScore: number; // 0-100
  recommendation: 'FAST_TRACK_SHORTLIST' | 'SHORTLIST' | 'POTENTIAL_FIT' | 'NOT_RECOMMENDED';
  recommendationSummary: string;
  matchedSkills: SkillMatchDetail[];
  missingSkills: MissingSkillDetail[];
  keyStrengths: string[];
  potentialGaps: string[];
  suggestedInterviewQuestions: string[];
}

export type CandidateStatus = 'new' | 'screening' | 'shortlisted' | 'interviewing' | 'rejected' | 'offered';

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  currentTitle: string;
  currentCompany: string;
  yearsExperience: number;
  summary: string;
  skills: string[];
  education: Education[];
  workExperience: WorkExperience[];
  certifications: string[];
  rawResumeText: string;
  parsedAt: string;
  status: CandidateStatus;
  recruiterNotes?: string;
  recruiterRating?: number; // 1-5
  screeningResults: Record<string, ScreeningResult>; // keyed by jobId
}

export interface ScreeningWeights {
  skills: number; // e.g. 50%
  experience: number; // e.g. 35%
  education: number; // e.g. 15%
}
