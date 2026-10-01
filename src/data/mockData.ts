import { Candidate, JobOpening } from '../types/resume';

export const INITIAL_JOB_OPENINGS: JobOpening[] = [
  {
    id: 'job-1',
    title: 'Senior Full-Stack Engineer',
    department: 'Core Product Engineering',
    location: 'San Francisco, CA (Hybrid / Remote)',
    type: 'Full-time',
    minYearsExperience: 5,
    educationRequired: "Bachelor's degree in Computer Science, Software Engineering, or equivalent experience",
    description: 'We are seeking an experienced Senior Full-Stack Engineer to architect, build, and scale our customer-facing web applications and distributed backend microservices. You will collaborate closely with product management and design teams to deliver high-performance, resilient experiences for millions of users.',
    requiredSkills: [
      'TypeScript',
      'React',
      'Node.js',
      'PostgreSQL',
      'REST & GraphQL APIs',
      'System Architecture',
      'Git & CI/CD'
    ],
    preferredSkills: [
      'Docker & Kubernetes',
      'AWS / GCP Cloud',
      'Tailwind CSS',
      'Redis & Caching',
      'High-throughput Distributed Systems'
    ],
    createdAt: '2026-09-15'
  },
  {
    id: 'job-2',
    title: 'Lead AI & Machine Learning Engineer',
    department: 'Applied AI & Research',
    location: 'New York, NY (Hybrid)',
    type: 'Full-time',
    minYearsExperience: 6,
    educationRequired: "Master's or Ph.D. in Computer Science, Machine Learning, Data Science, or related quantitative field",
    description: 'Lead the design, training, fine-tuning, and deployment of foundational language models and computer vision pipelines. You will take breakthrough generative AI models from prototype to low-latency production microservices.',
    requiredSkills: [
      'Python',
      'PyTorch / TensorFlow',
      'LLM Fine-tuning & Prompt Architecture',
      'Vector Databases & RAG',
      'MLOps & Model Deployment',
      'Transformer Architectures'
    ],
    preferredSkills: [
      'C++ / CUDA Optimization',
      'Distributed Training (Ray / DeepSpeed)',
      'Triton Inference Server',
      'Cloud ML (Vertex AI / AWS SageMaker)'
    ],
    createdAt: '2026-09-20'
  },
  {
    id: 'job-3',
    title: 'Technical Product Manager',
    department: 'Platform & Infrastructure',
    location: 'Seattle, WA (Remote)',
    type: 'Full-time',
    minYearsExperience: 4,
    educationRequired: "Bachelor's degree in Engineering, Business, or related discipline",
    description: 'Own the product roadmap for our developer APIs, SDKs, and platform ecosystem. Bridge business strategy with deep engineering requirements, defining metrics, driving agile sprints, and prioritizing developer ergonomics.',
    requiredSkills: [
      'Product Strategy & Roadmapping',
      'Developer APIs & SDKs',
      'Agile / Scrum Methodologies',
      'Data Analytics & SQL',
      'User Research & PRD Writing',
      'Cross-functional Leadership'
    ],
    preferredSkills: [
      'Prior Software Engineering experience',
      'SaaS Metrics & Monetization',
      'A/B Testing & Experimentation',
      'Developer Relations'
    ],
    createdAt: '2026-09-25'
  }
];

