import React, { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  User,
  Shield,
  Save,
  Bookmark,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Lock,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { useSchemeStore } from "@/lib/store";
import { schemes } from "@/data/schemes";
import { SchemeCard } from "@/components/schemes/SchemeCard";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const {
    profile,
    updateProfile,
    clearProfile,
    savedSchemes,
    t,
  } = useSchemeStore();

  const [name, setName] = useState(profile.name || "");
  const [age, setAge] = useState<number | "">(profile.age ?? "");
  const [state, setState] = useState(profile.state || "");
  const [occupation, setOccupation] = useState(profile.occupation || "");
  const [income, setIncome] = useState<number | "">(profile.income ?? "");
  const [gender, setGender] = useState(profile.gender || "");
  const [category, setCategory] = useState(profile.category || "");
  const [education, setEducation] = useState(profile.education || "");
  const [disability, setDisability] = useState<boolean>(profile.disability || false);

  const [savedSuccessToast, setSavedSuccessToast] = useState(false);

  // Completeness calculation
  const fields = [name, age, state, occupation, income, gender, category, education];
  const filledFields = fields.filter((f) => f !== "" && f !== undefined).length;
  const completeness = Math.round((filledFields / fields.length) * 100);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: name.trim() || undefined,
      age: age !== "" ? Number(age) : undefined,
      state: state || undefined,
      occupation: occupation || undefined,
      income: income !== "" ? Number(income) : undefined,
      gender: gender || undefined,
      category: category || undefined,
      education: education || undefined,
      disability,
    });
    setSavedSuccessToast(true);
    setTimeout(() => setSavedSuccessToast(false), 3000);
  };

  const handleReset = () => {
    if (confirm("Reset profile details? This will clear all stored demo profile attributes.")) {
      clearProfile();
      setName("");
      setAge("");
      setState("");
      setOccupation("");
      setIncome("");
      setGender("");
      setCategory("");
      setEducation("");
      setDisability(false);
    }
  };

  const bookmarkedSchemesList = schemes.filter((s) => savedSchemes.includes(s.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 pb-20">
      {/* Toast */}
      {savedSuccessToast && (
        <div className="fixed top-20 right-4 z-50 bg-emerald-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-emerald-700 flex items-center space-x-2 text-xs animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Profile saved successfully! AI recommendations updated.</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center space-x-1.5">
            <User className="w-3.5 h-3.5" />
            <span>Citizen Profile</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">
            Eligibility & Profile Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Keep your profile up to date to get accurate eligibility scores and personalized scheme matches.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center space-x-1.5 transition-colors self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Profile</span>
        </button>
      </div>

      {/* Completeness Meter Card */}
      <div className="bg-gradient-to-br from-blue-950 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Profile Completeness
            </div>
            <div className="text-2xl font-black text-white mt-0.5">
              {completeness}% Completed
            </div>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/10 text-slate-200 border border-white/15">
            {completeness >= 80 ? "High Match Accuracy" : "Fill more fields for higher accuracy"}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 rounded-full bg-white/15 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              completeness >= 80 ? "bg-emerald-400" : completeness >= 50 ? "bg-amber-400" : "bg-red-400"
            }`}
            style={{ width: `${completeness}%` }}
          />
        </div>

        <p className="text-xs text-slate-300 mt-3 leading-relaxed">
          {completeness < 100
            ? "Complete missing parameters such as family income and social category to unlock state scholarship quotas and subsidized MSME loans."
            : "Your profile is 100% complete. All schemes across India are accurately evaluated for you."}
        </p>
      </div>

      {/* Profile Form */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900">
              Personal & Demographic Details
            </h2>
            <p className="text-xs text-slate-500">
              These details are used purely for rule matching against scheme eligibility guidelines.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
            {/* Full Name */}
            <div>
              <label className="block font-bold text-slate-800 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Arun Kumar"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900 text-slate-900 font-medium"
              />
            </div>

            {/* Age */}
            <div>
              <label className="block font-bold text-slate-800 mb-1.5">
                Age (Years)
              </label>
              <input
                type="number"
                min="5"
                max="100"
                value={age}
                onChange={(e) => setAge(e.target.value ? Number(e.target.value) : "")}
                placeholder="e.g. 20"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900 text-slate-900 font-medium"
              />
            </div>

            {/* State */}
            <div>
              <label className="block font-bold text-slate-800 mb-1.5">
                State / Union Territory
              </label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900 text-slate-900 font-medium bg-white"
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
                <option value="Madhya Pradesh">Madhya Pradesh</option>
                <option value="Punjab">Punjab</option>
                <option value="Haryana">Haryana</option>
                <option value="Odisha">Odisha</option>
              </select>
            </div>

            {/* Occupation */}
            <div>
              <label className="block font-bold text-slate-800 mb-1.5">
                Primary Occupation
              </label>
              <select
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900 text-slate-900 font-medium bg-white"
              >
                <option value="">Select Occupation</option>
                <option value="student">Student</option>
                <option value="farmer">Farmer / Agriculturalist</option>
                <option value="worker">Worker / Laborer</option>
                <option value="self-employed">Self Employed</option>
                <option value="entrepreneur">Entrepreneur / MSME</option>
                <option value="artisan">Artisan / Craftsperson</option>
                <option value="street vendor">Street Vendor</option>
                <option value="job seeker">Job Seeker</option>
                <option value="homeowner">Homeowner / Resident</option>
                <option value="unemployed">Unemployed</option>
              </select>
            </div>

            {/* Annual Family Income */}
            <div>
              <label className="block font-bold text-slate-800 mb-1.5">
                Annual Family Income (₹)
              </label>
              <input
                type="number"
                value={income}
                onChange={(e) => setIncome(e.target.value ? Number(e.target.value) : "")}
                placeholder="e.g. 250000"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900 text-slate-900 font-medium"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                {income ? `Approx ₹${(Number(income) / 100000).toFixed(2)} Lakhs per annum` : ""}
              </span>
            </div>

            {/* Gender */}
            <div>
              <label className="block font-bold text-slate-800 mb-1.5">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900 text-slate-900 font-medium bg-white"
              >
                <option value="">Select Gender</option>
                <option value="man">Man / Male</option>
                <option value="woman">Woman / Female</option>
                <option value="other">Transgender / Other</option>
              </select>
            </div>

            {/* Social Category */}
            <div>
              <label className="block font-bold text-slate-800 mb-1.5">
                Social Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900 text-slate-900 font-medium bg-white"
              >
                <option value="">Select Category</option>
                <option value="General">General</option>
                <option value="OBC">OBC (Other Backward Classes)</option>
                <option value="SC">SC (Scheduled Caste)</option>
                <option value="ST">ST (Scheduled Tribe)</option>
                <option value="EWS">EWS (Economically Weaker Section)</option>
              </select>
            </div>

            {/* Education */}
            <div>
              <label className="block font-bold text-slate-800 mb-1.5">
                Highest Education
              </label>
              <select
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900 text-slate-900 font-medium bg-white"
              >
                <option value="">Select Education Level</option>
                <option value="Class 10">Class 10 / Matric</option>
                <option value="Class 12">Class 12 / Higher Secondary</option>
                <option value="Diploma / ITI">Diploma / ITI</option>
                <option value="Graduate">Bachelor Degree / Graduate</option>
                <option value="Post Graduate">Master Degree / Post Graduate</option>
              </select>
            </div>

            {/* Differently Abled (Divyangjan) */}
            <div>
              <label className="block font-bold text-slate-800 mb-1.5">
                Differently Abled (Divyangjan)
              </label>
              <div className="flex items-center space-x-4 pt-1.5">
                <label className="flex items-center space-x-2 cursor-pointer font-medium text-slate-700">
                  <input
                    type="radio"
                    name="disability"
                    checked={disability === true}
                    onChange={() => setDisability(true)}
                    className="text-blue-900"
                  />
                  <span>Yes</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer font-medium text-slate-700">
                  <input
                    type="radio"
                    name="disability"
                    checked={disability === false}
                    onChange={() => setDisability(false)}
                    className="text-blue-900"
                  />
                  <span>No</span>
                </label>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-950 hover:bg-blue-900 text-white font-black text-xs shadow-md transition-all flex items-center space-x-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save & Update Profile</span>
            </button>
          </div>
        </form>
      </div>

      {/* Saved Schemes Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bookmark className="w-5 h-5 text-blue-900" />
            <h2 className="text-xl font-bold text-slate-900">
              Saved Schemes ({bookmarkedSchemesList.length})
            </h2>
          </div>
          <Link
            to="/explore"
            className="text-xs font-bold text-blue-900 hover:underline"
          >
            Find more schemes →
          </Link>
        </div>

        {bookmarkedSchemesList.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center text-xs text-slate-500">
            You haven't bookmarked any schemes yet. Click the bookmark icon on any scheme card to save it here.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarkedSchemesList.map((scheme) => (
              <SchemeCard key={scheme.id} scheme={scheme} />
            ))}
          </div>
        )}
      </div>

      {/* Citizen Privacy Charter Note */}
      <div className="p-5 rounded-2xl bg-slate-100 border border-slate-200 text-slate-700 text-xs flex items-start space-x-3">
        <Lock className="w-5 h-5 text-slate-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold text-slate-900">
            Citizen Privacy Pledge
          </h4>
          <p className="leading-relaxed text-slate-600">
            All profile criteria entered above are stored directly inside your device's browser localStorage. They are never sold, tracked by advertising networks, or shared with third parties. They exist strictly to compute eligibility rules on your client device.
          </p>
        </div>
      </div>
    </div>
  );
}
