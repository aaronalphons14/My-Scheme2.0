import type { Scheme, UserProfile } from "@/data/schemes";

export type MatchCheck = {
  label: string;
  state: "met" | "not-met" | "unknown";
  detail: string;
};

export type MatchResult = {
  percentage: number;
  badgeLevel: "highly" | "good" | "possible";
  badgeLabel: string;
  badgeColor: string;
  checks: MatchCheck[];
  unmetReason: string | null;
  matchedCriteria: string[];
};

export function matchScheme(scheme: Scheme, profile: UserProfile): MatchResult {
  const checks: MatchCheck[] = [];
  const matchedCriteria: string[] = [];

  // 1. Age
  if (profile.age === undefined) {
    checks.push({
      label: "Age",
      state: "unknown",
      detail: scheme.minAge || scheme.maxAge ? `Requires ${scheme.minAge ?? 0}–${scheme.maxAge ?? "any"} years` : "No age limit",
    });
  } else {
    const minPass = !scheme.minAge || profile.age >= scheme.minAge;
    const maxPass = !scheme.maxAge || profile.age <= scheme.maxAge;
    if (minPass && maxPass) {
      checks.push({ label: "Age", state: "met", detail: `Age ${profile.age} meets requirement` });
      matchedCriteria.push("Age");
    } else {
      const reason = !minPass
        ? `Minimum age is ${scheme.minAge} (you are ${profile.age})`
        : `Maximum age is ${scheme.maxAge} (you are ${profile.age})`;
      checks.push({ label: "Age", state: "not-met", detail: reason });
    }
  }

  // 2. State
  if (!scheme.state || scheme.scope === "Central") {
    checks.push({ label: "State", state: "met", detail: "Open to all Indian States & UTs" });
    matchedCriteria.push("State (All-India)");
  } else if (!profile.state) {
    checks.push({ label: "State", state: "unknown", detail: `State requirement: ${scheme.state}` });
  } else if (profile.state.toLowerCase() === scheme.state.toLowerCase()) {
    checks.push({ label: "State", state: "met", detail: `Resident of ${scheme.state}` });
    matchedCriteria.push("State");
  } else {
    checks.push({ label: "State", state: "not-met", detail: `Restricted to ${scheme.state} residents (you selected ${profile.state})` });
  }

  // 3. Occupation / Activity
  if (!profile.occupation) {
    checks.push({
      label: "Occupation",
      state: "unknown",
      detail: `Applicable for: ${scheme.occupations.join(", ")}`,
    });
  } else {
    const occLower = profile.occupation.toLowerCase();
    const matchesOcc = scheme.occupations.some(
      (o) => occLower.includes(o.toLowerCase()) || o.toLowerCase().includes(occLower),
    );
    if (matchesOcc) {
      checks.push({ label: "Occupation", state: "met", detail: `Matches ${profile.occupation}` });
      matchedCriteria.push("Occupation");
    } else {
      checks.push({
        label: "Occupation",
        state: "not-met",
        detail: `Targeted for ${scheme.occupations.join(", ")} (you are ${profile.occupation})`,
      });
    }
  }

  // 4. Income Limit
  if (!scheme.incomeMax) {
    checks.push({ label: "Income", state: "met", detail: "No income ceiling specified" });
    matchedCriteria.push("Income");
  } else if (profile.income === undefined) {
    checks.push({
      label: "Income",
      state: "unknown",
      detail: `Income limit: ₹${(scheme.incomeMax).toLocaleString("en-IN")}/yr`,
    });
  } else if (profile.income <= scheme.incomeMax) {
    checks.push({
      label: "Income",
      state: "met",
      detail: `Income ₹${profile.income.toLocaleString("en-IN")} is within ₹${scheme.incomeMax.toLocaleString("en-IN")} ceiling`,
    });
    matchedCriteria.push("Income");
  } else {
    const diff = profile.income - scheme.incomeMax;
    checks.push({
      label: "Income",
      state: "not-met",
      detail: `Your family income is ₹${diff.toLocaleString("en-IN")} above the ₹${scheme.incomeMax.toLocaleString("en-IN")} limit`,
    });
  }

  // 5. Gender
  if (!scheme.gender) {
    // open to all
    checks.push({ label: "Gender", state: "met", detail: "Open to all genders" });
  } else if (!profile.gender) {
    checks.push({ label: "Gender", state: "unknown", detail: `Designated for: ${scheme.gender}` });
  } else {
    const genLower = profile.gender.toLowerCase();
    const targetLower = scheme.gender.toLowerCase();
    if (genLower.includes(targetLower) || targetLower.includes(genLower)) {
      checks.push({ label: "Gender", state: "met", detail: `Meets ${scheme.gender} criteria` });
      matchedCriteria.push("Gender");
    } else {
      checks.push({ label: "Gender", state: "not-met", detail: `Scheme is exclusively for ${scheme.gender}` });
    }
  }

  // Calculate percentage
  const totalAssessed = checks.filter((c) => c.state !== "unknown");
  const metCount = checks.filter((c) => c.state === "met").length;
  const unknownCount = checks.filter((c) => c.state === "unknown").length;

  let percentage = 70; // baseline if empty
  if (totalAssessed.length > 0) {
    const score = (metCount / checks.length) * 100;
    // give partial benefit of doubt for unknown if other criteria are strictly met
    percentage = Math.round(score + (unknownCount * 6));
    if (percentage > 98) percentage = 98;
    if (percentage < 30) percentage = 32;
  }

  // If hard-fail on state or gender or age, reduce percentage
  const hasHardFail = checks.some((c) => c.state === "not-met");
  if (hasHardFail && percentage > 74) {
    percentage = 68;
  }

  let badgeLevel: "highly" | "good" | "possible" = "possible";
  let badgeLabel = "Possible Match";
  let badgeColor = "bg-amber-500/10 text-amber-700 border-amber-500/20";

  if (percentage >= 90) {
    badgeLevel = "highly";
    badgeLabel = "Highly Recommended";
    badgeColor = "bg-emerald-500/10 text-emerald-700 border-emerald-500/20";
  } else if (percentage >= 75) {
    badgeLevel = "good";
    badgeLabel = "Good Match";
    badgeColor = "bg-blue-500/10 text-blue-700 border-blue-500/20";
  }

  const unmetItem = checks.find((c) => c.state === "not-met");
  const unmetReason = unmetItem ? unmetItem.detail : null;

  return {
    percentage,
    badgeLevel,
    badgeLabel,
    badgeColor,
    checks,
    unmetReason,
    matchedCriteria,
  };
}

