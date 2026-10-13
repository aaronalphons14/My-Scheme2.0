import React, { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Upload,
  ExternalLink,
  Bell,
  Trash2,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Lock,
} from "lucide-react";
import { useSchemeStore } from "@/lib/store";
import { schemes, documentGuides, type Scheme } from "@/data/schemes";
import { getLocalizedScheme, getLocalizedCategory } from "@/lib/scheme-translations";
import { getSiteText } from "@/lib/site-translations";

export const Route = createFileRoute("/documents")({
  component: DocumentsPage,
});

function DocumentsPage() {
  const {
    documents,
    updateDocumentStatus,
    openApplyModal,
    language,
    t,
  } = useSchemeStore();

  const site = getSiteText(language);
  const [selectedSchemeId, setSelectedSchemeId] = useState("pm-scholarship");
  const [reminderToast, setReminderToast] = useState<string | null>(null);
  const [uploadModalDocId, setUploadModalDocId] = useState<string | null>(null);
  const [mockFileName, setMockFileName] = useState("");

  const rawActiveScheme = (schemes.find((s) => s.id === selectedSchemeId) || schemes[0])!;
  const activeScheme = getLocalizedScheme(rawActiveScheme, language);

  // Calculate readiness for active scheme
  const schemeDocReadiness = rawActiveScheme.requiredDocuments.map((reqDoc) => {
    const vaultMatch = documents.find(
      (d) =>
        d.name.toLowerCase().includes(reqDoc.toLowerCase()) ||
        reqDoc.toLowerCase().includes(d.name.toLowerCase()),
    );
    const isReady = vaultMatch?.verified || false;
    return {
      name: reqDoc,
      isReady,
      vaultDoc: vaultMatch,
      guide: documentGuides[reqDoc],
    };
  });

  const readyCount = schemeDocReadiness.filter((d) => d.isReady).length;
  const totalCount = schemeDocReadiness.length;
  const readinessPercentage = Math.round((readyCount / totalCount) * 100);

  const handleSetReminder = (docName: string) => {
    setReminderToast(`Reminder set for ${docName}! We'll notify you 7 days before upcoming scheme deadlines.`);
    setTimeout(() => setReminderToast(null), 3500);
  };

  const handleMockUpload = (docId: string) => {
    const chosenName = mockFileName.trim() || `${docId}_verified_2026.pdf`;
    updateDocumentStatus(docId, true, chosenName);
    setUploadModalDocId(null);
    setMockFileName("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      {/* Toast alert */}
      {reminderToast && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center space-x-2 text-xs animate-in slide-in-from-top-4">
          <Bell className="w-4 h-4 text-amber-400" />
          <span>{reminderToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center space-x-1.5">
            <Lock className="w-3.5 h-3.5" />
            <span>{site.documents.vaultBadge}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">
            {site.documents.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {site.documents.subtitle}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{site.documents.digilockerBadge}</span>
          </span>
        </div>
      </div>

      {/* 1. SCHEME APPLICATION READINESS CALCULATOR */}
      <div className="bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          {/* Left info & Selector */}
          <div className="space-y-4 flex-1">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Per-Scheme Readiness Engine
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                {site.documents.readinessTitle}
              </h2>
            </div>

            <div className="max-w-md">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {site.documents.selectSchemeLabel}:
              </label>
              <select
                value={selectedSchemeId}
                onChange={(e) => setSelectedSchemeId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
              >
                {schemes.map((s) => {
                  const loc = getLocalizedScheme(s, language);
                  return (
                    <option key={s.id} value={s.id} className="text-slate-900">
                      {loc.name} ({getLocalizedCategory(s.category, language)})
                    </option>
                  );
                })}
              </select>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed max-w-lg">
              {readinessPercentage === 100
                ? `🎉 ${site.documents.allDocsReady}`
                : `⚠️ ${site.documents.missingDocsNotice} (${totalCount - readyCount}/${totalCount})`}
            </p>
          </div>

          {/* Right: Circular Progress Ring */}
          <div className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 shrink-0 w-64 text-center">
            {/* SVG Circular Progress Ring */}
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="text-white/20"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className={readinessPercentage >= 80 ? "text-emerald-400" : "text-amber-400"}
                  strokeWidth="8"
                  strokeDasharray={251.2}
                  strokeDashoffset={251.2 - (251.2 * readinessPercentage) / 100}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-white">{readinessPercentage}%</span>
                <span className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">
                  Ready
                </span>
              </div>
            </div>

            <div className="mt-3 text-xs font-bold text-white">
              {readyCount} of {totalCount} Documents Ready
            </div>

            <button
              onClick={() => openApplyModal(rawActiveScheme.id)}
              className="mt-4 w-full py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md transition-colors flex items-center justify-center space-x-1"
            >
              <span>{t.applyNow}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Readiness Checklist for this Scheme */}
        <div className="mt-8 pt-6 border-t border-white/15 grid grid-cols-1 md:grid-cols-2 gap-3">
          {schemeDocReadiness.map((item) => (
            <div
              key={item.name}
              className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 text-xs ${
                item.isReady
                  ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-100"
                  : "bg-red-950/40 border-red-500/30 text-red-100"
              }`}
            >
              <div className="flex items-start space-x-2.5">
                {item.isReady ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-bold">{item.name}</div>
                  <div className="text-[11px] opacity-80 mt-0.5">
                    {item.isReady
                      ? "Verified in Vault ✅"
                      : "Missing in Vault. Click below to view how to get it."}
                  </div>
                </div>
              </div>

              {!item.isReady && (
                <div className="flex items-center space-x-1 shrink-0">
                  <button
                    onClick={() => handleSetReminder(item.name)}
                    className="p-1 rounded-md bg-white/10 hover:bg-white/20 text-slate-200"
                    title="Remind me to obtain this"
                  >
                    <Bell className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 2. MY DOCUMENTS VAULT */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              My Document Vault ({documents.length} Records)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Securely stored in your browser session. Connect or upload certificates to reuse across all applications.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {doc.category}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      doc.verified
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                        : "bg-amber-50 text-amber-800 border-amber-200"
                    }`}
                  >
                    {doc.verified ? "Verified ✅" : "Missing / Needs Upload"}
                  </span>
                </div>

                <h3 className="text-sm font-extrabold text-slate-900 flex items-center space-x-1.5">
                  <FileText className="w-4 h-4 text-blue-900" />
                  <span>{doc.name}</span>
                </h3>

                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  {doc.notes}
                </p>

                {doc.fileName && (
                  <div className="mt-3 p-2 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-700 font-mono flex items-center justify-between">
                    <span className="truncate">{doc.fileName}</span>
                    <span className="text-slate-400 ml-2 shrink-0">{doc.fileSize}</span>
                  </div>
                )}

                {/* How to get this guide */}
                {doc.howToGetText && !doc.verified && (
                  <div className="mt-3 p-2.5 rounded-xl bg-blue-50/60 border border-blue-100 text-[11px] text-blue-950 space-y-1">
                    <div className="font-bold flex items-center space-x-1">
                      <HelpCircle className="w-3 h-3 text-blue-900" />
                      <span>How to obtain:</span>
                    </div>
                    <div>{doc.howToGetText}</div>
                    {doc.howToGetUrl && (
                      <a
                        href={doc.howToGetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 font-bold text-blue-900 hover:underline pt-0.5"
                      >
                        <span>Official Portal</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                {doc.verified ? (
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[11px] text-slate-400">
                      Uploaded on {doc.uploadedAt}
                    </span>
                    <button
                      onClick={() => updateDocumentStatus(doc.id, false)}
                      className="text-red-600 hover:text-red-800 font-semibold text-[11px]"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between w-full">
                    <button
                      onClick={() => handleSetReminder(doc.name)}
                      className="text-slate-500 hover:text-slate-800 font-medium flex items-center space-x-1"
                    >
                      <Bell className="w-3 h-3" />
                      <span>Reminder</span>
                    </button>

                    <button
                      onClick={() => setUploadModalDocId(doc.id)}
                      className="px-3 py-1.5 rounded-xl bg-blue-950 text-white font-bold text-xs hover:bg-blue-900 shadow-xs flex items-center space-x-1"
                    >
                      <Upload className="w-3 h-3" />
                      <span>Upload Mock PDF</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mock Upload Modal */}
      {uploadModalDocId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
            onClick={() => setUploadModalDocId(null)}
          />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 z-10">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Upload Certificate / Document
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Select or provide a mock PDF file name to simulate DigiLocker / portal verification.
            </p>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700">File Name</label>
              <input
                type="text"
                value={mockFileName}
                onChange={(e) => setMockFileName(e.target.value)}
                placeholder="e.g. income_certificate_2026.pdf"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
              />

              <div className="p-4 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 text-center text-xs text-slate-500">
                <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                <span>Simulated DigiLocker Drag & Drop</span>
              </div>
            </div>

            <div className="mt-5 flex justify-end space-x-2">
              <button
                onClick={() => setUploadModalDocId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={() => handleMockUpload(uploadModalDocId)}
                className="px-4 py-2 rounded-xl bg-blue-950 text-white font-bold text-xs hover:bg-blue-900 shadow-md"
              >
                Confirm Verification
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
