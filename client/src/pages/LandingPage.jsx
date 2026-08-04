import { LandingHero3D } from '@components/branding/LandingHero3D';
import { AnimatedStatistics } from '@components/branding/AnimatedStatistics';
import { BrandShowcase } from '@components/branding/BrandShowcase';
import { PlatformHighlights } from '@components/branding/PlatformHighlights';
import { InteractiveWorkflow } from '@components/branding/InteractiveWorkflow';
import { CustomerTrustSection } from '@components/branding/CustomerTrustSection';
import { EnterpriseFooter } from '@components/branding/EnterpriseFooter';
import { ParticleBackground } from '@components/branding/ParticleBackground';
import { FloatingShapes } from '@components/branding/FloatingShapes';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden">
      <ParticleBackground />
      <FloatingShapes />
      <main className="relative z-10">
        <LandingHero3D />
        <AnimatedStatistics />
        <BrandShowcase />
        <InteractiveWorkflow />
        <PlatformHighlights />
        <CustomerTrustSection />
      </main>
      <EnterpriseFooter />
    </div>
  );
}

export default LandingPage;
