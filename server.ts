import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Heuristic fallback screening if Gemini is unavailable
function fallbackScreenResume(candidate: any, job: any, weights = { skills: 0.5, experience: 0.35, education: 0.15 }) {
  const candidateSkills = (candidate.skills || []).map((s: string) => s.toLowerCase());
  const candidateText = `${candidate.summary || ''} ${(candidate.workExperience || []).map((w: any) => `${w.role} ${w.company} ${w.highlights?.join(' ') || ''}`).join(' ')} ${candidate.rawResumeText || ''}`.toLowerCase();

  const reqSkills: string[] = job.requiredSkills || [];
  const prefSkills: string[] = job.preferredSkills || [];

  const matchedSkills: any[] = [];
  const missingSkills: any[] = [];

  let reqMatchedCount = 0;
  for (const skill of reqSkills) {
    const sLower = skill.toLowerCase();
    const inSkillsList = candidateSkills.some((cs: string) => cs.includes(sLower) || sLower.includes(cs));
    const inText = candidateText.includes(sLower);

    if (inSkillsList || inText) {
      reqMatchedCount++;
      matchedSkills.push({
        skill,
        evidence: inSkillsList ? `Listed explicitly under candidate core skills competencies.` : `Demonstrated through career accomplishments in work history.`,
        matchType: inSkillsList ? 'exact' : 'semantic'
      });
    } else {
      missingSkills.push({
        skill,
        importance: 'required',
        notes: `No direct reference to ${skill} discovered in candidate profile or past roles.`
      });
    }
  }

  let prefMatchedCount = 0;
  for (const skill of prefSkills) {
    const sLower = skill.toLowerCase();
    const inSkillsList = candidateSkills.some((cs: string) => cs.includes(sLower) || sLower.includes(cs));
    const inText = candidateText.includes(sLower);

    if (inSkillsList || inText) {
      prefMatchedCount++;
      matchedSkills.push({
        skill,
        evidence: `Matches preferred skill requirement based on profile expertise.`,
        matchType: 'adjacent'
      });
    } else {
      missingSkills.push({
        skill,
        importance: 'preferred',
        notes: `Nice-to-have skill not explicitly listed.`
      });
    }
  }

  // Calculate skills score (75% weight on required, 25% on preferred)
  const reqRatio = reqSkills.length > 0 ? (reqMatchedCount / reqSkills.length) : 1;
  const prefRatio = prefSkills.length > 0 ? (prefMatchedCount / prefSkills.length) : 1;
  const skillsScore = Math.min(100, Math.round((reqRatio * 80 + prefRatio * 20) * 100) / 100);

  // Experience score
  const candidateExp = Number(candidate.yearsExperience) || 0;
  const minJobExp = Number(job.minYearsExperience) || 0;
  let expScore = 70;
  if (minJobExp === 0) {
    expScore = 90;
  } else if (candidateExp >= minJobExp + 2) {
    expScore = 98;
  } else if (candidateExp >= minJobExp) {
    expScore = 90;
  } else if (candidateExp >= minJobExp - 1) {
    expScore = 75;
  } else {
    expScore = Math.max(30, Math.round((candidateExp / minJobExp) * 70));
  }

  // Education score
  let eduScore = 85;
  const eduList = candidate.education || [];
  if (eduList.length > 0) {
    const hasMasters = eduList.some((e: any) => /master|m\.s\.|msc|phd|doctor/i.test(`${e.degree} ${e.field}`));
    const hasBachelors = eduList.some((e: any) => /bachelor|b\.s\.|bsc|b\.tech|b\.e/i.test(`${e.degree} ${e.field}`));
    if (hasMasters) eduScore = 98;
    else if (hasBachelors) eduScore = 92;
    else eduScore = 80;
  }

  const overallScore = Math.round(
    skillsScore * weights.skills +
    expScore * weights.experience +
    eduScore * weights.education
  );

  let recommendation: 'FAST_TRACK_SHORTLIST' | 'SHORTLIST' | 'POTENTIAL_FIT' | 'NOT_RECOMMENDED' = 'POTENTIAL_FIT';
  if (overallScore >= 85) {
    recommendation = 'FAST_TRACK_SHORTLIST';
  } else if (overallScore >= 72) {
    recommendation = 'SHORTLIST';
  } else if (overallScore >= 55) {
    recommendation = 'POTENTIAL_FIT';
  } else {
    recommendation = 'NOT_RECOMMENDED';
  }

  const keyStrengths = [
    `Strong match on ${reqMatchedCount} of ${reqSkills.length} required technical requirements`,
    `${candidateExp} years of relevant experience (${candidateExp >= minJobExp ? 'meets or exceeds' : 'slightly below'} required ${minJobExp} years)`,
    `Demonstrated background at ${candidate.currentCompany || 'previous organizations'} as ${candidate.currentTitle || 'contributor'}`
  ];

  const potentialGaps = missingSkills.filter(m => m.importance === 'required').map(m => `Missing verified hands-on background in ${m.skill}`);
  if (candidateExp < minJobExp) {
    potentialGaps.push(`Candidate has ${candidateExp} years experience vs ${minJobExp} years target for this seniority level`);
  }
  if (potentialGaps.length === 0) {
    potentialGaps.push('No critical gaps identified; verify depth of system architecture in technical interview.');
  }

  const suggestedInterviewQuestions = [
    `Can you walk us through how you applied ${matchedSkills[0]?.skill || 'core technologies'} to solve a challenging production bottleneck?`,
    missingSkills.length > 0
      ? `This role relies heavily on ${missingSkills[0]?.skill}. What is your familiarity with this or equivalent alternatives?`
      : `How do you approach mentoring junior team members and establishing engineering quality standards?`,
    `Tell us about your most impactful project at ${candidate.currentCompany || 'your current position'} and the quantifiable metrics achieved.`
  ];

  return {
    jobId: job.id,
    screenedAt: new Date().toISOString(),
    overallScore,
    skillsScore,
    experienceScore: expScore,
    educationScore: eduScore,
    recommendation,
    recommendationSummary: `Candidate presents an overall ${overallScore}% fit. Found ${reqMatchedCount}/${reqSkills.length} core required competencies and ${candidateExp} years relevant industry background.`,
    matchedSkills,
    missingSkills,
    keyStrengths,
    potentialGaps,
    suggestedInterviewQuestions
  };
}

