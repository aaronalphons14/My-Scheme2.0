import React, { createContext, useContext, useEffect, useState } from "react";
import type {
  AccessibilitySettings,
  LanguageCode,
  NotificationItem,
  UserApplication,
  UserProfile,
  VaultDocument,
} from "./types";
import { translations, type Translations } from "./i18n";

type SchemeStoreContextType = {
  profile: UserProfile;
  updateProfile: (partial: Partial<UserProfile>) => void;
  clearProfile: () => void;
  savedSchemes: string[];
  toggleSaveScheme: (schemeId: string) => boolean;
  isSchemeSaved: (schemeId: string) => boolean;
  comparedSchemes: string[];
  toggleCompareScheme: (schemeId: string) => boolean;
  clearCompare: () => void;
  isCompared: (schemeId: string) => boolean;
  documents: VaultDocument[];
  updateDocumentStatus: (id: string, verified: boolean, fileName?: string) => void;
  addDocument: (doc: VaultDocument) => void;
  applications: UserApplication[];
  addApplication: (app: Omit<UserApplication, "id" | "appliedAt">) => UserApplication;
  updateApplicationStatus: (appId: string, status: UserApplication["status"]) => void;
  a11y: AccessibilitySettings;
  updateA11y: (partial: Partial<AccessibilitySettings>) => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: Translations;
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  unreadCount: number;
  isApplyModalOpen: boolean;
  applySchemeId: string | null;
  openApplyModal: (schemeId: string) => void;
  closeApplyModal: () => void;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark") => void;
};

const defaultProfile: UserProfile = {
  name: "Arun Kumar",
  age: 20,
  state: "Tamil Nadu",
  occupation: "student",
  income: 250000,
  gender: "man",
  category: "OBC",
  disability: false,
  education: "Graduate",
};

const defaultDocuments: VaultDocument[] = [
  {
    id: "aadhaar",
    name: "Aadhaar Card",
    category: "Identity",
    fileName: "aadhaar_xxxx_9821.pdf",
    fileSize: "1.4 MB",
    uploadedAt: "10 Oct 2026",
    verified: true,
    notes: "Aadhaar biometric & mobile OTP verified via UIDAI DigiLocker gateway.",
    howToGetUrl: "https://myaadhaar.uidai.gov.in/",
    howToGetText: "Download instant e-Aadhaar from UIDAI portal using mobile OTP.",
  },
  {
    id: "bank_passbook",
    name: "Bank Account Details",
    category: "Banking",
    fileName: "sbi_passbook_active.pdf",
    fileSize: "840 KB",
    uploadedAt: "08 Oct 2026",
    verified: true,
    notes: "State Bank of India savings account linked to Aadhaar for Direct Benefit Transfer (DBT).",
    howToGetUrl: "https://www.npci.org.in/",
    howToGetText: "Ensure your savings account is seeded with Aadhaar for Direct Benefit Transfer.",
  },
  {
    id: "marksheets",
    name: "Marksheets",
    category: "Education",
    fileName: "hsc_12th_marksheet.pdf",
    fileSize: "2.1 MB",
    uploadedAt: "05 Oct 2026",
    verified: true,
    notes: "Class 12 Higher Secondary Examination mark memo digitally verified via DigiLocker.",
    howToGetUrl: "https://www.digilocker.gov.in/",
    howToGetText: "Fetch digital marksheets directly into DigiLocker from your state education board.",
  },
  {
    id: "institution_id",
    name: "Institution ID",
    category: "Education",
    fileName: "college_id_bonafide.pdf",
    fileSize: "1.2 MB",
    uploadedAt: "02 Oct 2026",
    verified: true,
    notes: "College ID and Bonafide Certificate issued for Academic Year 2026-27.",
    howToGetUrl: "https://scholarships.gov.in/",
    howToGetText: "Collect student bonafide certificate signed by the principal/dean.",
  },
  {
    id: "income_cert",
    name: "Income Certificate",
    category: "Income & Caste",
    fileName: undefined,
    fileSize: undefined,
    uploadedAt: undefined,
    verified: false,
    notes: "Required for scholarships and fee concession schemes with income ceiling.",
    howToGetUrl: "https://services.india.gov.in/",
    howToGetText: "Apply via state e-District portal or local Tahsildar / Revenue Inspector office.",
  },
  {
    id: "community_cert",
    name: "Community Certificate",
    category: "Income & Caste",
    fileName: undefined,
    fileSize: undefined,
    uploadedAt: undefined,
    verified: false,
    notes: "Required for reservation benefits and social justice scheme quotas.",
    howToGetUrl: "https://services.india.gov.in/",
    howToGetText: "Submit family ration card and school TC on state e-District portal.",
  },
  {
    id: "land_records",
    name: "Land Records",
    category: "Residence & Land",
    fileName: undefined,
    fileSize: undefined,
    uploadedAt: undefined,
    verified: false,
    notes: "Required for farmer schemes (PM-KISAN, crop insurance).",
    howToGetUrl: "https://dilrmp.gov.in/",
    howToGetText: "Download digitally signed Patta / Chitta / Khasra from your state land portal.",
  },
  {
    id: "residence_proof",
    name: "Residence Proof",
    category: "Residence & Land",
    fileName: undefined,
    fileSize: undefined,
    uploadedAt: undefined,
    verified: false,
    notes: "Required for state domicile restricted welfare initiatives.",
    howToGetUrl: "https://edistrict.gov.in/",
    howToGetText: "Apply for Nativity / Domicile Certificate through nearest e-Seva Kendra.",
  },
];

