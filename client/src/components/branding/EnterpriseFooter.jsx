import { AnimatedLogo3D } from './AnimatedLogo3D';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';
import { SOCIAL_LINKS } from '@constants';

const socialLinks = [
  { icon: Github, href: SOCIAL_LINKS.GITHUB, label: 'GitHub' },
  { icon: Twitter, href: SOCIAL_LINKS.TWITTER, label: 'Twitter' },
  { icon: Linkedin, href: SOCIAL_LINKS.LINKEDIN, label: 'LinkedIn' },
  { icon: Mail, href: SOCIAL_LINKS.EMAIL, label: 'Email' },
];

export function EnterpriseFooter() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-12 px-4 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <AnimatedLogo3D className="w-8 h-8" />
          <span className="font-extrabold text-white text-base tracking-tight">TrustPay Enterprise</span>
        </div>
        <p className="text-slate-500">© 2026 TrustPay Inc. All rights reserved. ISO 27001 Certified Escrow Infrastructure.</p>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                aria-label={label}
                id={`enterprise-footer-social-${label.toLowerCase()}`}
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-sky-400 hover:border-slate-700 transition-all duration-200"
              >
                <Icon size={14} />
              </a>
            ))}
          </div>
          <div className="flex gap-4">
            <a href="/login" className="hover:text-white">Portal Sign In</a>
            <a href="/register" className="hover:text-white">Register</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
