import { motion } from 'framer-motion';
import { Shield, Zap, Lock, ArrowRight, CheckCircle2, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@components/ui/Button';
import { Card } from '@components/ui/Card';
import { Container } from '@components/common/Container';
import { ROUTES } from '@constants';
import { useTheme } from '@contexts/ThemeContext';
import heroImage from '../assets/home page light image.png';
import darkHeroImage from '../assets/home page dark image.png';

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
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div id="home-page" className="min-h-screen bg-surface-50 transition-colors duration-300">
      {/* ─── Hero Section ──────────────────────────────────────────────────── */}
      <section id="hero" className="relative w-full min-h-[calc(100vh-3.5rem)] bg-surface-50 overflow-hidden pt-4 lg:pt-6 pb-16 transition-colors duration-300">
        {/* Background Glows — purple in light, green in dark */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {isDark ? (
            <>
              <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full blur-[120px]"
                style={{ background: 'radial-gradient(circle, rgba(0,210,106,0.08) 0%, transparent 70%)' }} />
              <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px]"
                style={{ background: 'radial-gradient(circle, rgba(0,210,106,0.06) 0%, transparent 70%)' }} />
            </>
          ) : (
            <>
              <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-secondary-400/10 rounded-full blur-[120px]" />
              <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-primary-400/10 rounded-full blur-[120px]" />
            </>
          )}
        </div>

        <Container className="relative z-10 w-full">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 w-full">
            {/* ─── Left: Copy (48%) ─────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="flex flex-col gap-3 lg:gap-4 lg:w-[48%]"
            >
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-semibold text-xs self-start border ${
                isDark
                  ? 'border-primary-600/30 bg-primary-600/10 text-primary-600'
                  : 'border-primary-200 bg-primary-50 text-primary-700'
              }`}>
                🚀 Now in Beta — Join 50,000+ Professionals
              </div>

              <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-5xl xl:text-6xl text-surface-950 leading-[1.05] tracking-tight">
                Contracts & Escrow<br className="hidden lg:block" />{' '}
                <span className={isDark
                  ? 'text-primary-600'
                  : 'bg-gradient-to-r from-secondary-600 to-primary-600 bg-clip-text text-transparent'
                }>You Can Trust</span>
              </h1>

              <p className="text-surface-700 text-base lg:text-lg xl:text-xl leading-relaxed max-w-xl font-medium">
                TrustPay secures every freelance engagement with legally binding digital contracts,
                milestone-based escrow, and AI-powered dispute resolution — all in one platform.
              </p>

              {/* Trust Points */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 xl:gap-y-2.5">
                {trustPoints.map((point) => (
                  <div key={point} className="flex items-center gap-2">
                    <div className={`w-5 h-5 xl:w-6 xl:h-6 rounded-full flex items-center justify-center shrink-0 border ${
                      isDark
                        ? 'bg-primary-600/10 border-primary-600/30'
                        : 'bg-secondary-50 border-secondary-100'
                    }`}>
                      <CheckCircle2 size={12} className={isDark ? 'text-primary-600' : 'text-secondary-600'} style={{ width: 12, height: 12 }} />
                    </div>
                    <span className="text-xs xl:text-sm font-semibold text-surface-900">{point}</span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <Button
                  className={isDark
                    ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all'
                    : 'bg-gradient-to-r from-secondary-600 to-primary-600 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all'
                  }
                  size="lg"
                  rightIcon={<ArrowRight size={18} />}
                  id="hero-cta-primary"
                >
                  <Link to={ROUTES.REGISTER}>Start for Free</Link>
                </Button>
                <Button
                  className={isDark
                    ? 'bg-transparent border-2 border-surface-300 text-surface-900 hover:border-primary-600 hover:bg-primary-600/10 transition-all font-semibold'
                    : 'bg-card border-2 border-surface-200 text-surface-900 hover:border-primary-600 hover:bg-primary-50 transition-all font-semibold'
                  }
                  size="lg"
                  id="hero-cta-secondary"
                >
                  <a href="#how-it-works">See How It Works</a>
                </Button>
              </div>

              <p className="text-xs font-semibold text-surface-500">
                No credit card required · Free forever plan available
              </p>
            </motion.div>

            {/* ─── Right: Visual Asset (52%) ─────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative lg:w-[52%] w-full flex justify-center items-center h-[350px] sm:h-[450px] lg:h-auto lg:max-h-[90%]"
              id="hero-image-container"
            >
              {/* Ambient glow behind the illustration */}
              <div className="absolute inset-0 pointer-events-none flex justify-center items-center z-0">
                {isDark ? (
                  <div className="w-[85%] h-[85%] rounded-full blur-[80px]"
                    style={{ background: 'radial-gradient(circle at 50% 50%, rgba(0,210,106,0.12) 0%, transparent 70%)' }} />
                ) : (
                  <div className="w-[85%] h-[85%] bg-gradient-to-tr from-primary-200/40 via-white/20 to-secondary-200/40 rounded-full blur-[60px] xl:blur-[80px]" />
                )}
              </div>

              {/* Hero Illustration */}
              <img
                src={isDark ? darkHeroImage : heroImage}
                alt="TrustPay digitally signed contract with escrow security shield"
                className={`relative z-10 w-full h-auto object-contain ${isDark ? 'mix-blend-screen opacity-90' : 'mix-blend-multiply'}`}
                style={{
                  maxHeight: 'min(620px, 75vh)',
                  maskImage: 'radial-gradient(50% 50% at 50% 50%, black 75%, transparent 100%)',
                  WebkitMaskImage: 'radial-gradient(50% 50% at 50% 50%, black 75%, transparent 100%)',
                }}
              />

              {/* Floating: Contract Signed card */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-[5%] left-[0%] lg:left-[5%] rounded-xl shadow-lg px-3 py-2 xl:px-4 xl:py-3 flex items-center gap-2 text-xs xl:text-sm z-10 transition-colors duration-300"
                style={{
                  backgroundColor: isDark ? 'rgba(10,18,14,0.92)' : 'rgb(255,255,255)',
                  border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <div className="w-2 h-2 xl:w-2.5 xl:h-2.5 rounded-full bg-primary-600 animate-pulse" />
                <span className="text-surface-900 font-bold">Contract Signed</span>
              </motion.div>

              {/* Floating: Escrow Released card */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute bottom-[5%] right-[0%] lg:right-[5%] rounded-xl shadow-lg px-4 py-3 xl:px-5 xl:py-4 z-10 transition-colors duration-300"
                style={{
                  backgroundColor: isDark ? 'rgba(10,18,14,0.92)' : 'rgb(255,255,255)',
                  border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <p className="text-surface-700 text-[10px] xl:text-xs font-bold uppercase tracking-wider mb-0.5">Escrow Released</p>
                <p className="text-primary-600 font-black text-lg xl:text-xl">₹1,25,000</p>
              </motion.div>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-2 left-1/2 -translate-x-1/2 flex-col items-center gap-1 text-surface-500 hidden lg:flex"
          >
            <span className="text-[10px] font-bold uppercase tracking-widest">Scroll to explore</span>
            <ChevronDown size={16} />
          </motion.div>
        </Container>
      </section>

      {/* ─── Stats Section ──────────────────────────────────────────────────── */}
      <section id="stats" className="py-16 border-y border-surface-200 bg-surface-100 transition-colors duration-300">
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
                <p className="font-display font-black text-4xl sm:text-5xl bg-gradient-to-r from-secondary-600 to-primary-600 bg-clip-text text-transparent mb-1">{value}</p>
                <p className="text-surface-700 font-bold text-sm uppercase tracking-wider">{label}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* ─── Features Section ────────────────────────────────────────────────── */}
      <section id="features" className="py-24 bg-surface-50 transition-colors duration-300">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-100 text-surface-900 font-bold text-xs mb-4">Platform Features</div>
            <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-surface-950 mb-4">
              Everything you need to{' '}
              <span className="bg-gradient-to-r from-secondary-600 to-primary-600 bg-clip-text text-transparent">work with confidence</span>
            </h2>
            <p className="text-surface-600 text-lg max-w-2xl mx-auto font-medium">
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
                <Card variant="bordered" hoverable className="h-full bg-card border-surface-200 shadow-sm hover:shadow-md transition-all">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 border
                    ${color === 'primary' ? 'bg-primary-50 text-primary-600 border-primary-100' : ''}
                    ${color === 'secondary' ? 'bg-secondary-50 text-secondary-600 border-secondary-100' : ''}
                    ${color === 'accent' ? 'bg-accent-50 text-accent-600 border-accent-100' : ''}
                  `}>
                    <Icon size={24} />
                  </div>
                  <h3 className="font-display font-bold text-xl text-surface-900 mb-3">{title}</h3>
                  <p className="text-surface-600 text-sm leading-relaxed font-medium">{description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* ─── CTA Section ────────────────────────────────────────────────────── */}
      <section id="cta" className="py-24 bg-surface-50 transition-colors duration-300">
        <Container>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl bg-card border border-surface-200 p-12 sm:p-16 text-center overflow-hidden shadow-xl"
          >
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-r from-secondary-400/10 to-primary-400/10 rounded-full blur-[80px]" />
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary-200 bg-primary-50 text-primary-700 font-semibold text-xs mb-6 relative z-10">Get Started Today</div>
            <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-surface-950 mb-4 relative z-10">
              Ready to build trust in{' '}
              <span className="bg-gradient-to-r from-secondary-600 to-primary-600 bg-clip-text text-transparent">every transaction?</span>
            </h2>
            <p className="text-surface-600 font-medium text-lg mb-8 max-w-xl mx-auto relative z-10">
              Join thousands of freelancers and clients who trust TrustPay to protect their work and payments.
            </p>
            <Button
              className={`shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all relative z-10 ${
                isDark
                  ? 'bg-primary-600 text-white hover:bg-primary-700'
                  : 'bg-gradient-to-r from-secondary-600 to-primary-600 text-white'
              }`}
              size="xl"
              rightIcon={<ArrowRight size={20} />}
              id="cta-get-started-btn"
            >
              <Link to={ROUTES.REGISTER}>Create Free Account</Link>
            </Button>
          </motion.div>
        </Container>
      </section>
    </div>
  );
}
