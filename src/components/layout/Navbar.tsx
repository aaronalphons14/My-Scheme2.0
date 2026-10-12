import React, { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Search,
  Sparkles,
  Bookmark,
  FileText,
  Clock,
  HelpCircle,
  Menu,
  X,
  Volume2,
  VolumeX,
  Globe,
  CheckCircle2,
  AlertCircle,
  Eye,
  SlidersHorizontal,
  Home,
  Compass,
  ArrowRight,
  ShieldCheck,
  Scale,
} from "lucide-react";
import { useSchemeStore } from "@/lib/store";
import type { LanguageCode } from "@/lib/types";
import { speakText, stopSpeaking } from "@/lib/speech";

interface NavbarProps {
  onOpenSearch: () => void;
  onOpenA11y: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch, onOpenA11y }) => {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const {
    profile,
    t,
    language,
    setLanguage,
    savedSchemes,
    comparedSchemes,
    unreadCount,
    notifications,
    markNotificationRead,
    a11y,
  } = useSchemeStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [isSpeakingNav, setIsSpeakingNav] = useState(false);

  const languages: { code: LanguageCode; label: string; native: string }[] = [
    { code: "en", label: "English", native: "English" },
    { code: "hi", label: "Hindi", native: "हिन्दी" },
    { code: "ta", label: "Tamil", native: "தமிழ்" },
    { code: "te", label: "Telugu", native: "తెలుగు" },
    { code: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
    { code: "ml", label: "Malayalam", native: "മലയാളം" },
  ];

  // Calculate profile completeness
  const profileFields = [
    profile.name,
    profile.age,
    profile.state,
    profile.occupation,
    profile.income,
    profile.gender,
    profile.category,
    profile.education,
  ];
  const filledCount = profileFields.filter((f) => f !== undefined && f !== "").length;
  const profileCompleteness = Math.round((filledCount / profileFields.length) * 100);

  const toggleSpeakHeader = () => {
    if (isSpeakingNav) {
      stopSpeaking();
      setIsSpeakingNav(false);
    } else {
      setIsSpeakingNav(true);
      speakText(
        `${t.portalName}. ${t.portalSubtitle}. ${t.heroHeadline}`,
        language,
        () => setIsSpeakingNav(false),
      );
    }
  };

  return (
    <>
      {/* Accessibility Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-amber-400 focus:text-slate-900 focus:font-semibold focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900"
      >
        Skip to main content
      </a>

      {/* Top Official Government of India Header Stripe */}
      <div className="bg-slate-900 text-slate-100 text-xs border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* Indian Tricolor subtle flag accent */}
            <div className="flex h-3 w-5 overflow-hidden rounded-xs border border-white/20 shadow-xs" aria-hidden="true">
              <span className="w-1/3 bg-[#FF9933] h-full" />
              <span className="w-1/3 bg-white h-full relative">
                <span className="absolute inset-0 m-auto w-1 h-1 rounded-full bg-[#000080]" />
              </span>
              <span className="w-1/3 bg-[#138808] h-full" />
            </div>
            <span className="font-medium text-slate-200">
              भारत सरकार | Government of India
            </span>
            <span className="hidden md:inline-block text-slate-400">·</span>
            <span className="hidden md:inline-block text-slate-400">
              {t.nationalPortal}
            </span>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            {/* Text to Speech Read Out */}
            <button
              onClick={toggleSpeakHeader}
              className="hidden sm:inline-flex items-center space-x-1 text-slate-300 hover:text-white transition-colors"
              aria-label={isSpeakingNav ? "Stop reading" : "Read page summary aloud"}
            >
              {isSpeakingNav ? <VolumeX className="w-3.5 h-3.5 text-amber-400 animate-pulse" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span>{isSpeakingNav ? "Stop Audio" : "Screen Audio"}</span>
            </button>

            {/* Accessibility Settings Trigger */}
            <button
              onClick={onOpenA11y}
              className="inline-flex items-center space-x-1 text-slate-300 hover:text-white px-2 py-0.5 rounded-sm hover:bg-slate-800 transition-colors"
              aria-label="Open accessibility preferences"
            >
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-medium">A+ / A-</span>
            </button>

            {/* Language Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="inline-flex items-center space-x-1 text-slate-200 hover:text-white px-2 py-0.5 rounded-sm hover:bg-slate-800 transition-colors"
                aria-expanded={langDropdownOpen}
                aria-haspopup="true"
              >
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                <span className="font-semibold uppercase tracking-wider text-[11px]">{language}</span>
                <span className="text-slate-400">({languages.find((l) => l.code === language)?.native})</span>
              </button>

              {langDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setLangDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-1 w-48 bg-white text-slate-900 rounded-md shadow-xl border border-slate-200 py-1.5 z-50 text-xs">
                    <div className="px-3 py-1 font-semibold text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-100">
                      Select Portal Language
                    </div>
                    {languages.map((item) => (
                      <button
                        key={item.code}
                        onClick={() => {
                          setLanguage(item.code);
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-blue-50 transition-colors ${
                          language === item.code ? "bg-blue-50/80 font-bold text-blue-900" : "text-slate-700"
                        }`}
                      >
                        <span>{item.native}</span>
                        <span className="text-[11px] text-slate-400 font-normal">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            {/* Logo and Emblem */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-950 text-white flex items-center justify-center shadow-md shadow-blue-950/15 group-hover:scale-105 transition-transform">
                {/* Ashoka Chakra / Dharma Emblem Graphic */}
                <svg className="w-6 h-6 text-amber-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 3v18" />
                  <path d="M3 12h18" />
                  <path d="m5.6 5.6 12.8 12.8" />
                  <path d="m18.4 5.6-12.8 12.8" />
                  <circle cx="12" cy="12" r="2.5" fill="currentColor" />
                </svg>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center space-x-1.5">
                  <span className="text-xl font-extrabold tracking-tight text-blue-950 group-hover:text-blue-900 transition-colors">
                    {t.portalName}
                  </span>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-sm text-[10px] font-semibold bg-blue-100 text-blue-900">
                    Official
                  </span>
                </div>
                <span className="text-[11px] font-medium text-slate-500 leading-tight">
                  {t.portalSubtitle}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1 font-medium text-sm text-slate-700">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md transition-colors ${
                  currentPath === "/"
                    ? "text-blue-900 bg-blue-50/80 font-bold"
                    : "hover:text-blue-900 hover:bg-slate-100"
                }`}
              >
                {t.home}
              </Link>

              <Link
                to="/explore"
                className={`px-3 py-2 rounded-md transition-colors ${
                  currentPath.startsWith("/explore")
                    ? "text-blue-900 bg-blue-50/80 font-bold"
                    : "hover:text-blue-900 hover:bg-slate-100"
                }`}
              >
                {t.exploreSchemes}
              </Link>

              <Link
                to="/finder"
                className={`relative px-3 py-2 rounded-md transition-colors flex items-center space-x-1.5 ${
                  currentPath.startsWith("/finder")
                    ? "text-blue-900 bg-blue-50/80 font-bold"
                    : "hover:text-blue-900 hover:bg-slate-100"
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                <span>{t.smartFinder}</span>
                <span className="ml-1 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white uppercase tracking-wider">
                  AI
                </span>
              </Link>

              <Link
                to="/compare"
                className={`relative px-3 py-2 rounded-md transition-colors flex items-center space-x-1 ${
                  currentPath.startsWith("/compare")
                    ? "text-blue-900 bg-blue-50/80 font-bold"
                    : "hover:text-blue-900 hover:bg-slate-100"
                }`}
              >
                <Scale className="w-4 h-4 text-slate-500" />
                <span>{t.compare}</span>
                {comparedSchemes.length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-blue-700 text-white text-[10px] flex items-center justify-center font-bold">
                    {comparedSchemes.length}
                  </span>
                )}
              </Link>

              <Link
                to="/documents"
                className={`px-3 py-2 rounded-md transition-colors ${
                  currentPath.startsWith("/documents")
                    ? "text-blue-900 bg-blue-50/80 font-bold"
                    : "hover:text-blue-900 hover:bg-slate-100"
                }`}
              >
                {t.myDocuments}
              </Link>

              <Link
                to="/applications"
                className={`px-3 py-2 rounded-md transition-colors ${
                  currentPath.startsWith("/applications")
                    ? "text-blue-900 bg-blue-50/80 font-bold"
                    : "hover:text-blue-900 hover:bg-slate-100"
                }`}
              >
                {t.myApplications}
              </Link>

              <Link
                to="/help"
                className={`px-3 py-2 rounded-md transition-colors ${
                  currentPath.startsWith("/help")
                    ? "text-blue-900 bg-blue-50/80 font-bold"
                    : "hover:text-blue-900 hover:bg-slate-100"
                }`}
              >
                {t.help}
              </Link>
            </nav>

            {/* Right Icons: Search, Notifications, Profile */}
            <div className="flex items-center space-x-2">
              {/* Quick Search Button */}
              <button
                onClick={onOpenSearch}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-slate-500 hover:text-slate-800 bg-slate-100/80 hover:bg-slate-200/70 border border-slate-200 text-xs transition-colors"
                aria-label="Search schemes"
              >
                <Search className="w-4 h-4 text-blue-900" />
                <span className="hidden sm:inline-block font-medium">Search...</span>
                <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white rounded-sm border border-slate-300 text-slate-400">
                  Ctrl K
                </kbd>
              </button>

              {/* Notifications Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                  className="relative p-2 rounded-lg text-slate-600 hover:text-blue-950 hover:bg-slate-100 transition-colors"
                  aria-label="View notifications"
                >
                  <Clock className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-red-600 ring-2 ring-white animate-pulse" />
                  )}
                </button>

                {notifDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setNotifDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-900">
                          Notifications & Alerts
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 font-semibold">
                          {unreadCount} unread
                        </span>
                      </div>
                      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                        {notifications.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => markNotificationRead(item.id)}
                            className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer ${
                              !item.read ? "bg-blue-50/40" : ""
                            }`}
                          >
                            <div className="flex items-start space-x-2.5">
                              {item.type === "deadline" ? (
                                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                              ) : (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                              )}
                              <div className="flex-1">
                                <div className="text-xs font-semibold text-slate-900">
                                  {item.title}
                                </div>
                                <div className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                                  {item.message}
                                </div>
                                <div className="text-[10px] text-slate-400 mt-1">
                                  {item.timestamp}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Profile Avatar / Menu */}
              <Link
                to="/profile"
                className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors group"
                aria-label="View user profile"
              >
                <div className="relative w-8 h-8 rounded-full bg-blue-950 text-white flex items-center justify-center font-bold text-xs ring-2 ring-blue-900/20 shadow-xs">
                  {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
                  {/* Completeness Badge Indicator */}
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                      profileCompleteness >= 80
                        ? "bg-emerald-500"
                        : profileCompleteness >= 40
                          ? "bg-amber-500"
                          : "bg-red-400"
                    }`}
                    title={`Profile ${profileCompleteness}% complete`}
                  />
                </div>
                <div className="hidden xl:flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-900 line-clamp-1">
                    {profile.name || "Citizen User"}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {profileCompleteness}% Profile
                  </span>
                </div>
              </Link>

              {/* Mobile Menu Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-colors"
                aria-label="Toggle mobile menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3 shadow-xl animate-in slide-in-from-top-4 duration-200">
            <div className="p-3 rounded-lg bg-blue-50/60 border border-blue-100 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-sm">
                  {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    {profile.name || "Citizen Profile"}
                  </div>
                  <div className="text-[11px] text-slate-600">
                    {profile.state || "State not set"} · {profile.occupation || "Occupation not set"}
                  </div>
                </div>
              </div>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-bold text-blue-900 hover:underline flex items-center space-x-1"
              >
                <span>Edit</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm font-medium">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 p-2.5 rounded-lg hover:bg-slate-100 text-slate-800"
              >
                <Home className="w-4 h-4 text-blue-900" />
                <span>{t.home}</span>
              </Link>

              <Link
                to="/explore"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 p-2.5 rounded-lg hover:bg-slate-100 text-slate-800"
              >
                <Compass className="w-4 h-4 text-blue-900" />
                <span>{t.exploreSchemes}</span>
              </Link>

              <Link
                to="/finder"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 p-2.5 rounded-lg bg-blue-50 text-blue-950 font-bold"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>{t.smartFinder}</span>
              </Link>

              <Link
                to="/compare"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 p-2.5 rounded-lg hover:bg-slate-100 text-slate-800"
              >
                <Scale className="w-4 h-4 text-blue-900" />
                <span>{t.compare} ({comparedSchemes.length})</span>
              </Link>

              <Link
                to="/documents"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 p-2.5 rounded-lg hover:bg-slate-100 text-slate-800"
              >
                <FileText className="w-4 h-4 text-blue-900" />
                <span>{t.myDocuments}</span>
              </Link>

              <Link
                to="/applications"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 p-2.5 rounded-lg hover:bg-slate-100 text-slate-800"
              >
                <Clock className="w-4 h-4 text-blue-900" />
                <span>{t.myApplications}</span>
              </Link>

              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 p-2.5 rounded-lg hover:bg-slate-100 text-slate-800"
              >
                <Bookmark className="w-4 h-4 text-blue-900" />
                <span>{t.savedSchemes} ({savedSchemes.length})</span>
              </Link>

              <Link
                to="/help"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 p-2.5 rounded-lg hover:bg-slate-100 text-slate-800"
              >
                <HelpCircle className="w-4 h-4 text-blue-900" />
                <span>{t.help}</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Bottom Tab Bar (fixed at bottom for mobile-first accessibility) */}
      <nav
        aria-label="Mobile Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 shadow-lg"
      >
        <div className="grid grid-cols-5 text-center">
          <Link
            to="/"
            className={`min-h-[44px] flex flex-col items-center justify-center py-1 text-[10px] font-medium transition-colors ${
              currentPath === "/" ? "text-blue-950 font-bold" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Home className="w-5 h-5 mb-0.5" />
            <span>{t.home}</span>
          </Link>

          <Link
            to="/explore"
            className={`min-h-[44px] flex flex-col items-center justify-center py-1 text-[10px] font-medium transition-colors ${
              currentPath.startsWith("/explore") ? "text-blue-950 font-bold" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Compass className="w-5 h-5 mb-0.5" />
            <span>Explore</span>
          </Link>

          <Link
            to="/finder"
            className="min-h-[44px] flex flex-col items-center justify-center py-1 relative group"
          >
            <div className="w-10 h-10 -mt-5 rounded-full bg-gradient-to-tr from-blue-950 via-blue-900 to-indigo-800 text-white flex items-center justify-center shadow-lg shadow-blue-900/30 group-active:scale-95 transition-transform">
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
            <span className="text-[10px] font-bold text-blue-950 mt-0.5">AI Finder</span>
          </Link>

          <Link
            to="/applications"
            className={`min-h-[44px] flex flex-col items-center justify-center py-1 text-[10px] font-medium transition-colors ${
              currentPath.startsWith("/applications") ? "text-blue-950 font-bold" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Clock className="w-5 h-5 mb-0.5" />
            <span>Track</span>
          </Link>

          <Link
            to="/profile"
            className={`min-h-[44px] flex flex-col items-center justify-center py-1 text-[10px] font-medium transition-colors ${
              currentPath.startsWith("/profile") ? "text-blue-950 font-bold" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-bold mb-0.5">
              {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
            </div>
            <span>Profile</span>
          </Link>
        </div>
      </nav>
    </>
  );
};
