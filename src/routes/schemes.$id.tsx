import React, { useState } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import {
  Sparkles,
  Bookmark,
  Share2,
  Volume2,
  VolumeX,
  ExternalLink,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Calendar,
  Building2,
  FileText,
  MapPin,
  ChevronDown,
  ChevronUp,
  Clock,
  ArrowRight,
  ShieldCheck,
  Check,
  AlertTriangle,
  Scale,
} from "lucide-react";
import { schemes, documentGuides, type Scheme } from "@/data/schemes";
import { useSchemeStore } from "@/lib/store";
import { matchScheme } from "@/lib/scheme-matching";
import { speakText, stopSpeaking } from "@/lib/speech";
import {
  getLocalizedScheme,
  getLocalizedCategory,
  getLocalizedState,
  getLocalizedApplicationMode,
  getLocalizedCriterion,
} from "@/lib/scheme-translations";

export const Route = createFileRoute("/schemes/$id")({
  component: SchemeDetailPage,
});

function SchemeDetailPage() {
  const { id } = useParams({ from: "/schemes/$id" });
  const {
    profile,
    documents,
    toggleSaveScheme,
    isSchemeSaved,
    toggleCompareScheme,
    isCompared,
    openApplyModal,
    language,
    t,
  } = useSchemeStore();

  const [activeTab, setActiveTab] = useState<
    "overview" | "benefits" | "eligibility" | "documents" | "faqs"
  >("overview");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [copiedShare, setCopiedShare] = useState(false);

  const rawScheme = schemes.find((s) => s.id === id);

  if (!rawScheme) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900">{t.noMatchingSchemes}</h1>
        <p className="text-sm text-slate-500 mt-2">
          {t.noMatchingDesc}
        </p>
        <Link
          to="/explore"
          className="mt-6 inline-block px-5 py-2.5 rounded-xl bg-blue-950 text-white font-bold text-xs"
        >
          {t.exploreSchemes}
        </Link>
      </div>
    );
  }

  const scheme = getLocalizedScheme(rawScheme, language);
  const match = matchScheme(rawScheme, profile);
  const isSaved = isSchemeSaved(rawScheme.id);
  const inCompare = isCompared(rawScheme.id);

  const matchLabel =
    match.percentage >= 80
      ? t.highlyRecommended
      : match.percentage >= 50
        ? t.goodMatch
        : t.possibleMatch;

  const toggleSpeak = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      const speechContent = `${scheme.name}. ${scheme.department}. ${scheme.benefit}. ${scheme.summary}`;
      speakText(speechContent, language, () => setIsSpeaking(false));
    }
  };

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-28">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500 flex items-center space-x-2">
        <Link to="/" className="hover:text-blue-900">
          {t.home}
        </Link>
        <span>/</span>
        <Link to="/explore" className="hover:text-blue-900">
          {t.navExplore}
        </Link>
        <span>/</span>
        <span className="font-semibold text-slate-900 truncate max-w-xs">
          {scheme.name}
        </span>
      </nav>

      {/* Hero Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-3 flex-1">
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-900">
                {scheme.category}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 flex items-center space-x-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span>
                  {rawScheme.scope === "Central"
                    ? t.central
                    : `${getLocalizedState(rawScheme.state, language)} ${t.state}`}
                </span>
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                {getLocalizedApplicationMode(rawScheme.applicationMode, language)}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              {scheme.name}
            </h1>

            <div className="text-xs sm:text-sm text-slate-500 flex items-center space-x-1.5 font-medium">
              <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{scheme.department}</span>
            </div>
          </div>

          {/* Match Score Card Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-950 to-indigo-950 text-white shrink-0 lg:w-72 shadow-xl border border-blue-900">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t.matchedOn}</span>
              </span>
              <span className="text-[11px] font-semibold bg-white/10 px-2 py-0.5 rounded-full">
                AI Assessed
              </span>
            </div>

            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-black">{match.percentage}%</span>
              <span className="text-xs font-semibold text-slate-300">
                {matchLabel}
              </span>
            </div>

            <p className="text-[11px] text-slate-300 mt-2 leading-relaxed">
              Based on profile ({profile.age ?? 20} yrs, {profile.occupation || "citizen"}, {profile.state || "India"}).
            </p>
          </div>
        </div>

        {/* Action Buttons Strip */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            {/* Text-to-Speech Listen Button */}
            <button
              onClick={toggleSpeak}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors ${
                isSpeaking
                  ? "bg-amber-100 text-amber-900"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
              aria-label="Listen to scheme summary"
            >
              {isSpeaking ? <VolumeX className="w-4 h-4 text-amber-600 animate-pulse" /> : <Volume2 className="w-4 h-4" />}
              <span>{isSpeaking ? t.stopAudio : t.listen}</span>
            </button>

            {/* Bookmark */}
            <button
              onClick={() => toggleSaveScheme(rawScheme.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors ${
                isSaved
                  ? "bg-blue-100 text-blue-900"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? "fill-blue-900" : ""}`} />
              <span>{isSaved ? t.saved : t.save}</span>
            </button>

            {/* Compare */}
            <button
              onClick={() => toggleCompareScheme(rawScheme.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors ${
                inCompare
                  ? "bg-indigo-100 text-indigo-900"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              <Scale className="w-4 h-4" />
              <span>{inCompare ? t.compared : t.compare}</span>
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center space-x-1.5 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>{copiedShare ? "Link Copied!" : "Share"}</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => openApplyModal(rawScheme.id)}
              className="px-6 py-2.5 rounded-xl bg-blue-950 hover:bg-blue-900 text-white font-extrabold text-xs shadow-md transition-all flex items-center space-x-1.5"
            >
              <span>{t.applyNow}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href={rawScheme.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs transition-colors"
              title="Open Official Ministry Portal in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 overflow-x-auto no-scrollbar space-x-4 text-sm font-bold">
        {[
          { key: "overview", label: "Overview" },
          { key: "benefits", label: "Benefits" },
          { key: "eligibility", label: "Eligibility Checklist" },
          { key: "documents", label: "Required Documents" },
          { key: "faqs", label: "Dates & FAQs" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`pb-3 px-1 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === tab.key
                ? "border-blue-950 text-blue-950"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT PANELS */}
      <div className="space-y-6">
        {/* 1. OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Executive Summary */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Scheme Summary
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {scheme.summary}
                </p>

                {scheme.tags && scheme.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {scheme.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Target Beneficiary Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Target Beneficiary Group
                </h3>
                <p className="text-sm text-slate-700 font-medium">
                  {scheme.targetBeneficiary}
                </p>
                <div className="mt-4 text-xs text-slate-500">
                  Targeted occupations:{" "}
                  <strong className="text-slate-800 capitalize">
                    {scheme.occupations.join(", ")}
                  </strong>
                </div>
              </div>
            </div>

            {/* Quick Details Column */}
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
                <h3 className="font-bold text-slate-900 uppercase tracking-wider">
                  At-A-Glance Info
                </h3>

                <div>
                  <span className="text-slate-400 block font-medium">Application Deadline</span>
                  <span className="text-slate-900 font-bold text-sm block mt-0.5">
                    {scheme.deadline}
                  </span>
                  {scheme.deadlineDays && (
                    <span className="text-amber-700 font-semibold text-[11px]">
                      Closing in {scheme.deadlineDays} days
                    </span>
                  )}
                </div>

                <div>
                  <span className="text-slate-400 block font-medium">Application Mode</span>
                  <span className="text-slate-900 font-bold block mt-0.5">
                    {scheme.applicationMode}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block font-medium">Income Ceiling</span>
                  <span className="text-slate-900 font-bold block mt-0.5">
                    {scheme.incomeMax
                      ? `Up to ₹${scheme.incomeMax.toLocaleString("en-IN")}/year`
                      : "No income limit specified"}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block font-medium">Official Portal Link</span>
                  <a
                    href={scheme.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-900 font-bold hover:underline flex items-center space-x-1 mt-0.5"
                  >
                    <span className="truncate">{scheme.officialUrl}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. BENEFITS TAB */}
        {activeTab === "benefits" && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/20">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                Primary Financial Grant
              </span>
              <div className="text-2xl sm:text-3xl font-black text-emerald-950 mt-1">
                {scheme.benefit}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scheme.detailedBenefits.map((item, index) => (
                <div
                  key={index}
                  className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start space-x-3"
                >
                  <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Benefit Clause {index + 1}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-700 mt-1 leading-relaxed">
                      {item}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. ELIGIBILITY TAB */}
        {activeTab === "eligibility" && (
          <div className="space-y-6">
            {/* Explainer: Why Am I Eligible / Not Eligible */}
            <div className="p-6 rounded-2xl bg-blue-50/70 border border-blue-200">
              <div className="flex items-center space-x-2 text-blue-950 font-bold text-sm mb-1.5">
                <HelpCircle className="w-5 h-5 text-blue-900" />
                <span>Why am I eligible / not eligible?</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Our eligibility evaluation compares your saved citizen profile parameters against the latest published departmental criteria. See below for the detailed status of each clause.
              </p>
            </div>

            {/* Checklist */}
            <div className="space-y-3">
              {match.checks.map((check) => {
                const isMet = check.state === "met";
                const isNotMet = check.state === "not-met";

                return (
                  <div
                    key={check.label}
                    className={`p-4 rounded-2xl border flex items-center justify-between text-xs sm:text-sm ${
                      isMet
                        ? "bg-emerald-50/50 border-emerald-200 text-emerald-950"
                        : isNotMet
                          ? "bg-red-50/50 border-red-200 text-red-950"
                          : "bg-amber-50/50 border-amber-200 text-amber-950"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {isMet ? (
                        <div className="p-1.5 rounded-full bg-emerald-100 text-emerald-700 shrink-0">
                          <Check className="w-4 h-4 font-black" />
                        </div>
                      ) : isNotMet ? (
                        <div className="p-1.5 rounded-full bg-red-100 text-red-700 shrink-0">
                          <XCircle className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="p-1.5 rounded-full bg-amber-100 text-amber-700 shrink-0">
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                      )}

                      <div>
                        <span className="font-bold block">{check.label} Criteria</span>
                        <span className="text-xs opacity-90">{check.detail}</span>
                      </div>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        isMet
                          ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                          : isNotMet
                            ? "bg-red-100 text-red-900 border-red-300"
                            : "bg-amber-100 text-amber-900 border-amber-300"
                      }`}
                    >
                      {isMet ? "Met ✓" : isNotMet ? "Not Met ✗" : "Unknown ?"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. DOCUMENTS TAB */}
        {activeTab === "documents" && (
          <div className="space-y-6">
            <div className="text-xs text-slate-600">
              The following documents are mandatory for verification by the respective department:
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scheme.requiredDocuments.map((docName) => {
                const foundInVault = documents.find(
                  (d) =>
                    d.name.toLowerCase().includes(docName.toLowerCase()) ||
                    docName.toLowerCase().includes(d.name.toLowerCase()),
                );
                const guide = documentGuides[docName];

                return (
                  <div
                    key={docName}
                    className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                          <FileText className="w-4 h-4 text-blue-900" />
                          <span>{docName}</span>
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            foundInVault?.verified
                              ? "bg-emerald-100 text-emerald-900"
                              : "bg-amber-100 text-amber-900"
                          }`}
                        >
                          {foundInVault?.verified ? "Ready in Vault ✅" : "Missing / Unverified ⚠️"}
                        </span>
                      </div>

                      {guide && (
                        <div className="space-y-1.5 text-xs text-slate-600 mt-2">
                          <p>{guide.description}</p>
                          <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-[11px]">
                            <strong>How to get this:</strong> {guide.howToGet}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      {guide?.portal && (
                        <a
                          href={guide.portal}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-900 hover:underline flex items-center space-x-1 font-semibold"
                        >
                          <span>Official Portal</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}

                      <Link
                        to="/documents"
                        className="text-slate-700 hover:text-blue-900 font-bold"
                      >
                        Manage in Vault →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 5. DATES & FAQS TAB */}
        {activeTab === "faqs" && (
          <div className="space-y-6">
            {/* Timeline */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                Application & Scrutiny Timeline
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block font-medium">Application Window</span>
                  <span className="text-slate-900 font-bold mt-1 block">Active Now</span>
                  <span className="text-slate-500 mt-0.5 block">Closes: {scheme.deadline}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block font-medium">Verification Stage</span>
                  <span className="text-slate-900 font-bold mt-1 block">7–15 Days</span>
                  <span className="text-slate-500 mt-0.5 block">Document scrutiny by nodal officer</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block font-medium">Disbursal Mode</span>
                  <span className="text-slate-900 font-bold mt-1 block">Direct DBT</span>
                  <span className="text-slate-500 mt-0.5 block">Credited directly to bank account</span>
                </div>
              </div>
            </div>

            {/* Accordion FAQs */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Frequently Asked Questions
              </h3>

              {scheme.faqs.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div
                    key={index}
                    className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs transition-all"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      className="w-full text-left p-4.5 flex items-center justify-between hover:bg-slate-50 transition-colors"
                      aria-expanded={isOpen}
                    >
                      <span className="text-xs sm:text-sm font-bold text-slate-900 pr-4">
                        {faq.question}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                      )}
                    </button>

                    {isOpen && (
                      <div className="px-4.5 pb-4.5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Apply Action Bar for mobile and desktop */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 sm:p-4 shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div>
            <span className="text-xs text-slate-500 hidden sm:block">Eligible Benefit:</span>
            <span className="text-sm sm:text-base font-black text-emerald-900 line-clamp-1">
              {scheme.benefit}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => toggleCompareScheme(scheme.id)}
              className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors hidden sm:inline-flex"
            >
              {inCompare ? "Compared" : "Add to Compare"}
            </button>

            <button
              onClick={() => openApplyModal(scheme.id)}
              className="px-6 py-2.5 rounded-xl bg-blue-950 hover:bg-blue-900 text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center space-x-1.5"
            >
              <span>Apply via Official Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
