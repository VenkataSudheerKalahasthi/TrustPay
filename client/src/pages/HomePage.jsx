import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { Shield, Zap, Lock, ArrowRight, CheckCircle2, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@components/ui/Button';
import { Badge } from '@components/ui/Badge';
import { Card } from '@components/ui/Card';
import { Container } from '@components/common/Container';
import { ROUTES } from '@constants';

// ─── Three.js Hero Scene ───────────────────────────────────────────────────

function HeroScene() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 500;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pLight1 = new THREE.PointLight(0x6366f1, 2.5, 50);
    pLight1.position.set(10, 10, 10);
    scene.add(pLight1);

    const pLight2 = new THREE.PointLight(0xd946ef, 1.8, 50);
    pLight2.position.set(-10, -10, -10);
    scene.add(pLight2);

    const pLight3 = new THREE.PointLight(0x10b981, 1.2, 50);
    pLight3.position.set(0, 10, -5);
    scene.add(pLight3);

    // Distorted Sphere
    const geometry = new THREE.SphereGeometry(1.6, 64, 64);
    const originalPositions = geometry.attributes.position.clone();
    const material = new THREE.MeshStandardMaterial({
      color: 0x6366f1,
      roughness: 0.1,
      metalness: 0.9,
      transparent: true,
      opacity: 0.85,
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Starfield Background
    const starsCount = 600;
    const starsGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starsCount * 3);
    for (let i = 0; i < starsCount * 3; i++) {
      starPositions[i] = (Math.random() - 0.5) * 40;
    }
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starsMaterial = new THREE.PointsMaterial({
      color: 0x818cf8,
      size: 0.08,
      transparent: true,
      opacity: 0.6,
    });
    const starField = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starField);

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation loop with smooth vertex distortion
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      sphere.rotation.x = elapsedTime * 0.1;
      sphere.rotation.y = elapsedTime * 0.15;
      starField.rotation.y = elapsedTime * 0.02;

      const pos = geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const u = originalPositions.getX(i);
        const v = originalPositions.getY(i);
        const w = originalPositions.getZ(i);

        const distortion = Math.sin(u * 2 + elapsedTime * 2) * Math.cos(v * 2 + elapsedTime * 2) * 0.12;
        pos.setXYZ(i, u + u * distortion, v + v * distortion, w + w * distortion);
      }
      pos.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      starsGeometry.dispose();
      starsMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full" style={{ background: 'transparent' }} />;
}

// ─── Feature Data ─────────────────────────────────────────────────────────────

const features = [
  {
    icon: Shield,
    title: 'Smart Contracts',
    description: 'Legally binding digital contracts with milestone tracking, automated payments, and dispute resolution.',
    color: 'primary',
  },
  {
    icon: Lock,
    title: 'Secure Escrow',
    description: 'Funds are held in secure escrow accounts and only released when both parties confirm milestone completion.',
    color: 'secondary',
  },
  {
    icon: Zap,
    title: 'Instant Payments',
    description: 'Razorpay-powered instant payouts directly to your bank account or UPI within minutes.',
    color: 'accent',
  },
];

const stats = [
  { value: '50K+', label: 'Active Users' },
  { value: '₹12Cr+', label: 'Secured in Escrow' },
  { value: '99.9%', label: 'Uptime' },
  { value: '0%', label: 'Fraud Rate' },
];

const trustPoints = [
  'Bank-grade AES-256 encryption',
  'DPDP Act compliant data handling',
  'Real-time dispute resolution',
  'Instant UPI & bank payouts',
  'AI-powered contract analysis',
  'Multi-party digital signatures',
];

// ─── Home Page ───────────────────────────────────────────────────────────────

