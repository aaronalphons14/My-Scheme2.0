import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Calendar,
  FileText,
  Bookmark,
  Scale,
  Sparkles,
  ExternalLink,
  Volume2,
  VolumeX,
  Check,
  AlertCircle,
  Building2,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import type { Scheme } from "@/data/schemes";
import { useSchemeStore } from "@/lib/store";
import { matchScheme } from "@/lib/scheme-matching";
import { speakText, stopSpeaking } from "@/lib/speech";
import {
  getLocalizedScheme,
  getLocalizedCriterion,
  getLocalizedState,
  getLocalizedApplicationMode,
} from "@/lib/scheme-translations";

interface SchemeCardProps {
  scheme: Scheme;
  onApply?: () => void;
}

export const SchemeCard: React.FC<SchemeCardProps> = ({ scheme, onApply }) => {
  const {
    profile,
    toggleSaveScheme,
    isSchemeSaved,
    toggleCompareScheme,
    isCompared,
    openApplyModal,
    language,
    t,
  } = useSchemeStore();

  const [isSpeaking, setIsSpeaking] = useState(false);

  const loc = getLocalizedScheme(scheme, language);
  const match = matchScheme(scheme, profile);
  const saved = isSchemeSaved(scheme.id);
  const compared = isCompared(scheme.id);

  const matchLabel =
    match.percentage >= 80
      ? t.highlyRecommended
      : match.percentage >= 50
        ? t.goodMatch
        : t.possibleMatch;

  const handleToggleSpeak = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      speakText(
        `${loc.name}. ${loc.department}. ${loc.benefit}. ${loc.summary}`,
        language,
        () => setIsSpeaking(false),
      );
    }
  };

  const handleApplyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onApply) {
      onApply();
    } else {
      openApplyModal(scheme.id);
    }
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSaveScheme(scheme.id);
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleCompareScheme(scheme.id);
  };

  // Urgency color logic for deadline
  const isUrgent = scheme.deadlineDays && scheme.deadlineDays <= 7;
  const isSoon = scheme.deadlineDays && scheme.deadlineDays > 7 && scheme.deadlineDays <= 20;

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200 hover:border-blue-300 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden">
      {/* Top Banner: Category, Scope, Match badge */}
      <div className="p-5 pb-4">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-900 border border-blue-200">
              {loc.category}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 flex items-center space-x-1">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span>
                {scheme.scope === "Central"
                  ? t.central
                  : scheme.state
                    ? getLocalizedState(scheme.state, language)
                    : t.state}
              </span>
            </span>
          </div>

          {/* Match Score Badge */}
          <div
            className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center space-x-1 shrink-0 ${match.badgeColor}`}
            title={`${match.percentage}% eligibility match`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{match.percentage}%</span>
            <span className="hidden sm:inline">· {matchLabel}</span>
          </div>
        </div>

        {/* Scheme Title */}
        <Link
          to="/schemes/$id"
          params={{ id: scheme.id }}
          className="block group-hover:text-blue-900 transition-colors"
        >
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 line-clamp-2 leading-snug">
            {loc.name}
          </h3>
        </Link>

        {/* Ministry / Department */}
        <div className="text-xs text-slate-500 line-clamp-1 mt-1 flex items-center space-x-1">
          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>{loc.department}</span>
        </div>

        {/* Highlight Benefit Amount Box */}
        <div className="mt-3.5 p-3 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50/50 to-blue-50/30 border border-emerald-100/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
              {t.benefitAmount}
            </span>
            <span className="text-sm font-extrabold text-emerald-950 line-clamp-1">
              {loc.benefit}
            </span>
          </div>
          <span className="text-[11px] font-semibold text-slate-600 bg-white/80 px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs">
            {getLocalizedApplicationMode(scheme.applicationMode, language)}
          </span>
        </div>

        {/* Summary Snippet */}
        <p className="text-xs text-slate-600 line-clamp-2 mt-3 leading-relaxed">
          {loc.summary}
        </p>

        {/* Matched Criteria Chips */}
        {match.matchedCriteria.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-100">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>{t.matchedOn}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {match.matchedCriteria.map((crit) => (
                <span
                  key={crit}
                  className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-semibold"
                >
                  <Check className="w-2.5 h-2.5" />
                  <span>{getLocalizedCriterion(crit, language)}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Unmet Reason Warning if partial match */}
        {match.unmetReason && (
          <div className="mt-2.5 p-2 rounded-lg bg-amber-50/80 border border-amber-200 text-amber-900 text-[11px] flex items-start space-x-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
            <span className="line-clamp-2">{match.unmetReason}</span>
          </div>
        )}

        {/* Documents & Deadline Meta */}
        <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-500">
          <div className="flex items-center space-x-1.5">
            <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">
              {scheme.requiredDocuments.length} {t.documentsRequired}
            </span>
          </div>

          <div className="flex items-center space-x-1.5 justify-end">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span
              className={`truncate font-medium ${
                isUrgent
                  ? "text-red-700 font-bold"
                  : isSoon
                    ? "text-amber-700 font-semibold"
                    : "text-slate-600"
              }`}
            >
              {scheme.deadlineDays
                ? `${scheme.deadlineDays} ${t.closingInDays}`
                : scheme.deadline}
            </span>
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="px-5 py-3.5 bg-slate-50/90 border-t border-slate-100 flex items-center justify-between gap-2">
        {/* Secondary Utility Actions (TTS, Save, Compare) */}
        <div className="flex items-center space-x-1">
          {/* TTS Listen Button */}
          <button
            onClick={handleToggleSpeak}
            className={`p-2 rounded-lg transition-colors ${
              isSpeaking
                ? "bg-amber-100 text-amber-900"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
            title={isSpeaking ? t.stopAudio : t.listen}
            aria-label="Listen to scheme summary"
          >
            {isSpeaking ? <VolumeX className="w-4 h-4 text-amber-600" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Bookmark Button */}
          <button
            onClick={handleSaveClick}
            className={`p-2 rounded-lg transition-colors ${
              saved
                ? "bg-blue-100 text-blue-900"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
            title={saved ? t.saved : t.save}
            aria-label={saved ? "Remove bookmark" : "Bookmark scheme"}
          >
            <Bookmark className={`w-4 h-4 ${saved ? "fill-blue-900 text-blue-900" : ""}`} />
          </button>

          {/* Add to Compare */}
          <button
            onClick={handleCompareClick}
            className={`p-2 rounded-lg transition-colors ${
              compared
                ? "bg-indigo-100 text-indigo-900 font-bold"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
            title={compared ? t.compared : t.addToCompare}
            aria-label="Compare scheme"
          >
            <Scale className="w-4 h-4" />
          </button>
        </div>

        {/* Primary Actions: View Details & Apply */}
        <div className="flex items-center space-x-2">
          <Link
            to="/schemes/$id"
            params={{ id: scheme.id }}
            className="px-3 py-1.5 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition-colors"
          >
            {t.viewDetails}
          </Link>

          <button
            onClick={handleApplyClick}
            className="px-3.5 py-1.5 rounded-xl bg-blue-950 hover:bg-blue-900 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center space-x-1"
          >
            <span>{t.applyNow}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