export function parseProfile(message: string, current: UserProfile): UserProfile {
  const next = { ...current };

  // Age extraction
  const ageMatch = message.match(/(?:\b(?:age(?:d)?|i am|i'm|im)\s*[:=]?\s*)(\d{1,2})/i)
    ?? message.match(/(\d{1,2})\s*(?:years? old|yr old|yrs old|yo\b)/i);
  if (ageMatch?.[1]) {
    const parsedAge = Number(ageMatch[1]);
    if (parsedAge >= 5 && parsedAge <= 100) {
      next.age = parsedAge;
    }
  }

  // State extraction
  const stateNames = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
    "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
    "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
    "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Puducherry", "Jammu and Kashmir"
  ];
  const matchedState = stateNames.find((s) => new RegExp(`\\b${s}\\b`, "i").test(message));
  if (matchedState) next.state = matchedState;

  // Occupation extraction
  const occupations = [
    "student", "farmer", "worker", "artisan", "entrepreneur", "street vendor",
    "self-employed", "job seeker", "homeowner", "unemployed", "pregnant woman", "woman"
  ];
  for (const occ of occupations) {
    if (new RegExp(`\\b${occ}\\b`, "i").test(message)) {
      next.occupation = occ;
      break;
    }
  }

  // Income extraction
  // Matches "₹2.5 lakh", "2.5 lakh", "₹250000", "2.5L", "25000/mo", "income 300000"
  const incomeRegex = /(?:income|family income|earn|earning|salary|package)[^\d₹]{0,20}(?:₹|rs\.?|inr)?\s*(\d+(?:\.\d+)?)\s*(lakh|lac|lpa|l|k|thousand)?/i;
  const directAmountRegex = /(?:₹|rs\.?)\s*(\d+(?:\.\d+)?)\s*(lakh|lac|lpa|l|k|thousand)?/i;
  const wordAmountRegex = /(\d+(?:\.\d+)?)\s*(lakh|lac|lpa)\b/i;

  const incMatch = message.match(incomeRegex) || message.match(directAmountRegex) || message.match(wordAmountRegex);
  if (incMatch) {
    const rawNum = Number(incMatch[1]);
    const unit = incMatch[2]?.toLowerCase();
    if (unit === "lakh" || unit === "lac" || unit === "l" || unit === "lpa") {
      next.income = rawNum * 100000;
    } else if (unit === "k" || unit === "thousand") {
      next.income = rawNum * 1000;
    } else if (rawNum > 1000) {
      next.income = rawNum;
    } else if (rawNum <= 25) {
      // e.g. "income is 3" usually means 3 lakhs in Indian colloquial context
      next.income = rawNum * 100000;
    }
  }

  // Gender extraction
  if (/\b(woman|female|girl|mother|daughter|lady|she|her)\b/i.test(message)) {
    next.gender = "woman";
  } else if (/\b(man|male|boy|son|father|he|his)\b/i.test(message)) {
    next.gender = "man";
  }

  // Category extraction
  if (/\b(sc|scheduled caste)\b/i.test(message)) next.category = "SC";
  else if (/\b(st|scheduled tribe)\b/i.test(message)) next.category = "ST";
  else if (/\b(obc|other backward classes?)\b/i.test(message)) next.category = "OBC";
  else if (/\b(ews|economically weaker section)\b/i.test(message)) next.category = "EWS";
  else if (/\b(general|open category)\b/i.test(message)) next.category = "General";

  // Disability extraction
  if (/\b(disability|disabled|divyang|physically challenged|pwd)\b/i.test(message)) {
    next.disability = true;
  }

  // Education extraction
  if (/\b(10th|matric|high school)\b/i.test(message)) next.education = "Class 10";
  else if (/\b(12th|intermediate|plus two|higher secondary)\b/i.test(message)) next.education = "Class 12";
  else if (/\b(b\.?tech|b\.?e|mbbs|degree|graduate|bachelor|bsc|bcom|ba)\b/i.test(message)) next.education = "Graduate";
  else if (/\b(post graduate|pg|master|m\.?tech|mba|msc)\b/i.test(message)) next.education = "Post Graduate";
  else if (/\b(diploma|iti)\b/i.test(message)) next.education = "Diploma / ITI";

  return next;
}