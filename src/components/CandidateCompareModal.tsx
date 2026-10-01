import React from 'react';
import { Candidate, JobOpening, CandidateStatus } from '../types/resume';
import { X, Layers, CheckCircle2, AlertTriangle, Star, Award, Briefcase } from 'lucide-react';

interface CandidateCompareModalProps {
  candidates: Candidate[];
  activeJob: JobOpening;
  onClose: () => void;
  onUpdateCandidateStatus: (candidateId: string, status: CandidateStatus) => void;
  onSelectCandidate: (candidate: Candidate) => void;
}

export const CandidateCompareModal: React.FC<CandidateCompareModalProps> = ({
  candidates,
  activeJob,
  onClose,
  onUpdateCandidateStatus,
  onSelectCandidate,
}) => {
  if (candidates.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-6xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-800 rounded-lg">
              <Layers className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Side-by-Side Candidate Calibration
              </h2>
              <p className="text-xs text-slate-300">
                Comparing {candidates.length} candidates for{' '}
                <strong className="text-white">{activeJob.title}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Matrix Table */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {candidates.map((cand) => {
              const res = cand.screeningResults?.[activeJob.id];

              return (
                <div
                  key={cand.id}
                  className="bg-slate-50 rounded-xl border border-slate-200 p-5 flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="border-b border-slate-200 pb-3">
                      <h3
                        onClick={() => onSelectCandidate(cand)}
                        className="font-bold text-base text-slate-900 hover:text-indigo-600 cursor-pointer"
                      >
                        {cand.name}
                      </h3>
                      <p className="text-xs text-slate-600 font-medium mt-0.5">
                        {cand.currentTitle}
                      </p>
                      <div className="text-[11px] text-slate-500 mt-1">
                        {cand.yearsExperience} yrs exp · {cand.location}
                      </div>
                    </div>

                    {/* Overall Score */}
                    {res ? (
                      <div className="p-3 bg-white rounded-lg border border-slate-200 text-center">
                        <div className="text-xs font-semibold text-slate-500">Overall AI Fit</div>
                        <div className="text-2xl font-bold font-mono text-indigo-700 mt-0.5">
                          {res.overallScore}%
                        </div>
                        <div className="text-xs font-bold text-indigo-900 mt-1">
                          {res.recommendation.replace(/_/g, ' ')}
                        </div>

                        {/* Breakdown */}
                        <div className="grid grid-cols-3 gap-1 mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-600 font-mono">
                          <div>
                            <span className="block text-slate-400">Skills</span>
                            <span className="font-bold text-slate-800">{res.skillsScore}%</span>
                          </div>
                          <div>
                            <span className="block text-slate-400">Exp</span>
                            <span className="font-bold text-slate-800">{res.experienceScore}%</span>
                          </div>
                          <div>
                            <span className="block text-slate-400">Edu</span>
                            <span className="font-bold text-slate-800">{res.educationScore}%</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-white rounded-lg border border-slate-200 text-center text-xs text-slate-400">
                        Not yet screened
                      </div>
                    )}

                    {/* Verified Skills Evidence */}
                    {res && (
                      <div>
                        <div className="text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Matched Skills ({res.matchedSkills.length})</span>
                        </div>
                        <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
                          {res.matchedSkills.map((m, idx) => (
                            <span
                              key={idx}
                              className="text-[11px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-900 border border-emerald-100 font-medium"
                            >
                              {m.skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Missing Skills */}
                    {res && res.missingSkills.length > 0 && (
                      <div>
                        <div className="text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                          <span>Identified Gaps ({res.missingSkills.length})</span>
                        </div>
                        <div className="space-y-1 text-xs">
                          {res.missingSkills.map((mis, idx) => (
                            <div
                              key={idx}
                              className="p-1.5 bg-amber-50/60 rounded text-[11px] text-slate-700"
                            >
                              <span className="font-semibold text-amber-900">{mis.skill}</span>
                              <span className="text-[10px] text-amber-700 ml-1">
                                ({mis.importance})
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Top Strengths */}
                    {res && (
                      <div>
                        <div className="text-xs font-bold text-slate-800 mb-1">Top Strength</div>
                        <p className="text-xs text-slate-600 bg-white p-2 rounded border border-slate-150 leading-relaxed">
                          {res.keyStrengths[0] || 'Strong alignment across core requirements.'}
                        </p>
                      </div>
                    )}

                    {/* Recruiter Notes Excerpt */}
                    {cand.recruiterNotes && (
                      <div>
                        <div className="text-xs font-bold text-slate-800 mb-1">Recruiter Notes</div>
                        <p className="text-xs text-slate-600 italic bg-white p-2 rounded border border-slate-150">
                          "{cand.recruiterNotes}"
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions for Candidate */}
                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
                    <select
                      value={cand.status}
                      onChange={(e) =>
                        onUpdateCandidateStatus(cand.id, e.target.value as CandidateStatus)
                      }
                      className="bg-white border border-slate-300 text-xs font-medium text-slate-800 rounded-md px-2 py-1 focus:outline-hidden"
                    >
                      <option value="new">New</option>
                      <option value="screening">Screening</option>
                      <option value="shortlisted">Shortlist</option>
                      <option value="interviewing">Interview</option>
                      <option value="offered">Offer</option>
                      <option value="rejected">Decline</option>
                    </select>

                    <button
                      onClick={() => onSelectCandidate(cand)}
                      className="px-3 py-1 text-xs font-semibold text-indigo-700 bg-white border border-indigo-200 hover:bg-indigo-50 rounded-md transition-colors"
                    >
                      Full Dossier
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};
