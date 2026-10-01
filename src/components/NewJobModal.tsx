import React, { useState } from 'react';
import { JobOpening } from '../types/resume';
import { X, Sparkles, Plus, Trash2, Briefcase } from 'lucide-react';

interface NewJobModalProps {
  onClose: () => void;
  onAddJob: (job: JobOpening) => void;
}

export const NewJobModal: React.FC<NewJobModalProps> = ({ onClose, onAddJob }) => {
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [location, setLocation] = useState('San Francisco, CA (Hybrid / Remote)');
  const [type, setType] = useState('Full-time');
  const [minYearsExperience, setMinYearsExperience] = useState(4);
  const [educationRequired, setEducationRequired] = useState(
    "Bachelor's degree in Computer Science, Software Engineering, or equivalent practical experience"
  );
  const [description, setDescription] = useState('');
  const [requiredSkills, setRequiredSkills] = useState<string[]>([
    'TypeScript',
    'React',
    'Node.js',
    'PostgreSQL',
    'System Design'
  ]);
  const [preferredSkills, setPreferredSkills] = useState<string[]>([
    'Docker & Kubernetes',
    'Cloud Architecture (AWS/GCP)',
    'GraphQL'
  ]);

  const [newRequiredInput, setNewRequiredInput] = useState('');
  const [newPreferredInput, setNewPreferredInput] = useState('');
  const [isGeneratingWithAI, setIsGeneratingWithAI] = useState(false);

  const handleGenerateAI = async () => {
    if (!title.trim()) {
      alert('Please enter a Job Title first.');
      return;
    }

    setIsGeneratingWithAI(true);
    try {
      const res = await fetch('/api/generate-job-spec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          department,
          level: minYearsExperience >= 6 ? 'Lead' : minYearsExperience >= 4 ? 'Senior' : 'Mid'
        })
      });
      const data = await res.json();
      if (data.spec) {
        setDescription(data.spec.description || '');
        if (data.spec.requiredSkills) setRequiredSkills(data.spec.requiredSkills);
        if (data.spec.preferredSkills) setPreferredSkills(data.spec.preferredSkills);
        if (data.spec.minYearsExperience) setMinYearsExperience(data.spec.minYearsExperience);
        if (data.spec.educationRequired) setEducationRequired(data.spec.educationRequired);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingWithAI(false);
    }
  };

  const addRequiredSkill = () => {
    if (newRequiredInput.trim() && !requiredSkills.includes(newRequiredInput.trim())) {
      setRequiredSkills([...requiredSkills, newRequiredInput.trim()]);
      setNewRequiredInput('');
    }
  };

  const removeRequiredSkill = (idx: number) => {
    setRequiredSkills(requiredSkills.filter((_, i) => i !== idx));
  };

  const addPreferredSkill = () => {
    if (newPreferredInput.trim() && !preferredSkills.includes(newPreferredInput.trim())) {
      setPreferredSkills([...preferredSkills, newPreferredInput.trim()]);
      setNewPreferredInput('');
    }
  };

  const removePreferredSkill = (idx: number) => {
    setPreferredSkills(preferredSkills.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newJob: JobOpening = {
      id: `job-${Date.now()}`,
      title,
      department,
      location,
      type,
      minYearsExperience: Number(minYearsExperience),
      educationRequired,
      description: description || `Role opening for ${title} within ${department}.`,
      requiredSkills,
      preferredSkills,
      createdAt: new Date().toISOString().split('T')[0]
    };

    onAddJob(newJob);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Create New Job Requisition
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                Job Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Senior Backend Engineer (Distributed Systems)"
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                Department
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Platform Infrastructure"
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500"
              />
            </div>
          </div>

          {/* AI Auto-generate button */}
          <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl flex items-center justify-between gap-3">
            <div className="text-xs text-indigo-900">
              <span className="font-bold">AI Assistant: </span>
              Enter role title above and click to automatically populate requirements and competencies.
            </div>
            <button
              type="button"
              onClick={handleGenerateAI}
              disabled={isGeneratingWithAI}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg transition-colors shadow-2xs shrink-0 inline-flex items-center gap-1.5"
            >
              {isGeneratingWithAI ? (
                <>
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Drafting...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
                  <span>AI Generate Specs</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                Min Experience (Years)
              </label>
              <input
                type="number"
                min="0"
                max="25"
                value={minYearsExperience}
                onChange={(e) => setMinYearsExperience(parseInt(e.target.value) || 0)}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                Employment Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500"
              >
                <option value="Full-time">Full-time</option>
                <option value="Contract">Contract</option>
                <option value="Part-time">Part-time</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
              Education Baseline
            </label>
            <input
              type="text"
              value={educationRequired}
              onChange={(e) => setEducationRequired(e.target.value)}
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
              Role Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Outline high-level responsibilities, key project objectives, and mission..."
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 leading-relaxed"
            />
          </div>

          {/* Required Skills list */}
          <div>
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
              Required Core Skills ({requiredSkills.length})
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {requiredSkills.map((sk, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2.5 py-1 bg-indigo-50 text-indigo-950 border border-indigo-100 rounded-md font-medium flex items-center gap-1.5"
                >
                  <span>{sk}</span>
                  <button
                    type="button"
                    onClick={() => removeRequiredSkill(idx)}
                    className="text-indigo-400 hover:text-rose-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newRequiredInput}
                onChange={(e) => setNewRequiredInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addRequiredSkill();
                  }
                }}
                placeholder="Add required skill (press Enter)..."
                className="flex-1 p-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden"
              />
              <button
                type="button"
                onClick={addRequiredSkill}
                className="px-3 py-2 text-xs font-semibold bg-slate-200 hover:bg-slate-300 rounded-lg"
              >
                + Add
              </button>
            </div>
          </div>

          {/* Preferred Skills list */}
          <div>
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
              Preferred / Nice-to-Have Skills ({preferredSkills.length})
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {preferredSkills.map((sk, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2.5 py-1 bg-slate-100 text-slate-800 rounded-md font-medium flex items-center gap-1.5"
                >
                  <span>{sk}</span>
                  <button
                    type="button"
                    onClick={() => removePreferredSkill(idx)}
                    className="text-slate-400 hover:text-rose-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newPreferredInput}
                onChange={(e) => setNewPreferredInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addPreferredSkill();
                  }
                }}
                placeholder="Add preferred skill (press Enter)..."
                className="flex-1 p-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden"
              />
              <button
                type="button"
                onClick={addPreferredSkill}
                className="px-3 py-2 text-xs font-semibold bg-slate-200 hover:bg-slate-300 rounded-lg"
              >
                + Add
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs"
            >
              Save & Open Requisition
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
