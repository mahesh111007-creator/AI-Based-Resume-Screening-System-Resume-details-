import React, { useState, useRef } from 'react';
import { Candidate, JobOpening } from '../types/resume';
import { SAMPLE_RESUME_PRESETS } from '../data/mockData';
import {
  Upload,
  FileText,
  Search,
  Sparkles,
  ExternalLink,
  Trash2,
  CheckCircle,
  Clock,
  ArrowRight,
  PlusCircle,
  FileCode,
  Briefcase
} from 'lucide-react';

interface ResumeDetailsViewProps {
  candidates: Candidate[];
  activeJob: JobOpening;
  onAddCandidate: (candidate: Candidate) => void;
  onDeleteCandidate: (candidateId: string) => void;
  onSelectCandidate: (candidate: Candidate) => void;
  onScreenCandidate: (candidate: Candidate) => void;
  onGoToMatching: () => void;
  screeningCandidateId: string | null;
}

export const ResumeDetailsView: React.FC<ResumeDetailsViewProps> = ({
  candidates,
  activeJob,
  onAddCandidate,
  onDeleteCandidate,
  onSelectCandidate,
  onScreenCandidate,
  onGoToMatching,
  screeningCandidateId
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'all' | 'new' | 'screened' | 'shortlisted'>('all');
  const [isUploading, setIsUploading] = useState(false);
  const [pasteModalOpen, setPasteModalOpen] = useState(false);
  const [pastedResumeText, setPastedResumeText] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter candidates
  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.currentTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.skills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    const isScreened = Boolean(c.screeningResults && c.screeningResults[activeJob.id]);
    if (selectedStatusFilter === 'screened') return isScreened;
    if (selectedStatusFilter === 'new') return !isScreened;
    if (selectedStatusFilter === 'shortlisted') {
      return (
        c.status === 'shortlisted' ||
        c.status === 'interviewing' ||
        c.screeningResults?.[activeJob.id]?.recommendation === 'FAST_TRACK_SHORTLIST' ||
        c.screeningResults?.[activeJob.id]?.recommendation === 'SHORTLIST'
      );
    }
    return true;
  });

  // Handle parsing a raw text resume
  const parseAndAddResume = async (rawText: string) => {
    if (!rawText.trim()) return;
    setIsUploading(true);
    setUploadError(null);

    try {
      const response = await fetch('/api/parse-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText })
      });

      if (!response.ok) {
        throw new Error('Failed to parse resume');
      }

      const data = await response.json();
      const parsed = data.candidate;

      const newCandidate: Candidate = {
        id: `cand-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        name: parsed.name || 'New Applicant',
        email: parsed.email || 'applicant@example.com',
        phone: parsed.phone || '',
        location: parsed.location || 'Remote',
        currentTitle: parsed.currentTitle || 'Professional',
        currentCompany: parsed.currentCompany || 'Industry Experience',
        yearsExperience: Number(parsed.yearsExperience) || 3,
        summary: parsed.summary || 'Extracted resume details ready for screening.',
        skills: parsed.skills || ['Communication', 'Problem Solving'],
        education: parsed.education || [],
        workExperience: parsed.workExperience || [],
        certifications: parsed.certifications || [],
        rawResumeText: rawText,
        parsedAt: new Date().toISOString(),
        status: 'new',
        screeningResults: {}
      };

      onAddCandidate(newCandidate);
      setPasteModalOpen(false);
      setPastedResumeText('');
    } catch (err: any) {
      console.error(err);
      setUploadError('Unable to extract resume text. Please check the text format and try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      if (text) {
        await parseAndAddResume(text);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const loadPresetResume = (presetText: string) => {
    parseAndAddResume(presetText);
  };

  return (
    <div className="space-y-6">
      {/* Step Banner & Context */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 uppercase tracking-wider mb-1">
              <span>Step 1 of 3</span>
              <span aria-hidden="true">·</span>
              <span>Candidate Pool Ingestion</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Resume Ingestion & Detail Extraction
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              Import applicant resumes to parse contact details, technical skill inventories, career timelines, and education. Each parsed profile will be mapped into our AI semantic matching pipeline for{' '}
              <strong className="text-slate-900 font-semibold">{activeJob.title}</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setPasteModalOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <FileCode className="w-4 h-4 text-slate-600" />
              <span>Paste Resume Text</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg transition-colors shadow-xs"
            >
              {isUploading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Parsing with AI...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Upload Resume File</span>
                </>
              )}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".txt,.md,.json,.pdf,.doc,.docx"
              className="hidden"
            />
          </div>
        </div>

        {/* Quick Sample Resume Loader */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span className="font-medium text-slate-700">Quick Test Candidates:</span>
          {SAMPLE_RESUME_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => loadPresetResume(preset.text)}
              disabled={isUploading}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 transition-colors text-slate-700 font-medium"
            >
              <PlusCircle className="w-3 h-3 text-indigo-500" />
              <span>+ Load {preset.title}</span>
            </button>
          ))}
        </div>
      </div>

      {uploadError && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 rounded-lg text-xs">
          {uploadError}
        </div>
      )}

      {/* Roster Controls: Search & Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search candidates by name, current role, or skill..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Segmented Filter Buttons (Clean buttons per constitution) */}
        <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg self-start sm:self-auto text-xs font-medium">
          <button
            onClick={() => setSelectedStatusFilter('all')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              selectedStatusFilter === 'all'
                ? 'bg-white text-slate-900 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({candidates.length})
          </button>
          <button
            onClick={() => setSelectedStatusFilter('new')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              selectedStatusFilter === 'new'
                ? 'bg-white text-slate-900 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Unscreened
          </button>
          <button
            onClick={() => setSelectedStatusFilter('screened')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              selectedStatusFilter === 'screened'
                ? 'bg-white text-slate-900 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Screened
          </button>
          <button
            onClick={() => setSelectedStatusFilter('shortlisted')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              selectedStatusFilter === 'shortlisted'
                ? 'bg-white text-slate-900 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Shortlistable
          </button>
        </div>
      </div>

      {/* Candidate Grid */}
      {filteredCandidates.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-xl p-12 text-center">
          <FileText className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-900">No candidates match your filter</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria, or upload new resumes to begin evaluating talent.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedStatusFilter('all');
            }}
            className="mt-4 px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
          >
            Clear Search & Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCandidates.map((candidate) => {
            const screening = candidate.screeningResults?.[activeJob.id];
            const isScreeningThis = screeningCandidateId === candidate.id;

            return (
              <div
                key={candidate.id}
                className="bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 transition-all flex flex-col justify-between shadow-2xs hover:shadow-xs group"
              >
                <div>
                  {/* Card Header: Candidate Info & Screened Status */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2
                        onClick={() => onSelectCandidate(candidate)}
                        className="font-bold text-slate-900 text-base hover:text-indigo-600 cursor-pointer transition-colors truncate"
                      >
                        {candidate.name}
                      </h2>
                      <p className="text-xs font-medium text-slate-700 truncate mt-0.5">
                        {candidate.currentTitle}
                        {candidate.currentCompany ? ` · ${candidate.currentCompany}` : ''}
                      </p>
                    </div>

                    {/* Unboxed Status (NO PILLS per anti-slop rules) */}
                    {screening ? (
                      <div className="text-right shrink-0">
                        <span className="text-base font-bold text-indigo-600 font-mono">
                          {screening.overallScore}%
                        </span>
                        <div className="text-[10px] text-slate-500 font-medium">Fit Score</div>
                      </div>
                    ) : (
                      <div className="text-right shrink-0">
                        <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Pending</span>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Clean unboxed metadata with typographic separators */}
                  <div className="flex items-center flex-wrap gap-2 text-xs text-slate-500 mt-2.5">
                    <span>{candidate.yearsExperience} yrs experience</span>
                    <span aria-hidden="true">·</span>
                    <span className="truncate max-w-[140px]">{candidate.location}</span>
                    {candidate.education[0] && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="truncate max-w-[150px]">
                          {candidate.education[0].degree}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Candidate Summary */}
                  <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                    {candidate.summary}
                  </p>

                  {/* Extracted Core Skills */}
                  <div className="mt-3.5">
                    <div className="text-[11px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
                      Extracted Skills ({candidate.skills.length})
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {candidate.skills.slice(0, 5).map((skill, sIdx) => {
                        const isReq = activeJob.requiredSkills.some(
                          (rq) => rq.toLowerCase() === skill.toLowerCase()
                        );
                        return (
                          <span
                            key={sIdx}
                            className={`text-xs px-2 py-0.5 rounded font-medium ${
                              isReq
                                ? 'bg-indigo-50 text-indigo-800 border border-indigo-100'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {skill}
                          </span>
                        );
                      })}
                      {candidate.skills.length > 5 && (
                        <span className="text-xs px-1.5 py-0.5 text-slate-400 font-medium">
                          +{candidate.skills.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onSelectCandidate(candidate)}
                      className="text-xs font-semibold text-slate-700 hover:text-slate-900 px-2.5 py-1.5 rounded hover:bg-slate-100 transition-colors inline-flex items-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>
                    <button
                      onClick={() => onDeleteCandidate(candidate.id)}
                      className="text-slate-400 hover:text-rose-600 p-1.5 rounded hover:bg-rose-50 transition-colors"
                      title="Remove candidate"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {screening ? (
                    <button
                      onClick={onGoToMatching}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1.5 rounded-lg transition-colors"
                    >
                      <span>View Match</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => onScreenCandidate(candidate)}
                      disabled={isScreeningThis}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 px-3 py-1.5 rounded-lg transition-colors shadow-xs"
                    >
                      {isScreeningThis ? (
                        <>
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Screening...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
                          <span>Screen with AI</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Paste Resume Modal */}
      {pasteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-base">Paste Raw Resume Text</h3>
              </div>
              <button
                onClick={() => setPasteModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 mt-2">
              Paste the plaintext contents of any resume. Our AI parser will extract the candidate’s name, contact information, role history, education, and technical skills automatically.
            </p>

            <textarea
              rows={12}
              value={pastedResumeText}
              onChange={(e) => setPastedResumeText(e.target.value)}
              placeholder="Paste plain text resume here (e.g. Name, Experience, Education, Technical Skills)..."
              className="w-full mt-3 p-3 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 leading-relaxed"
            />

            <div className="mt-4 flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setPasteModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => parseAndAddResume(pastedResumeText)}
                disabled={!pastedResumeText.trim() || isUploading}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg transition-colors shadow-xs inline-flex items-center gap-2"
              >
                {isUploading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Parsing Profile...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
                    <span>Parse & Ingest Candidate</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
