import React, { useState } from 'react';
import { Candidate, JobOpening, CandidateStatus } from '../types/resume';
import {
  Award,
  Download,
  Check,
  Star,
  Layers,
  ArrowUpDown,
  Filter,
  Eye,
  MessageSquare,
  FileSpreadsheet,
  CheckCircle,
  HelpCircle,
  Briefcase
} from 'lucide-react';

interface ShortlistViewProps {
  candidates: Candidate[];
  activeJob: JobOpening;
  onSelectCandidate: (candidate: Candidate) => void;
  onUpdateCandidateStatus: (candidateId: string, status: CandidateStatus) => void;
  onUpdateCandidateRating: (candidateId: string, rating: number) => void;
  onUpdateCandidateNotes: (candidateId: string, notes: string) => void;
  onOpenCompareModal: (selectedCandidates: Candidate[]) => void;
}

export const ShortlistView: React.FC<ShortlistViewProps> = ({
  candidates,
  activeJob,
  onSelectCandidate,
  onUpdateCandidateStatus,
  onUpdateCandidateRating,
  onUpdateCandidateNotes,
  onOpenCompareModal,
}) => {
  const [filterTier, setFilterTier] = useState<
    'all' | 'fast_track' | 'shortlisted' | 'interviewing' | 'review'
  >('all');
  const [selectedCandidateIdsForCompare, setSelectedCandidateIdsForCompare] = useState<string[]>(
    []
  );
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [notesText, setNotesText] = useState('');

  // Sort candidates by AI score descending
  const sortedCandidates = [...candidates].sort((a, b) => {
    const scoreA = a.screeningResults?.[activeJob.id]?.overallScore ?? -1;
    const scoreB = b.screeningResults?.[activeJob.id]?.overallScore ?? -1;
    return scoreB - scoreA;
  });

  const filteredCandidates = sortedCandidates.filter((c) => {
    const res = c.screeningResults?.[activeJob.id];
    if (filterTier === 'fast_track') return res?.recommendation === 'FAST_TRACK_SHORTLIST';
    if (filterTier === 'shortlisted') return c.status === 'shortlisted' || res?.recommendation === 'SHORTLIST';
    if (filterTier === 'interviewing') return c.status === 'interviewing';
    if (filterTier === 'review') return res?.recommendation === 'POTENTIAL_FIT';
    return true;
  });

  const toggleSelectForCompare = (candidateId: string) => {
    if (selectedCandidateIdsForCompare.includes(candidateId)) {
      setSelectedCandidateIdsForCompare(selectedCandidateIdsForCompare.filter((id) => id !== candidateId));
    } else {
      if (selectedCandidateIdsForCompare.length >= 3) {
        alert('You can compare up to 3 candidates simultaneously.');
        return;
      }
      setSelectedCandidateIdsForCompare([...selectedCandidateIdsForCompare, candidateId]);
    }
  };

  const handleStartEditingNotes = (candidate: Candidate) => {
    setEditingNotesId(candidate.id);
    setNotesText(candidate.recruiterNotes || '');
  };

  const handleSaveNotes = (candidateId: string) => {
    onUpdateCandidateNotes(candidateId, notesText);
    setEditingNotesId(null);
  };

  // CSV Export functionality
  const exportCSV = () => {
    const headers = [
      'Rank',
      'Name',
      'Email',
      'Overall Fit (%)',
      'Skills Score (%)',
      'Experience Score (%)',
      'Education Score (%)',
      'Recommendation',
      'Status',
      'Years Experience',
      'Recruiter Rating (1-5)',
      'Recruiter Notes'
    ];

    const rows = sortedCandidates.map((c, idx) => {
      const res = c.screeningResults?.[activeJob.id];
      return [
        idx + 1,
        `"${c.name}"`,
        `"${c.email}"`,
        res?.overallScore || 'Unscreened',
        res?.skillsScore || '',
        res?.experienceScore || '',
        res?.educationScore || '',
        res?.recommendation || 'PENDING',
        c.status,
        c.yearsExperience,
        c.recruiterRating || '',
        `"${(c.recruiterNotes || '').replace(/"/g, '""')}"`
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `shortlist-${activeJob.title.toLowerCase().replace(/\s+/g, '-')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const selectedCandidatesObjects = candidates.filter((c) =>
    selectedCandidateIdsForCompare.includes(c.id)
  );

  return (
    <div className="space-y-6">
      {/* Step Banner & Context */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 uppercase tracking-wider mb-1">
              <span>Step 3 of 3</span>
              <span aria-hidden="true">·</span>
              <span>Final Hiring Decisions</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Candidate Shortlist & Hiring Pipeline
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              Rank-ordered candidate leaderboard based on semantic skills match, experience alignment, and qualification checks for{' '}
              <strong className="text-slate-900 font-semibold">{activeJob.title}</strong>. Advance fast-track candidates, run side-by-side comparisons, and export interview memos.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {selectedCandidateIdsForCompare.length >= 2 && (
              <button
                onClick={() => onOpenCompareModal(selectedCandidatesObjects)}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs"
              >
                <Layers className="w-4 h-4" />
                <span>Compare Selected ({selectedCandidateIdsForCompare.length})</span>
              </button>
            )}

            <button
              onClick={exportCSV}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4 text-slate-600" />
              <span>Export Shortlist CSV</span>
            </button>
          </div>
        </div>

        {/* Filter Tabs (Clean buttons per constitution) */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium">
            <button
              onClick={() => setFilterTier('all')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                filterTier === 'all'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Ranked ({sortedCandidates.length})
            </button>
            <button
              onClick={() => setFilterTier('fast_track')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                filterTier === 'fast_track'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Fast-Track Match (≥85%)
            </button>
            <button
              onClick={() => setFilterTier('shortlisted')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                filterTier === 'shortlisted'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Shortlisted
            </button>
            <button
              onClick={() => setFilterTier('interviewing')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                filterTier === 'interviewing'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Interviewing
            </button>
            <button
              onClick={() => setFilterTier('review')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                filterTier === 'review'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Potential / Review
            </button>
          </div>

          <div className="text-xs text-slate-500">
            Tip: Check the box next to any 2-3 candidates to view side-by-side comparison.
          </div>
        </div>
      </div>

      {/* Shortlist Table / Cards */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="py-3 px-4 w-10 text-center">
                  <span className="sr-only">Select</span>
                </th>
                <th className="py-3 px-4 w-12 text-center">Rank</th>
                <th className="py-3 px-4">Candidate & Background</th>
                <th className="py-3 px-4">Fit Score</th>
                <th className="py-3 px-4">AI Recommendation</th>
                <th className="py-3 px-4">Pipeline Status</th>
                <th className="py-3 px-4">Recruiter Rating</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCandidates.map((candidate, idx) => {
                const res = candidate.screeningResults?.[activeJob.id];
                const isSelectedForCompare = selectedCandidateIdsForCompare.includes(candidate.id);

                return (
                  <tr
                    key={candidate.id}
                    className={`hover:bg-slate-50/70 transition-colors ${
                      isSelectedForCompare ? 'bg-indigo-50/40' : ''
                    }`}
                  >
                    {/* Checkbox for Comparison */}
                    <td className="py-3.5 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={isSelectedForCompare}
                        onChange={() => toggleSelectForCompare(candidate.id)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        title="Select to compare"
                      />
                    </td>

                    {/* Rank */}
                    <td className="py-3.5 px-4 text-center font-bold text-slate-500 font-mono">
                      #{idx + 1}
                    </td>

                    {/* Candidate Info */}
                    <td className="py-3.5 px-4">
                      <div>
                        <button
                          onClick={() => onSelectCandidate(candidate)}
                          className="font-bold text-slate-900 text-sm hover:text-indigo-600 text-left transition-colors"
                        >
                          {candidate.name}
                        </button>
                        <p className="text-slate-600 text-xs mt-0.5">
                          {candidate.currentTitle} · {candidate.currentCompany}
                        </p>
                        {/* Clean unboxed metadata with typographic separators */}
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-1">
                          <span>{candidate.yearsExperience} yrs exp</span>
                          <span aria-hidden="true">·</span>
                          <span>{candidate.location}</span>
                          <span aria-hidden="true">·</span>
                          <span className="truncate max-w-[160px]">{candidate.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Fit Score */}
                    <td className="py-3.5 px-4">
                      {res ? (
                        <div className="space-y-1">
                          <div className="flex items-baseline gap-1">
                            <span className="text-base font-bold font-mono text-indigo-700">
                              {res.overallScore}%
                            </span>
                            <span className="text-[10px] text-slate-400">composite</span>
                          </div>
                          <div className="text-[10px] text-slate-500 flex items-center gap-1.5">
                            <span>S: {res.skillsScore}%</span>
                            <span aria-hidden="true">·</span>
                            <span>E: {res.experienceScore}%</span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Not screened</span>
                      )}
                    </td>

                    {/* AI Recommendation (Rendered cleanly per constitution) */}
                    <td className="py-3.5 px-4">
                      {res ? (
                        <div className="space-y-1 max-w-xs">
                          <div className="font-semibold text-xs text-slate-800">
                            {res.recommendation === 'FAST_TRACK_SHORTLIST' && (
                              <span className="text-emerald-700 font-bold">
                                Fast-Track Shortlist
                              </span>
                            )}
                            {res.recommendation === 'SHORTLIST' && (
                              <span className="text-indigo-700 font-bold">Shortlist</span>
                            )}
                            {res.recommendation === 'POTENTIAL_FIT' && (
                              <span className="text-amber-700 font-semibold">Potential Fit</span>
                            )}
                            {res.recommendation === 'NOT_RECOMMENDED' && (
                              <span className="text-slate-500">Not Recommended</span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-600 line-clamp-1">
                            {res.recommendationSummary}
                          </p>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>

                    {/* Pipeline Status Select */}
                    <td className="py-3.5 px-4">
                      <select
                        value={candidate.status}
                        onChange={(e) =>
                          onUpdateCandidateStatus(candidate.id, e.target.value as CandidateStatus)
                        }
                        className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 rounded-md px-2 py-1 focus:outline-hidden focus:border-indigo-500 cursor-pointer"
                      >
                        <option value="new">New</option>
                        <option value="screening">Screening</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="interviewing">Interviewing</option>
                        <option value="offered">Offer Extended</option>
                        <option value="rejected">Archived / Declined</option>
                      </select>
                    </td>

                    {/* Recruiter 5-Star Rating */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => onUpdateCandidateRating(candidate.id, star)}
                            className="p-0.5 hover:scale-110 transition-transform"
                            title={`Rate ${star} stars`}
                          >
                            <Star
                              className={`w-3.5 h-3.5 ${
                                (candidate.recruiterRating || 0) >= star
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-slate-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleStartEditingNotes(candidate)}
                          className="p-1.5 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                          title="Hiring notes"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onSelectCandidate(candidate)}
                          className="px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors"
                        >
                          Dossier
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recruiter Notes Quick Modal */}
      {editingNotesId && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-sm mb-2">
              Confidential Recruiter Evaluation Notes
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Add internal feedback, interview impressions, or compensation expectations for this candidate.
            </p>
            <textarea
              rows={5}
              value={notesText}
              onChange={(e) => setNotesText(e.target.value)}
              placeholder="e.g. Completed initial hiring manager screen. High enthusiasm for technical leadership, salary expectations align with Level 5 band..."
              className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setEditingNotesId(null)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveNotes(editingNotesId)}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