export function HomePage() {
  return (
    <div id="home-page" className="min-h-screen bg-surface-950">
      {/* ─── Hero Section ──────────────────────────────────────────────────── */}
      <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-1 bg-gradient-brand opacity-60 blur-sm" />
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary-600/12 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-40 right-1/4 w-80 h-80 bg-secondary-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-accent-600/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <Container className="relative z-10 pt-24 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[85vh]">
            {/* ─── Left: Copy ─────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="flex flex-col gap-6"
            >
              <Badge variant="primary" dot size="md" id="hero-badge">
                🚀 Now in Beta — Join 50,000+ Professionals
              </Badge>

              <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-surface-50 leading-[1.1] tracking-tight">
                Contracts & Escrow{' '}
                <span className="gradient-text">You Can Trust</span>
              </h1>

              <p className="text-surface-400 text-lg sm:text-xl leading-relaxed max-w-xl">
                TrustPay secures every freelance engagement with legally binding digital contracts,
                milestone-based escrow, and AI-powered dispute resolution — all in one platform.
              </p>

              {/* Trust Points */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {trustPoints.map((point) => (
                  <div key={point} className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-accent-400 shrink-0" />
                    <span className="text-sm text-surface-300">{point}</span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  variant="gradient"
                  size="xl"
                  rightIcon={<ArrowRight size={20} />}
                  id="hero-cta-primary"
                >
                  <Link to={ROUTES.REGISTER}>Start for Free</Link>
                </Button>
                <Button
                  variant="outline"
                  size="xl"
                  id="hero-cta-secondary"
                >
                  <a href="#how-it-works">See How It Works</a>
                </Button>
              </div>

              <p className="text-xs text-surface-600">
                No credit card required · Free forever plan available
              </p>
            </motion.div>

            {/* ─── Right: 3D Scene ─────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative h-[450px] lg:h-[600px]"
              id="hero-3d-scene"
            >
              <HeroScene />

              {/* Floating badges on 3D */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-8 left-0 glass-card px-4 py-3 flex items-center gap-2 text-sm"
              >
                <div className="w-2 h-2 rounded-full bg-success-400 animate-pulse" />
                <span className="text-surface-300 font-medium">Contract Signed</span>
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute bottom-16 right-0 glass-card px-4 py-3 text-sm"
              >
                <p className="text-surface-400 text-xs">Escrow Released</p>
                <p className="text-accent-400 font-bold text-base">₹1,25,000</p>
              </motion.div>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-surface-600"
          >
            <span className="text-xs">Scroll to explore</span>
            <ChevronDown size={20} />
          </motion.div>
        </Container>
      </section>

      {/* ─── Stats Section ──────────────────────────────────────────────────── */}
      <section id="stats" className="py-16 border-y border-surface-800/50">
        <Container>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map(({ value, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <p className="font-display font-black text-4xl sm:text-5xl gradient-text mb-1">{value}</p>
                <p className="text-surface-400 text-sm">{label}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* ─── Features Section ────────────────────────────────────────────────── */}
      <section id="features" className="py-24">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="surface" size="md" className="mb-4">Platform Features</Badge>
            <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-surface-50 mb-4">
              Everything you need to{' '}
              <span className="gradient-text">work with confidence</span>
            </h2>
            <p className="text-surface-400 text-lg max-w-2xl mx-auto">
              Built specifically for the Indian freelance market with compliance,
              security, and speed as first-class priorities.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, description, color }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
              >
                <Card variant="default" hoverable className="h-full">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4
                    ${color === 'primary' ? 'bg-primary-500/15 text-primary-400' : ''}
                    ${color === 'secondary' ? 'bg-secondary-500/15 text-secondary-400' : ''}
                    ${color === 'accent' ? 'bg-accent-500/15 text-accent-400' : ''}
                  `}>
                    <Icon size={24} />
                  </div>
                  <h3 className="font-display font-bold text-xl text-surface-100 mb-3">{title}</h3>
                  <p className="text-surface-400 text-sm leading-relaxed">{description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* ─── CTA Section ────────────────────────────────────────────────────── */}
      <section id="cta" className="py-24">
        <Container>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl bg-gradient-hero border border-primary-500/20 p-12 sm:p-16 text-center overflow-hidden"
          >
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
            </div>
            <Badge variant="primary" dot size="md" className="mb-6">Get Started Today</Badge>
            <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-surface-50 mb-4 relative z-10">
              Ready to build trust in{' '}
              <span className="gradient-text">every transaction?</span>
            </h2>
            <p className="text-surface-300 text-lg mb-8 max-w-xl mx-auto relative z-10">
              Join thousands of freelancers and clients who trust TrustPay to protect their work and payments.
            </p>
            <Button
              variant="gradient"
              size="xl"
              rightIcon={<ArrowRight size={20} />}
              id="cta-get-started-btn"
              className="relative z-10"
            >
              <Link to={ROUTES.REGISTER}>Create Free Account</Link>
            </Button>
          </motion.div>
        </Container>
      </section>
    </div>
  );
}
