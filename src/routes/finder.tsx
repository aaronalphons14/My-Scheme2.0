import React, { useState, useRef, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Sparkles,
  Send,
  Mic,
  MicOff,
  User,
  Bot,
  RotateCcw,
  Sliders,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Edit2,
  X,
  Volume2,
  VolumeX,
  ArrowRight,
  Filter,
} from "lucide-react";
import { useSchemeStore } from "@/lib/store";
import { schemes } from "@/data/schemes";
import { matchScheme, parseProfile } from "@/lib/scheme-matching";
import { SchemeCard } from "@/components/schemes/SchemeCard";
import { startSpeechRecognition, isSpeechRecognitionSupported, speakText, stopSpeaking } from "@/lib/speech";

export const Route = createFileRoute("/finder")({
  component: SmartFinderPage,
});

type ChatMessage = {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  extracted?: {
    age?: number;
    state?: string;
    occupation?: string;
    income?: number;
    gender?: string;
    category?: string;
  };
  matchedCount?: number;
};

function SmartFinderPage() {
  const { profile, updateProfile, t, language } = useSchemeStore();

  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  // Initial greeting
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: "msg-1",
      sender: "assistant",
      text: "Namaste! I am your AI Scheme Discovery Assistant. Tell me about yourself in plain words — your age, state, what you do, or family income. I will instantly discover every central and state benefit made for you.",
      timestamp: "Just now",
    },
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const speechHandleRef = useRef<{ stop: () => void } | null>(null);

  // Auto scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Suggested questions chips
  const suggestedPrompts = [
    "🎓 I'm a 20-year-old student from Tamil Nadu. Family income ₹2.5 lakh per year.",
    "🌾 I'm a farmer from Uttar Pradesh looking for direct financial assistance & crop insurance.",
    "💼 I'm a 28-year-old woman entrepreneur looking to start a food enterprise with subsidies.",
    "🏠 Urban resident with ₹4.5 lakh annual income looking for housing interest subsidy.",
    "🏥 Seeking cashless healthcare coverage for a family of 5 with elderly parents.",
  ];

  // Live ranking of schemes based on current profile
  const rankedSchemes = schemes
    .map((s) => ({
      scheme: s,
      match: matchScheme(s, profile),
    }))
    .sort((a, b) => b.match.percentage - a.match.percentage);

  const topMatches = rankedSchemes.filter((m) => m.match.percentage >= 70);
  const displaySchemes = topMatches.length > 0 ? topMatches : rankedSchemes.slice(0, 8);

  const handleSendMessage = (messageText: string) => {
    const text = messageText.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Parse profile using rule-based extractor
    const updatedProfile = parseProfile(text, profile);
    updateProfile(updatedProfile);

    // Compute updated matches
    setTimeout(() => {
      const newRanked = schemes.map((s) => ({
        scheme: s,
        match: matchScheme(s, updatedProfile),
      }));
      const qualified = newRanked.filter((m) => m.match.percentage >= 75);

      // Determine follow up questions if key parameters are still unknown
      let followUp = "";
      if (updatedProfile.income === undefined) {
        followUp = " Could you also share your approximate annual family income so I can verify eligibility against specific income limits?";
      } else if (!updatedProfile.state) {
        followUp = " Which State or Union Territory do you reside in? Certain schemes have state-specific quotas.";
      } else if (!updatedProfile.occupation) {
        followUp = " Are you currently a student, farmer, self-employed, or working in the unorganised sector?";
      }

      const assistantText = `Based on your details (${[
        updatedProfile.age ? `Age: ${updatedProfile.age}` : null,
        updatedProfile.state ? `State: ${updatedProfile.state}` : null,
        updatedProfile.occupation ? `Occupation: ${updatedProfile.occupation}` : null,
        updatedProfile.income ? `Income: ₹${(updatedProfile.income / 100000).toFixed(1)}L/yr` : null,
      ]
        .filter(Boolean)
        .join(", ")}), we found ${qualified.length} highly relevant schemes for you.${followUp}`;

      const aiMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: "assistant",
        text: assistantText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        matchedCount: qualified.length,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 700);
  };

  const handleVoiceInput = () => {
    if (isListening) {
      speechHandleRef.current?.stop();
      setIsListening(false);
      return;
    }

    if (!isSpeechRecognitionSupported()) {
      alert("Voice speech recognition is not supported in this browser.");
      return;
    }

    setIsListening(true);
    const handle = startSpeechRecognition(
      language,
      (transcript) => {
        setIsListening(false);
        handleSendMessage(transcript);
      },
      () => setIsListening(false),
      () => setIsListening(false),
    );
    speechHandleRef.current = handle;
  };

  const handleReset = () => {
    setMessages([
      {
        id: "msg-1",
        sender: "assistant",
        text: "Chat reset. How can I help you discover government benefits today?",
        timestamp: "Just now",
      },
    ]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-900 text-xs font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>AI Conversational Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Smart Scheme Finder
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Describe your situation in natural language. Our engine extracts your parameters and ranks schemes live.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsEditProfileOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:border-slate-400 text-slate-800 text-xs font-bold shadow-2xs flex items-center space-x-1.5 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5 text-blue-900" />
            <span>Update My Details</span>
          </button>

          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors"
            title="Reset conversation"
            aria-label="Reset conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Layout: Left Profile & Chat, Right Live Schemes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Profile Chips & Chat Interface (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Active Profile Summary Panel (Editable Chips) */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
                <Sliders className="w-3.5 h-3.5 text-blue-900" />
                <span>Extracted Profile Parameters</span>
              </span>
              <button
                onClick={() => setIsEditProfileOpen(true)}
                className="text-[11px] font-bold text-blue-900 hover:underline"
              >
                Edit All
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              <div
                onClick={() => setIsEditProfileOpen(true)}
                className="cursor-pointer px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100/70 border border-blue-200 text-blue-950 text-xs font-medium flex items-center space-x-1.5 transition-colors"
              >
                <span className="text-slate-400">Age:</span>
                <span className="font-bold">{profile.age ? `${profile.age} yrs` : "Not set"}</span>
              </div>

              <div
                onClick={() => setIsEditProfileOpen(true)}
                className="cursor-pointer px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100/70 border border-blue-200 text-blue-950 text-xs font-medium flex items-center space-x-1.5 transition-colors"
              >
                <span className="text-slate-400">State:</span>
                <span className="font-bold">{profile.state || "Not set"}</span>
              </div>

              <div
                onClick={() => setIsEditProfileOpen(true)}
                className="cursor-pointer px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100/70 border border-blue-200 text-blue-950 text-xs font-medium flex items-center space-x-1.5 transition-colors"
              >
                <span className="text-slate-400">Work/Study:</span>
                <span className="font-bold capitalize">{profile.occupation || "Not set"}</span>
              </div>

              <div
                onClick={() => setIsEditProfileOpen(true)}
                className="cursor-pointer px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100/70 border border-blue-200 text-blue-950 text-xs font-medium flex items-center space-x-1.5 transition-colors"
              >
                <span className="text-slate-400">Income:</span>
                <span className="font-bold">
                  {profile.income !== undefined
                    ? `₹${(profile.income / 100000).toFixed(1)}L/yr`
                    : "Not set"}
                </span>
              </div>

              {profile.gender && (
                <div className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 text-xs font-medium capitalize">
                  <span className="text-slate-400">Gender:</span> {profile.gender}
                </div>
              )}

              {profile.category && (
                <div className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 text-xs font-medium">
                  <span className="text-slate-400">Category:</span> {profile.category}
                </div>
              )}
            </div>
          </div>

          {/* Chat Window */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[520px]">
            {/* Messages Scroll Area */}
            <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start space-x-2.5 ${
                    msg.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                      msg.sender === "user"
                        ? "bg-blue-950 text-white"
                        : "bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950"
                    }`}
                  >
                    {msg.sender === "user" ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                  </div>

                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-blue-950 text-white rounded-tr-xs"
                        : "bg-slate-100 text-slate-900 rounded-tl-xs border border-slate-200/60"
                    }`}
                  >
                    <div>{msg.text}</div>
                    <div
                      className={`text-[10px] mt-1 text-right ${
                        msg.sender === "user" ? "text-blue-200" : "text-slate-400"
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center space-x-2 text-xs text-slate-400 italic py-2">
                  <span className="w-2 h-2 rounded-full bg-blue-900 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-blue-900 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-blue-900 animate-bounce [animation-delay:0.4s]" />
                  <span>AI Assistant is analyzing eligibility rules...</span>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Suggested Question Chips */}
            <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/70 overflow-x-auto flex space-x-2 no-scrollbar">
              {suggestedPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  className="px-3 py-1.5 rounded-full bg-white hover:bg-blue-50 border border-slate-200 text-slate-700 hover:text-blue-900 text-[11px] font-medium whitespace-nowrap shrink-0 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(input);
              }}
              className="p-3 sm:p-4 border-t border-slate-200 bg-white flex items-center space-x-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type in English, Hindi, Tamil... e.g. 'I am 22yo student from Karnataka'"
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 placeholder:text-slate-400"
              />

              {/* Voice Input Mic */}
              <button
                type="button"
                onClick={handleVoiceInput}
                className={`p-2.5 rounded-xl transition-all ${
                  isListening
                    ? "bg-red-500 text-white animate-pulse"
                    : "text-slate-500 hover:text-blue-900 hover:bg-slate-100 border border-slate-300"
                }`}
                title="Speak to the AI Assistant"
                aria-label="Voice input button"
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              {/* Send Button */}
              <button
                type="submit"
                disabled={!input.trim()}
                className="p-2.5 rounded-xl bg-blue-950 text-white hover:bg-blue-900 disabled:opacity-40 transition-colors"
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: Live Ranked Scheme Cards (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 text-white p-4 rounded-2xl flex items-center justify-between shadow-md">
            <div>
              <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                Live Matched Results
              </div>
              <h2 className="text-base font-bold text-white mt-0.5">
                {displaySchemes.length} Schemes Discovered
              </h2>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-800 text-blue-200">
              Ranked Live
            </span>
          </div>

          <div className="space-y-4 max-h-[640px] overflow-y-auto pr-1">
            {displaySchemes.map(({ scheme, match }) => (
              <SchemeCard key={scheme.id} scheme={scheme} />
            ))}
          </div>
        </div>
      </div>

      {/* Profile Edit Modal Dialog */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
            onClick={() => setIsEditProfileOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 z-10 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-900">
                Update Profile Parameters
              </h3>
              <button
                onClick={() => setIsEditProfileOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Age</label>
                <input
                  type="number"
                  value={profile.age ?? ""}
                  onChange={(e) => updateProfile({ age: e.target.value ? Number(e.target.value) : undefined })}
                  placeholder="e.g. 20"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">State Domicile</label>
                <select
                  value={profile.state ?? ""}
                  onChange={(e) => updateProfile({ state: e.target.value || undefined })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-900 bg-white"
                >
                  <option value="">Select State</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Kerala">Kerala</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="West Bengal">West Bengal</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Bihar">Bihar</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Occupation</label>
                <select
                  value={profile.occupation ?? ""}
                  onChange={(e) => updateProfile({ occupation: e.target.value || undefined })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-900 bg-white"
                >
                  <option value="">Select Occupation</option>
                  <option value="student">Student</option>
                  <option value="farmer">Farmer</option>
                  <option value="worker">Worker / Wage Laborer</option>
                  <option value="self-employed">Self Employed</option>
                  <option value="entrepreneur">Entrepreneur</option>
                  <option value="artisan">Artisan / Craftsperson</option>
                  <option value="street vendor">Street Vendor</option>
                  <option value="job seeker">Job Seeker</option>
                  <option value="unemployed">Unemployed</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Annual Family Income</label>
                <input
                  type="number"
                  value={profile.income ?? ""}
                  onChange={(e) => updateProfile({ income: e.target.value ? Number(e.target.value) : undefined })}
                  placeholder="e.g. 250000"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Gender</label>
                <select
                  value={profile.gender ?? ""}
                  onChange={(e) => updateProfile({ gender: e.target.value || undefined })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-900 bg-white"
                >
                  <option value="">Any / Not specified</option>
                  <option value="woman">Woman / Female</option>
                  <option value="man">Man / Male</option>
                </select>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setIsEditProfileOpen(false)}
                className="px-4 py-2 rounded-xl bg-blue-950 text-white font-bold text-xs hover:bg-blue-900 shadow-md"
              >
                Save & Recalculate Matches
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
