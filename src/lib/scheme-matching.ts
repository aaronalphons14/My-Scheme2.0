import type { Scheme, UserProfile } from "@/data/schemes";

export type MatchResult = {
  percentage: number;
  checks: { label: string; state: "met" | "not-met" | "unknown" }[];
  reason: string | null;
};

export function matchScheme(scheme: Scheme, profile: UserProfile): MatchResult {
  const rules: { label: string; pass: boolean | undefined; reason?: string }[] = [
    {
      label: "Age",
      pass:
        profile.age === undefined
          ? undefined
          : (!scheme.minAge || profile.age >= scheme.minAge) &&
            (!scheme.maxAge || profile.age <= scheme.maxAge),
      reason: scheme.maxAge && profile.age && profile.age > scheme.maxAge
        ? `This scheme lists an age limit of ${scheme.maxAge}.`
        : undefined,
    },
    {
      label: "State",
      pass:
        profile.state === undefined || scheme.scope === "Central" || !scheme.state
          ? undefined
          : profile.state.toLowerCase() === scheme.state.toLowerCase(),
      reason: scheme.state ? `This example is for residents of ${scheme.state}.` : undefined,
    },
    {
      label: "Work or study",
      pass:
        profile.occupation === undefined
          ? undefined
          : scheme.occupations.some((occupation) =>
              `${profile.occupation}`.toLowerCase().includes(occupation.toLowerCase()),
            ) ||
            scheme.occupations.some((occupation) =>
              occupation.toLowerCase().includes(`${profile.occupation}`.toLowerCase()),
            ),
    },
    {
      label: "Income",
      pass:
        profile.income === undefined || !scheme.incomeMax
          ? undefined
          : profile.income <= scheme.incomeMax,
      reason:
        scheme.incomeMax && profile.income && profile.income > scheme.incomeMax
          ? `Income is ₹${(profile.income - scheme.incomeMax).toLocaleString("en-IN")} above the example limit.`
          : undefined,
    },
    {
      label: "Gender",
      pass:
        profile.gender === undefined || !scheme.gender
          ? undefined
          : profile.gender.toLowerCase().includes(scheme.gender.toLowerCase()) ||
            scheme.gender.toLowerCase().includes(profile.gender.toLowerCase()),
    },
  ];
  const assessed = rules.filter((rule) => rule.pass !== undefined);
  const met = assessed.filter((rule) => rule.pass).length;
  const percentage = assessed.length === 0 ? 62 : Math.round((met / assessed.length) * 100);
  return {
    percentage,
    checks: rules.map(({ label, pass }) => ({
      label,
      state: pass === undefined ? "unknown" : pass ? "met" : "not-met",
    })),
    reason: rules.find((rule) => rule.pass === false && rule.reason)?.reason ?? null,
  };
}

export function parseProfile(message: string, current: UserProfile): UserProfile {
  const next = { ...current };
  const age = message.match(/(?:\b(?:age(?:d)?|i am|i'm|im)\s*[:=]?\s*)(\d{1,2})/i);
  if (age?.[1]) next.age = Number(age[1]);
  const stateNames = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
    "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
    "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
    "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi",
  ];
  const state = stateNames.find((name) => message.toLowerCase().includes(name.toLowerCase()));
  if (state) next.state = state;
  const occupation = ["student", "farmer", "woman", "job seeker", "worker", "artisan", "entrepreneur", "street vendor", "self-employed", "homeowner"]
    .find((word) => message.toLowerCase().includes(word));
  if (occupation) next.occupation = occupation;
  const incomeMatch = message.match(/(?:income|earn|salary|family income)[^\d₹]{0,18}₹?\s*(\d+(?:\.\d+)?)\s*(lakh|lac|l|thousand|k)?/i)
    ?? message.match(/₹\s*(\d+(?:\.\d+)?)\s*(lakh|lac|l|thousand|k)?/i);
  if (incomeMatch?.[1]) {
    const amount = Number(incomeMatch[1]);
    const scale = incomeMatch[2]?.toLowerCase();
    next.income = amount * (scale === "lakh" || scale === "lac" || scale === "l" ? 100000 : scale ? 1000 : 1);
  }
  if (/\b(woman|female|girl)\b/i.test(message)) next.gender = "woman";
  if (/\b(man|male|boy)\b/i.test(message)) next.gender = "man";
  if (/\b(disability|disabled|divyang)\b/i.test(message)) next.disability = true;
  if (/\b(sc|st|obc|ews|general)\b/i.test(message)) {
    const category = message.match(/\b(sc|st|obc|ews|general)\b/i)?.[1];
    if (category) next.category = category.toUpperCase();
  }
  return next;
}