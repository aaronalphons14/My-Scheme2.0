import React, { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  HelpCircle,
  PhoneCall,
  Sparkles,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  CheckCircle2,
  FileQuestion,
  ShieldCheck,
  Send,
  Star,
  BookOpen,
} from "lucide-react";
import { useSchemeStore } from "@/lib/store";
import { getSiteText } from "@/lib/site-translations";

export const Route = createFileRoute("/help")({
  component: HelpPage,
});

function HelpPage() {
  const { setIsOnboardingOpen, language } = useSchemeStore();
  const site = getSiteText(language);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Feedback form state
  const [rating, setRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const faqs = [
    {
      q: "What is myScheme 2.0?",
      a: "myScheme 2.0 is a national e-Governance initiative that transforms government scheme discovery. Instead of searching across hundreds of central and state departmental websites, you enter your profile or speak naturally, and our AI matches your exact eligibility.",
    },
    {
      q: "Does a 90%+ match score guarantee government approval?",
      a: "No. A high match score indicates you meet all published preliminary guidelines (age, occupation, income ceiling, state). Final sanction is determined by the respective government department after physical or digital scrutiny of your original documents.",
    },
    {
      q: "How does the Document Readiness engine work?",
      a: "Our engine maps your verified certificates in your browser DigiLocker vault against the mandatory attachments of each scheme. If you are missing an Income or Community Certificate, we warn you upfront and provide instructions on how to obtain it.",
    },
    {
      q: "Is my personal data uploaded to any central server?",
      a: "No. In myScheme 2.0, your personal profile and document statuses remain strictly inside your device's local browser memory. You only send data when you voluntarily submit your form on the official department portal.",
    },
    {
      q: "Can I use voice recognition in regional languages?",
      a: "Yes! myScheme 2.0 supports voice input in Hindi, Tamil, Telugu, Kannada, Malayalam, and English via the Web Speech API. Click the microphone icon in search or the AI Assistant to speak.",
    },
    {
      q: "What should I do if a scheme's deadline is closing soon?",
      a: "Check the 'Applications Closing Soon' row. Click 'Apply Now' to verify document readiness and proceed immediately to the respective department portal.",
    },
  ];

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackSubmitted(true);
    setTimeout(() => {
      setFeedbackText("");
      setFeedbackSubmitted(false);
    }, 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center space-x-1.5">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{site.help.badge}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">
            {site.help.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {site.help.subtitle}
          </p>
        </div>

        <button
          onClick={() => setIsOnboardingOpen(true)}
          className="px-4 py-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-950 font-bold text-xs hover:bg-blue-100 flex items-center space-x-1.5 transition-colors self-start sm:self-auto"
        >
          <BookOpen className="w-4 h-4 text-blue-900" />
          <span>{site.help.replayTourBtn}</span>
        </button>
      </div>

      {/* 1. TOLL-FREE HELPLINE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start space-x-4">
          <div className="p-3 rounded-xl bg-blue-100 text-blue-900 shrink-0">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-blue-900 uppercase tracking-wider">
              {site.help.helplineTitle}
            </div>
            <div className="text-lg font-black text-slate-900 mt-0.5">
              1800-115-555
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {site.help.helplineDesc}
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start space-x-4">
          <div className="p-3 rounded-xl bg-emerald-100 text-emerald-900 shrink-0">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
              {site.help.pmjayTitle}
            </div>
            <div className="text-lg font-black text-slate-900 mt-0.5">
              14555 / 1800-111-565
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {site.help.pmjayDesc}
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start space-x-4">
          <div className="p-3 rounded-xl bg-amber-100 text-amber-900 shrink-0">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
              {site.help.pmkisanTitle}
            </div>
            <div className="text-lg font-black text-slate-900 mt-0.5">
              155261 / 011-24300606
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {site.help.pmkisanDesc}
            </p>
          </div>
        </div>
      </div>

      {/* 2. HOW TO USE MYSCHEME 2.0 (Walkthrough Visual) */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            User Walkthrough
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            How to Use myScheme 2.0 in 4 Steps
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
            <div className="text-amber-400 font-black text-base mb-1">01</div>
            <h3 className="font-bold text-white text-sm mb-1">Create or Tell Profile</h3>
            <p className="text-slate-300 leading-relaxed">
              Tell your age, state, education, and family income through voice or the AI chat interface.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
            <div className="text-amber-400 font-black text-base mb-1">02</div>
            <h3 className="font-bold text-white text-sm mb-1">Review Recommendations</h3>
            <p className="text-slate-300 leading-relaxed">
              Examine match percentages (90%+ Highly Recommended) and plain-language eligibility reasons.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
            <div className="text-amber-400 font-black text-base mb-1">03</div>
            <h3 className="font-bold text-white text-sm mb-1">Check Documents</h3>
            <p className="text-slate-300 leading-relaxed">
              Verify your certificates in the Document Vault before you spend time filling official forms.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
            <div className="text-amber-400 font-black text-base mb-1">04</div>
            <h3 className="font-bold text-white text-sm mb-1">Apply & Track DBT</h3>
            <p className="text-slate-300 leading-relaxed">
              Follow our guided flow to the official portal, record your application ID, and track live scrutiny.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 pt-2">
          <Link
            to="/finder"
            className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md transition-colors inline-flex items-center space-x-1.5"
          >
            <Sparkles className="w-4 h-4 fill-slate-950" />
            <span>Launch Smart Scheme Finder</span>
          </Link>
        </div>
      </div>

      {/* 3. FAQ ACCORDION */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">
          {site.help.faqTitle}
        </h2>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full text-left p-4.5 flex items-center justify-between hover:bg-slate-50 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="text-xs sm:text-sm font-bold text-slate-900 pr-4">
                    {faq.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-4.5 pb-4.5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. CITIZEN FEEDBACK WIDGET */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs max-w-xl mx-auto text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-900 flex items-center justify-center mx-auto">
          <MessageSquare className="w-6 h-6" />
        </div>

        <div>
          <h2 className="text-base font-bold text-slate-900">
            {site.help.feedbackTitle}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {site.help.feedbackSubtitle}
          </p>
        </div>

        {feedbackSubmitted ? (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{site.help.feedbackThankYou}</span>
          </div>
        ) : (
          <form onSubmit={handleFeedbackSubmit} className="space-y-4 text-left">
            {/* Star Rating */}
            <div className="flex items-center justify-center space-x-1.5 py-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setRating(s)}
                  className="p-1 focus:outline-none"
                >
                  <Star
                    className={`w-6 h-6 ${
                      s <= rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-300"
                    }`}
                  />
                </button>
              ))}
            </div>

            <textarea
              rows={3}
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder={site.help.feedbackPlaceholder}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-900 placeholder:text-slate-400"
            />

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-blue-950 hover:bg-blue-900 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center space-x-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{site.help.submitFeedbackBtn}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
