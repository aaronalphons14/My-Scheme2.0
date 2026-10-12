import React, { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Scale,
  Sparkles,
  Trash2,
  Plus,
  Check,
  X,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  Building2,
  FileText,
  Clock,
  Award,
} from "lucide-react";
import { schemes, type Scheme } from "@/data/schemes";
import { useSchemeStore } from "@/lib/store";
import { matchScheme } from "@/lib/scheme-matching";

export const Route = createFileRoute("/compare")({
  component: CompareSchemesPage,
});

function CompareSchemesPage() {
  const {
    comparedSchemes,
    toggleCompareScheme,
    clearCompare,
    profile,
    openApplyModal,
  } = useSchemeStore();

  const [addSelectorOpen, setAddSelectorOpen] = useState(false);

  // Selected scheme objects
  const selectedList = schemes.filter((s) => comparedSchemes.includes(s.id));

  // Compute matches for each
  const evaluated = selectedList.map((s) => ({
    scheme: s,
    match: matchScheme(s, profile),
  }));

  // Identify "Best for you" (highest match % among selected, tie-break by benefit)
  const bestForYouSchemeId =
    evaluated.length > 0
      ? [...evaluated].sort((a, b) => {
          if (b.match.percentage !== a.match.percentage) {
            return b.match.percentage - a.match.percentage;
          }
          return b.scheme.benefitValue - a.scheme.benefitValue;
        })[0]?.scheme.id
      : null;

  // Maximum benefit value among selected
  const maxBenefit = Math.max(...selectedList.map((s) => s.benefitValue), 0);

  // Schemes available to add
  const availableToAdd = schemes.filter((s) => !comparedSchemes.includes(s.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center space-x-1.5">
            <Scale className="w-3.5 h-3.5" />
            <span>Side-by-Side Matrix</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">
            Compare Schemes
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Compare benefits, eligibility criteria, documents, and application modes side-by-side.
          </p>
        </div>

        {selectedList.length > 0 && (
          <div className="flex items-center space-x-2">
            {selectedList.length < 4 && (
              <button
                onClick={() => setAddSelectorOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-blue-950 text-white text-xs font-bold hover:bg-blue-900 shadow-md flex items-center space-x-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Scheme ({selectedList.length}/4)</span>
              </button>
            )}

            <button
              onClick={clearCompare}
              className="p-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-600 hover:text-red-600 transition-colors"
              title="Clear all schemes from comparison"
              aria-label="Clear all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Selector modal to add a scheme if modal open */}
      {addSelectorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
            onClick={() => setAddSelectorOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 z-10 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-900">
                Select Scheme to Compare
              </h3>
              <button
                onClick={() => setAddSelectorOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {availableToAdd.map((s) => (
                <div
                  key={s.id}
                  onClick={() => {
                    toggleCompareScheme(s.id);
                    setAddSelectorOpen(false);
                  }}
                  className="p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 cursor-pointer flex items-center justify-between transition-colors"
                >
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      {s.name}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {s.category} · {s.benefit}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-blue-900">+ Add</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Comparison Table / Matrix */}
      {selectedList.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-xs">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-900 flex items-center justify-center mx-auto mb-4">
            <Scale className="w-8 h-8" />
          </div>
          <h2 className="text-base font-bold text-slate-900">
            No schemes selected for comparison
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Select 2 to 4 schemes from Explore or recommendations to view a side-by-side comparison matrix.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <button
              onClick={() => {
                toggleCompareScheme("pm-scholarship");
                toggleCompareScheme("national-means-merit");
              }}
              className="px-4 py-2 rounded-xl bg-blue-950 text-white font-bold text-xs hover:bg-blue-900 shadow-md"
            >
              Compare Education Scholarships (Demo)
            </button>
            <Link
              to="/explore"
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50"
            >
              Browse Catalog
            </Link>
          </div>
        </div>
      ) : (
        /* Horizontally Swipeable Comparison Table */
        <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-xs">
          <table className="w-full text-left border-collapse min-w-[700px]">
            {/* Table Header: Scheme Titles & Actions */}
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70">
                <th className="p-4 sm:p-5 w-44 font-bold text-xs text-slate-500 uppercase tracking-wider">
                  Attribute
                </th>
                {evaluated.map(({ scheme, match }) => {
                  const isBest = scheme.id === bestForYouSchemeId;
                  return (
                    <th key={scheme.id} className="p-4 sm:p-5 font-bold align-top relative">
                      {isBest && (
                        <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider mb-2 shadow-xs">
                          <Award className="w-3 h-3" />
                          <span>Best For You</span>
                        </div>
                      )}

                      <div className="flex items-start justify-between gap-2">
                        <Link
                          to="/schemes/$id"
                          params={{ id: scheme.id }}
                          className="text-sm font-extrabold text-slate-900 hover:text-blue-900 line-clamp-2"
                        >
                          {scheme.name}
                        </Link>
                        <button
                          onClick={() => toggleCompareScheme(scheme.id)}
                          className="p-1 rounded-md text-slate-400 hover:text-red-500"
                          title="Remove from compare"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-[11px] font-medium text-slate-500 mt-1 line-clamp-1">
                        {scheme.department}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs">
              {/* Row 1: Match Score */}
              <tr className="hover:bg-slate-50/50">
                <td className="p-4 font-bold text-slate-700 bg-slate-50/40">
                  AI Match Score
                </td>
                {evaluated.map(({ scheme, match }) => (
                  <td key={scheme.id} className="p-4">
                    <div className="flex items-center space-x-1.5">
                      <span className={`px-2.5 py-1 rounded-full font-bold text-xs border ${match.badgeColor}`}>
                        {match.percentage}% · {match.badgeLabel}
                      </span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Row 2: Benefit Amount */}
              <tr className="hover:bg-slate-50/50">
                <td className="p-4 font-bold text-slate-700 bg-slate-50/40">
                  Benefit Amount
                </td>
                {evaluated.map(({ scheme }) => {
                  const isMax = scheme.benefitValue === maxBenefit && maxBenefit > 0;
                  return (
                    <td key={scheme.id} className="p-4">
                      <div className={`font-black text-sm ${isMax ? "text-emerald-800" : "text-slate-900"}`}>
                        {scheme.benefit}
                      </div>
                      {isMax && (
                        <span className="inline-block mt-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-sm">
                          Highest Value
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* Row 3: Scope */}
              <tr className="hover:bg-slate-50/50">
                <td className="p-4 font-bold text-slate-700 bg-slate-50/40">
                  Government Level
                </td>
                {evaluated.map(({ scheme }) => (
                  <td key={scheme.id} className="p-4 font-semibold text-slate-800">
                    {scheme.scope === "Central" ? "Central Government" : `${scheme.state} State`}
                  </td>
                ))}
              </tr>

              {/* Row 4: Category */}
              <tr className="hover:bg-slate-50/50">
                <td className="p-4 font-bold text-slate-700 bg-slate-50/40">
                  Category
                </td>
                {evaluated.map(({ scheme }) => (
                  <td key={scheme.id} className="p-4">
                    <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-900 font-bold text-[11px]">
                      {scheme.category}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Row 5: Eligibility Summary */}
              <tr className="hover:bg-slate-50/50">
                <td className="p-4 font-bold text-slate-700 bg-slate-50/40">
                  Eligibility Criteria
                </td>
                {evaluated.map(({ scheme }) => (
                  <td key={scheme.id} className="p-4 space-y-1 text-slate-600">
                    <div>
                      <strong>Age:</strong> {scheme.minAge || scheme.maxAge ? `${scheme.minAge ?? 0}–${scheme.maxAge ?? "any"} yrs` : "No limit"}
                    </div>
                    <div>
                      <strong>Income Limit:</strong> {scheme.incomeMax ? `₹${scheme.incomeMax.toLocaleString("en-IN")}` : "No ceiling"}
                    </div>
                    <div>
                      <strong>Occupation:</strong> <span className="capitalize">{scheme.occupations.join(", ")}</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Row 6: Required Documents */}
              <tr className="hover:bg-slate-50/50">
                <td className="p-4 font-bold text-slate-700 bg-slate-50/40">
                  Required Documents
                </td>
                {evaluated.map(({ scheme }) => (
                  <td key={scheme.id} className="p-4">
                    <div className="font-bold text-slate-900 mb-1">
                      {scheme.requiredDocuments.length} Documents Required
                    </div>
                    <ul className="list-disc list-inside text-slate-500 space-y-0.5 text-[11px]">
                      {scheme.requiredDocuments.map((doc) => (
                        <li key={doc} className="truncate">{doc}</li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>

              {/* Row 7: Application Mode */}
              <tr className="hover:bg-slate-50/50">
                <td className="p-4 font-bold text-slate-700 bg-slate-50/40">
                  Application Mode
                </td>
                {evaluated.map(({ scheme }) => (
                  <td key={scheme.id} className="p-4 font-semibold text-slate-800">
                    {scheme.applicationMode}
                  </td>
                ))}
              </tr>

              {/* Row 8: Deadline */}
              <tr className="hover:bg-slate-50/50">
                <td className="p-4 font-bold text-slate-700 bg-slate-50/40">
                  Application Window
                </td>
                {evaluated.map(({ scheme }) => (
                  <td key={scheme.id} className="p-4 text-slate-800">
                    <div className="font-bold">{scheme.deadline}</div>
                    {scheme.deadlineDays && (
                      <div className="text-amber-700 text-[11px]">
                        {scheme.deadlineDays} days remaining
                      </div>
                    )}
                  </td>
                ))}
              </tr>

              {/* Row 9: Actions */}
              <tr className="bg-slate-50/70">
                <td className="p-4 font-bold text-slate-700">Action</td>
                {evaluated.map(({ scheme }) => (
                  <td key={scheme.id} className="p-4">
                    <button
                      onClick={() => openApplyModal(scheme.id)}
                      className="w-full px-4 py-2 rounded-xl bg-blue-950 hover:bg-blue-900 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center space-x-1"
                    >
                      <span>Apply</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
