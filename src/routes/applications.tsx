import React, { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  FileText,
  Building2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Bell,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Plus,
} from "lucide-react";
import { useSchemeStore } from "@/lib/store";
import type { UserApplication } from "@/lib/types";

export const Route = createFileRoute("/applications")({
  component: ApplicationsPage,
});

function ApplicationsPage() {
  const {
    applications,
    updateApplicationStatus,
    notifications,
    markNotificationRead,
  } = useSchemeStore();

  const [activeTab, setActiveTab] = useState<
    "All" | "Submitted" | "Under Review" | "Approved" | "Rejected"
  >("All");
  const [expandedId, setExpandedId] = useState<string | null>(applications[0]?.id || null);

  const statusCounts = {
    All: applications.length,
    Submitted: applications.filter((a) => a.status === "Submitted").length,
    "Under Review": applications.filter((a) => a.status === "Under Review").length,
    Approved: applications.filter((a) => a.status === "Approved").length,
    Rejected: applications.filter((a) => a.status === "Rejected").length,
  };

  const filteredApplications =
    activeTab === "All"
      ? applications
      : applications.filter((a) => a.status === activeTab);

  const getStatusColor = (status: UserApplication["status"]) => {
    switch (status) {
      case "Approved":
        return "bg-emerald-100 text-emerald-900 border-emerald-300";
      case "Under Review":
        return "bg-amber-100 text-amber-900 border-amber-300";
      case "Submitted":
        return "bg-blue-100 text-blue-900 border-blue-300";
      case "Rejected":
        return "bg-red-100 text-red-900 border-red-300";
    }
  };

  const getStatusIcon = (status: UserApplication["status"]) => {
    switch (status) {
      case "Approved":
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case "Under Review":
        return <Clock className="w-4 h-4 text-amber-600 animate-spin" />;
      case "Submitted":
        return <FileText className="w-4 h-4 text-blue-600" />;
      case "Rejected":
        return <XCircle className="w-4 h-4 text-red-600" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Real-time Tracking</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">
            My Applications Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track status updates, scrutiny stages, and DBT disbursal for all submitted schemes.
          </p>
        </div>

        <Link
          to="/explore"
          className="px-4 py-2.5 rounded-xl bg-blue-950 hover:bg-blue-900 text-white font-bold text-xs shadow-md transition-colors flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Apply For New Scheme</span>
        </Link>
      </div>

      {/* Notifications / Alerts Bar */}
      {notifications.length > 0 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-950 text-white flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-white/10 shrink-0">
              <Bell className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                Status Alert
              </div>
              <div className="text-xs text-slate-200 mt-0.5">
                {notifications[0].message}
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 font-medium">
            Updated {notifications[0].timestamp}
          </div>
        </div>
      )}

      {/* Filter Tabs: Submitted | Under Review | Approved | Rejected */}
      <div className="flex border-b border-slate-200 overflow-x-auto no-scrollbar space-x-2 text-xs font-bold">
        {(["All", "Submitted", "Under Review", "Approved", "Rejected"] as const).map(
          (tab) => {
            const count = statusCounts[tab];
            const active = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 px-3 border-b-2 flex items-center space-x-1.5 transition-colors cursor-pointer ${
                  active
                    ? "border-blue-950 text-blue-950"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <span>{tab}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    active ? "bg-blue-100 text-blue-900" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          },
        )}
      </div>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-xs">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8" />
          </div>
          <h2 className="text-base font-bold text-slate-900">
            No applications in "{activeTab}" status
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            You haven't submitted any schemes under this status yet. Browse schemes to apply and track them here.
          </p>
          <Link
            to="/explore"
            className="mt-6 inline-block px-5 py-2.5 rounded-xl bg-blue-950 text-white font-bold text-xs"
          >
            Explore Schemes Catalog
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((app) => {
            const isExpanded = expandedId === app.id;

            return (
              <div
                key={app.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all overflow-hidden"
              >
                {/* Main Card Header */}
                <div className="p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-900">
                        {app.category}
                      </span>
                      <span className="text-xs font-mono font-medium text-slate-500">
                        Ref: <strong>{app.trackingRef}</strong>
                      </span>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-xs text-slate-500">
                        Applied: {app.appliedAt}
                      </span>
                    </div>

                    <h2 className="text-base sm:text-lg font-black text-slate-900">
                      {app.schemeName}
                    </h2>

                    <div className="text-xs text-slate-500 flex items-center space-x-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{app.department}</span>
                    </div>

                    {/* Next step line */}
                    <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 text-xs text-blue-950 flex items-start space-x-2">
                      <Clock className="w-4 h-4 text-blue-900 shrink-0 mt-0.5" />
                      <div>
                        <strong>Next Step:</strong> {app.nextStep}
                      </div>
                    </div>
                  </div>

                  {/* Status Pill & Benefit */}
                  <div className="flex flex-col sm:items-end justify-between gap-3 shrink-0">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center space-x-1.5 ${getStatusColor(
                          app.status,
                        )}`}
                      >
                        {getStatusIcon(app.status)}
                        <span>{app.status}</span>
                      </span>

                      {/* Status changer simulator for testing */}
                      <select
                        value={app.status}
                        onChange={(e) =>
                          updateApplicationStatus(app.id, e.target.value as any)
                        }
                        className="text-[11px] px-2 py-1 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 focus:outline-none"
                        title="Simulate government status change"
                      >
                        <option value="Submitted">Status: Submitted</option>
                        <option value="Under Review">Status: Under Review</option>
                        <option value="Approved">Status: Approved</option>
                        <option value="Rejected">Status: Rejected</option>
                      </select>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                        Benefit Value
                      </span>
                      <span className="text-sm font-black text-emerald-800">
                        {app.benefitAmount}
                      </span>
                    </div>

                    <button
                      onClick={() => setExpandedId(isExpanded ? null : app.id)}
                      className="text-xs font-bold text-blue-900 hover:underline flex items-center space-x-1 self-end"
                    >
                      <span>{isExpanded ? "Hide Timeline" : "View Timeline"}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expandable Status Timeline */}
                {isExpanded && (
                  <div className="bg-slate-50/70 p-6 border-t border-slate-100">
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">
                      Application Progress & Disbursal Stages
                    </h3>

                    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                      {app.timeline.map((step, idx) => (
                        <div key={idx} className="relative flex items-start space-x-3 text-xs">
                          {/* Dot / Check Icon */}
                          <div
                            className={`absolute -left-6 w-5 h-5 rounded-full flex items-center justify-center ${
                              step.completed
                                ? "bg-emerald-600 text-white"
                                : step.current
                                  ? "bg-amber-500 text-white animate-pulse"
                                  : "bg-slate-200 text-slate-500"
                            }`}
                          >
                            {step.completed ? (
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            ) : (
                              <span className="text-[10px] font-bold">{idx + 1}</span>
                            )}
                          </div>

                          <div className="flex-1 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                            <div className="flex items-center justify-between">
                              <span
                                className={`font-bold ${
                                  step.completed
                                    ? "text-emerald-900"
                                    : step.current
                                      ? "text-amber-900"
                                      : "text-slate-600"
                                }`}
                              >
                                {step.title}
                              </span>
                              <span className="text-[11px] text-slate-400 font-medium">
                                {step.date}
                              </span>
                            </div>
                            <p className="text-slate-500 mt-1 leading-relaxed">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
