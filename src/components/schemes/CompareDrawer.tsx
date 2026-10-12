import React from "react";
import { Link } from "@tanstack/react-router";
import { Scale, X, ArrowRight, Trash2 } from "lucide-react";
import { useSchemeStore } from "@/lib/store";
import { schemes } from "@/data/schemes";

export const CompareDrawer: React.FC = () => {
  const { comparedSchemes, toggleCompareScheme, clearCompare } = useSchemeStore();

  if (comparedSchemes.length === 0) return null;

  const selectedItems = schemes.filter((s) => comparedSchemes.includes(s.id));

  return (
    <div className="fixed bottom-16 lg:bottom-4 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-2xl bg-slate-900/95 backdrop-blur-md text-white rounded-2xl shadow-2xl border border-slate-700/80 p-3 sm:p-4 animate-in slide-in-from-bottom-5 duration-200">
      <div className="flex items-center justify-between gap-3">
        {/* Left: Badge & selected chips */}
        <div className="flex items-center space-x-2.5 overflow-x-auto py-1">
          <div className="flex items-center space-x-1.5 shrink-0 bg-blue-800 text-blue-100 px-2.5 py-1 rounded-xl text-xs font-bold">
            <Scale className="w-3.5 h-3.5" />
            <span>Compare ({comparedSchemes.length}/4)</span>
          </div>

          <div className="flex items-center space-x-2">
            {selectedItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-1 bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-200 shrink-0"
              >
                <span className="max-w-[110px] truncate">{item.name}</span>
                <button
                  onClick={() => toggleCompareScheme(item.id)}
                  className="hover:text-red-400 p-0.5"
                  aria-label={`Remove ${item.name}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={clearCompare}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Clear comparison list"
            aria-label="Clear all"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <Link
            to="/compare"
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white font-bold text-xs shadow-md flex items-center space-x-1 transition-all"
          >
            <span>Compare Matrix</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
