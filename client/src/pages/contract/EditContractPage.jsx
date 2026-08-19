import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { contractService } from '@services/contract.service';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { PageLoader } from '@components/error/PageLoader';
import { useToast } from '@hooks/useToast';
import { ArrowLeft, Save, AlertTriangle } from 'lucide-react';

export function EditContractPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [contract, setContract] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    scopeOfWork: '',
    deliverables: '',
    termsAndConditions: '',
    paymentTermsText: '',
    changeSummary: '',
  });

  useEffect(() => {
    loadContract();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadContract = async () => {
    setIsLoading(true);
    try {
      const data = await contractService.getContractById(id);
      if (data.status === 'ACCEPTED' || data.status === 'ARCHIVED') {
        toast.error('Accepted or Archived contracts cannot be edited directly.');
        navigate(`/contracts/${id}`);
        return;
      }

      setContract(data);
      setFormData({
        title: data.title || '',
        description: data.description || '',
        scopeOfWork: data.scopeOfWork || '',
        deliverables: data.deliverables || '',
        termsAndConditions: data.termsAndConditions || '',
        paymentTermsText: data.paymentTermsText || '',
        changeSummary: '',
      });
    } catch {
      toast.error('Failed to load contract details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.changeSummary) {
      toast.error('Please enter a change summary for this new version');
      return;
    }

    setIsSaving(true);
    try {
      await contractService.updateContract(id, formData);
      toast.success('Updated contract & created new version!');
      navigate(`/contracts/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update contract');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <PageLoader />;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
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
            Edit Contract & Create Version
          </h1>
          <p className="text-xs text-surface-600">
            Modifying terms will automatically generate version v{(contract?.currentVersionNumber || 1) + 1}.
          </p>
        </div>
      </div>

      <div className="bg-warning-500/10 border border-warning-500/20 p-4 rounded-2xl flex items-start gap-3">
        <AlertTriangle size={18} className="text-warning-400 shrink-0 mt-0.5" />
        <p className="text-xs text-warning-200 leading-relaxed">
          Editing this contract will generate an immutable version record. Both parties will be notified of contract changes.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-6 space-y-6">
        <Input
          label="Contract Title *"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />

        <div>
          <label className="block text-xs font-semibold text-surface-700 mb-1.5">
            Scope of Work *
          </label>
          <textarea
            rows={5}
            value={formData.scopeOfWork}
            onChange={(e) => setFormData({ ...formData, scopeOfWork: e.target.value })}
            className="w-full bg-card border border-surface-200 rounded-xl p-3 text-xs text-surface-900 focus:outline-none focus:border-primary-600"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-surface-700 mb-1.5">
            Deliverables *
          </label>
          <textarea
            rows={4}
            value={formData.deliverables}
            onChange={(e) => setFormData({ ...formData, deliverables: e.target.value })}
            className="w-full bg-card border border-surface-200 rounded-xl p-3 text-xs text-surface-900 focus:outline-none focus:border-primary-600"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-surface-700 mb-1.5">
            Terms & Conditions *
          </label>
          <textarea
            rows={4}
            value={formData.termsAndConditions}
            onChange={(e) => setFormData({ ...formData, termsAndConditions: e.target.value })}
            className="w-full bg-card border border-surface-200 rounded-xl p-3 text-xs text-surface-900 focus:outline-none focus:border-primary-600"
            required
          />
        </div>

        <Input
          label="Version Change Summary *"
          placeholder="e.g. Updated scope of work to include mobile responsiveness and bug fixes."
          value={formData.changeSummary}
          onChange={(e) => setFormData({ ...formData, changeSummary: e.target.value })}
          required
        />

        <div className="pt-4 border-t border-surface-200 flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSaving} leftIcon={<Save size={16} />}>
            Save New Version
          </Button>
        </div>
      </form>
    </div>
  );
}

