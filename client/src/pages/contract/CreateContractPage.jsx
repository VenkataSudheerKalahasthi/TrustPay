import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { contractService } from '@services/contract.service';
import { workerService } from '@services/worker.service';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { useToast } from '@hooks/useToast';
import { ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';

export function CreateContractPage() {
  const navigate = useNavigate();
  const toast = useToast();

  const [templates, setTemplates] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    workerProfileId: '',
    title: '',
    description: '',
    scopeOfWork: '',
    deliverables: '',
    termsAndConditions: '',
    paymentTermsText: '50% upfront upon agreement, 50% upon final milestone approval.',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [tmplRes, wrkRes] = await Promise.all([
        contractService.getTemplates(),
        workerService.searchWorkers({ limit: 50 }),
      ]);
      setTemplates(tmplRes || []);
      setWorkers(wrkRes?.workers || []);
    } catch {
      // Fallback defaults
    }
  };

  const handleSelectTemplate = (tmpl) => {
    setFormData((prev) => ({
      ...prev,
      title: tmpl.title,
      description: tmpl.description || '',
      scopeOfWork: tmpl.scopeOfWork,
      deliverables: tmpl.deliverables,
      termsAndConditions: tmpl.termsAndConditions,
    }));
    toast.success(`Loaded "${tmpl.title}" template details!`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.workerProfileId) {
      toast.error('Please select a worker / specialist for this contract');
      return;
    }

    setIsSubmitting(true);
    try {
      const contract = await contractService.createContract(formData);
      toast.success('Contract created and submitted for acceptance!');
      navigate(`/contracts/${contract.id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create contract');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-card border border-surface-200 text-surface-600 hover:text-surface-900"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-surface-900 font-display">
            Create Digital Contract
          </h1>
          <p className="text-xs text-surface-600">
            Define terms, deliverables, scope of work, and assign a specialist worker.
          </p>
        </div>
      </div>

      {/* Template Quick Selection Bar */}
      {templates.length > 0 && (
        <div className="glass-card p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-surface-800">
            <Sparkles size={14} className="text-primary-600" />
            <span>Use Template Preset:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {templates.map((tmpl) => (
              <button
                key={tmpl.id}
                type="button"
                onClick={() => handleSelectTemplate(tmpl)}
                className="px-3 py-1.5 rounded-xl bg-surface-100/80 hover:bg-primary-500/20 text-surface-700 hover:text-primary-700 text-xs font-medium border border-surface-300/50 transition-colors"
              >
                {tmpl.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="glass-card p-6 space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-surface-800 border-b border-surface-200/80 pb-2">
            1. Contract Parties & Title
          </h3>

          <div>
            <label className="block text-xs font-semibold text-surface-700 mb-1.5">
              Assigned Specialist / Worker *
            </label>
            <select
              value={formData.workerProfileId}
              onChange={(e) => setFormData({ ...formData, workerProfileId: e.target.value })}
              className="w-full bg-card border border-surface-200 rounded-xl px-3 py-2.5 text-xs text-surface-900 focus:outline-none focus:border-primary-600"
              required
            >
              <option value="">-- Select Worker --</option>
              {workers.map((w) => {
                const name = w.user
                  ? `${w.user.firstName} ${w.user.lastName}`
                  : w.title || 'Worker';
                return (
                  <option key={w.id} value={w.id}>
                    {name} ({w.title || 'Specialist'})
                  </option>
                );
              })}
            </select>
          </div>

          <Input
            label="Contract Title *"
            placeholder="e.g. Fullstack Web Application Development Service Agreement"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <div>
            <label className="block text-xs font-semibold text-surface-700 mb-1.5">
              Short Description
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief summary of the contract objective..."
              className="w-full bg-card border border-surface-200 rounded-xl p-3 text-xs text-surface-900 focus:outline-none focus:border-primary-600"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold text-surface-800 border-b border-surface-200/80 pb-2">
            2. Scope of Work & Deliverables
          </h3>

          <div>
            <label className="block text-xs font-semibold text-surface-700 mb-1.5">
              Scope of Work *
            </label>
            <textarea
              rows={4}
              value={formData.scopeOfWork}
              onChange={(e) => setFormData({ ...formData, scopeOfWork: e.target.value })}
              placeholder="Detailed description of responsibilities, features, tasks, and technical stack..."
              className="w-full bg-card border border-surface-200 rounded-xl p-3 text-xs text-surface-900 focus:outline-none focus:border-primary-600"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-surface-700 mb-1.5">
              Deliverables List *
            </label>
            <textarea
              rows={3}
              value={formData.deliverables}
              onChange={(e) => setFormData({ ...formData, deliverables: e.target.value })}
              placeholder="Enumerate explicit deliverables expected upon project completion..."
              className="w-full bg-card border border-surface-200 rounded-xl p-3 text-xs text-surface-900 focus:outline-none focus:border-primary-600"
              required
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold text-surface-800 border-b border-surface-200/80 pb-2">
            3. Terms & Schedules
          </h3>

          <div>
            <label className="block text-xs font-semibold text-surface-700 mb-1.5">
              Terms & Conditions *
            </label>
            <textarea
              rows={4}
              value={formData.termsAndConditions}
              onChange={(e) => setFormData({ ...formData, termsAndConditions: e.target.value })}
              placeholder="Specify intellectual property transfer, confidentiality, liability limits..."
              className="w-full bg-card border border-surface-200 rounded-xl p-3 text-xs text-surface-900 focus:outline-none focus:border-primary-600"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-surface-700 mb-1.5">
              Payment Terms (Text Notice)
            </label>
            <Input
              value={formData.paymentTermsText}
              onChange={(e) => setFormData({ ...formData, paymentTermsText: e.target.value })}
              placeholder="e.g. 50% deposit, 50% upon final sign-off"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="date"
              label="Start Date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            />
            <Input
              type="date"
              label="Estimated End Date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            />
          </div>
        </div>

        <div className="pt-4 border-t border-surface-200 flex justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isSubmitting}
            leftIcon={<CheckCircle2 size={16} />}
          >
            Create & Submit Contract
          </Button>
        </div>
      </form>
    </div>
  );
}

