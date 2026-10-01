/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Candidate, JobOpening, ScreeningWeights, CandidateStatus } from './types/resume';
import { INITIAL_JOB_OPENINGS, INITIAL_CANDIDATES } from './data/mockData';
import { Header } from './components/Header';
import { ResumeDetailsView } from './components/ResumeDetailsView';
import { SkillsMatchingView } from './components/SkillsMatchingView';
import { ShortlistView } from './components/ShortlistView';
import { CandidateModal } from './components/CandidateModal';
import { CandidateCompareModal } from './components/CandidateCompareModal';
import { NewJobModal } from './components/NewJobModal';
import { RotateCcw } from 'lucide-react';

const STORAGE_KEYS = {
  JOBS: 'talentscan_jobs_v1',
  CANDIDATES: 'talentscan_candidates_v1',
  ACTIVE_JOB: 'talentscan_active_job_v1',
  WEIGHTS: 'talentscan_weights_v1',
};

export default function App() {
  // Load state from localStorage with fallback
  const [jobs, setJobs] = useState<JobOpening[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.JOBS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_JOB_OPENINGS;
  });

  const [activeJobId, setActiveJobId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_JOB);
      if (saved && INITIAL_JOB_OPENINGS.some((j) => j.id === saved)) return saved;
    } catch (e) {
      console.error(e);
    }
    return INITIAL_JOB_OPENINGS[0].id;
  });

  const [candidates, setCandidates] = useState<Candidate[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CANDIDATES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_CANDIDATES;
  });

  const [weights, setWeights] = useState<ScreeningWeights>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WEIGHTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return { skills: 0.5, experience: 0.35, education: 0.15 };
  });

  const [activeTab, setActiveTab] = useState<'resumes' | 'matching' | 'shortlist'>('resumes');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [screeningCandidateId, setScreeningCandidateId] = useState<string | null>(null);
  const [isBatchScreening, setIsBatchScreening] = useState(false);
  const [batchProgress, setBatchProgress] = useState<{ current: number; total: number } | null>(
    null
  );

  const [isNewJobModalOpen, setIsNewJobModalOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [candidatesForComparison, setCandidatesForComparison] = useState<Candidate[]>([]);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
    } catch (e) {}
  }, [jobs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(candidates));
    } catch (e) {}
  }, [candidates]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_JOB, activeJobId);
    } catch (e) {}
  }, [activeJobId]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WEIGHTS, JSON.stringify(weights));
    } catch (e) {}
  }, [weights]);

  // Current active job
  const activeJob = jobs.find((j) => j.id === activeJobId) || jobs[0];

  // Keep selectedCandidate synced if candidates array changes
  useEffect(() => {
    if (selectedCandidate) {
      const updated = candidates.find((c) => c.id === selectedCandidate.id);
      if (updated) setSelectedCandidate(updated);
    }
  }, [candidates]);

  // 1. Screen a single candidate against current job
  const handleScreenCandidate = async (candidate: Candidate) => {
    setScreeningCandidateId(candidate.id);

    try {
      const response = await fetch('/api/screen-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidate,
          job: activeJob,
          weights,
        }),
      });

      if (!response.ok) {
        throw new Error('Screening request failed');
      }

      const data = await response.json();
      const screeningResult = data.result;

      setCandidates((prev) =>
        prev.map((c) => {
          if (c.id !== candidate.id) return c;
          const newStatus =
            c.status === 'new' &&
            (screeningResult.recommendation === 'FAST_TRACK_SHORTLIST' ||
              screeningResult.recommendation === 'SHORTLIST')
              ? 'shortlisted'
              : c.status;

          return {
            ...c,
            status: newStatus,
            screeningResults: {
              ...(c.screeningResults || {}),
              [activeJob.id]: screeningResult,
            },
          };
        })
      );
    } catch (err) {
      console.error('[Screening Error]', err);
    } finally {
      setScreeningCandidateId(null);
    }
  };

  // 2. Batch screen all candidates for active job
  const handleBatchScreen = async () => {
    setIsBatchScreening(true);
    setBatchProgress({ current: 0, total: candidates.length });

    for (let i = 0; i < candidates.length; i++) {
      const candidate = candidates[i];
      setBatchProgress({ current: i + 1, total: candidates.length });

      try {
        const response = await fetch('/api/screen-resume', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            candidate,
            job: activeJob,
            weights,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const screeningResult = data.result;

          setCandidates((prev) =>
            prev.map((c) => {
              if (c.id !== candidate.id) return c;
              const newStatus =
                c.status === 'new' &&
                (screeningResult.recommendation === 'FAST_TRACK_SHORTLIST' ||
                  screeningResult.recommendation === 'SHORTLIST')
                  ? 'shortlisted'
                  : c.status;

              return {
                ...c,
                status: newStatus,
                screeningResults: {
                  ...(c.screeningResults || {}),
                  [activeJob.id]: screeningResult,
                },
              };
            })
          );
        }
      } catch (err) {
        console.error(`[Batch Screening Error for candidate ${candidate.id}]`, err);
      }
    }

    setIsBatchScreening(false);
    setBatchProgress(null);
  };

  // 3. Add new candidate
  const handleAddCandidate = (newCand: Candidate) => {
    setCandidates((prev) => [newCand, ...prev]);
  };

  // 4. Delete candidate
  const handleDeleteCandidate = (candidateId: string) => {
    if (confirm('Are you sure you want to remove this applicant?')) {
      setCandidates((prev) => prev.filter((c) => c.id !== candidateId));
      if (selectedCandidate?.id === candidateId) {
        setSelectedCandidate(null);
      }
    }
  };

  // 5. Update candidate status
  const handleUpdateCandidateStatus = (candidateId: string, status: CandidateStatus) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, status } : c))
    );
  };

  // 6. Update candidate recruiter rating
  const handleUpdateCandidateRating = (candidateId: string, rating: number) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, recruiterRating: rating } : c))
    );
  };

  // 7. Update candidate notes
  const handleUpdateCandidateNotes = (candidateId: string, notes: string) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, recruiterNotes: notes } : c))
    );
  };

  // 8. Add new job requisition
  const handleAddJob = (newJob: JobOpening) => {
    setJobs((prev) => [newJob, ...prev]);
    setActiveJobId(newJob.id);
  };

  // 9. Reset sample demo data
  const handleResetData = () => {
    if (confirm('Reset candidate pool and job descriptions to default sample state?')) {
      localStorage.clear();
      setJobs(INITIAL_JOB_OPENINGS);
      setActiveJobId(INITIAL_JOB_OPENINGS[0].id);
      setCandidates(INITIAL_CANDIDATES);
      setWeights({ skills: 0.5, experience: 0.35, education: 0.15 });
      setSelectedCandidate(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      {/* App Header & Navigation */}
      <Header
        jobs={jobs}
        activeJobId={activeJobId}
        onSelectJob={setActiveJobId}
        onOpenNewJobModal={() => setIsNewJobModalOpen(true)}
        candidates={candidates}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'resumes' && (
          <ResumeDetailsView
            candidates={candidates}
            activeJob={activeJob}
            onAddCandidate={handleAddCandidate}
            onDeleteCandidate={handleDeleteCandidate}
            onSelectCandidate={setSelectedCandidate}
            onScreenCandidate={handleScreenCandidate}
            onGoToMatching={() => setActiveTab('matching')}
            screeningCandidateId={screeningCandidateId}
          />
        )}

        {activeTab === 'matching' && (
          <SkillsMatchingView
            candidates={candidates}
            activeJob={activeJob}
            weights={weights}
            onUpdateWeights={setWeights}
            onScreenCandidate={handleScreenCandidate}
            onBatchScreen={handleBatchScreen}
            isBatchScreening={isBatchScreening}
            batchProgress={batchProgress}
            onSelectCandidate={setSelectedCandidate}
            onUpdateCandidateStatus={handleUpdateCandidateStatus}
            onGoToShortlist={() => setActiveTab('shortlist')}
          />
        )}

        {activeTab === 'shortlist' && (
          <ShortlistView
            candidates={candidates}
            activeJob={activeJob}
            onSelectCandidate={setSelectedCandidate}
            onUpdateCandidateStatus={handleUpdateCandidateStatus}
            onUpdateCandidateRating={handleUpdateCandidateRating}
            onUpdateCandidateNotes={handleUpdateCandidateNotes}
            onOpenCompareModal={(cands) => {
              setCandidatesForComparison(cands);
              setIsCompareModalOpen(true);
            }}
          />
        )}
      </main>

      {/* Modals */}
      <CandidateModal
        candidate={selectedCandidate}
        activeJob={activeJob}
        onClose={() => setSelectedCandidate(null)}
        onScreenCandidate={handleScreenCandidate}
        onUpdateCandidateStatus={handleUpdateCandidateStatus}
        onUpdateCandidateRating={handleUpdateCandidateRating}
        onUpdateCandidateNotes={handleUpdateCandidateNotes}
      />

      {isCompareModalOpen && (
        <CandidateCompareModal
          candidates={candidatesForComparison}
          activeJob={activeJob}
          onClose={() => setIsCompareModalOpen(false)}
          onUpdateCandidateStatus={handleUpdateCandidateStatus}
          onSelectCandidate={(cand) => {
            setIsCompareModalOpen(false);
            setSelectedCandidate(cand);
          }}
        />
      )}

      {isNewJobModalOpen && (
        <NewJobModal
          onClose={() => setIsNewJobModalOpen(false)}
          onAddJob={handleAddJob}
        />
      )}

      {/* Footer per Anti-Slop Guidelines (Quiet copyright & reset action, no ornamental telemetry) */}
      <footer className="mt-auto border-t border-slate-200 py-4 bg-white text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            TalentScan AI · Autonomous Resume Screening & Candidate Shortlisting System
          </div>
          <button
            onClick={handleResetData}
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