const defaultApplications: UserApplication[] = [
  {
    id: "APP-2026-9812",
    schemeId: "pm-scholarship",
    schemeName: "Prime Minister's Scholarship Scheme (PMSS)",
    department: "Ministry of Home Affairs",
    category: "Education",
    appliedAt: "02 Oct 2026",
    status: "Under Review",
    benefitAmount: "₹36,000 / year",
    trackingRef: "NSP-2026-MHA-87421",
    nextStep: "Institutional level scrutiny in progress. Keep college attendance record ready.",
    timeline: [
      {
        title: "Application Submitted",
        date: "02 Oct 2026",
        description: "Application successfully submitted through the National Scholarship Portal.",
        completed: true,
      },
      {
        title: "DigiLocker Document Verification",
        date: "04 Oct 2026",
        description: "Aadhaar and academic marksheets verified successfully.",
        completed: true,
      },
      {
        title: "Nodal Institute Verification",
        date: "In Progress",
        description: "Currently pending approval by college scholarship officer.",
        completed: false,
        current: true,
      },
      {
        title: "DBT Sanction & Disbursal",
        date: "Estimated 15 Nov 2026",
        description: "Fund disbursement directly to Bank Account via PFMS gateway.",
        completed: false,
      },
    ],
  },
  {
    id: "APP-2026-4409",
    schemeId: "tn-first-graduate",
    schemeName: "Tamil Nadu First Graduate Tuition Concession",
    department: "Government of Tamil Nadu",
    category: "Education",
    appliedAt: "28 Sep 2026",
    status: "Approved",
    benefitAmount: "₹25,000 Tuition Waiver",
    trackingRef: "TN-ED-2026-FG-1102",
    nextStep: "Sanction certificate issued. Download concession slip and submit to College Registrar.",
    timeline: [
      {
        title: "Application Submitted",
        date: "28 Sep 2026",
        description: "Submitted at e-Seva centre with family declaration.",
        completed: true,
      },
      {
        title: "Revenue Inspector Field Check",
        date: "01 Oct 2026",
        description: "Verified family educational status at Taluk office.",
        completed: true,
      },
      {
        title: "Tahsildar Sanction Approval",
        date: "05 Oct 2026",
        description: "First Graduate Certificate approved and digitally signed.",
        completed: true,
      },
      {
        title: "Tuition Concession Order Issued",
        date: "07 Oct 2026",
        description: "Sanction letter generated and communicated to university.",
        completed: true,
      },
    ],
  },
];

const defaultNotifications: NotificationItem[] = [
  {
    id: "n-1",
    title: "Application Deadline Alert",
    message: "PM-KISAN eKYC verification closes in 4 days. Update Aadhaar linkage now.",
    timestamp: "2 hours ago",
    type: "deadline",
    schemeId: "pm-kisan",
    read: false,
  },
  {
    id: "n-2",
    title: "Status Update: PMSS Application",
    message: "Your application NSP-2026-MHA-87421 has moved to Institutional Level Scrutiny.",
    timestamp: "1 day ago",
    type: "status",
    schemeId: "pm-scholarship",
    read: false,
  },
  {
    id: "n-3",
    title: "Document Vault Reminder",
    message: "Upload Income Certificate to unlock 6 additional state scholarship schemes.",
    timestamp: "3 days ago",
    type: "info",
    read: true,
  },
];

const SchemeStoreContext = createContext<SchemeStoreContextType | null>(null);

