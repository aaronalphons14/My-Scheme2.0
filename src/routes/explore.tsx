import React, { useState, useMemo } from "react";
import { createFileRoute, useSearch, Link } from "@tanstack/react-router";
import {
  Search,
  Filter,
  Grid3X3,
  List,
  SlidersHorizontal,
  X,
  Sparkles,
  ArrowUpDown,
  RotateCcw,
  Building2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { schemes, categories, type SchemeCategory, type Scheme } from "@/data/schemes";
import { useSchemeStore } from "@/lib/store";
import { matchScheme } from "@/lib/scheme-matching";
import { SchemeCard } from "@/components/schemes/SchemeCard";

type ExploreSearchParams = {
  q?: string;
  category?: SchemeCategory | "All";
  scope?: "All" | "Central" | "State";
  state?: string;
  beneficiary?: string;
  sort?: "match" | "benefit" | "deadline" | "name";
};

export const Route = createFileRoute("/explore")({
  validateSearch: (search: Record<string, unknown>): ExploreSearchParams => {
    return {
      q: (search.q as string) || "",
      category: (search.category as SchemeCategory | "All") || "All",
      scope: (search.scope as "All" | "Central" | "State") || "All",
      state: (search.state as string) || "All",
      beneficiary: (search.beneficiary as string) || "All",
      sort: (search.sort as "match" | "benefit" | "deadline" | "name") || "match",
    };
  },
  component: ExploreSchemesPage,
});

function ExploreSchemesPage() {
  const searchParams = useSearch({ from: "/explore" });
  const { profile, t } = useSchemeStore();

  const [searchQuery, setSearchQuery] = useState(searchParams.q || "");
  const [selectedCategory, setSelectedCategory] = useState<SchemeCategory | "All">(
    searchParams.category || "All",
  );
  const [selectedScope, setSelectedScope] = useState<"All" | "Central" | "State">(
    searchParams.scope || "All",
  );
  const [selectedState, setSelectedState] = useState(searchParams.state || "All");
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(searchParams.beneficiary || "All");
  const [sortBy, setSortBy] = useState<"match" | "benefit" | "deadline" | "name">(
    searchParams.sort || "match",
  );
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Filter and sort schemes
  const filteredSchemes = useMemo(() => {
    return schemes.filter((s) => {
      // Keyword
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = s.name.toLowerCase().includes(q);
        const matchesSummary = s.summary.toLowerCase().includes(q);
        const matchesDept = s.department.toLowerCase().includes(q);
        const matchesTags = s.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesSummary && !matchesDept && !matchesTags) return false;
      }

      // Category
      if (selectedCategory !== "All" && s.category !== selectedCategory) {
        return false;
      }

      // Scope
      if (selectedScope !== "All" && s.scope !== selectedScope) {
        return false;
      }

      // State
      if (selectedState !== "All") {
        if (s.scope === "State" && s.state && s.state.toLowerCase() !== selectedState.toLowerCase()) {
          return false;
        }
      }

      // Beneficiary
      if (selectedBeneficiary !== "All") {
        const b = selectedBeneficiary.toLowerCase();
        const matchesOcc = s.occupations.some((o) => o.toLowerCase().includes(b));
        if (!matchesOcc) return false;
      }

      return true;
    });
  }, [searchQuery, selectedCategory, selectedScope, selectedState, selectedBeneficiary]);

  // Sort
  const sortedSchemes = useMemo(() => {
    return [...filteredSchemes].sort((a, b) => {
      if (sortBy === "match") {
        const matchA = matchScheme(a, profile).percentage;
        const matchB = matchScheme(b, profile).percentage;
        return matchB - matchA;
      }
      if (sortBy === "benefit") {
        return b.benefitValue - a.benefitValue;
      }
      if (sortBy === "deadline") {
        return (a.deadlineDays ?? 999) - (b.deadlineDays ?? 999);
      }
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
  }, [filteredSchemes, sortBy, profile]);

  const totalPages = Math.ceil(sortedSchemes.length / pageSize) || 1;
  const paginatedSchemes = sortedSchemes.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedScope("All");
    setSelectedState("All");
    setSelectedBeneficiary("All");
    setSortBy("match");
    setCurrentPage(1);
  };

  const statesList = [
    "All",
    "Tamil Nadu",
    "Uttar Pradesh",
    "Maharashtra",
    "Karnataka",
    "Kerala",
    "Andhra Pradesh",
    "Delhi",
  ];

  const beneficiariesList = [
    "All",
    "Student",
    "Farmer",
    "Woman",
    "Worker",
    "Artisan",
    "Self-Employed",
    "Street Vendor",
    "Job Seeker",
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="text-xs font-bold text-blue-900 uppercase tracking-wider">
            National Catalog
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">
            Explore Government Schemes
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse 24 verified Central & State initiatives across Education, Agriculture, Housing & Welfare.
          </p>
        </div>

        {/* View toggles & Sort dropdown */}
        <div className="flex items-center space-x-3">
          {/* Sort Dropdown */}
          <div className="flex items-center space-x-1.5 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-2xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="match">Sort: Highest Match %</option>
              <option value="benefit">Sort: Highest Benefit</option>
              <option value="deadline">Sort: Closing Soonest</option>
              <option value="name">Sort: Name (A-Z)</option>
            </select>
          </div>

          {/* Grid / List View Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === "grid" ? "bg-white text-blue-900 shadow-2xs" : "text-slate-500"
              }`}
              title="Grid view"
              aria-label="Grid view"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === "list" ? "bg-white text-blue-900 shadow-2xs" : "text-slate-500"
              }`}
              title="List view"
              aria-label="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar & Category Chips */}
      <div className="space-y-4">
        {/* Search input with reset */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by keywords (e.g. 'Scholarship', 'PM-KISAN', 'Subsidy', 'Rooftop Solar')..."
            className="w-full pl-11 pr-10 py-3 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-900 shadow-xs placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Horizontal Filter Chips */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 no-scrollbar">
          <button
            onClick={() => {
              setSelectedCategory("All");
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === "All"
                ? "bg-blue-950 text-white shadow-md shadow-blue-950/20"
                : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            All Categories ({schemes.length})
          </button>

          {categories.map((cat) => {
            const count = schemes.filter((s) => s.category === cat).length;
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  active
                    ? "bg-blue-950 text-white shadow-md shadow-blue-950/20"
                    : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Left Filter Sidebar (3 cols) + Right Schemes (9 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Filter Sidebar */}
        <div className="lg:col-span-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-blue-900" />
              <span>Filters</span>
            </span>
            <button
              onClick={resetFilters}
              className="text-[11px] font-bold text-slate-500 hover:text-blue-900 flex items-center space-x-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Scope: Central vs State */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2">
              Government Level
            </label>
            <div className="grid grid-cols-3 gap-1.5 text-xs font-medium">
              {(["All", "Central", "State"] as const).map((sc) => (
                <button
                  key={sc}
                  onClick={() => {
                    setSelectedScope(sc);
                    setCurrentPage(1);
                  }}
                  className={`py-1.5 px-2 rounded-lg border text-center transition-colors ${
                    selectedScope === sc
                      ? "border-blue-900 bg-blue-50 text-blue-950 font-bold"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {sc}
                </button>
              ))}
            </div>
          </div>

          {/* State Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2">
              State / Union Territory
            </label>
            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-900 bg-white"
            >
              {statesList.map((st) => (
                <option key={st} value={st}>
                  {st === "All" ? "All States (Central & Pan-India)" : st}
                </option>
              ))}
            </select>
          </div>

          {/* Beneficiary Type */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2">
              Beneficiary Type
            </label>
            <select
              value={selectedBeneficiary}
              onChange={(e) => {
                setSelectedBeneficiary(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-900 bg-white"
            >
              {beneficiariesList.map((ben) => (
                <option key={ben} value={ben}>
                  {ben === "All" ? "All Beneficiaries" : ben}
                </option>
              ))}
            </select>
          </div>

          {/* Active Filter Counter */}
          <div className="pt-3 border-t border-slate-100 text-xs text-slate-500">
            Showing <strong>{sortedSchemes.length}</strong> of {schemes.length} schemes
          </div>
        </div>

        {/* Right Schemes Results Grid / List */}
        <div className="lg:col-span-9 space-y-6">
          {sortedSchemes.length === 0 ? (
            /* Friendly Empty State with suggestions */
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                No matching schemes found
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
                We couldn't find any schemes with the current filter criteria. Try clearing some filters or search for common terms.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 rounded-xl bg-blue-950 text-white text-xs font-bold hover:bg-blue-900 shadow-md transition-colors"
                >
                  Clear All Filters
                </button>
                <Link
                  to="/finder"
                  className="px-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors flex items-center space-x-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Ask AI Scheme Finder</span>
                </Link>
              </div>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {paginatedSchemes.map((scheme) => (
                <SchemeCard key={scheme.id} scheme={scheme} />
              ))}
            </div>
          ) : (
            /* List View */
            <div className="space-y-4">
              {paginatedSchemes.map((scheme) => (
                <SchemeCard key={scheme.id} scheme={scheme} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-200 pt-6">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-colors"
              >
                Previous
              </button>

              <div className="text-xs font-medium text-slate-500">
                Page <strong className="text-slate-900">{currentPage}</strong> of{" "}
                <strong className="text-slate-900">{totalPages}</strong>
              </div>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
