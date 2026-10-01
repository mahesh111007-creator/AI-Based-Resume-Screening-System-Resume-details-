import React, { useState } from 'react';
import { Candidate, JobOpening, CandidateStatus } from '../types/resume';
import {
  X,
  Briefcase,
  GraduationCap,
  Award,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Star,
  FileText
} from 'lucide-react';

interface CandidateModalProps {
  candidate: Candidate | null;
  activeJob: JobOpening;
  onClose: () => void;
  onScreenCandidate: (candidate: Candidate) => Promise<void>;
  onUpdateCandidateStatus: (candidateId: string, status: CandidateStatus) => void;
  onUpdateCandidateRating: (candidateId: string, rating: number) => void;
  onUpdateCandidateNotes: (candidateId: string, notes: string) => void;
}

export const CandidateModal: React.FC<CandidateModalProps> = ({
  candidate,
  activeJob,
  onClose,
  onScreenCandidate,
  onUpdateCandidateStatus,
  onUpdateCandidateRating,
  onUpdateCandidateNotes,
}) => {
  if (!candidate) return null;

  const [activeTab, setActiveTab] = useState<'profile' | 'screening' | 'rawResume'>('profile');
  const [notes, setNotes] = useState(candidate.recruiterNotes || '');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [isScreening, setIsScreening] = useState(false);

  const screening = candidate.screeningResults?.[activeJob.id];

  const handleSaveNotes = () => {
    setIsSavingNotes(true);
    onUpdateCandidateNotes(candidate.id, notes);
    setTimeout(() => setIsSavingNotes(false), 600);
  };

  const handleScreenNow = async () => {
    setIsScreening(true);
    await onScreenCandidate(candidate);
    setIsScreening(false);
    setActiveTab('screening');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                {candidate.name}
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                {candidate.yearsExperience} yrs exp
              </span>
            </div>
            <p className="text-sm text-slate-300 mt-1">
              {candidate.currentTitle} {candidate.currentCompany ? `at ${candidate.currentCompany}` : ''}
            </p>
            {/* Clean unboxed metadata with typographic separators */}
            <div className="flex items-center flex-wrap gap-2 text-xs text-slate-400 mt-2">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" />
                <span>{candidate.email}</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" />
                <span>{candidate.phone || 'Phone not listed'}</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{candidate.location}</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Status Select */}
            <div className="flex flex-col items-end">
              <label className="text-[10px] uppercase font-bold text-slate-400 mb-1">
                Hiring Pipeline
              </label>
              <select
                value={candidate.status}
                onChange={(e) => onUpdateCandidateStatus(candidate.id, e.target.value as CandidateStatus)}
                className="bg-slate-800 border border-slate-700 text-xs font-semibold text-white rounded-lg px-2.5 py-1.5 focus:outline-hidden"
              >
                <option value="new">New Candidate</option>
                <option value="screening">In Screening</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="interviewing">Interview Scheduled</option>
                <option value="offered">Offer Extended</option>
                <option value="rejected">Archived</option>
              </select>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-2"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="px-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-3 text-xs font-semibold border-b-2 transition-all ${
                activeTab === 'profile'
                  ? 'border-indigo-600 text-indigo-700 bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Resume Details & History
            </button>
            <button
              onClick={() => setActiveTab('screening')}
              className={`px-4 py-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'screening'
                  ? 'border-indigo-600 text-indigo-700 bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>AI Skills Match ({activeJob.title})</span>
              {screening && (
                <span className="font-mono text-xs font-bold text-indigo-600 ml-1">
                  {screening.overallScore}%
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('rawResume')}
              className={`px-4 py-3 text-xs font-semibold border-b-2 transition-all ${
                activeTab === 'rawResume'
                  ? 'border-indigo-600 text-indigo-700 bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Original Resume Plaintext
            </button>
          </div>

          {!screening && (
            <button
              onClick={handleScreenNow}
              disabled={isScreening}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg transition-colors shadow-xs"
            >
              {isScreening ? (
                <>
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Screening...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Run AI Screen</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Professional Summary */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Executive Summary
                </h4>
                <p className="text-xs text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200 leading-relaxed">
                  {candidate.summary}
                </p>
              </div>

              {/* Skills Inventory */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Extracted Technical & Domain Skills ({candidate.skills.length})
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {candidate.skills.map((skill, sIdx) => {
                    const isJobReq = activeJob.requiredSkills.some(
                      (r) => r.toLowerCase() === skill.toLowerCase()
                    );
                    return (
                      <span
                        key={sIdx}
                        className={`text-xs px-2.5 py-1 rounded-md font-medium ${
                          isJobReq
                            ? 'bg-indigo-100 text-indigo-900 font-semibold border border-indigo-200'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        {skill}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Work Experience Timeline */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Career Experience Timeline</span>
                </h4>
                <div className="space-y-4">
                  {candidate.workExperience.map((work, wIdx) => (
                    <div
                      key={wIdx}
                      className="p-4 bg-white border border-slate-200 rounded-xl space-y-2 shadow-2xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h5 className="font-bold text-sm text-slate-900">{work.role}</h5>
                          <span className="text-xs font-semibold text-slate-700">
                            {work.company}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500 font-medium">
                          {work.startDate} — {work.endDate}
                        </span>
                      </div>
                      <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
                        {work.highlights.map((hl, hIdx) => (
                          <li key={hIdx} className="leading-relaxed">
                            {hl}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education & Certifications */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Education Credentials</span>
                  </h4>
                  {candidate.education.map((edu, eIdx) => (
                    <div key={eIdx} className="text-xs text-slate-700 space-y-0.5">
                      <div className="font-semibold text-slate-900">
                        {edu.degree} in {edu.field}
                      </div>
                      <div className="text-slate-500">
                        {edu.institution} {edu.graduationYear ? `(${edu.graduationYear})` : ''}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Certifications & Honors</span>
                  </h4>
                  {candidate.certifications && candidate.certifications.length > 0 ? (
                    <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside">
                      {candidate.certifications.map((cert, cIdx) => (
                        <li key={cIdx}>{cert}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No formal certifications listed.</p>
                  )}
                </div>
              </div>

              {/* Recruiter Evaluation Notes Form */}
              <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
                    Internal Recruiter Assessment Notes
                  </h4>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => onUpdateCandidateRating(candidate.id, star)}
                        className="hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-3.5 h-3.5 ${
                            (candidate.recruiterRating || 0) >= star
                              ? 'text-amber-500 fill-amber-500'
                              : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Record confidential notes, compensation expectations, or next steps..."
                  className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500"
                />
                <div className="mt-2 flex justify-end">
                  <button
                    onClick={handleSaveNotes}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors shadow-2xs"
                  >
                    {isSavingNotes ? 'Saved!' : 'Save Recruiter Notes'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'screening' && (
            <div className="space-y-5">
              {screening ? (
                <>
                  {/* Scores Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="p-4 bg-indigo-50/80 rounded-xl border border-indigo-100">
                      <div className="text-[11px] font-semibold text-indigo-700 uppercase tracking-wider">
                        Composite Fit
                      </div>
                      <div className="text-3xl font-bold text-indigo-900 font-mono mt-1">
                        {screening.overallScore}%
                      </div>
                      <div className="text-[11px] text-indigo-700 font-semibold mt-1">
                        {screening.recommendation.replace(/_/g, ' ')}
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        Skills Score
                      </div>
                      <div className="text-3xl font-bold text-slate-900 font-mono mt-1">
                        {screening.skillsScore}%
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        Experience Fit
                      </div>
                      <div className="text-3xl font-bold text-slate-900 font-mono mt-1">
                        {screening.experienceScore}%
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        Education Fit
                      </div>
                      <div className="text-3xl font-bold text-slate-900 font-mono mt-1">
                        {screening.educationScore}%
                      </div>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
                    <span className="font-bold text-slate-900">Executive Assessment: </span>
                    {screening.recommendationSummary}
                  </div>

                  {/* Matched Skills */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Verified Matched Competencies ({screening.matchedSkills.length})</span>
                    </h4>
                    <div className="space-y-2">
                      {screening.matchedSkills.map((m, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-emerald-50/40 border border-emerald-100/70 rounded-lg text-xs"
                        >
                          <div className="font-bold text-emerald-950 flex items-center gap-2">
                            <span>{m.skill}</span>
                            <span className="text-[10px] text-emerald-700 bg-emerald-100/60 px-1.5 py-0.5 rounded font-medium">
                              {m.matchType}
                            </span>
                          </div>
                          <p className="text-slate-600 mt-1">{m.evidence}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Missing Skills */}
                  {screening.missingSkills.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                        <span>Identified Skill Gaps ({screening.missingSkills.length})</span>
                      </h4>
                      <div className="space-y-2">
                        {screening.missingSkills.map((mis, idx) => (
                          <div
                            key={idx}
                            className="p-3 bg-amber-50/40 border border-amber-100 rounded-lg text-xs"
                          >
                            <span className="font-bold text-amber-950">{mis.skill}</span>
                            <span className="text-[10px] uppercase font-bold text-amber-700 ml-2">
                              [{mis.importance}]
                            </span>
                            <p className="text-slate-600 mt-1">{mis.notes}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Interview Questions */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                      Customized Interview Probing Questions
                    </h4>
                    <div className="space-y-2">
                      {screening.suggestedInterviewQuestions.map((q, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800"
                        >
                          <span className="text-indigo-600 font-bold mr-1.5">Q{idx + 1}:</span>
                          {q}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                  <Sparkles className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
                  <h4 className="text-sm font-semibold text-slate-900">
                    Not Screened for {activeJob.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Run screening to evaluate skills match, experience alignment, and produce interview questions.
                  </p>
                  <button
                    onClick={handleScreenNow}
                    disabled={isScreening}
                    className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
                  >
                    Run AI Screening Now
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'rawResume' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Raw Resume Content
                </h4>
                <span className="text-xs text-slate-500">
                  Parsed on {new Date(candidate.parsedAt).toLocaleDateString()}
                </span>
              </div>
              <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl text-xs font-mono whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-y-auto">
                {candidate.rawResumeText || 'No raw resume text stored.'}
              </pre>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500">
            Candidate ID: <span className="font-mono">{candidate.id}</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors shadow-2xs"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
