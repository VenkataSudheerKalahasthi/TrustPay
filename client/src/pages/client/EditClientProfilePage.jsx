import { useState, useEffect } from 'react';
import { clientProfileService } from '@services/client.service';
import { Button } from '@components/ui/Button';
import { useToast } from '@hooks/useToast';
import { PageLoader } from '@components/error/PageLoader';
import { Building2, Save } from 'lucide-react';

export function EditClientProfilePage() {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    companyType: '',
    companyWebsite: '',
    companyLogo: '',
    businessDescription: '',
    industry: '',
    city: '',
    state: '',
    country: 'India',
  });

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const prof = await clientProfileService.getMyProfile();
      if (prof) {
        setFormData({
          companyName: prof.companyName || '',
          companyType: prof.companyType || '',
          companyWebsite: prof.companyWebsite || '',
          companyLogo: prof.companyLogo || '',
          businessDescription: prof.businessDescription || '',
          industry: prof.industry || '',
          city: prof.city || '',
          state: prof.state || '',
          country: prof.country || 'India',
        });
      }
    } catch (err) {
      toast.error(err.message || 'Failed to load client profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await clientProfileService.updateProfile(formData);
      toast.success('Client company profile updated!');
    } catch (err) {
      toast.error(err.message || 'Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <PageLoader message="Loading Company Profile..." />;

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary-500/10 text-primary-400 border border-primary-500/20">
            <Building2 size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold font-display text-surface-50">Edit Client & Company Profile</h1>
            <p className="text-xs text-surface-400">Manage your business profile visible to hiring freelancers.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="glass-card p-6 flex flex-col gap-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-surface-300 block mb-1">Company / Business Name</label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              placeholder="e.g. Acme Technologies Inc"
              className="w-full px-3 py-2 text-xs bg-surface-950 border border-surface-800 rounded-xl text-surface-100 focus:outline-none focus:border-primary-500"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-surface-300 block mb-1">Business Type</label>
            <input
              type="text"
              value={formData.companyType}
              onChange={(e) => setFormData({ ...formData, companyType: e.target.value })}
              placeholder="e.g. Tech Startup, Agency, Enterprise"
              className="w-full px-3 py-2 text-xs bg-surface-950 border border-surface-800 rounded-xl text-surface-100 focus:outline-none focus:border-primary-500"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-surface-300 block mb-1">Company Website</label>
          <input
            type="url"
            value={formData.companyWebsite}
            onChange={(e) => setFormData({ ...formData, companyWebsite: e.target.value })}
            placeholder="https://example.com"
            className="w-full px-3 py-2 text-xs bg-surface-950 border border-surface-800 rounded-xl text-surface-100 focus:outline-none focus:border-primary-500"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-surface-300 block mb-1">Business Description</label>
          <textarea
            rows={4}
            value={formData.businessDescription}
            onChange={(e) => setFormData({ ...formData, businessDescription: e.target.value })}
            placeholder="Describe your company, products, and key hiring projects..."
            className="w-full px-3 py-2 text-xs bg-surface-950 border border-surface-800 rounded-xl text-surface-100 focus:outline-none focus:border-primary-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-surface-300 block mb-1">City</label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              placeholder="e.g. Mumbai"
              className="w-full px-3 py-2 text-xs bg-surface-950 border border-surface-800 rounded-xl text-surface-100 focus:outline-none focus:border-primary-500"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-surface-300 block mb-1">Country</label>
            <input
              type="text"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-surface-950 border border-surface-800 rounded-xl text-surface-100 focus:outline-none focus:border-primary-500"
            />
          </div>
        </div>

        <Button type="submit" variant="primary" size="md" isLoading={isSaving} leftIcon={<Save size={16} />}>
          Save Company Profile
        </Button>
      </form>
    </div>
  );
}
