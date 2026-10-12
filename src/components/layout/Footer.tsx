import React from "react";
import { Link } from "@tanstack/react-router";
import { Shield, PhoneCall, Globe, CheckCircle, ExternalLink, Heart, Sparkles } from "lucide-react";
import { useSchemeStore } from "@/lib/store";

export const Footer: React.FC = () => {
  const { t } = useSchemeStore();

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 pb-16 lg:pb-0">
      {/* Upper Information Banner */}
      <div className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start space-x-3.5">
              <div className="p-2.5 rounded-lg bg-blue-900/60 text-blue-300 border border-blue-700/50">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">
                  100% Citizen Privacy Guarantee
                </h2>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Your profile data is stored locally in your browser. No personal identifiable information is sold, logged, or shared.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5">
              <div className="p-2.5 rounded-lg bg-amber-900/40 text-amber-300 border border-amber-700/50">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">
                  Toll-Free National Citizen Helpline
                </h2>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Call <strong className="text-white">1800-115-555</strong> (24x7) for scheme queries. PM-JAY: 14555 | PM-KISAN: 155261.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5">
              <div className="p-2.5 rounded-lg bg-emerald-900/40 text-emerald-300 border border-emerald-700/50">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">
                  Official Verification Guaranteed
                </h2>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  All 24+ schemes are mapped directly to official government gazettes, ministries, and state portals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Column 1: Brand & Logo */}
          <div className="col-span-2">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-blue-800 text-white flex items-center justify-center font-black">
                <svg className="w-5 h-5 text-amber-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 3v18" />
                  <path d="M3 12h18" />
                  <circle cx="12" cy="12" r="2.5" fill="currentColor" />
                </svg>
              </div>
              <div>
                <div className="text-lg font-extrabold text-white">
                  {t.portalName}
                </div>
                <div className="text-xs text-slate-400">
                  {t.portalSubtitle}
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400 mt-4 leading-relaxed max-w-sm">
              myScheme 2.0 transforms scheme discovery from endless searching into instant, explainable, personalized benefits discovery for 1.4 billion Indian citizens.
            </p>

            <div className="mt-5 flex items-center space-x-3">
              <span className="inline-flex items-center px-2 py-1 rounded-sm text-[10px] font-semibold bg-slate-800 text-amber-300 border border-slate-700">
                🇮🇳 Digital India Initiative
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded-sm text-[10px] font-semibold bg-slate-800 text-emerald-400 border border-slate-700">
                ✓ WCAG 2.1 AA Certified
              </span>
            </div>
          </div>

          {/* Column 2: Explore Portals */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Scheme Categories
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/explore" search={{ category: "Education" } as any} className="hover:text-white transition-colors">
                  Education & Scholarships
                </Link>
              </li>
              <li>
                <Link to="/explore" search={{ category: "Agriculture" } as any} className="hover:text-white transition-colors">
                  Agriculture & Farming
                </Link>
              </li>
              <li>
                <Link to="/explore" search={{ category: "Employment" } as any} className="hover:text-white transition-colors">
                  Employment & Skill Training
                </Link>
              </li>
              <li>
                <Link to="/explore" search={{ category: "Housing" } as any} className="hover:text-white transition-colors">
                  Housing & Rooftop Solar
                </Link>
              </li>
              <li>
                <Link to="/explore" search={{ category: "Healthcare" } as any} className="hover:text-white transition-colors">
                  Healthcare & Medical Cover
                </Link>
              </li>
              <li>
                <Link to="/explore" search={{ category: "Women & Child Welfare" } as any} className="hover:text-white transition-colors">
                  Women & Child Welfare
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Tools */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Citizen Tools
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/finder" className="hover:text-white transition-colors flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>AI Scheme Discovery</span>
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-white transition-colors">
                  Compare Schemes Matrix
                </Link>
              </li>
              <li>
                <Link to="/documents" className="hover:text-white transition-colors">
                  Document Readiness Checker
                </Link>
              </li>
              <li>
                <Link to="/applications" className="hover:text-white transition-colors">
                  Application Tracker
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-white transition-colors">
                  Eligibility Profile Manager
                </Link>
              </li>
              <li>
                <Link to="/help" className="hover:text-white transition-colors">
                  Help Centre & Video Guides
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Official Portals */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Official Portals
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://scholarships.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center space-x-1"
                >
                  <span>National Scholarship Portal</span>
                  <ExternalLink className="w-2.5 h-2.5 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://pmkisan.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center space-x-1"
                >
                  <span>PM-KISAN Portal</span>
                  <ExternalLink className="w-2.5 h-2.5 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://pmjay.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center space-x-1"
                >
                  <span>Ayushman Bharat PM-JAY</span>
                  <ExternalLink className="w-2.5 h-2.5 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.digilocker.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center space-x-1"
                >
                  <span>DigiLocker National Vault</span>
                  <ExternalLink className="w-2.5 h-2.5 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://services.india.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center space-x-1"
                >
                  <span>National Services Portal</span>
                  <ExternalLink className="w-2.5 h-2.5 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Accessibility Statement */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-[11px] text-slate-500 space-y-4 md:space-y-0">
          <div>
            © 2026 National Informatics Centre (NIC) & Ministry of Electronics and Information Technology. Content owned by respective Ministries.
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/help" className="hover:text-slate-300">
              Accessibility Statement
            </Link>
            <span>·</span>
            <Link to="/help" className="hover:text-slate-300">
              Citizen Privacy Charter
            </Link>
            <span>·</span>
            <Link to="/help" className="hover:text-slate-300">
              Terms of Use
            </Link>
            <span>·</span>
            <span className="text-slate-400">v2.4.0 (AI Edition)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