export const INITIAL_CANDIDATES: Candidate[] = [
  {
    id: 'cand-1',
    name: 'Elena Rostova',
    email: 'elena.rostova@techmail.io',
    phone: '(415) 892-4412',
    location: 'San Francisco, CA',
    currentTitle: 'Senior Full-Stack Engineer',
    currentCompany: 'Veloce Data Labs',
    yearsExperience: 6,
    summary: 'Senior Full-Stack Engineer with 6+ years of expertise designing modern React/TypeScript frontends and distributed Node.js/PostgreSQL microservices. Experienced in cloud containerization (Docker, AWS) and GraphQL API gateways processing 25M+ daily requests.',
    skills: [
      'TypeScript',
      'React',
      'Node.js',
      'PostgreSQL',
      'GraphQL',
      'REST APIs',
      'AWS (ECS, S3, RDS)',
      'Docker',
      'Redis',
      'Git',
      'Tailwind CSS',
      'Jest',
      'System Architecture'
    ],
    education: [
      {
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        institution: 'University of California, Berkeley',
        graduationYear: '2020'
      }
    ],
    workExperience: [
      {
        company: 'Veloce Data Labs',
        role: 'Senior Full-Stack Engineer',
        startDate: '2022-04',
        endDate: 'Present',
        highlights: [
          'Led end-to-end architecture of real-time collaborative workspace used by 120,000+ active enterprise users.',
          'Migrated legacy Express monolith into modular TypeScript microservices, reducing p99 latency by 38%.',
          'Spearheaded PostgreSQL schema partitioning and query optimizations, cutting database costs by $45,000/year.'
        ]
      },
      {
        company: 'Apex Cloud Solutions',
        role: 'Software Engineer',
        startDate: '2020-06',
        endDate: '2022-03',
        highlights: [
          'Built responsive component libraries in React and TypeScript with 100% test coverage.',
          'Implemented OAuth2 authentication workflows and rate-limited RESTful APIs.'
        ]
      }
    ],
    certifications: ['AWS Certified Solutions Architect – Associate', 'Meta Certified Frontend Specialist'],
    rawResumeText: `Elena Rostova
San Francisco, CA | (415) 892-4412 | elena.rostova@techmail.io

PROFESSIONAL SUMMARY
Senior Full-Stack Engineer with 6+ years of experience building scalable web applications. Strong track record in TypeScript, React, Node.js, and PostgreSQL database performance tuning.

EXPERIENCE
Veloce Data Labs — Senior Full-Stack Engineer (2022 - Present)
- Led end-to-end architecture of real-time collaborative workspace used by 120,000+ active enterprise users.
- Migrated legacy Express monolith into modular TypeScript microservices, reducing p99 latency by 38%.
- Optimized PostgreSQL database schema partitioning, saving $45k annually in cloud compute.

Apex Cloud Solutions — Software Engineer (2020 - 2022)
- Built enterprise React/TypeScript dashboards and integrated GraphQL endpoints.
- Designed automated CI/CD deployment pipelines using GitHub Actions and Docker.

EDUCATION
B.S. in Computer Science — UC Berkeley (2020)

SKILLS
TypeScript, React, Node.js, PostgreSQL, Docker, AWS, GraphQL, Redis, Git, Tailwind CSS`,
    parsedAt: '2026-09-28T10:00:00Z',
    status: 'shortlisted',
    recruiterNotes: 'Exceptional full-stack candidate with direct expertise across our entire tech stack. Great communication and proven system optimization metrics.',
    recruiterRating: 5,
    screeningResults: {
      'job-1': {
        jobId: 'job-1',
        screenedAt: '2026-09-28T10:05:00Z',
        overallScore: 94,
        skillsScore: 96,
        experienceScore: 95,
        educationScore: 92,
        recommendation: 'FAST_TRACK_SHORTLIST',
        recommendationSummary: 'Outstanding match. Elena demonstrates mastery in TypeScript, React, Node.js, PostgreSQL, and AWS with 6 years of proven production experience.',
        matchedSkills: [
          { skill: 'TypeScript', evidence: 'Primary language across 6+ years of production experience at Veloce and Apex.', matchType: 'exact' },
          { skill: 'React', evidence: 'Architected collaborative UI dashboards and enterprise design systems.', matchType: 'exact' },
          { skill: 'Node.js', evidence: 'Re-architected monolithic services into high-throughput TypeScript microservices.', matchType: 'exact' },
          { skill: 'PostgreSQL', evidence: 'Direct experience in query optimization, partitioning, and relational modeling.', matchType: 'exact' },
          { skill: 'REST & GraphQL APIs', evidence: 'Designed enterprise GraphQL gateways serving 25M+ requests.', matchType: 'exact' },
          { skill: 'Docker & Kubernetes', evidence: 'Extensive containerization experience in production AWS ECS environments.', matchType: 'semantic' },
          { skill: 'AWS / GCP Cloud', evidence: 'Holds AWS Certified Solutions Architect credential.', matchType: 'exact' }
        ],
        missingSkills: [],
        keyStrengths: [
          'Full-stack mastery across our exact stack: TypeScript, React, Node.js, and PostgreSQL.',
          'Documented impact on performance: 38% latency reduction and $45k cloud cost savings.',
          'Strong cloud infrastructure background with AWS certification.'
        ],
        potentialGaps: [
          'Verify hands-on Kubernetes orchestration complexity versus managed ECS.'
        ],
        suggestedInterviewQuestions: [
          'Can you describe the architectural decisions you made when migrating the Express monolith to microservices at Veloce Data Labs?',
          'How did you structure PostgreSQL partitioning to handle the increase in active enterprise users?',
          'Walk us through how you manage state and real-time synchronization in complex React applications.'
        ]
      }
    }
  },
  {
    id: 'cand-2',
    name: 'Marcus Vance',
    email: 'marcus.vance@devfrontier.com',
    phone: '(206) 555-0193',
    location: 'Seattle, WA',
    currentTitle: 'Backend Engineer',
    currentCompany: 'OmniStream Cloud',
    yearsExperience: 4,
    summary: 'Backend-focused software engineer with 4 years of experience building high-concurrency microservices in Go, Node.js, and PostgreSQL. Familiar with React on the frontend but predominantly backend and distributed caching specialist.',
    skills: [
      'Node.js',
      'Go (Golang)',
      'PostgreSQL',
      'Redis',
      'Docker',
      'Kafka',
      'REST APIs',
      'Git',
      'Linux',
      'Kubernetes'
    ],
    education: [
      {
        degree: 'Bachelor of Science',
        field: 'Software Engineering',
        institution: 'University of Washington',
        graduationYear: '2022'
      }
    ],
    workExperience: [
      {
        company: 'OmniStream Cloud',
        role: 'Backend Engineer',
        startDate: '2022-07',
        endDate: 'Present',
        highlights: [
          'Architected streaming data pipeline in Go and Kafka ingesting 500,000 events/sec.',
          'Maintained Node.js microservices and built database connection pooling algorithms in PostgreSQL.'
        ]
      }
    ],
    certifications: ['Docker Certified Associate'],
    rawResumeText: `Marcus Vance
Seattle, WA | marcus.vance@devfrontier.com

SUMMARY
Backend engineer specializing in distributed systems, Go, Node.js, Kafka, and PostgreSQL.

EXPERIENCE
OmniStream Cloud — Backend Engineer (2022 - Present)
- Designed streaming ingest pipelines handling 500k events/sec.
- Enhanced PostgreSQL query throughput by 45% using Redis caching layers.

SKILLS
Node.js, Go, PostgreSQL, Redis, Kafka, Docker, Kubernetes, Linux, Git`,
    parsedAt: '2026-09-28T11:00:00Z',
    status: 'screening',
    screeningResults: {
      'job-1': {
        jobId: 'job-1',
        screenedAt: '2026-09-28T11:15:00Z',
        overallScore: 76,
        skillsScore: 74,
        experienceScore: 78,
        educationScore: 88,
        recommendation: 'SHORTLIST',
        recommendationSummary: 'Solid backend engineer with strong Node.js, PostgreSQL, and distributed systems foundation, though relatively light on modern React and TypeScript frontend requirements.',
        matchedSkills: [
          { skill: 'Node.js', evidence: 'Extensive hands-on backend microservice development.', matchType: 'exact' },
          { skill: 'PostgreSQL', evidence: 'Optimized query throughput with Redis caching.', matchType: 'exact' },
          { skill: 'Docker & Kubernetes', evidence: 'Docker Certified Associate and active Kubernetes experience.', matchType: 'exact' },
          { skill: 'REST & GraphQL APIs', evidence: 'Built high-throughput REST APIs.', matchType: 'semantic' }
        ],
        missingSkills: [
          { skill: 'React', importance: 'required', notes: 'Resume shows no documented React or frontend UI production experience.' },
          { skill: 'TypeScript', importance: 'required', notes: 'Primarily uses Go and standard JavaScript.' }
        ],
        keyStrengths: [
          'Deep distributed systems, streaming, and database performance experience.',
          'Strong DevOps familiarity (Docker, Kubernetes, Kafka).',
          'High performance orientation with verifiable event pipeline metrics.'
        ],
        potentialGaps: [
          'Lack of demonstrable React / frontend experience for a full-stack role.',
          'Total experience is 4 years vs 5 years target.'
        ],
        suggestedInterviewQuestions: [
          'Given your heavy backend background in Go and Node, how comfortable are you picking up modern React and client-side state architecture?',
          'Can you walk us through the caching strategy you designed with Redis and PostgreSQL?',
          'What trade-offs do you consider when choosing between relational data modeling and event streams?'
        ]
      }
    }
  },
  {
    id: 'cand-3',
    name: 'Dr. Aris Thorne',
    email: 'aris.thorne@deepcognition.ai',
    phone: '(617) 440-9281',
    location: 'Boston, MA',
    currentTitle: 'Senior Machine Learning Scientist',
    currentCompany: 'Syntropic Intelligence',
    yearsExperience: 7,
    summary: 'Ph.D. in Computer Science with 7 years of specialized experience in LLM alignment, RAG pipelines, and PyTorch deep learning architectures. Published author in NeurIPS and CVPR on parameter-efficient fine-tuning (LoRA, QLoRA).',
    skills: [
      'Python',
      'PyTorch',
      'LLM Fine-tuning & Prompt Architecture',
      'Vector Databases & RAG',
      'MLOps & Model Deployment',
      'Transformer Architectures',
      'DeepSpeed',
      'CUDA / C++',
      'HuggingFace',
      'Docker'
    ],
    education: [
      {
        degree: 'Ph.D.',
        field: 'Computer Science (Machine Learning Focus)',
        institution: 'Massachusetts Institute of Technology',
        graduationYear: '2019'
      },
      {
        degree: 'Bachelor of Science',
        field: 'Computer Science & Mathematics',
        institution: 'Carnegie Mellon University',
        graduationYear: '2015'
      }
    ],
    workExperience: [
      {
        company: 'Syntropic Intelligence',
        role: 'Senior Machine Learning Scientist',
        startDate: '2021-08',
        endDate: 'Present',
        highlights: [
          'Trained and aligned proprietary 14B enterprise LLM with domain-specific instruction tuning and RLHF.',
          'Built enterprise RAG search platform using Qdrant vector database with sub-80ms semantic retrieval.',
          'Decreased inference memory consumption by 65% through 4-bit quantization and FlashAttention-2 kernels.'
        ]
      },
      {
        company: 'Boston AI Labs',
        role: 'Research Scientist',
        startDate: '2019-06',
        endDate: '2021-07',
        highlights: [
          'Developed novel multimodal attention models for automated document analysis.',
          'Published 3 papers at NeurIPS and ICLR conferences.'
        ]
      }
    ],
    certifications: ['NVIDIA Deep Learning Institute Certified'],
    rawResumeText: `Dr. Aris Thorne | Boston, MA | aris.thorne@deepcognition.ai
PH.D. in Computer Science (MIT) | 7 Years AI/ML Experience

SUMMARY
Senior ML Scientist specializing in LLMs, PyTorch, RAG architectures, and model acceleration.

WORK HISTORY
Syntropic Intelligence — Senior Machine Learning Scientist (2021 - Present)
- Led development of 14B parameter enterprise LLM with LoRA fine-tuning and RLHF.
- Built low-latency RAG system with Qdrant vector store and hybrid BM25 + dense embedding reranking.
- Cut GPU inference compute by 65% via 4-bit quantization and FlashAttention-2.

EDUCATION
Ph.D. in Computer Science — MIT (2019)
B.S. in Computer Science & Math — Carnegie Mellon (2015)

SKILLS
Python, PyTorch, Transformers, LLMs, Vector DBs, RAG, MLOps, CUDA, DeepSpeed`,
    parsedAt: '2026-09-28T12:00:00Z',
    status: 'shortlisted',
    recruiterNotes: 'Top-tier AI researcher with rare combination of theoretical rigor (MIT PhD) and production MLOps deployment.',
    recruiterRating: 5,
    screeningResults: {
      'job-2': {
        jobId: 'job-2',
        screenedAt: '2026-09-28T12:05:00Z',
        overallScore: 97,
        skillsScore: 98,
        experienceScore: 96,
        educationScore: 99,
        recommendation: 'FAST_TRACK_SHORTLIST',
        recommendationSummary: 'Ideal candidate for Lead AI Engineer. MIT PhD with direct production experience in LLM fine-tuning, RAG, CUDA acceleration, and high-impact publications.',
        matchedSkills: [
          { skill: 'Python', evidence: 'Primary research and production language for 10+ years.', matchType: 'exact' },
          { skill: 'PyTorch / TensorFlow', evidence: 'Built custom Transformer layers and quantization kernels in PyTorch.', matchType: 'exact' },
          { skill: 'LLM Fine-tuning & Prompt Architecture', evidence: 'Led fine-tuning of 14B models using LoRA and RLHF.', matchType: 'exact' },
          { skill: 'Vector Databases & RAG', evidence: 'Built production retrieval system with Qdrant and hybrid reranking.', matchType: 'exact' },
          { skill: 'MLOps & Model Deployment', evidence: 'Deployed sub-80ms models to production with 65% memory reduction.', matchType: 'exact' },
          { skill: 'Transformer Architectures', evidence: 'Published research on attention mechanisms in NeurIPS.', matchType: 'exact' },
          { skill: 'C++ / CUDA Optimization', evidence: 'FlashAttention-2 and custom kernel implementations.', matchType: 'exact' }
        ],
        missingSkills: [],
        keyStrengths: [
          'World-class academic credentials (MIT PhD) combined with production enterprise deployments.',
          'Direct experience in cutting-edge LLM optimization: quantization, LoRA, and FlashAttention-2.',
          'Proven ability to lower inference costs by 65% while maintaining model benchmarks.'
        ],
        potentialGaps: [
          'Assess people management versus technical leadership preference.'
        ],
        suggestedInterviewQuestions: [
          'How did you structure the data mixture and evaluation benchmarks when fine-tuning the 14B model?',
          'What were the primary failure modes in your RAG pipeline and how did hybrid search address them?',
          'How do you approach team mentorship and balancing research exploration with tight product ship deadlines?'
        ]
      }
    }
  },
  {
    id: 'cand-4',
    name: 'Sofia Chen',
    email: 'sofia.chen@productpulse.org',
    phone: '(408) 321-7789',
    location: 'San Jose, CA',
    currentTitle: 'Product Manager',
    currentCompany: 'CloudNexus Inc.',
    yearsExperience: 5,
    summary: 'Technical Product Manager with 5 years experience scaling developer APIs, analytics dashboards, and B2B SaaS integrations. Proven success increasing API developer adoption by 140% and running cross-functional agile squads.',
    skills: [
      'Product Strategy & Roadmapping',
      'Developer APIs & SDKs',
      'Agile / Scrum Methodologies',
      'Data Analytics & SQL',
      'User Research & PRD Writing',
      'Cross-functional Leadership',
      'Postman',
      'Figma',
      'Jira',
      'SaaS Metrics & Monetization'
    ],
    education: [
      {
        degree: 'Bachelor of Science',
        field: 'Informatics & Business Management',
        institution: 'San Jose State University',
        graduationYear: '2021'
      }
    ],
    workExperience: [
      {
        company: 'CloudNexus Inc.',
        role: 'Product Manager, Developer Ecosystem',
        startDate: '2022-01',
        endDate: 'Present',
        highlights: [
          'Spearheaded redesign of Developer API documentation and interactive sandbox, increasing active API keys by 140%.',
          'Managed backlog and sprint rituals for 12 engineers across US and Europe timezones.',
          'Synthesized telemetry data in SQL to identify developer drop-off bottlenecks.'
        ]
      }
    ],
    certifications: ['Certified Scrum Product Owner (CSPO)'],
    rawResumeText: `Sofia Chen
San Jose, CA | sofia.chen@productpulse.org

EXPERIENCE
CloudNexus Inc. — Product Manager (2022 - Present)
- Managed developer platform APIs and SDKs. Grew developer usage by 140%.
- Authored detailed PRDs, user stories, and wireframes in Figma.
- Analyzed API usage in SQL and Mixpanel.

EDUCATION
B.S. in Informatics — San Jose State University (2021)

SKILLS
Product Strategy, APIs, SQL, Agile/Scrum, User Research, Jira, Figma`,
    parsedAt: '2026-09-28T13:00:00Z',
    status: 'shortlisted',
    screeningResults: {
      'job-3': {
        jobId: 'job-3',
        screenedAt: '2026-09-28T13:10:00Z',
        overallScore: 91,
        skillsScore: 93,
        experienceScore: 90,
        educationScore: 89,
        recommendation: 'FAST_TRACK_SHORTLIST',
        recommendationSummary: 'Superb match for Technical Product Manager. Strong background in developer APIs, SQL analytics, agile leadership, and demonstrated 140% developer ecosystem growth.',
        matchedSkills: [
          { skill: 'Product Strategy & Roadmapping', evidence: 'Owned developer platform roadmap at CloudNexus.', matchType: 'exact' },
          { skill: 'Developer APIs & SDKs', evidence: 'Redesigned API sandbox and drove 140% developer adoption.', matchType: 'exact' },
          { skill: 'Agile / Scrum Methodologies', evidence: 'CSPO certified, led 12-engineer sprint squads.', matchType: 'exact' },
          { skill: 'Data Analytics & SQL', evidence: 'Directly queried telemetry to locate drop-offs.', matchType: 'exact' },
          { skill: 'User Research & PRD Writing', evidence: 'Authored comprehensive PRDs and user journeys.', matchType: 'exact' },
          { skill: 'Cross-functional Leadership', evidence: 'Coordinated global teams across engineering, UX, and marketing.', matchType: 'exact' }
        ],
        missingSkills: [],
        keyStrengths: [
          'Direct domain expertise in Developer Platforms and API ecosystems.',
          'Data-driven mindset with hands-on SQL and telemetry skills.',
          'Certified Scrum Product Owner with experience managing distributed squads.'
        ],
        potentialGaps: [
          'Verify technical depth on API versioning and backward compatibility breaking changes.'
        ],
        suggestedInterviewQuestions: [
          'How do you manage deprecation and breaking changes for developer APIs without disrupting existing customers?',
          'Walk us through a time you used SQL telemetry to uncover an unexpected friction point in your developer onboarding.',
          'How do you resolve prioritization conflicts between technical debt reduction and new feature requests?'
        ]
      }
    }
  },
  {
    id: 'cand-5',
    name: 'David K. O’Reilly',
    email: 'david.oreilly@legacycode.net',
    phone: '(312) 670-1192',
    location: 'Chicago, IL',
    currentTitle: 'Junior Web Developer',
    currentCompany: 'Midwest Solutions Group',
    yearsExperience: 2,
    summary: 'Junior Web Developer with 2 years of experience working with HTML5, CSS3, jQuery, and basic PHP/MySQL backends. Enthusiastic about expanding into modern TypeScript, React, and cloud architectures.',
    skills: [
      'HTML5',
      'CSS3',
      'JavaScript (ES5/ES6)',
      'jQuery',
      'PHP',
      'MySQL',
      'WordPress',
      'Git Basics'
    ],
    education: [
      {
        degree: 'Associate Degree',
        field: 'Web Development',
        institution: 'City Colleges of Chicago',
        graduationYear: '2024'
      }
    ],
    workExperience: [
      {
        company: 'Midwest Solutions Group',
        role: 'Junior Web Developer',
        startDate: '2024-03',
        endDate: 'Present',
        highlights: [
          'Maintained client WordPress sites and custom PHP theme templates.',
          'Assisted senior developers with frontend bug fixes and styling tweaks.'
        ]
      }
    ],
    certifications: [],
    rawResumeText: `David K. O'Reilly
Chicago, IL | david.oreilly@legacycode.net

Junior Web Developer with 2 years experience in PHP, MySQL, JavaScript, HTML/CSS.

Midwest Solutions Group (2024 - Present)
- Fixed frontend bugs on client portals.
- Assisted with database queries in MySQL.

Education: Associate Degree in Web Dev (2024)`,
    parsedAt: '2026-09-28T14:00:00Z',
    status: 'new',
    screeningResults: {}
  }
];

