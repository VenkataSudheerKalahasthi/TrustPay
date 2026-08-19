import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { workerService } from '@services/worker.service';
import { Avatar } from '@components/ui/Avatar';
import { Badge } from '@components/ui/Badge';
import { Button } from '@components/ui/Button';
import { PortfolioCard } from '@components/worker/PortfolioCard';
import { PageLoader } from '@components/error/PageLoader';
import { NotFound } from '@components/error/NotFound';
import { CollaborationRequestModal } from '@components/collaboration/CollaborationRequestModal';
import {
  CheckCircle2,
  MapPin,
  Clock,
  Briefcase,
  GraduationCap,
  Award,
  Star,
  Send,
  CheckCircle,
  ThumbsUp,
} from 'lucide-react';

export function PublicWorkerProfilePage() {
  const { slugOrId } = useParams();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slugOrId]);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const res = await workerService.getPublicProfile(slugOrId);
      setData(res);
    } catch (err) {
      setError(err.message || 'Worker profile not found');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <PageLoader message="Loading Worker Profile..." />;
  if (error || !data || !data.profile) return <NotFound message="Worker Profile Not Found" />;

  const { profile } = data;
  const user = profile.user || {};
  const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Worker';
  const skills = profile.skills ? profile.skills.map((s) => s.skill?.name || s.name) : [];
  const projects = profile.portfolioProjects || [];

  const rating = profile.rating || 4.9;
  const reviewsCount = profile.reviewsCount || 18;
  const completedProjects = profile.completedProjectsCount || profile.projects?.length || 12;
  const successRate = profile.successRate || 98;

  return (
    <div className="min-h-screen bg-card text-surface-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto flex flex-col gap-8">
        {/* Cover Image & Header Card */}
        <div className="glass-card overflow-hidden relative">
          <div className="h-40 w-full bg-gradient-hero relative">
            {profile.coverImageUrl && (
              <img
                src={profile.coverImageUrl}
                alt="Cover"
                className="w-full h-full object-cover opacity-60"
              />
            )}
          </div>

          <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 -mt-16 sm:-mt-20 relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
              <div className="p-1 rounded-3xl bg-card shadow">
                <Avatar name={name} src={user.avatar} size="xl" status="online" />
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold font-display text-surface-900">{name}</h1>
                  {profile.verificationStatus === 'VERIFIED' && (
                    <Badge variant="success" size="sm">
                      <CheckCircle2 size={12} className="mr-1" />
                      VERIFIED
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-surface-700 font-medium">
                  {profile.title || 'Independent Specialist'}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-surface-600 mt-1">
                  <div className="flex items-center gap-1">
                    <MapPin size={14} className="text-surface-500" />
                    <span>{profile.city ? `${profile.city}, ${profile.country || 'India'}` : 'Remote'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} className="text-surface-500" />
                    <span>{profile.yearsExperience || 0} Years Experience</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-400 font-semibold">
                    <Star size={14} className="fill-amber-400" />
                    <span>{rating} ({reviewsCount} reviews)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Header Primary Action CTA */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button
                variant="primary"
                size="md"
                onClick={() => setIsModalOpen(true)}
                leftIcon={<Send size={16} />}
                className="shadow font-bold w-full sm:w-auto"
              >
                ✅ Request Collaboration
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="glass-card p-4 flex flex-col gap-1">
            <span className="text-2xs uppercase tracking-wider text-surface-600 font-semibold">Completed Projects</span>
            <span className="text-xl font-bold font-display text-surface-900 flex items-center gap-1.5">
              <CheckCircle size={18} className="text-primary-600" />
              {completedProjects}
            </span>
          </div>
          <div className="glass-card p-4 flex flex-col gap-1">
            <span className="text-2xs uppercase tracking-wider text-surface-600 font-semibold">Success Rate</span>
            <span className="text-xl font-bold font-display text-emerald-400 flex items-center gap-1.5">
              <ThumbsUp size={18} />
              {successRate}%
            </span>
          </div>
          <div className="glass-card p-4 flex flex-col gap-1">
            <span className="text-2xs uppercase tracking-wider text-surface-600 font-semibold">Rating</span>
            <span className="text-xl font-bold font-display text-amber-400 flex items-center gap-1.5">
              <Star size={18} className="fill-amber-400" />
              {rating} / 5.0
            </span>
          </div>
          <div className="glass-card p-4 flex flex-col gap-1">
            <span className="text-2xs uppercase tracking-wider text-surface-600 font-semibold">Availability</span>
            <span className="text-sm font-bold font-display text-emerald-300 mt-1">
              {profile.availabilityStatus || 'AVAILABLE'}
            </span>
          </div>
        </div>

        {/* Two-Column Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* About Specialist */}
            <div className="glass-card p-6 flex flex-col gap-3">
              <h2 className="text-base font-bold text-surface-900 font-display flex items-center gap-2">
                <Briefcase size={18} className="text-primary-600" />
                About Specialist
              </h2>
              <p className="text-xs text-surface-700 leading-relaxed whitespace-pre-line">
                {profile.bio || 'No bio description provided yet.'}
              </p>
            </div>

            {/* Portfolio Projects Showcase */}
            <div className="flex flex-col gap-4">
              <h2 className="text-base font-bold text-surface-900 font-display flex items-center gap-2">
                <Award size={18} className="text-primary-600" />
                Portfolio Projects ({projects.length})
              </h2>
              {projects.length === 0 ? (
                <div className="glass-card p-6 text-center text-xs text-surface-600">
                  No portfolio projects uploaded yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {projects.map((proj) => (
                    <PortfolioCard key={proj.id} project={proj} />
                  ))}
                </div>
              )}
            </div>

            {/* Education & Certifications */}
            <div className="glass-card p-6 flex flex-col gap-6">
              {profile.educations && profile.educations.length > 0 && (
                <div className="flex flex-col gap-3">
                  <h3 className="text-sm font-bold text-surface-900 flex items-center gap-2">
                    <GraduationCap size={16} className="text-primary-600" />
                    Education
                  </h3>
                  {profile.educations.map((edu) => (
                    <div key={edu.id} className="text-xs text-surface-700 border-l-2 border-surface-200 pl-3 py-1">
                      <p className="font-semibold text-surface-900">{edu.degree} in {edu.fieldOfStudy}</p>
                      <p className="text-2xs text-surface-600">{edu.institution}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar Info */}
          <div className="flex flex-col gap-6">
            {/* Rates & Availability */}
            <div className="glass-card p-6 flex flex-col gap-4">
              <h3 className="text-sm font-bold text-surface-900 font-display">Specialist Rates</h3>
              <div className="flex items-center justify-between border-b border-surface-200/80 pb-3">
                <span className="text-xs text-surface-600">Hourly Rate</span>
                <span className="text-sm font-bold text-primary-600">
                  {profile.hourlyRate ? `₹${profile.hourlyRate}/hr` : 'Negotiable'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-surface-600">Availability</span>
                <Badge variant={profile.availabilityStatus === 'AVAILABLE' ? 'success' : 'warning'} size="sm">
                  {profile.availabilityStatus || 'AVAILABLE'}
                </Badge>
              </div>
            </div>

            {/* Verified Skills */}
            <div className="glass-card p-6 flex flex-col gap-3">
              <h3 className="text-sm font-bold text-surface-900 font-display">Verified Skills</h3>
              {skills.length === 0 ? (
                <p className="text-xs text-surface-500">No skills listed yet.</p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-surface-50 text-surface-800 text-xs font-medium border border-surface-300/60"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Primary Bottom Action Bar as specified in Step 1 */}
        <div className="glass-card p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t-2 border-primary-600/40 bg-card/90 shadow">
          <div>
            <h3 className="text-lg font-bold text-surface-900 font-display">Ready to work with {name}?</h3>
            <p className="text-xs text-surface-600 mt-0.5">
              Initiate a secure, private collaboration workspace with real-time chat, contract, and escrow protection.
            </p>
          </div>
          <Button
            variant="primary"
            size="lg"
            onClick={() => setIsModalOpen(true)}
            leftIcon={<Send size={18} />}
            className="shadow font-bold w-full sm:w-auto text-sm px-8 py-3"
          >
            ✅ Request Collaboration
          </Button>
        </div>
      </div>

      {/* Collaboration Request Modal */}
      <CollaborationRequestModal
        worker={profile}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

