import React, { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Sparkles,
  Search,
  Mic,
  GraduationCap,
  Sprout,
  Briefcase,
  Home,
  HeartPulse,
  Users,
  ArrowRight,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  FileText,
  HelpCircle,
  ChevronRight,
  Volume2,
} from "lucide-react";
import { schemes, categories, type SchemeCategory } from "@/data/schemes";
import { useSchemeStore } from "@/lib/store";
import { matchScheme } from "@/lib/scheme-matching";
import { SchemeCard } from "@/components/schemes/SchemeCard";
import { startSpeechRecognition, isSpeechRecognitionSupported } from "@/lib/speech";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const navigate = useNavigate();
  const { profile, updateProfile, t, language, openApplyModal } = useSchemeStore();
  const [heroSearch, setHeroSearch] = useState("");
  const [isListeningHero, setIsListeningHero] = useState(false);

  const categoryIcons: Record<SchemeCategory, React.ElementType> = {
    Education: GraduationCap,
    Agriculture: Sprout,
    Employment: Briefcase,
    Housing: Home,
    Healthcare: HeartPulse,
    "Women & Child Welfare": Users,
  };

  const categoryGradients: Record<SchemeCategory, string> = {
    Education: "from-blue-600 to-indigo-700",
    Agriculture: "from-emerald-600 to-green-700",
    Employment: "from-violet-600 to-purple-700",
    Housing: "from-amber-500 to-orange-600",
    Healthcare: "from-rose-500 to-red-600",
    "Women & Child Welfare": "from-pink-500 to-rose-600",
  };

  // Recommendations logic
  const schemesWithMatch = schemes.map((s) => ({
    scheme: s,
    match: matchScheme(s, profile),
  }));

  // Sort by match percentage descending
  const recommendedSchemes = [...schemesWithMatch]
    .sort((a, b) => b.match.percentage - a.match.percentage)
    .slice(0, 4)
    .map((item) => item.scheme);

  // Applications closing soon (schemes with deadlineDays <= 20)
  const closingSoonSchemes = [...schemes]
    .filter((s) => s.deadlineDays && s.deadlineDays <= 25)
    .sort((a, b) => (a.deadlineDays ?? 99) - (b.deadlineDays ?? 99))
    .slice(0, 4);

  const handleHeroVoice = () => {
    if (isListeningHero) return;
    if (!isSpeechRecognitionSupported()) {
      alert("Voice speech recognition not supported in this browser.");
      return;
    }

    setIsListeningHero(true);
    startSpeechRecognition(
      language,
      (transcript) => {
        setIsListeningHero(false);
        navigate({ to: "/explore", search: { q: transcript } as any });
      },
      () => setIsListeningHero(false),
      () => setIsListeningHero(false),
    );
  };

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate({ to: "/explore", search: { q: heroSearch.trim() } as any });
    } else {
      navigate({ to: "/finder" });
    }
  };

  const hasProfile = Boolean(profile.age || profile.occupation || profile.state || profile.income);

  return (
    <div className="space-y-14 sm:space-y-20 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-950 via-slate-900 to-blue-900 text-white pt-12 pb-20 sm:pt-20 sm:pb-28">
        {/* Subtle Background Pattern & Glows */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Official Flag Accent Pill */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-slate-200 mb-6 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Official Government Discovery Portal · Digital India</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-tight">
            {t.heroHeadline}
          </h1>

          {/* Subline */}
          <p className="mt-5 text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {t.heroSubline}
          </p>

          {/* Primary CTA and Search Bar */}
          <div className="mt-8 sm:mt-10 max-w-2xl mx-auto">
            <form
              onSubmit={handleHeroSubmit}
              className="relative flex items-center bg-white rounded-2xl shadow-2xl p-1.5 sm:p-2 border border-white/20"
            >
              <div className="pl-3 sm:pl-4 text-blue-950">
                <Search className="w-5 h-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                placeholder="Search schemes or describe what you need (e.g. 'Scholarship for college')..."
                className="w-full px-3 py-2 text-slate-900 text-xs sm:text-sm font-medium focus:outline-none placeholder:text-slate-400"
              />

              {/* Voice Input Mic */}
              <button
                type="button"
                onClick={handleHeroVoice}
                className={`p-2.5 rounded-xl transition-all ${
                  isListeningHero
                    ? "bg-red-500 text-white animate-pulse"
                    : "text-slate-500 hover:text-blue-900 hover:bg-slate-100"
                }`}
                title="Speak to search in your regional language"
                aria-label="Voice search input"
              >
                <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Submit CTA */}
              <button
                type="submit"
                className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-blue-950 hover:bg-blue-900 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center space-x-1.5 shrink-0"
              >
                <span>Find Schemes</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Direct Conversational AI Finder Button */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/finder"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-extrabold text-xs sm:text-sm shadow-lg shadow-amber-500/25 hover:scale-102 transition-all"
              >
                <Sparkles className="w-4 h-4 fill-slate-950" />
                <span>{t.findSchemesForMe} (AI Assistant)</span>
              </Link>

              <Link
                to="/explore"
                className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm backdrop-blur-md border border-white/10 transition-colors"
              >
                <span>Browse All 24 Schemes</span>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </Link>
            </div>
          </div>

          {/* Trust stats pill bar */}
          <div className="mt-12 pt-8 border-t border-white/10 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-xl sm:text-2xl font-black text-amber-300">2,000+</div>
              <div className="text-[11px] text-slate-300 font-medium">Verified Schemes</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-emerald-300">₹1.4 Lakh Cr+</div>
              <div className="text-[11px] text-slate-300 font-medium">Benefits Disbursed</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-blue-200">6 Languages</div>
              <div className="text-[11px] text-slate-300 font-medium">Native Regional Support</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-purple-200">100% Free</div>
              <div className="text-[11px] text-slate-300 font-medium">No Middlemen, Direct DBT</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS 4-STEP STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="text-xs font-bold text-blue-900 uppercase tracking-wider">
            Simple 4-Step Journey
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            {t.howItWorksTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              num: "01",
              title: t.step1Title,
              desc: t.step1Desc,
              icon: Users,
              color: "text-blue-900 bg-blue-50 border-blue-200",
            },
            {
              num: "02",
              title: t.step2Title,
              desc: t.step2Desc,
              icon: Sparkles,
              color: "text-amber-700 bg-amber-50 border-amber-200",
            },
            {
              num: "03",
              title: t.step3Title,
              desc: t.step3Desc,
              icon: ShieldCheck,
              color: "text-emerald-800 bg-emerald-50 border-emerald-200",
            },
            {
              num: "04",
              title: t.step4Title,
              desc: t.step4Desc,
              icon: CheckCircle2,
              color: "text-indigo-900 bg-indigo-50 border-indigo-200",
            },
          ].map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="relative bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl border ${step.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-2xl font-black text-slate-200">
                    {step.num}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1.5">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. QUICK CATEGORY ACCESS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="text-xs font-bold text-blue-900 uppercase tracking-wider">
              Explore by Sector
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Browse Schemes by Category
            </h2>
          </div>

          <Link
            to="/explore"
            className="text-xs font-bold text-blue-900 hover:underline flex items-center space-x-1"
          >
            <span>{t.viewAll} (24)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => {
            const Icon = categoryIcons[cat];
            const count = schemes.filter((s) => s.category === cat).length;
            const gradient = categoryGradients[cat];

            return (
              <Link
                key={cat}
                to="/explore"
                search={{ category: cat } as any}
                className="group relative bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-400 shadow-xs hover:shadow-xl transition-all duration-200 flex flex-col justify-between"
              >
                <div
                  className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} text-white flex items-center justify-center shadow-md mb-3 group-hover:scale-105 transition-transform`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-900 transition-colors">
                    {cat}
                  </h3>
                  <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
                    {count} Schemes
                  </p>
                </div>

                <div className="mt-3 text-[10px] font-bold text-blue-900 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Explore</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. RECOMMENDED FOR YOU (AI Curated) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 text-xs font-bold mb-1.5">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Personalized Matches</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {t.recommendedForYou}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Curated based on your age ({profile.age ?? 20} yrs), {profile.state || "State"}, and {profile.occupation || "occupation"}.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Link
              to="/profile"
              className="text-xs font-bold px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 transition-colors"
            >
              Update Profile
            </Link>
            <Link
              to="/finder"
              className="text-xs font-bold px-3 py-2 rounded-xl bg-blue-950 text-white hover:bg-blue-900 transition-colors flex items-center space-x-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>AI Chat Matcher</span>
            </Link>
          </div>
        </div>

        {/* Profile incomplete prompt if empty */}
        {!hasProfile && (
          <div className="mb-6 p-5 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
            <div>
              <h3 className="text-sm sm:text-base font-bold">
                {t.completeProfileBanner}
              </h3>
              <p className="text-xs text-blue-200 mt-1">
                Tell us your age, location, and study/work details to get 100% accurate match percentages.
              </p>
            </div>
            <Link
              to="/profile"
              className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md shrink-0 transition-colors"
            >
              {t.completeProfileCta}
            </Link>
          </div>
        )}

        {/* Recommended Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendedSchemes.map((scheme) => (
            <SchemeCard key={scheme.id} scheme={scheme} />
          ))}
        </div>
      </section>

      {/* 5. APPLICATIONS CLOSING SOON (Deadline Aware) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 text-xs font-bold mb-1.5">
                <Clock className="w-3 h-3 text-red-600 animate-pulse" />
                <span>Urgent Windows</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {t.closingSoon}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Deadlines approaching within the next 25 days. Don't miss these state and central grants.
              </p>
            </div>

            <Link
              to="/explore"
              search={{ sort: "deadline" } as any}
              className="text-xs font-bold text-amber-900 hover:underline flex items-center space-x-1"
            >
              <span>View All Closing Soon</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {closingSoonSchemes.map((scheme) => (
              <SchemeCard key={scheme.id} scheme={scheme} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white p-8 sm:p-12 shadow-2xl">
          <div className="relative z-10 max-w-2xl">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950">
              Conversational AI Engine
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-3">
              Unsure Which Scheme You Qualify For?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              Just talk to our Smart Scheme Finder in your own words. It evaluates your eligibility instantly and explains unmet conditions in plain language.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/finder"
                className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-400/20 transition-all flex items-center space-x-2"
              >
                <Sparkles className="w-4 h-4 fill-slate-950" />
                <span>Launch Smart Scheme Finder</span>
              </Link>

              <Link
                to="/documents"
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/15 transition-all"
              >
                Check Document Readiness
              </Link>
            </div>
          </div>

          {/* Decorative Ashoka Chakra Graphic */}
          <div className="absolute right-4 bottom-4 opacity-10 pointer-events-none hidden md:block">
            <svg className="w-72 h-72 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 3v18" />
              <path d="M3 12h18" />
              <path d="m5.6 5.6 12.8 12.8" />
              <path d="m18.4 5.6-12.8 12.8" />
            </svg>
          </div>
        </div>
      </section>
    </div>
  );
}
