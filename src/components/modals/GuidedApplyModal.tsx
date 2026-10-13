import React, { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  X,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  FileCheck,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { useSchemeStore } from "@/lib/store";
import { schemes } from "@/data/schemes";
import { matchScheme } from "@/lib/scheme-matching";
import { getLocalizedScheme } from "@/lib/scheme-translations";
import { getSiteText } from "@/lib/site-translations";

export const GuidedApplyModal: React.FC = () => {
  const navigate = useNavigate();
  const {
    isApplyModalOpen,
    applySchemeId,
    closeApplyModal,
    profile,
    documents,
    addApplication,
    language,
    t,
  } = useSchemeStore();

  const site = getSiteText(language);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [trackingId, setTrackingId] = useState(
    () => `APP-2026-${Math.floor(10000 + Math.random() * 90000)}`,
  );
  const [customRef, setCustomRef] = useState("");
  const [notes, setNotes] = useState("");

  if (!isApplyModalOpen || !applySchemeId) return null;

  const rawScheme = schemes.find((s) => s.id === applySchemeId);
  if (!rawScheme) return null;

  const scheme = getLocalizedScheme(rawScheme, language);
  const match = matchScheme(rawScheme, profile);

  // Document check
  const docStatus = scheme.requiredDocuments.map((docName) => {
    const found = documents.find(
      (d) =>
        d.name.toLowerCase().includes(docName.toLowerCase()) ||
        docName.toLowerCase().includes(d.name.toLowerCase()),
    );
    return {
      name: docName,
      ready: found?.verified || false,
    };
  });

  const verifiedDocsCount = docStatus.filter((d) => d.ready).length;
  const isDocsComplete = verifiedDocsCount === scheme.requiredDocuments.length;

  const handleOfficialRedirect = () => {
    window.open(scheme.officialUrl, "_blank", "noopener,noreferrer");
    setStep(4);
  };

  const handleMarkAsApplied = () => {
    const finalTrackingRef = customRef.trim() || trackingId;
    addApplication({
      schemeId: scheme.id,
      schemeName: scheme.name,
      department: scheme.department,
      category: scheme.category,
      status: "Submitted",
      benefitAmount: scheme.benefit,
      trackingRef: finalTrackingRef,
      nextStep: "Acknowledgement received. Institutional scrutiny scheduled within 10 working days.",
      timeline: [
        {
          title: "Application Submitted",
          date: new Date().toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          description: `Submitted via official portal (${scheme.officialUrl}). Acknowledgement Ref: ${finalTrackingRef}`,
          completed: true,
          current: true,
        },
        {
          title: "Document Verification",
          date: "Pending",
          description: "Nodal officer will verify uploaded certificates.",
          completed: false,
        },
        {
          title: "Department Scrutiny",
          date: "Pending",
          description: "Eligibility approval and budget allocation.",
          completed: false,
        },
        {
          title: "Benefit Sanction / DBT",
          date: "Pending",
          description: "Direct Bank Transfer to Aadhaar-seeded bank account.",
          completed: false,
        },
      ],
    });

    closeApplyModal();
    setStep(1);
    navigate({ to: "/applications" });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
        onClick={closeApplyModal}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="guided-apply-title"
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Top Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div>
            <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Guided Citizen Apply Flow</span>
            </div>
            <h2 id="guided-apply-title" className="text-base font-bold text-white mt-0.5 line-clamp-1">
              {scheme.name}
            </h2>
          </div>

          <button
            onClick={closeApplyModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4-Step Progress Indicator */}
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between text-xs">
          {[
            { num: 1, label: "Readiness" },
            { num: 2, label: "Review Data" },
            { num: 3, label: "Official Portal" },
            { num: 4, label: "Confirm & Track" },
          ].map((s) => (
            <div key={s.num} className="flex items-center space-x-1.5">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                  step === s.num
                    ? "bg-blue-900 text-white ring-2 ring-blue-900/30"
                    : step > s.num
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-200 text-slate-600"
                }`}
              >
                {step > s.num ? "✓" : s.num}
              </div>
              <span
                className={`hidden sm:inline-block font-medium ${
                  step === s.num ? "text-blue-950 font-bold" : "text-slate-500"
                }`}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Modal Body based on step */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-blue-50/70 border border-blue-100">
                <div>
                  <div className="text-xs font-semibold text-slate-600">Your AI Match Score</div>
                  <div className="text-xl font-black text-blue-950 mt-0.5">
                    {match.percentage}% Match
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${match.badgeColor}`}>
                  {match.badgeLabel}
                </span>
              </div>

              {match.unmetReason && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start space-x-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">Eligibility Notice:</div>
                    <div>{match.unmetReason}</div>
                  </div>
                </div>
              )}

              {/* Document Readiness Checklist */}
              <div>
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Document Readiness ({verifiedDocsCount}/{scheme.requiredDocuments.length})</span>
                  <span className={`text-[11px] font-bold ${isDocsComplete ? "text-emerald-700" : "text-amber-700"}`}>
                    {isDocsComplete ? "All Ready" : "Missing Documents"}
                  </span>
                </div>

                <div className="space-y-2">
                  {docStatus.map((doc) => (
                    <div
                      key={doc.name}
                      className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                        doc.ready
                          ? "bg-emerald-50/60 border-emerald-200 text-emerald-950"
                          : "bg-red-50/50 border-red-200 text-red-950"
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        {doc.ready ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                        )}
                        <span className="font-semibold">{doc.name}</span>
                      </div>
                      <span className="text-[11px] font-medium">
                        {doc.ready ? "Verified in Vault" : "Not Uploaded"}
                      </span>
                    </div>
                  ))}
                </div>

                {!isDocsComplete && (
                  <p className="text-[11px] text-amber-800 bg-amber-50/80 p-2.5 rounded-lg border border-amber-200/80 mt-3">
                    <strong>Tip:</strong> You can still proceed to view the official portal, but we recommend preparing the missing documents before final submission.
                  </p>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="text-xs text-slate-600">
                The official portal will request the following personal details. Please review your pre-filled citizen profile:
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-slate-400 font-medium">Applicant Name</div>
                  <div className="text-slate-900 font-bold mt-0.5">{profile.name || "Arun Kumar"}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-slate-400 font-medium">Age & Gender</div>
                  <div className="text-slate-900 font-bold mt-0.5">
                    {profile.age ?? 20} Years · {profile.gender || "Not specified"}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-slate-400 font-medium">State Domicile</div>
                  <div className="text-slate-900 font-bold mt-0.5">{profile.state || "Tamil Nadu"}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-slate-400 font-medium">Occupation</div>
                  <div className="text-slate-900 font-bold mt-0.5 capitalize">{profile.occupation || "Student"}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-slate-400 font-medium">Family Annual Income</div>
                  <div className="text-slate-900 font-bold mt-0.5">
                    ₹{(profile.income ?? 250000).toLocaleString("en-IN")}/year
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-slate-400 font-medium">Social Category</div>
                  <div className="text-slate-900 font-bold mt-0.5">{profile.category || "General"}</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>
                  Aadhaar DBT e-KYC status: <strong>Active & Enabled</strong>
                </span>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center mx-auto shadow-md">
                <ExternalLink className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Ready to Redirect to Official Portal
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  You are being redirected to <strong>{scheme.department}</strong> official website:
                </p>
                <div className="mt-2 text-xs font-mono text-blue-900 bg-blue-50 py-1.5 px-3 rounded-lg border border-blue-200 inline-block">
                  {scheme.officialUrl}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs space-y-1.5">
                <div className="font-bold text-slate-800">What happens next:</div>
                <div className="text-slate-600">1. Click "Open Official Portal" to launch the government portal in a new tab.</div>
                <div className="text-slate-600">2. Complete the form and note your Application Acknowledgement Number.</div>
                <div className="text-slate-600">3. Return here to mark it as applied so myScheme 2.0 can track its status for you.</div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 flex items-center space-x-3">
                <CheckCircle2 className="w-6 h-6 text-blue-900 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-blue-950">
                    Did you submit on the official portal?
                  </div>
                  <div className="text-[11px] text-slate-600">
                    Save your tracking reference below to monitor scrutiny stages and DBT payments.
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Official Application / Acknowledgement Number
                </label>
                <input
                  type="text"
                  value={customRef}
                  onChange={(e) => setCustomRef(e.target.value)}
                  placeholder={`e.g. ${trackingId}`}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Submission Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Uploaded mark memo, pending college seal submission..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep((s) => (s - 1) as any)}
              className="flex items-center space-x-1 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <button
              onClick={closeApplyModal}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              Cancel
            </button>
          )}

          {step === 1 && (
            <button
              onClick={() => setStep(2)}
              className="px-5 py-2.5 rounded-xl bg-blue-950 text-white font-bold text-xs hover:bg-blue-900 shadow-md flex items-center space-x-1.5 transition-colors"
            >
              <span>Review Profile Data</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {step === 2 && (
            <button
              onClick={() => setStep(3)}
              className="px-5 py-2.5 rounded-xl bg-blue-950 text-white font-bold text-xs hover:bg-blue-900 shadow-md flex items-center space-x-1.5 transition-colors"
            >
              <span>Continue to Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {step === 3 && (
            <button
              onClick={handleOfficialRedirect}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white font-bold text-xs hover:from-blue-950 hover:to-indigo-950 shadow-md flex items-center space-x-1.5 transition-colors"
            >
              <span>Open Official Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}

          {step === 4 && (
            <button
              onClick={handleMarkAsApplied}
              className="px-5 py-2.5 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 shadow-md flex items-center space-x-1.5 transition-colors"
            >
              <span>Confirm & Add to My Applications</span>
              <CheckCircle2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