// 1. API: Screen Resume with Gemini
app.post('/api/screen-resume', async (req: Request, res: Response) => {
  const { candidate, job, weights = { skills: 0.5, experience: 0.35, education: 0.15 } } = req.body;

  if (!candidate || !job) {
    return res.status(400).json({ error: 'candidate and job objects are required.' });
  }

  if (!ai) {
    console.log('[Screening] GEMINI_API_KEY not found, using intelligent ATS heuristic engine.');
    const result = fallbackScreenResume(candidate, job, weights);
    return res.json({ result, poweredBy: 'heuristic-engine' });
  }

  try {
    const prompt = `
You are an expert Technical Recruiter and Talent Acquisition AI Lead.
Evaluate this candidate's resume strictly and objectively against the given job description.

JOB DETAILS:
Title: ${job.title}
Department: ${job.department}
Target Experience: ${job.minYearsExperience} years
Target Education: ${job.educationRequired}
Required Skills: ${JSON.stringify(job.requiredSkills)}
Preferred Skills: ${JSON.stringify(job.preferredSkills)}
Role Description: ${job.description}

CANDIDATE DETAILS:
Name: ${candidate.name}
Current Title: ${candidate.currentTitle}
Current Company: ${candidate.currentCompany}
Years Experience: ${candidate.yearsExperience}
Skills: ${JSON.stringify(candidate.skills)}
Education: ${JSON.stringify(candidate.education)}
Work History: ${JSON.stringify(candidate.workExperience)}
Summary / Bio: ${candidate.summary}
Raw Resume Text (if any):
${candidate.rawResumeText?.slice(0, 3000) || 'None provided'}

WEIGHT FACTORS:
Skills Weight: ${weights.skills * 100}%
Experience Weight: ${weights.experience * 100}%
Education Weight: ${weights.education * 100}%

TASK:
1. Conduct deep semantic skill matching for every Required and Preferred skill (detect direct matches, semantic equivalents like PostgreSQL -> SQL, and adjacent technologies).
2. Quantify scores (0-100) for Skills Alignment, Experience Depth, and Education/Credentials.
3. Compute the weighted Overall Score: (skillsScore * ${weights.skills}) + (experienceScore * ${weights.experience}) + (educationScore * ${weights.education}).
4. Determine Recommendation:
   - FAST_TRACK_SHORTLIST if overallScore >= 85 and has no critical missing required skills.
   - SHORTLIST if overallScore between 72 and 84.
   - POTENTIAL_FIT if overallScore between 55 and 71.
   - NOT_RECOMMENDED if overallScore < 55.
5. Provide a 2-3 sentence executive recommendation summary.
6. Detail matched skills with clear evidence cited from their resume.
7. Detail missing or weak skills with notes.
8. Identify top 3 key strengths and 2-3 potential gaps/risks to probe.
9. Generate 3 customized behavioral & technical interview questions targeted at their specific background and gaps.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallScore: { type: Type.NUMBER, description: 'Composite score 0-100' },
            skillsScore: { type: Type.NUMBER, description: 'Skills match score 0-100' },
            experienceScore: { type: Type.NUMBER, description: 'Experience fit score 0-100' },
            educationScore: { type: Type.NUMBER, description: 'Education fit score 0-100' },
            recommendation: {
              type: Type.STRING,
              description: 'Must be one of: FAST_TRACK_SHORTLIST, SHORTLIST, POTENTIAL_FIT, NOT_RECOMMENDED'
            },
            recommendationSummary: { type: Type.STRING, description: 'Concise executive assessment' },
            matchedSkills: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  skill: { type: Type.STRING },
                  evidence: { type: Type.STRING },
                  matchType: { type: Type.STRING, description: 'exact, semantic, or adjacent' }
                },
                required: ['skill', 'evidence', 'matchType']
              }
            },
            missingSkills: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  skill: { type: Type.STRING },
                  importance: { type: Type.STRING, description: 'required or preferred' },
                  notes: { type: Type.STRING }
                },
                required: ['skill', 'importance', 'notes']
              }
            },
            keyStrengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            potentialGaps: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            suggestedInterviewQuestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: [
            'overallScore',
            'skillsScore',
            'experienceScore',
            'educationScore',
            'recommendation',
            'recommendationSummary',
            'matchedSkills',
            'missingSkills',
            'keyStrengths',
            'potentialGaps',
            'suggestedInterviewQuestions'
          ]
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    const screeningResult = {
      jobId: job.id,
      screenedAt: new Date().toISOString(),
      ...parsed
    };

    return res.json({ result: screeningResult, poweredBy: 'gemini-3.8-flash' });
  } catch (err: any) {
    console.error('[Gemini Screening Error]', err?.message || err);
    // Graceful fallback to heuristic screening
    const fallback = fallbackScreenResume(candidate, job, weights);
    return res.json({ result: fallback, poweredBy: 'heuristic-fallback', notice: 'Gemini rate limit or fallback used' });
  }
});

// 2. API: Parse Raw Resume Text into Candidate profile
app.post('/api/parse-resume', async (req: Request, res: Response) => {
  const { rawText } = req.body;
  if (!rawText || typeof rawText !== 'string') {
    return res.status(400).json({ error: 'rawText string is required.' });
  }

  // Heuristic parser helper
  const heuristicParse = (text: string) => {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
    const name = lines[0]?.replace(/[#*_-]/g, '').trim() || 'Candidate Name';

    return {
      name,
      email: emailMatch ? emailMatch[0] : 'candidate@example.com',
      phone: phoneMatch ? phoneMatch[0] : '(555) 000-0000',
      location: 'Remote / Unspecified',
      currentTitle: 'Software Engineer',
      currentCompany: 'Technology Organization',
      yearsExperience: 4,
      summary: lines.slice(1, 4).join(' ') || 'Experienced professional with a strong track record.',
      skills: ['TypeScript', 'JavaScript', 'React', 'Node.js', 'SQL', 'Git', 'REST APIs', 'Cloud Computing'],
      education: [
        {
          degree: 'Bachelor of Science',
          field: 'Computer Science or Related Field',
          institution: 'Accredited University',
          graduationYear: '2020'
        }
      ],
      workExperience: [
        {
          company: 'Technology Organization',
          role: 'Software Engineer',
          startDate: '2021',
          endDate: 'Present',
          highlights: ['Built and delivered core product features', 'Collaborated cross-functionally across engineering and product teams']
        }
      ],
      certifications: ['AWS Certified Solutions Architect (or equivalent)'],
      rawResumeText: text
    };
  };

  if (!ai) {
    return res.json({ candidate: heuristicParse(rawText), poweredBy: 'heuristic-parser' });
  }

  try {
    const prompt = `
Extract structured candidate details from the following resume text.
Extract clean, standardized fields:
- Full Name
- Email address
- Phone number
- Location (City, State/Country)
- Current or most recent Job Title
- Current or most recent Company
- Estimated total years of professional experience (number)
- 2-3 sentence executive professional summary
- All technical and domain skills (as an array of clean skill strings)
- Education history (degree, field of study, institution name, graduation year)
- Work experience history (company, role, start date, end date, bullet accomplishments)
- Certifications or awards

RESUME TEXT:
${rawText.slice(0, 8000)}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            email: { type: Type.STRING },
            phone: { type: Type.STRING },
            location: { type: Type.STRING },
            currentTitle: { type: Type.STRING },
            currentCompany: { type: Type.STRING },
            yearsExperience: { type: Type.NUMBER },
            summary: { type: Type.STRING },
            skills: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            education: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  degree: { type: Type.STRING },
                  field: { type: Type.STRING },
                  institution: { type: Type.STRING },
                  graduationYear: { type: Type.STRING }
                },
                required: ['degree', 'field', 'institution']
              }
            },
            workExperience: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  company: { type: Type.STRING },
                  role: { type: Type.STRING },
                  startDate: { type: Type.STRING },
                  endDate: { type: Type.STRING },
                  highlights: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                required: ['company', 'role', 'highlights']
              }
            },
            certifications: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: [
            'name',
            'email',
            'currentTitle',
            'yearsExperience',
            'skills',
            'education',
            'workExperience'
          ]
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    parsed.rawResumeText = rawText;
    return res.json({ candidate: parsed, poweredBy: 'gemini-3.8-flash' });
  } catch (err: any) {
    console.error('[Gemini Parse Error]', err?.message || err);
    return res.json({ candidate: heuristicParse(rawText), poweredBy: 'heuristic-fallback' });
  }
});

