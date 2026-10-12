import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Search, Mic, MicOff, X, ArrowRight, Sparkles, Building2, Tag } from "lucide-react";
import { schemes, type Scheme } from "@/data/schemes";
import { useSchemeStore } from "@/lib/store";
import { startSpeechRecognition, isSpeechRecognitionSupported } from "@/lib/speech";

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { language } = useSchemeStore();
  const [query, setQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const speechHandleRef = useRef<{ stop: () => void } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      if (speechHandleRef.current) {
        speechHandleRef.current.stop();
        setIsListening(false);
      }
    }
  }, [isOpen]);

  const handleVoiceSearch = () => {
    if (isListening) {
      speechHandleRef.current?.stop();
      setIsListening(false);
      return;
    }

    if (!isSpeechRecognitionSupported()) {
      alert("Voice speech recognition is not supported in this browser. Please type your search.");
      return;
    }

    setIsListening(true);
    const handle = startSpeechRecognition(
      language,
      (transcript) => {
        setQuery(transcript);
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      },
    );
    speechHandleRef.current = handle;
  };

  if (!isOpen) return null;

  const normalized = query.trim().toLowerCase();
  const filteredSchemes = normalized
    ? schemes.filter(
        (s) =>
          s.name.toLowerCase().includes(normalized) ||
          s.summary.toLowerCase().includes(normalized) ||
          s.department.toLowerCase().includes(normalized) ||
          s.category.toLowerCase().includes(normalized) ||
          s.tags?.some((t) => t.toLowerCase().includes(normalized)) ||
          s.benefit.toLowerCase().includes(normalized),
      )
    : [];

  const quickPills = [
    "PM Scholarship",
    "PM-KISAN",
    "Ayushman Bharat",
    "Tamil Nadu",
    "College Student",
    "Farmer Credit",
    "Rooftop Solar",
    "Women Business",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Search Container */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Quick search portal schemes"
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Search Header Input */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center space-x-3 bg-slate-50/50">
          <Search className="w-5 h-5 text-blue-900 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search 24+ schemes by name, keyword, ministry, or benefit..."
            className="w-full bg-transparent border-none text-slate-900 text-sm sm:text-base focus:outline-none placeholder:text-slate-400 font-medium"
          />

          {/* Voice Search Button */}
          <button
            type="button"
            onClick={handleVoiceSearch}
            className={`p-2 rounded-xl transition-all ${
              isListening
                ? "bg-red-500 text-white animate-pulse"
                : "text-slate-500 hover:text-blue-900 hover:bg-slate-200/60"
            }`}
            title="Search by speaking (regional languages supported)"
            aria-label="Voice search"
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Listening Indicator */}
        {isListening && (
          <div className="bg-red-50 text-red-700 text-xs px-5 py-2 flex items-center space-x-2 border-b border-red-100">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
            <span className="font-semibold">
              Listening in your selected language... Speak now.
            </span>
          </div>
        )}

        {/* Suggestions / Results */}
        <div className="max-h-96 overflow-y-auto p-4 sm:p-5">
          {query.trim() === "" ? (
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Popular Searches & Quick Topics</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {quickPills.map((pill) => (
                  <button
                    key={pill}
                    onClick={() => setQuery(pill)}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-900 text-xs font-medium border border-slate-200 transition-colors"
                  >
                    {pill}
                  </button>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-xl bg-blue-50/70 border border-blue-100 flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-blue-900 text-white shrink-0">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xs font-bold text-blue-950">
                    Try the AI Scheme Finder
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    Instead of guessing scheme names, type your situation (e.g. "I am a 20yo student from Tamil Nadu"). Our AI matches you instantly.
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      navigate({ to: "/finder" });
                    }}
                    className="mt-2 text-xs font-bold text-blue-900 hover:underline flex items-center space-x-1"
                  >
                    <span>Launch AI Finder</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ) : filteredSchemes.length > 0 ? (
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-500 mb-2">
                Found {filteredSchemes.length} matching scheme{filteredSchemes.length > 1 ? "s" : ""}
              </div>
              {filteredSchemes.map((scheme) => (
                <Link
                  key={scheme.id}
                  to="/schemes/$id"
                  params={{ id: scheme.id }}
                  onClick={onClose}
                  className="block p-3.5 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold px-2 py-0.5 rounded-sm bg-blue-100 text-blue-900">
                          {scheme.category}
                        </span>
                        <span className="text-xs font-medium text-slate-400">
                          {scheme.scope}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-900 transition-colors mt-1">
                        {scheme.name}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {scheme.summary}
                      </p>
                    </div>

                    <div className="text-right shrink-0 ml-3">
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200 block">
                        {scheme.benefit}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Search className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <div className="text-sm font-bold text-slate-700">
                No schemes found for "{query}"
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Try searching for broad terms like "Scholarship", "Agriculture", "Housing", or check your state name.
              </p>
              <button
                onClick={() => {
                  onClose();
                  navigate({ to: "/finder" });
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-blue-950 text-white font-bold text-xs hover:bg-blue-900 transition-colors inline-flex items-center space-x-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Ask AI Scheme Finder Instead</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
