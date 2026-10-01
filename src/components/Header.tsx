import React from 'react';
import { JobOpening, Candidate } from '../types/resume';
import { Briefcase, Sparkles, Plus, Users, Award, CheckCircle2, ChevronDown } from 'lucide-react';

interface HeaderProps {
  jobs: JobOpening[];
  activeJobId: string;
  onSelectJob: (jobId: string) => void;
  onOpenNewJobModal: () => void;
  candidates: Candidate[];
  activeTab: 'resumes' | 'matching' | 'shortlist';
  onChangeTab: (tab: 'resumes' | 'matching' | 'shortlist') => void;
}

export const Header: React.FC<HeaderProps> = ({
  jobs,
  activeJobId,
  onSelectJob,
  onOpenNewJobModal,
  candidates,
  activeTab,
  onChangeTab,
}) => {
  const activeJob = jobs.find((j) => j.id === activeJobId) || jobs[0];

  // Metrics for active job
  const screenedCandidates = candidates.filter(
    (c) => c.screeningResults && c.screeningResults[activeJobId]
  );
  const shortlistedCandidates = candidates.filter((c) => {
    const res = c.screeningResults?.[activeJobId];
    return (
      c.status === 'shortlisted' ||
      c.status === 'interviewing' ||
      res?.recommendation === 'FAST_TRACK_SHORTLIST' ||
      res?.recommendation === 'SHORTLIST'
    );
  });

  const avgScore =
    screenedCandidates.length > 0
      ? Math.round(
          screenedCandidates.reduce(
            (acc, c) => acc + (c.screeningResults[activeJobId]?.overallScore || 0),
            0
          ) / screenedCandidates.length
        )
      : 0;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      {/* Top Brand & Job Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & App Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-lg tracking-tight">
                  TalentScan AI
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                  ATS Screening
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Resume Ingestion · Semantic Skills Matching · Shortlist Engine
              </p>
            </div>
          </div>

          {/* Active Job Selector Dropdown & New Job Button */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <label htmlFor="job-selector" className="sr-only">
                Select Active Job
              </label>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 hover:border-slate-300 transition-colors">
                <Briefcase className="w-4 h-4 text-slate-500 shrink-0" />
                <select
                  id="job-selector"
                  value={activeJobId}
                  onChange={(e) => onSelectJob(e.target.value)}
                  className="bg-transparent text-sm font-medium text-slate-800 pr-6 focus:outline-hidden cursor-pointer"
                >
                  {jobs.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.title} · {j.department}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 -ml-5 pointer-events-none" />
              </div>
            </div>

            <button
              onClick={onOpenNewJobModal}
              className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Job Req</span>
            </button>
          </div>
        </div>

        {/* Sub-bar: Workflow Navigation Tabs & Live Metrics */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-slate-100 py-2.5 gap-3">
          {/* 3 Step Workflow Navigation */}
          <nav className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg self-start">
            <button
              onClick={() => onChangeTab('resumes')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeTab === 'resumes'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 text-[10px] flex items-center justify-center font-bold">
                1
              </span>
              <span>Resume Details</span>
              <span className="text-[11px] text-slate-400 font-normal">
                ({candidates.length})
              </span>
            </button>

            <button
              onClick={() => onChangeTab('matching')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeTab === 'matching'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 text-[10px] flex items-center justify-center font-bold">
                2
              </span>
              <span>Skills Matching</span>
              <span className="text-[11px] text-slate-400 font-normal">
                ({screenedCandidates.length}/{candidates.length})
              </span>
            </button>

            <button
              onClick={() => onChangeTab('shortlist')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeTab === 'shortlist'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 text-[10px] flex items-center justify-center font-bold">
                3
              </span>
              <span>Shortlist Pipeline</span>
              <span className="text-[11px] text-indigo-600 font-bold">
                ({shortlistedCandidates.length})
              </span>
            </button>
          </nav>

          {/* Active Job Executive Metrics (Rendered as clean unboxed text) */}
          <div className="flex items-center gap-4 text-xs text-slate-500 overflow-x-auto py-0.5">
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold text-slate-800">{candidates.length}</span>
              <span>Candidates</span>
            </div>
            <span className="text-slate-300" aria-hidden="true">·</span>
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span className="font-semibold text-slate-800">{screenedCandidates.length}</span>
              <span>Screened</span>
            </div>
            <span className="text-slate-300" aria-hidden="true">·</span>
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <Award className="w-3.5 h-3.5 text-indigo-600" />
              <span className="font-semibold text-slate-800">{shortlistedCandidates.length}</span>
              <span>Shortlisted</span>
            </div>
            {avgScore > 0 && (
              <>
                <span className="text-slate-300" aria-hidden="true">·</span>
                <div className="flex items-center gap-1.5 whitespace-nowrap">
                  <span className="text-slate-500">Avg Fit:</span>
                  <span className="font-bold text-indigo-700">{avgScore}%</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
