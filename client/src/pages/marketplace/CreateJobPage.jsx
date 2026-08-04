import { useState, useEffect } from 'react';
import { Briefcase, AlertTriangle, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { marketplaceService } from '@services/marketplace.service';
import { Button } from '@components/ui/Button';

const DRAFT_KEY = 'trustpay_create_job_draft';

export function CreateJobPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [workType, setWorkType] = useState('FIXED');
  const [budget, setBudget] = useState(1500);
  const [experienceLevel, setExperienceLevel] = useState('INTERMEDIATE');
  const [screeningQuestion, setScreeningQuestion] = useState('');

  const [duplicateWarning, setDuplicateWarning] = useState(null);
  const [loading, setLoading] = useState(false);

  // Auto-load draft from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.title) setTitle(parsed.title);
        if (parsed.description) setDescription(parsed.description);
        if (parsed.workType) setWorkType(parsed.workType);
        if (parsed.budget) setBudget(parsed.budget);
        if (parsed.experienceLevel) setExperienceLevel(parsed.experienceLevel);
      }
    } catch {
      // Draft parse error ignored
    }
  }, []);

  // Auto-save draft on form changes
  useEffect(() => {
    const draftData = { title, description, workType, budget, experienceLevel };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draftData));
  }, [title, description, workType, budget, experienceLevel]);

  const handleSubmit = async (confirmDuplicate = false) => {
    setLoading(true);
    try {
      const res = await marketplaceService.createJob({
        title,
        description,
        workType,
        budget: Number(budget),
        experienceLevel,
        confirmDuplicate,
        screeningQuestions: screeningQuestion
          ? [{ question: screeningQuestion, type: 'SHORT_TEXT', isRequired: true }]
          : undefined,
      });

      if (res.warning === 'DUPLICATE_JOB_DETECTED') {
        setDuplicateWarning(res.message);
        return;
      }

      localStorage.removeItem(DRAFT_KEY);
      navigate(`/dashboard/client/marketplace/${res.slug || ''}`);
    } catch (err) {
      console.error('Failed to publish job', err);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { num: 1, label: 'Basic Info' },
    { num: 2, label: 'Skills & Scope' },
    { num: 3, label: 'Budget' },
    { num: 4, label: 'Screening' },
    { num: 5, label: 'Attachments' },
    { num: 6, label: 'Preview' },
    { num: 7, label: 'Publish' },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-surface-50 flex items-center gap-2">
          <Briefcase size={20} className="text-primary-400" />
          <span>7-Step Enterprise Job Creation Wizard</span>
        </h1>
        <p className="text-xs text-surface-400">
          Draft auto-saved locally. Create an opportunity posting with custom screening questions.
        </p>
      </div>

      {/* Wizard Progress Bar */}
      <div className="flex items-center justify-between p-2 bg-surface-900 border border-surface-800 rounded-2xl">
        {steps.map((s) => (
          <button
            key={s.num}
            onClick={() => setStep(s.num)}
            className={`flex-1 text-center py-1.5 px-1 rounded-xl text-3xs font-mono font-bold transition-colors ${
              step === s.num
                ? 'bg-primary-500 text-surface-950 shadow'
                : step > s.num
                ? 'text-emerald-400'
                : 'text-surface-500'
            }`}
          >
            {s.num}. {s.label}
          </button>
        ))}
      </div>

      {duplicateWarning && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 space-y-2">
          <div className="flex items-center gap-2 font-bold text-xs">
            <AlertTriangle size={16} />
            <span>Duplicate Job Warning</span>
          </div>
          <p className="text-3xs">{duplicateWarning}</p>
          <div className="flex gap-2 pt-2">
            <Button size="xs" variant="primary" onClick={() => handleSubmit(true)} isLoading={loading}>
              Confirm & Post Anyway
            </Button>
            <Button size="xs" variant="outline" onClick={() => setDuplicateWarning(null)}>
              Edit Details
            </Button>
          </div>
        </div>
      )}

      {/* Step Form Container */}
      <div className="p-6 rounded-2xl bg-surface-900 border border-surface-800 space-y-4">
        {step === 1 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-surface-100">Step 1: Job Title & Basic Info</h3>
            <div>
              <label className="text-3xs font-mono text-surface-400 block mb-1">Job Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Senior Full Stack Node & React Developer"
                required
                className="w-full px-3 py-2.5 rounded-xl bg-surface-800 border border-surface-700 text-xs text-surface-100 focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-surface-100">Step 2: Detailed Scope & Qualifications</h3>
            <div>
              <label className="text-3xs font-mono text-surface-400 block mb-1">Job Description *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                placeholder="Detailed description of deliverables, qualifications, and project scope..."
                required
                className="w-full px-3 py-2.5 rounded-xl bg-surface-800 border border-surface-700 text-xs text-surface-100 focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-surface-100">Step 3: Budget & Experience Level</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-3xs font-mono text-surface-400 block mb-1">Work Type</label>
                <select
                  value={workType}
                  onChange={(e) => setWorkType(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-surface-800 border border-surface-700 text-xs text-surface-100 focus:outline-none focus:border-primary-500"
                >
                  <option value="FIXED">Fixed Price</option>
                  <option value="HOURLY">Hourly Rate</option>
                  <option value="MILESTONE">Milestone Based</option>
                </select>
              </div>

              <div>
                <label className="text-3xs font-mono text-surface-400 block mb-1">Budget ($USD)</label>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-surface-800 border border-surface-700 text-xs text-surface-100 focus:outline-none focus:border-primary-500"
                />
              </div>

              <div>
                <label className="text-3xs font-mono text-surface-400 block mb-1">Experience Level</label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-surface-800 border border-surface-700 text-xs text-surface-100 focus:outline-none focus:border-primary-500"
                >
                  <option value="ENTRY">Entry Level</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="EXPERT">Expert</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-surface-100">Step 4: Custom Screening Questions</h3>
            <div>
              <label className="text-3xs font-mono text-surface-400 block mb-1">Screening Question</label>
              <input
                type="text"
                value={screeningQuestion}
                onChange={(e) => setScreeningQuestion(e.target.value)}
                placeholder="e.g. Describe your experience with Node.js microservices?"
                className="w-full px-3 py-2.5 rounded-xl bg-surface-800 border border-surface-700 text-xs text-surface-100 focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-surface-100">Step 5: Attachments & Storage</h3>
            <p className="text-3xs text-surface-400">Attachments will be stored in Supabase storage buckets with signed download URLs.</p>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-surface-100">Step 6: Preview Job Posting</h3>
            <div className="p-4 rounded-xl bg-surface-950 space-y-2 text-xs">
              <p className="font-bold text-surface-100">{title || 'Untitled Opportunity'}</p>
              <p className="text-surface-300 text-3xs">{description || 'No description provided.'}</p>
              <div className="text-3xs font-mono text-emerald-400">Budget: ${budget} ({workType})</div>
            </div>
          </div>
        )}

        {step === 7 && (
          <div className="space-y-3 text-center">
            <h3 className="text-xs font-bold text-surface-100">Step 7: Confirm & Publish</h3>
            <p className="text-3xs text-surface-400">Publish opportunity to the global marketplace catalog.</p>
            <Button size="sm" variant="primary" onClick={() => handleSubmit(false)} isLoading={loading} leftIcon={<Check size={14} />}>
              Publish Opportunity Now
            </Button>
          </div>
        )}

        {/* Navigation Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-surface-800">
          <Button
            size="xs"
            variant="outline"
            onClick={() => setStep((prev) => Math.max(1, prev - 1))}
            disabled={step === 1}
            leftIcon={<ArrowLeft size={12} />}
          >
            Previous
          </Button>

          {step < 7 && (
            <Button
              size="xs"
              variant="primary"
              onClick={() => setStep((prev) => Math.min(7, prev + 1))}
              rightIcon={<ArrowRight size={12} />}
            >
              Next Step
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
