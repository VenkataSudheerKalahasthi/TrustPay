import { Link } from 'react-router-dom';
import { Shield, Github, Twitter, Linkedin, Mail, Heart } from 'lucide-react';
import { APP_NAME, SOCIAL_LINKS } from '@constants';

const footerLinks = {
  Platform: [
    { label: 'Features', href: '#features' },
    { label: 'How it Works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Security', href: '#security' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
  ],
  Support: [
    { label: 'Help Center', href: '/help' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Status', href: '/status' },
  ],
};

const socialLinks = [
  { icon: Github, href: SOCIAL_LINKS.GITHUB, label: 'GitHub' },
  { icon: Twitter, href: SOCIAL_LINKS.TWITTER, label: 'Twitter' },
  { icon: Linkedin, href: SOCIAL_LINKS.LINKEDIN, label: 'LinkedIn' },
  { icon: Mail, href: SOCIAL_LINKS.EMAIL, label: 'Email' },
];

/**
 * Application Footer
 *
 * Full-featured footer with column navigation, social links,
 * brand tagline, and copyright. Adapts to mobile.
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface-900 border-t border-surface-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* ─── Brand Column ─────────────────────────────────────────── */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4 w-fit group">
              <div className="w-9 h-9 rounded-xl bg-primary-500 flex items-center justify-center shadow-sm transition-shadow duration-300">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl text-surface-50">
                Trust<span className="gradient-text">Pay</span>
              </span>
            </Link>
            <p className="text-surface-400 text-sm leading-relaxed max-w-xs mb-6">
              The secure digital contract and escrow platform built for the future of work.
              Protect every transaction, every time.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  aria-label={label}
                  id={`footer-social-${label.toLowerCase()}`}
                  className="w-9 h-9 rounded-lg bg-surface-800 border border-surface-700 flex items-center justify-center text-surface-400 hover:text-primary-400 hover:border-primary-500/50 hover:bg-primary-500/10 transition-all duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* ─── Link Columns ─────────────────────────────────────────── */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="text-sm font-semibold text-surface-100 mb-4">{heading}</h3>
              <ul className="flex flex-col gap-3">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="text-sm text-surface-400 hover:text-surface-100 transition-colors duration-200"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ─── Bottom Bar ───────────────────────────────────────────── */}
        <div className="mt-12 pt-8 border-t border-surface-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-surface-500 flex items-center gap-1.5">
            © {currentYear} {APP_NAME}. All rights reserved.
          </p>
          <p className="text-sm text-surface-600 flex items-center gap-1">
            Built with <Heart size={12} className="text-danger-500 mx-0.5" /> for developers
          </p>
        </div>
      </div>
    </footer>
  );
}