export const SAMPLE_RESUME_PRESETS = [
  {
    title: 'Senior Frontend & React Specialist',
    text: `Samantha Wu
Austin, TX | samantha.wu@reactdev.io | (512) 402-9981 | linkedin.com/in/samanthawu

PROFESSIONAL SUMMARY
Senior Frontend Engineer with 7 years of specialized expertise in modern React, TypeScript, Next.js, and design system architecture. Passionate about web performance optimization, accessible UI (WCAG AAA), and reactive state management.

PROFESSIONAL EXPERIENCE
Hyperion Software — Staff Frontend Engineer (2022 - Present)
- Led frontend architecture of high-scale dashboard rendering 50,000 live data points using WebGL and Virtualized Canvas in React.
- Standardized TypeScript design system adopted across 8 product teams, decreasing UI bug reports by 42%.
- Improved Core Web Vitals across the platform, driving Largest Contentful Paint (LCP) from 3.2s to 1.1s.

CloudScale Technologies — Senior Software Engineer (2019 - 2022)
- Built customer portal using Next.js, React, TypeScript, Tailwind CSS, and GraphQL.
- Authored comprehensive end-to-end Cypress test suites and Jest component tests.

EDUCATION
B.S. in Computer Science — University of Texas at Austin (2019)

SKILLS & CERTIFICATIONS
React, TypeScript, Next.js, JavaScript, Tailwind CSS, GraphQL, REST APIs, Redux Toolkit, Webpack, Vite, Git, Jest, Cypress, System Architecture`
  },
  {
    title: 'DevOps & Site Reliability Engineer',
    text: `Kofi Mensah
Denver, CO | kofi.mensah@cloudops.tech | (720) 334-1182

SUMMARY
Senior SRE and Cloud Architect with 8 years of experience building resilient Kubernetes clusters, Terraform IaC, and zero-downtime CI/CD deployment pipelines on AWS and GCP.

WORK EXPERIENCE
Apex Distributed Systems — Lead SRE (2021 - Present)
- Managed multi-region Kubernetes (EKS) infrastructure supporting 99.995% uptime across 8 global regions.
- Automated complete cloud infrastructure provisioning via Terraform and GitOps (ArgoCD).
- Implemented Datadog and Prometheus/Grafana observability stack, reducing Mean Time to Detection (MTTD) from 18m to 3m.

Stratos Cloud — Cloud DevOps Engineer (2018 - 2021)
- Migrated 40+ legacy on-prem services to Docker containerized microservices on AWS.
- Configured PostgreSQL multi-AZ replication, failover testing, and automated backup strategies.

EDUCATION
B.S. in Information Systems — Colorado State University (2018)

SKILLS
Kubernetes, Docker, AWS, GCP, Terraform, CI/CD, GitOps, Prometheus, Grafana, Linux, Python, Bash, PostgreSQL, Redis`
  }
];
