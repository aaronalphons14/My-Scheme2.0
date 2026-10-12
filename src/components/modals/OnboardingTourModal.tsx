import React, { useState, useEffect } from "react";
import { Sparkles, Globe, ShieldCheck, CheckCircle2, ArrowRight, X } from "lucide-react";
import { useSchemeStore } from "@/lib/store";

export const OnboardingTourModal: React.FC = () => {
  const { isOnboardingOpen, setIsOnboardingOpen } = useSchemeStore();
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Check if user has already seen onboarding
    try {
      const seen = localStorage.getItem("myscheme_onboarding_seen");
      if (!seen) {
        setIsOnboardingOpen(true);
      }
    } catch {
      // ignore
    }
  }, [setIsOnboardingOpen]);

  if (!isOnboardingOpen) return null;

  const steps = [
    {
      title: "Welcome to myScheme 2.0",
      subtitle: "Discover government benefits tailored uniquely for you.",
      desc: "Stop searching through hundreds of scattered departmental websites. myScheme 2.0 uses AI to match your age, occupation, state, and income against 1,000+ eligibility guidelines in seconds.",
      icon: Sparkles,
      color: "from-blue-600 to-indigo-600",
    },
    {
      title: "Regional Voice & Indian Languages",
      subtitle: "Speak in Tamil, Hindi, Telugu, Kannada, Malayalam, or English.",
      desc: "Just click the microphone and describe yourself in plain words. Our natural language parser automatically understands your family income, study status, and requirements without filling complex forms.",
      icon: Globe,
      color: "from-amber-500 to-orange-600",
    },
    {
      title: "Digital Document Locker & Readiness Ring",
      subtitle: "Know if you're ready BEFORE you apply.",
      desc: "Our Document Readiness engine maps your DigiLocker documents against the scheme requirements and warns you upfront if an Income or Community Certificate is missing.",
      icon: ShieldCheck,
      color: "from-emerald-600 to-teal-700",
    },
    {
      title: "Guided Application & Live Status Tracking",
      subtitle: "Never lose track of your scholarship or subsidy again.",
      desc: "Review your pre-filled details, jump straight to the responsible portal, and mark your application to track nodal officer scrutiny, college verification, and Direct Benefit Transfer (DBT).",
      icon: CheckCircle2,
      color: "from-blue-800 to-slate-900",
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    try {
      localStorage.setItem("myscheme_onboarding_seen", "true");
    } catch {
      // ignore
    }
    setIsOnboardingOpen(false);
  };

  const activeStep = steps[currentStep];
  const StepIcon = activeStep.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs transition-opacity"
        onClick={handleFinish}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Welcome tour"
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Top Graphic Accent */}
        <div className={`p-8 bg-gradient-to-br ${activeStep.color} text-white relative`}>
          <button
            onClick={handleFinish}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
            aria-label="Skip tour"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-4 shadow-inner">
            <StepIcon className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-xl font-extrabold tracking-tight text-white">
            {activeStep.title}
          </h2>
          <p className="text-xs font-medium text-white/80 mt-1">
            {activeStep.subtitle}
          </p>
        </div>

        {/* Body content */}
        <div className="p-6">
          <p className="text-sm text-slate-600 leading-relaxed">
            {activeStep.desc}
          </p>

          {/* Stepper Dots */}
          <div className="flex items-center justify-center space-x-2 mt-8 mb-4">
            {steps.map((_, idx) => (
              <span
                key={idx}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentStep ? "w-8 bg-blue-900" : "w-2 bg-slate-200"
                }`}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={handleFinish}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              Skip Tour
            </button>

            <button
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-blue-950 hover:bg-blue-900 text-white font-bold text-xs shadow-md flex items-center space-x-1.5 transition-all"
            >
              <span>{currentStep === steps.length - 1 ? "Start Exploring" : "Next"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
