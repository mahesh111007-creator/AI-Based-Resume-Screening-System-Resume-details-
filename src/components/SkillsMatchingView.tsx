import React, { useState } from 'react';
import { Candidate, JobOpening, ScreeningWeights, ScreeningResult } from '../types/resume';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sliders,
  ChevronRight,
  HelpCircle,
  Briefcase,
  GraduationCap,
  Award,
  Layers,
  ArrowRight
} from 'lucide-react';

interface SkillsMatchingViewProps {
  candidates: Candidate[];
  activeJob: JobOpening;
  weights: ScreeningWeights;
  onUpdateWeights: (newWeights: ScreeningWeights) => void;
  onScreenCandidate: (candidate: Candidate) => Promise<void>;
  onBatchScreen: () => Promise<void>;
  isBatchScreening: boolean;
  batchProgress: { current: number; total: number } | null;
  onSelectCandidate: (candidate: Candidate) => void;
  onUpdateCandidateStatus: (candidateId: string, status: any) => void;
  onGoToShortlist: () => void;
}

export const SkillsMatchingView: React.FC<SkillsMatchingViewProps> = ({
  candidates,
  activeJob,
  weights,
  onUpdateWeights,
  onScreenCandidate,
  onBatchScreen,
  isBatchScreening,
  batchProgress,
  onSelectCandidate,
  onUpdateCandidateStatus,
  onGoToShortlist,
}) => {
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>(
    candidates[0]?.id || ''
  );
  const [showWeightSliders, setShowWeightSliders] = useState(false);

  // Selected candidate object
  const activeCandidate =
    candidates.find((c) => c.id === selectedCandidateId) || candidates[0];

  const screening: ScreeningResult | undefined =
    activeCandidate?.screeningResults?.[activeJob.id];

  const screenedCount = candidates.filter(
    (c) => c.screeningResults && c.screeningResults[activeJob.id]
  ).length;

  return (
    <div className="space-y-6">
      {/* Step Banner & Role Requirements Summary */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 uppercase tracking-wider mb-1">
              <span>Step 2 of 3</span>
              <span aria-hidden="true">·</span>
              <span>Semantic Alignment</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Semantic Skills Matching & Fit Scoring
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              Evaluating candidate resumes against required and preferred capabilities for{' '}
              <strong className="text-slate-900 font-semibold">{activeJob.title}</strong>. Our
              Gemini model detects direct keywords, semantic equivalents (e.g. PostgreSQL ↔ SQL,
              Docker ↔ Containerization), and extracts verifiable resume evidence.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setShowWeightSliders(!showWeightSliders)}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <Sliders className="w-4 h-4 text-slate-600" />
              <span>
                {showWeightSliders ? 'Hide Weights' : 'Adjust Match Weights'}
              </span>
            </button>

            <button
              onClick={onBatchScreen}
              disabled={isBatchScreening}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 rounded-lg transition-colors shadow-xs"
            >
              {isBatchScreening ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>
                    Screening Pool ({batchProgress?.current || 0}/
                    {batchProgress?.total || candidates.length})...
                  </span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-indigo-300" />
                  <span>
                    {screenedCount === candidates.length
                      ? 'Re-screen All Candidates'
                      : `Screen All (${candidates.length - screenedCount} unscreened)`}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Scoring Weights Drawer */}
        {showWeightSliders && (
          <div className="mt-5 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Screening Formula Weights
              </h4>
              <span className="text-xs text-slate-500">
                Total must equal 100% (Current:{' '}
                {Math.round((weights.skills + weights.experience + weights.education) * 100)}%)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Skills Alignment</span>
                  <span>{Math.round(weights.skills * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="0.8"
                  step="0.05"
                  value={weights.skills}
                  onChange={(e) =>
                    onUpdateWeights({ ...weights, skills: parseFloat(e.target.value) })
                  }
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Experience Depth</span>
                  <span>{Math.round(weights.experience * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="0.8"
                  step="0.05"
                  value={weights.experience}
                  onChange={(e) =>
                    onUpdateWeights({ ...weights, experience: parseFloat(e.target.value) })
                  }
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Education & Domain</span>
                  <span>{Math.round(weights.education * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.5"
                  step="0.05"
                  value={weights.education}
                  onChange={(e) =>
                    onUpdateWeights({ ...weights, education: parseFloat(e.target.value) })
                  }
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* Required & Preferred Skills Baseline */}
        <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-600" />
              <span>Required Core Competencies ({activeJob.requiredSkills.length})</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {activeJob.requiredSkills.map((req, rIdx) => (
                <span
                  key={rIdx}
                  className="text-xs px-2.5 py-1 rounded bg-indigo-50 text-indigo-900 border border-indigo-100 font-medium"
                >
                  {req}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              <span>Preferred / Nice-to-Have Skills ({activeJob.preferredSkills.length})</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {activeJob.preferredSkills.map((pref, pIdx) => (
                <span
                  key={pIdx}
                  className="text-xs px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-medium"
                >
                  {pref}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Split: Candidate Selector & Deep Match Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Candidate List Selector (lg: 4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Candidate Pool ({candidates.length})
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              {screenedCount} screened
            </span>
          </div>

          <div className="space-y-1.5 max-h-[640px] overflow-y-auto pr-1">
            {candidates.map((cand) => {
              const res = cand.screeningResults?.[activeJob.id];
              const isSelected = cand.id === activeCandidate?.id;

              return (
                <div
                  key={cand.id}
                  onClick={() => setSelectedCandidateId(cand.id)}
                  className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                      : 'border-slate-100 hover:border-slate-200 bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-sm text-slate-900 truncate">
                      {cand.name}
                    </span>
                    {res ? (
                      <span className="font-mono text-xs font-bold text-indigo-700">
                        {res.overallScore}% Fit
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-medium">Pending</span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    {cand.currentTitle}
                  </p>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100/80 text-[11px] text-slate-500">
                    <span>{cand.yearsExperience} yrs exp</span>
                    {res?.recommendation && (
                      <span
                        className={`font-semibold ${
                          res.recommendation === 'FAST_TRACK_SHORTLIST'
                            ? 'text-emerald-700'
                            : res.recommendation === 'SHORTLIST'
                            ? 'text-indigo-700'
                            : res.recommendation === 'POTENTIAL_FIT'
                            ? 'text-amber-700'
                            : 'text-slate-500'
                        }`}
                      >
                        {res.recommendation === 'FAST_TRACK_SHORTLIST' && 'Fast-Track'}
                        {res.recommendation === 'SHORTLIST' && 'Shortlist'}
                        {res.recommendation === 'POTENTIAL_FIT' && 'Review'}
                        {res.recommendation === 'NOT_RECOMMENDED' && 'Not Recommended'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: In-Depth Semantic Match Breakdown (lg: 8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          {activeCandidate && (
            <>
              {/* Candidate Quick Header */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {activeCandidate.name}
                    </h2>
                    <p className="text-xs text-slate-600 font-medium mt-0.5">
                      {activeCandidate.currentTitle} · {activeCandidate.currentCompany}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1.5">
                      <span>{activeCandidate.yearsExperience} Years Total Exp</span>
                      <span aria-hidden="true">·</span>
                      <span>{activeCandidate.location}</span>
                      <span aria-hidden="true">·</span>
                      <span>{activeCandidate.email}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onSelectCandidate(activeCandidate)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                      Full Dossier
                    </button>
                    {!screening && (
                      <button
                        onClick={() => onScreenCandidate(activeCandidate)}
                        className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs inline-flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
                        <span>Run AI Screen</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Match Score Display */}
                {screening ? (
                  <div className="mt-4 pt-2">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                      <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100/80">
                        <div className="text-[11px] font-semibold text-indigo-700 uppercase tracking-wider">
                          Overall Match
                        </div>
                        <div className="text-2xl font-bold text-indigo-900 font-mono mt-0.5">
                          {screening.overallScore}%
                        </div>
                        <div className="text-[10px] text-indigo-600 mt-0.5 font-medium">
                          Weighted Fit
                        </div>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                          Skills Score
                        </div>
                        <div className="text-2xl font-bold text-slate-900 font-mono mt-0.5">
                          {screening.skillsScore}%
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5 font-medium">
                          Req & Preferred
                        </div>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                          Experience Fit
                        </div>
                        <div className="text-2xl font-bold text-slate-900 font-mono mt-0.5">
                          {screening.experienceScore}%
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5 font-medium">
                          Seniority & Depth
                        </div>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                          Education & Domain
                        </div>
                        <div className="text-2xl font-bold text-slate-900 font-mono mt-0.5">
                          {screening.educationScore}%
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5 font-medium">
                          Credential Match
                        </div>
                      </div>
                    </div>

                    {/* Recommendation Banner */}
                    <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-indigo-600" />
                          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                            AI Recommendation:
                          </span>
                          <span className="text-xs font-bold text-indigo-700">
                            {screening.recommendation.replace(/_/g, ' ')}
                          </span>
                        </div>

                        {/* Recruiter 1-click status actions */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onUpdateCandidateStatus(activeCandidate.id, 'shortlisted')}
                            className="px-2.5 py-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors"
                          >
                            + Shortlist
                          </button>
                          <button
                            onClick={() => onUpdateCandidateStatus(activeCandidate.id, 'rejected')}
                            className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                          >
                            Decline
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-slate-700 mt-2 leading-relaxed">
                        {screening.recommendationSummary}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 py-10 text-center bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                    <Sparkles className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
                    <h4 className="text-sm font-semibold text-slate-900">
                      Candidate Not Yet Screened for {activeJob.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      Click below to let Gemini analyze semantic alignment, verified experience, and generate interview questions.
                    </p>
                    <button
                      onClick={() => onScreenCandidate(activeCandidate)}
                      className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs inline-flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Screen {activeCandidate.name} Now</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Verified Matched Skills Breakdown */}
              {screening && (
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <h3 className="font-bold text-slate-900 text-sm">
                        Verified Matched Skills & Resume Evidence ({screening.matchedSkills.length})
                      </h3>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">
                      Exact & Semantic Equivalents
                    </span>
                  </div>

                  <div className="space-y-2">
                    {screening.matchedSkills.map((match, mIdx) => (
                      <div
                        key={mIdx}
                        className="p-3 rounded-lg bg-emerald-50/40 border border-emerald-100/80 flex flex-col sm:flex-row sm:items-start justify-between gap-2"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-emerald-950">
                              {match.skill}
                            </span>
                            <span className="text-[10px] text-emerald-700 bg-emerald-100/60 px-1.5 py-0.2 rounded font-medium">
                              {match.matchType} match
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {match.evidence}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Missing Skills or Gaps */}
                  {screening.missingSkills.length > 0 && (
                    <div className="pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                        <h4 className="font-bold text-slate-900 text-xs">
                          Missing or Unverified Competencies ({screening.missingSkills.length})
                        </h4>
                      </div>
                      <div className="space-y-2">
                        {screening.missingSkills.map((miss, misIdx) => (
                          <div
                            key={misIdx}
                            className="p-2.5 rounded-lg bg-amber-50/40 border border-amber-100 text-xs space-y-0.5"
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-amber-950">
                                {miss.skill}
                              </span>
                              <span className="text-[10px] uppercase font-bold text-amber-700">
                                ({miss.importance})
                              </span>
                            </div>
                            <p className="text-slate-600">{miss.notes}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Strengths & Potential Risks */}
              {screening && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>Key Candidate Strengths</span>
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {screening.keyStrengths.map((str, sIdx) => (
                        <li key={sIdx} className="flex items-start gap-2">
                          <span className="text-emerald-600 font-bold">✓</span>
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <span>Potential Gaps & Probing Areas</span>
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {screening.potentialGaps.map((gap, gIdx) => (
                        <li key={gIdx} className="flex items-start gap-2">
                          <span className="text-amber-500 font-bold">!</span>
                          <span>{gap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Suggested Interview Questions */}
              {screening && screening.suggestedInterviewQuestions?.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                  <div className="flex items-center gap-2 mb-3">
                    <HelpCircle className="w-4 h-4 text-indigo-600" />
                    <h3 className="font-bold text-slate-900 text-sm">
                      Targeted Interview Questions for {activeCandidate.name}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mb-3">
                    AI generated tailored questions specifically targeting this candidate’s career background and skill gaps.
                  </p>
                  <div className="space-y-2.5">
                    {screening.suggestedInterviewQuestions.map((q, qIdx) => (
                      <div
                        key={qIdx}
                        className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-800 leading-relaxed font-medium"
                      >
                        <span className="text-indigo-600 font-bold mr-2">Q{qIdx + 1}:</span>
                        {q}
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      Satisfied with this candidate’s screening profile?
                    </span>
                    <button
                      onClick={onGoToShortlist}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <span>Proceed to Shortlist</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
