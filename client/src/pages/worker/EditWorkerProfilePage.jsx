import { useState, useEffect } from 'react';
import { workerService } from '@services/worker.service';
import { taxonomyService } from '@services/taxonomy.service';
import { ProfileCompletionBar } from '@components/worker/ProfileCompletionBar';
import { PortfolioCard } from '@components/worker/PortfolioCard';
import { GoogleLocationPicker } from '@components/maps/GoogleLocationPicker';
import { Button } from '@components/ui/Button';
import { Tabs } from '@components/ui/Tabs';
import { useToast } from '@hooks/useToast';
import { PageLoader } from '@components/error/PageLoader';
import {
  User,
  DollarSign,
  MapPin,
  Briefcase,
  ShieldCheck,
  Plus,
  Save,
  Upload,
} from 'lucide-react';

export function EditWorkerProfilePage() {
  const toast = useToast();
  const [profile, setProfile] = useState(null);
  const [_categories, setCategories] = useState([]);
  const [_skills, setSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    bio: '',
    hourlyRate: '',
    availabilityStatus: 'AVAILABLE',
    yearsExperience: 0,
    address: '',
    city: '',
    state: '',
    country: 'India',
    postalCode: '',
    latitude: null,
    longitude: null,
    formattedAddress: '',
  });

  // Portfolio Modal State
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    projectUrl: '',
    githubUrl: '',
    technologies: '',
  });

  // Verification Document State
  const [docType, setDocType] = useState('GOVERNMENT_ID');
  const [docNumber, setDocNumber] = useState('');
  const [docUrl, setDocUrl] = useState('');

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [prof, tax] = await Promise.all([
        workerService.getMyProfile(),
        taxonomyService.getTaxonomies(),
      ]);
      setProfile(prof);
      setCategories(tax.categories || []);
      setSkills(tax.skills || []);

      if (prof) {
        setFormData({
          title: prof.title || '',
          bio: prof.bio || '',
          hourlyRate: prof.hourlyRate || '',
          availabilityStatus: prof.availabilityStatus || 'AVAILABLE',
          yearsExperience: prof.yearsExperience || 0,
          address: prof.address || '',
          city: prof.city || '',
          state: prof.state || '',
          country: prof.country || 'India',
          postalCode: prof.postalCode || '',
          latitude: prof.latitude || null,
          longitude: prof.longitude || null,
          formattedAddress: prof.formattedAddress || '',
        });
      }
    } catch (err) {
      toast.error(err.message || 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e?.preventDefault();
    try {
      setIsSaving(true);
      const updated = await workerService.updateProfile({
        ...formData,
        hourlyRate: formData.hourlyRate ? Number(formData.hourlyRate) : null,
        yearsExperience: Number(formData.yearsExperience) || 0,
      });
      setProfile(updated);
      toast.success('Worker profile saved successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddPortfolio = async (e) => {
    e.preventDefault();
    try {
      const techArray = newProject.technologies.split(',').map((t) => t.trim()).filter(Boolean);
      await workerService.addPortfolioProject({
        ...newProject,
        technologies: techArray,
      });
      toast.success('Portfolio project added!');
      setNewProject({ title: '', description: '', projectUrl: '', githubUrl: '', technologies: '' });
      loadData();
    } catch (err) {
      toast.error(err.message || 'Failed to add portfolio project');
    }
  };

  const handleDeletePortfolio = async (id) => {
    try {
      await workerService.deletePortfolioProject(id);
      toast.success('Portfolio project deleted');
      loadData();
    } catch (err) {
      toast.error(err.message || 'Failed to delete portfolio project');
    }
  };

  const handleSubmitVerificationDoc = async (e) => {
    e.preventDefault();
    try {
      await workerService.submitVerificationDocument({
        documentType: docType,
        documentUrl: docUrl || 'https://storage.trustpay.dev/verification-documents/sample-doc.pdf',
        documentNumber: docNumber || undefined,
      });
      toast.success('Verification document submitted for review!');
      setDocNumber('');
      setDocUrl('');
      loadData();
    } catch (err) {
      toast.error(err.message || 'Failed to submit verification document');
    }
  };

  if (isLoading) return <PageLoader message="Loading Profile Editor..." />;

  const missingItems = [];
  if (!formData.title || !formData.bio) missingItems.push('Bio & Title');
  if (!formData.hourlyRate) missingItems.push('Hourly Rate');
  if (!profile?.resumeUrl) missingItems.push('Resume Upload');
  if (!profile?.skills || profile.skills.length === 0) missingItems.push('Verified Skills');
  if (!profile?.portfolioProjects || profile.portfolioProjects.length === 0) missingItems.push('Portfolio Showcase');

  const personalTab = (
    <div className="flex flex-col gap-4">
      <div>
        <label className="text-xs font-semibold text-surface-700 block mb-1">Professional Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g. Senior Fullstack React & Node.js Engineer"
          className="w-full px-3 py-2 text-xs bg-card border border-surface-200 rounded-xl text-surface-900 focus:outline-none focus:border-primary-600"
        />
      </div>
      <div>
        <label className="text-xs font-semibold text-surface-700 block mb-1">About Me (Bio)</label>
        <textarea
          rows={5}
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          placeholder="Describe your professional background, key achievements, and specialization..."
          className="w-full px-3 py-2 text-xs bg-card border border-surface-200 rounded-xl text-surface-900 focus:outline-none focus:border-primary-600"
        />
      </div>
      <div>
        <label className="text-xs font-semibold text-surface-700 block mb-1">Years of Experience</label>
        <input
          type="number"
          value={formData.yearsExperience}
          onChange={(e) => setFormData({ ...formData, yearsExperience: e.target.value })}
          className="w-full px-3 py-2 text-xs bg-card border border-surface-200 rounded-xl text-surface-900 focus:outline-none focus:border-primary-600"
        />
      </div>
    </div>
  );

  const ratesTab = (
    <div className="flex flex-col gap-4">
      <div>
        <label className="text-xs font-semibold text-surface-700 block mb-1">Hourly Rate (₹ INR)</label>
        <input
          type="number"
          value={formData.hourlyRate}
          onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
          placeholder="e.g. 1500"
          className="w-full px-3 py-2 text-xs bg-card border border-surface-200 rounded-xl text-surface-900 focus:outline-none focus:border-primary-600"
        />
      </div>
      <div>
        <label className="text-xs font-semibold text-surface-700 block mb-1">Availability Status</label>
        <select
          value={formData.availabilityStatus}
          onChange={(e) => setFormData({ ...formData, availabilityStatus: e.target.value })}
          className="w-full px-3 py-2 text-xs bg-card border border-surface-200 rounded-xl text-surface-900 focus:outline-none focus:border-primary-600"
        >
          <option value="AVAILABLE">Available Now</option>
          <option value="BUSY">Busy with Projects</option>
          <option value="ON_VACATION">On Vacation</option>
          <option value="OFFLINE">Offline</option>
        </select>
      </div>
    </div>
  );

  const locationTab = (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-surface-700 block mb-1">City</label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            placeholder="e.g. Bengaluru"
            className="w-full px-3 py-2 text-xs bg-card border border-surface-200 rounded-xl text-surface-900 focus:outline-none focus:border-primary-600"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-surface-700 block mb-1">State</label>
          <input
            type="text"
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            placeholder="e.g. Karnataka"
            className="w-full px-3 py-2 text-xs bg-card border border-surface-200 rounded-xl text-surface-900 focus:outline-none focus:border-primary-600"
          />
        </div>
      </div>

      <GoogleLocationPicker
        latitude={formData.latitude}
        longitude={formData.longitude}
        city={formData.city}
        state={formData.state}
        country={formData.country}
        address={formData.formattedAddress}
        onChange={(loc) => {
          setFormData({
            ...formData,
            latitude: loc.latitude,
            longitude: loc.longitude,
            formattedAddress: loc.formattedAddress,
          });
        }}
      />
    </div>
  );

  const portfolioTab = (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleAddPortfolio} className="glass-card p-4 flex flex-col gap-3">
        <h3 className="text-xs font-bold text-surface-800 uppercase tracking-wider">Add Portfolio Project</h3>
        <input
          type="text"
          value={newProject.title}
          onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
          placeholder="Project Title *"
          required
          className="w-full px-3 py-1.5 text-xs bg-card border border-surface-200 rounded-xl text-surface-900"
        />
        <textarea
          rows={2}
          value={newProject.description}
          onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
          placeholder="Project Description"
          className="w-full px-3 py-1.5 text-xs bg-card border border-surface-200 rounded-xl text-surface-900"
        />
        <input
          type="text"
          value={newProject.technologies}
          onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value })}
          placeholder="Technologies used (comma separated, e.g. React, Node.js, PostgreSQL)"
          className="w-full px-3 py-1.5 text-xs bg-card border border-surface-200 rounded-xl text-surface-900"
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            type="url"
            value={newProject.projectUrl}
            onChange={(e) => setNewProject({ ...newProject, projectUrl: e.target.value })}
            placeholder="Live Demo URL"
            className="w-full px-3 py-1.5 text-xs bg-card border border-surface-200 rounded-xl text-surface-900"
          />
          <input
            type="url"
            value={newProject.githubUrl}
            onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
            placeholder="GitHub Repo URL"
            className="w-full px-3 py-1.5 text-xs bg-card border border-surface-200 rounded-xl text-surface-900"
          />
        </div>
        <Button type="submit" variant="outline" size="xs" leftIcon={<Plus size={14} />}>
          Add Project
        </Button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {(profile?.portfolioProjects || []).map((p) => (
          <PortfolioCard key={p.id} project={p} onDelete={handleDeletePortfolio} />
        ))}
      </div>
    </div>
  );

  const verificationTab = (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmitVerificationDoc} className="glass-card p-5 flex flex-col gap-3">
        <h3 className="text-xs font-bold text-surface-800 uppercase tracking-wider">
          Upload Government Verification Document
        </h3>
        <select
          value={docType}
          onChange={(e) => setDocType(e.target.value)}
          className="w-full px-3 py-2 text-xs bg-card border border-surface-200 rounded-xl text-surface-800"
        >
          <option value="GOVERNMENT_ID">Government Issued ID</option>
          <option value="PASSPORT">Passport</option>
          <option value="DRIVING_LICENSE">Driving License</option>
          <option value="PAN_CARD">PAN Card (India)</option>
          <option value="AADHAAR_CARD">Aadhaar Card (India)</option>
        </select>
        <input
          type="text"
          value={docNumber}
          onChange={(e) => setDocNumber(e.target.value)}
          placeholder="Document ID Number (Optional)"
          className="w-full px-3 py-2 text-xs bg-card border border-surface-200 rounded-xl text-surface-900"
        />
        <input
          type="url"
          value={docUrl}
          onChange={(e) => setDocUrl(e.target.value)}
          placeholder="Document File Storage URL"
          className="w-full px-3 py-2 text-xs bg-card border border-surface-200 rounded-xl text-surface-900"
        />
        <Button type="submit" variant="primary" size="xs" leftIcon={<Upload size={14} />}>
          Submit Document for Audit
        </Button>
      </form>

      {/* Submitted Documents History */}
      <div className="glass-card p-5 flex flex-col gap-3">
        <h4 className="text-xs font-bold text-surface-800 uppercase tracking-wider">Document History</h4>
        {(profile?.verificationDocuments || []).length === 0 ? (
          <p className="text-xs text-surface-500">No verification documents submitted yet.</p>
        ) : (
          profile.verificationDocuments.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between p-3 rounded-xl bg-card border border-surface-200 text-xs">
              <span className="font-semibold text-surface-900">{doc.documentType}</span>
              <span className="text-2xs font-mono text-warning-400">{doc.verificationStatus}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const tabsConfig = [
    { id: 'personal', label: 'Personal Info', icon: User, content: personalTab },
    { id: 'rates', label: 'Rates & Availability', icon: DollarSign, content: ratesTab },
    { id: 'location', label: 'Location & Map', icon: MapPin, content: locationTab },
    { id: 'portfolio', label: 'Portfolio Showcase', icon: Briefcase, content: portfolioTab },
    { id: 'verification', label: 'Verification Docs', icon: ShieldCheck, content: verificationTab },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto py-6">
      {/* Profile Completion Header */}
      <ProfileCompletionBar
        completionPercentage={profile?.profileCompletion || 0}
        missingItems={missingItems}
      />

      {/* Main Form Area */}
      <form onSubmit={handleSaveProfile} className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold font-display text-surface-900">Edit Specialist Profile</h2>
          <Button type="submit" variant="primary" size="sm" isLoading={isSaving} leftIcon={<Save size={14} />}>
            Save Changes
          </Button>
        </div>

        <Tabs tabs={tabsConfig} activeTab={activeTab} onChange={setActiveTab} />
      </form>
    </div>
  );
}

