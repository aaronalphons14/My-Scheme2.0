import React from "react";
import { X, Eye, Volume2, Mic, Sparkles, RefreshCcw, Check } from "lucide-react";
import { useSchemeStore } from "@/lib/store";

interface AccessibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccessibilityModal: React.FC<AccessibilityModalProps> = ({ isOpen, onClose }) => {
  const { a11y, updateA11y, t } = useSchemeStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="a11y-title"
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 z-10 animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-900">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h2 id="a11y-title" className="text-base font-bold text-slate-900">
                {t.a11ySettings}
              </h2>
              <p className="text-xs text-slate-500">
                Customise view and reading preferences (WCAG 2.1 AAA Compliant)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close accessibility options"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6 py-5">
          {/* Text Size */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              {t.textSize}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { size: "small", label: "A-", desc: "Compact (14px)" },
                { size: "normal", label: "A", desc: "Default (16px)" },
                { size: "large", label: "A+", desc: "Large (18px)" },
                { size: "xlarge", label: "A++", desc: "Maximum (20px)" },
              ].map((item) => (
                <button
                  key={item.size}
                  onClick={() => updateA11y({ textSize: item.size as any })}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    a11y.textSize === item.size
                      ? "border-blue-900 bg-blue-50 text-blue-950 font-bold ring-2 ring-blue-900/20 shadow-xs"
                      : "border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <div className="text-lg font-bold">{item.label}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* High Contrast Mode */}
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50/70">
            <div>
              <div className="text-sm font-bold text-slate-900">
                {t.highContrast}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Maximum contrast yellow-on-black theme for low vision users
              </div>
            </div>
            <button
              onClick={() => updateA11y({ highContrast: !a11y.highContrast })}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-offset-2 ${
                a11y.highContrast ? "bg-amber-500" : "bg-slate-300"
              }`}
              role="switch"
              aria-checked={a11y.highContrast}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  a11y.highContrast ? "translate-x-5" : "translate-x-0.5"
                } mt-0.5`}
              />
            </button>
          </div>

          {/* Voice Assistance */}
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50/70">
            <div>
              <div className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                <Volume2 className="w-4 h-4 text-blue-900" />
                <span>{t.voiceAssistance}</span>
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Enable text-to-speech reading buttons on all scheme descriptions
              </div>
            </div>
            <button
              onClick={() => updateA11y({ voiceAssistance: !a11y.voiceAssistance })}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-offset-2 ${
                a11y.voiceAssistance ? "bg-blue-900" : "bg-slate-300"
              }`}
              role="switch"
              aria-checked={a11y.voiceAssistance}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  a11y.voiceAssistance ? "translate-x-5" : "translate-x-0.5"
                } mt-0.5`}
              />
            </button>
          </div>

          {/* Reduce Motion */}
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50/70">
            <div>
              <div className="text-sm font-bold text-slate-900">
                {t.reduceMotion}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Disables animations and transitions for users prone to motion discomfort
              </div>
            </div>
            <button
              onClick={() => updateA11y({ reduceMotion: !a11y.reduceMotion })}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-offset-2 ${
                a11y.reduceMotion ? "bg-blue-900" : "bg-slate-300"
              }`}
              role="switch"
              aria-checked={a11y.reduceMotion}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  a11y.reduceMotion ? "translate-x-5" : "translate-x-0.5"
                } mt-0.5`}
              />
            </button>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
          <button
            onClick={() =>
              updateA11y({
                textSize: "normal",
                highContrast: false,
                voiceAssistance: false,
                voiceSearch: true,
                reduceMotion: false,
              })
            }
            className="flex items-center space-x-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            <span>Reset to Standard</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-950 text-white font-bold text-xs hover:bg-blue-900 shadow-md transition-colors"
          >
            Apply & Save
          </button>
        </div>
      </div>
    </div>
  );
};