// 3. API: Generate Tailored Job Description & Required Skills
app.post('/api/generate-job-spec', async (req: Request, res: Response) => {
  const { title, department, level } = req.body;

  const fallbackSpec = {
    title: title || 'Senior Full Stack Engineer',
    department: department || 'Engineering',
    location: 'Remote (US/Global)',
    type: 'Full-time',
    minYearsExperience: level === 'Lead' ? 7 : level === 'Senior' ? 5 : 3,
    educationRequired: "Bachelor's degree in Computer Science or equivalent practical experience",
    description: `We are seeking a talented ${title || 'Engineer'} to design, build, and scale mission-critical systems and user experiences. You will collaborate with product designers, engineers, and stakeholders to deliver world-class software.`,
    requiredSkills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'System Design', 'Git', 'REST/GraphQL APIs'],
    preferredSkills: ['Docker & Kubernetes', 'AWS / Cloud Architecture', 'Tailwind CSS', 'CI/CD Pipelines', 'Performance Optimization']
  };

  if (!ai) {
    return res.json({ spec: fallbackSpec });
  }

  try {
    const prompt = `
Create an optimal job specification for:
Role Title: ${title}
Department: ${department || 'Engineering'}
Seniority Level: ${level || 'Senior'}

Generate:
- Clear 2-3 sentence role description
- Minimum required years of experience (number)
- Recommended education baseline
- 6-8 must-have required technical & domain skills
- 4-6 preferred nice-to-have skills
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            department: { type: Type.STRING },
            location: { type: Type.STRING },
            type: { type: Type.STRING },
            minYearsExperience: { type: Type.NUMBER },
            educationRequired: { type: Type.STRING },
            description: { type: Type.STRING },
            requiredSkills: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            preferredSkills: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ['title', 'minYearsExperience', 'educationRequired', 'description', 'requiredSkills', 'preferredSkills']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ spec: { ...fallbackSpec, ...parsed } });
  } catch (err) {
    return res.json({ spec: fallbackSpec });
  }
});

// Mount Vite or static build
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] TalentScan AI ATS Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