export const SchemeStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    if (typeof window === "undefined") return defaultProfile;
    try {
      const stored = localStorage.getItem("myscheme_profile");
      return stored ? JSON.parse(stored) : defaultProfile;
    } catch {
      return defaultProfile;
    }
  });

  const [savedSchemes, setSavedSchemes] = useState<string[]>(() => {
    if (typeof window === "undefined") return ["pm-scholarship", "ayushman-bharat"];
    try {
      const stored = localStorage.getItem("myscheme_saved");
      return stored ? JSON.parse(stored) : ["pm-scholarship", "ayushman-bharat"];
    } catch {
      return ["pm-scholarship", "ayushman-bharat"];
    }
  });

  const [comparedSchemes, setComparedSchemes] = useState<string[]>(() => {
    if (typeof window === "undefined") return ["pm-scholarship", "national-means-merit"];
    try {
      const stored = localStorage.getItem("myscheme_compare");
      return stored ? JSON.parse(stored) : ["pm-scholarship", "national-means-merit"];
    } catch {
      return ["pm-scholarship", "national-means-merit"];
    }
  });

  const [documents, setDocuments] = useState<VaultDocument[]>(() => {
    if (typeof window === "undefined") return defaultDocuments;
    try {
      const stored = localStorage.getItem("myscheme_documents");
      return stored ? JSON.parse(stored) : defaultDocuments;
    } catch {
      return defaultDocuments;
    }
  });

  const [applications, setApplications] = useState<UserApplication[]>(() => {
    if (typeof window === "undefined") return defaultApplications;
    try {
      const stored = localStorage.getItem("myscheme_applications");
      return stored ? JSON.parse(stored) : defaultApplications;
    } catch {
      return defaultApplications;
    }
  });

  const [a11y, setA11y] = useState<AccessibilitySettings>(() => {
    if (typeof window === "undefined") {
      return {
        textSize: "normal",
        highContrast: false,
        voiceAssistance: false,
        voiceSearch: true,
        reduceMotion: false,
      };
    }
    try {
      const stored = localStorage.getItem("myscheme_a11y");
      return stored
        ? JSON.parse(stored)
        : {
            textSize: "normal",
            highContrast: false,
            voiceAssistance: false,
            voiceSearch: true,
            reduceMotion: false,
          };
    } catch {
      return {
        textSize: "normal",
        highContrast: false,
        voiceAssistance: false,
        voiceSearch: true,
        reduceMotion: false,
      };
    }
  });

  const [language, setLanguageState] = useState<LanguageCode>(() => {
    if (typeof window === "undefined") return "en";
    try {
      return (localStorage.getItem("myscheme_lang") as LanguageCode) || "en";
    } catch {
      return "en";
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    if (typeof window === "undefined") return defaultNotifications;
    try {
      const stored = localStorage.getItem("myscheme_notifications");
      return stored ? JSON.parse(stored) : defaultNotifications;
    } catch {
      return defaultNotifications;
    }
  });

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applySchemeId, setApplySchemeId] = useState<string | null>(null);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // Theme state: default to light, persist to localStorage
  const [theme, setThemeState] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "light";
    try {
      const stored = localStorage.getItem("myscheme_theme");
      if (stored === "dark" || stored === "light") return stored;
    } catch {
      // ignore
    }
    return "light";
  });

  useEffect(() => {
    try {
      localStorage.setItem("myscheme_theme", theme);
    } catch {
      // ignore
    }
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      if (theme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const setTheme = (newTheme: "light" | "dark") => {
    setThemeState(newTheme);
  };

  // Synchronize localStorage
  useEffect(() => {
    try {
      localStorage.setItem("myscheme_profile", JSON.stringify(profile));
    } catch {
      // ignore
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem("myscheme_saved", JSON.stringify(savedSchemes));
    } catch {
      // ignore
    }
  }, [savedSchemes]);

  useEffect(() => {
    try {
      localStorage.setItem("myscheme_compare", JSON.stringify(comparedSchemes));
    } catch {
      // ignore
    }
  }, [comparedSchemes]);

  useEffect(() => {
    try {
      localStorage.setItem("myscheme_documents", JSON.stringify(documents));
    } catch {
      // ignore
    }
  }, [documents]);

  useEffect(() => {
    try {
      localStorage.setItem("myscheme_applications", JSON.stringify(applications));
    } catch {
      // ignore
    }
  }, [applications]);

  useEffect(() => {
    try {
      localStorage.setItem("myscheme_a11y", JSON.stringify(a11y));
    } catch {
      // ignore
    }
    // Apply a11y classes to body
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      // High contrast
      if (a11y.highContrast) {
        root.classList.add("high-contrast-mode");
      } else {
        root.classList.remove("high-contrast-mode");
      }

      // Font size
      root.classList.remove("text-size-small", "text-size-normal", "text-size-large", "text-size-xlarge");
      root.classList.add(`text-size-${a11y.textSize}`);

      // Reduce motion
      if (a11y.reduceMotion) {
        root.classList.add("reduce-motion");
      } else {
        root.classList.remove("reduce-motion");
      }
    }
  }, [a11y]);

  useEffect(() => {
    try {
      localStorage.setItem("myscheme_lang", language);
    } catch {
      // ignore
    }
  }, [language]);

  useEffect(() => {
    try {
      localStorage.setItem("myscheme_notifications", JSON.stringify(notifications));
    } catch {
      // ignore
    }
  }, [notifications]);

  const updateProfile = (partial: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...partial }));
  };

  const clearProfile = () => {
    setProfile({});
  };

  const toggleSaveScheme = (schemeId: string): boolean => {
    let saved = false;
    setSavedSchemes((prev) => {
      if (prev.includes(schemeId)) {
        saved = false;
        return prev.filter((id) => id !== schemeId);
      } else {
        saved = true;
        return [...prev, schemeId];
      }
    });
    return saved;
  };

  const isSchemeSaved = (schemeId: string) => savedSchemes.includes(schemeId);

  const toggleCompareScheme = (schemeId: string): boolean => {
    let inList = false;
    setComparedSchemes((prev) => {
      if (prev.includes(schemeId)) {
        inList = false;
        return prev.filter((id) => id !== schemeId);
      } else {
        if (prev.length >= 4) {
          // keep latest 4
          return [...prev.slice(1), schemeId];
        }
        inList = true;
        return [...prev, schemeId];
      }
    });
    return inList;
  };

  const clearCompare = () => setComparedSchemes([]);

  const isCompared = (schemeId: string) => comparedSchemes.includes(schemeId);

  const updateDocumentStatus = (id: string, verified: boolean, fileName?: string) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === id
          ? {
              ...doc,
              verified,
              fileName: fileName ?? doc.fileName ?? `${doc.id}_uploaded.pdf`,
              fileSize: fileName ? "1.5 MB" : doc.fileSize,
              uploadedAt: new Date().toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }),
            }
          : doc,
      ),
    );
  };

  const addDocument = (doc: VaultDocument) => {
    setDocuments((prev) => {
      const idx = prev.findIndex((d) => d.id === doc.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = doc;
        return next;
      }
      return [...prev, doc];
    });
  };

  const addApplication = (appData: Omit<UserApplication, "id" | "appliedAt">): UserApplication => {
    const newApp: UserApplication = {
      ...appData,
      id: `APP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      appliedAt: new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    };
    setApplications((prev) => [newApp, ...prev]);
    return newApp;
  };

  const updateApplicationStatus = (appId: string, status: UserApplication["status"]) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, status } : app)),
    );
  };

  const updateA11y = (partial: Partial<AccessibilitySettings>) => {
    setA11y((prev) => ({ ...prev, ...partial }));
  };

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const openApplyModal = (schemeId: string) => {
    setApplySchemeId(schemeId);
    setIsApplyModalOpen(true);
  };

  const closeApplyModal = () => {
    setApplySchemeId(null);
    setIsApplyModalOpen(false);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const t = translations[language] || translations.en;

  return (
    <SchemeStoreContext.Provider
      value={{
        profile,
        updateProfile,
        clearProfile,
        savedSchemes,
        toggleSaveScheme,
        isSchemeSaved,
        comparedSchemes,
        toggleCompareScheme,
        clearCompare,
        isCompared,
        documents,
        updateDocumentStatus,
        addDocument,
        applications,
        addApplication,
        updateApplicationStatus,
        a11y,
        updateA11y,
        language,
        setLanguage,
        t,
        notifications,
        markNotificationRead,
        unreadCount,
        isApplyModalOpen,
        applySchemeId,
        openApplyModal,
        closeApplyModal,
        isOnboardingOpen,
        setIsOnboardingOpen,
        theme,
        toggleTheme,
        setTheme,
      }}
    >
      {children}
    </SchemeStoreContext.Provider>
  );
};

export function useSchemeStore(): SchemeStoreContextType {
  const context = useContext(SchemeStoreContext);
  if (!context) {
    throw new Error("useSchemeStore must be used within SchemeStoreProvider");
  }
  return context;
}
