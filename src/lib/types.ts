import type { SchemeCategory } from "@/data/schemes";

export type UserProfile = {
  name?: string;
  age?: number;
  dob?: string;
  state?: string;
  district?: string;
  occupation?: string;
  income?: number;
  gender?: "man" | "woman" | "other" | string;
  category?: "General" | "OBC" | "SC" | "ST" | "EWS" | string;
  disability?: boolean;
  education?: string;
};

export type VaultDocument = {
  id: string;
  name: string;
  category: "Identity" | "Income & Caste" | "Education" | "Banking" | "Residence & Land";
  fileName?: string;
  fileSize?: string;
  uploadedAt?: string;
  verified: boolean;
  notes?: string;
  howToGetUrl?: string;
  howToGetText?: string;
};

export type ApplicationTimelineStep = {
  title: string;
  date: string;
  description: string;
  completed: boolean;
  current?: boolean;
};

export type UserApplication = {
  id: string;
  schemeId: string;
  schemeName: string;
  department: string;
  category: SchemeCategory;
  appliedAt: string;
  status: "Submitted" | "Under Review" | "Approved" | "Rejected";
  benefitAmount: string;
  trackingRef: string;
  nextStep: string;
  timeline: ApplicationTimelineStep[];
};

export type AccessibilitySettings = {
  textSize: "small" | "normal" | "large" | "xlarge";
  highContrast: boolean;
  voiceAssistance: boolean;
  voiceSearch: boolean;
  reduceMotion: boolean;
  theme?: "light" | "dark";
};

export type LanguageCode = "en" | "hi" | "ta" | "te" | "kn" | "ml";

export type NotificationItem = {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: "deadline" | "status" | "info";
  schemeId?: string;
  read: boolean;
};
