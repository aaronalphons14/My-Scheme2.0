export type SchemeCategory =
  | "Education"
  | "Agriculture"
  | "Employment"
  | "Housing"
  | "Healthcare"
  | "Women & Child Welfare";

export type UserProfile = {
  age?: number;
  state?: string;
  occupation?: string;
  income?: number;
  gender?: string;
  category?: string;
  disability?: boolean;
  education?: string;
};

export type Scheme = {
  id: string;
  name: string;
  department: string;
  category: SchemeCategory;
  summary: string;
  benefit: string;
  benefitValue: number;
  scope: "Central" | "State";
  state?: string;
  minAge?: number;
  maxAge?: number;
  incomeMax?: number;
  occupations: string[];
  gender?: string;
  requiredDocuments: string[];
  deadline: string;
  applicationMode: "Online" | "Offline" | "Online & offline";
  officialUrl: string;
  faqs: { question: string; answer: string }[];
  updated: string;
};

const commonFaqs = [
  {
    question: "Where do I confirm the current rules?",
    answer:
      "Eligibility and application windows can change. Confirm the latest notice with the responsible department before applying.",
  },
  {
    question: "Does a match guarantee approval?",
    answer:
      "No. A match is only an initial guide. The department reviews your documents and makes the final decision.",
  },
];

const entry = (
  id: string,
  name: string,
  department: string,
  category: SchemeCategory,
  summary: string,
  benefit: string,
  benefitValue: number,
  scope: Scheme["scope"],
  occupations: string[],
  requiredDocuments: string[],
  officialUrl: string,
  options: Partial<Pick<Scheme, "state" | "minAge" | "maxAge" | "incomeMax" | "gender" | "applicationMode" | "deadline">> = {},
): Scheme => ({
  id,
  name,
  department,
  category,
  summary,
  benefit,
  benefitValue,
  scope,
  occupations,
  requiredDocuments,
  deadline: options.deadline ?? "Check with the official department",
  applicationMode: options.applicationMode ?? "Online",
  officialUrl,
  faqs: commonFaqs,
  updated: "Demo catalogue · confirm details with the official department",
  ...options,
});

export const schemes: Scheme[] = [
  entry("pm-scholarship", "PM Scholarship Scheme", "Ministry of Home Affairs", "Education", "Scholarships for eligible wards and dependants of personnel covered by the scheme.", "Up to ₹36,000 per year", 36000, "Central", ["student"], ["Aadhaar card", "Bank account details", "Marksheets", "Institution ID"], "https://scholarships.gov.in/", { minAge: 16, maxAge: 25, incomeMax: 600000 }),
  entry("national-means-merit", "National Means-cum-Merit Scholarship", "Department of School Education & Literacy", "Education", "Financial support intended to help eligible students continue secondary education.", "₹12,000 per year", 12000, "Central", ["student"], ["Income certificate", "Marksheets", "Bank account details", "School ID"], "https://scholarships.gov.in/", { minAge: 13, maxAge: 18, incomeMax: 350000 }),
  entry("central-sector-scholarship", "Central Sector Scheme of Scholarships", "Department of Higher Education", "Education", "Support for meritorious students pursuing higher education, subject to current scheme rules.", "₹12,000–₹20,000 per year", 20000, "Central", ["student"], ["Marksheets", "Income certificate", "Bank account details", "Institution ID"], "https://scholarships.gov.in/", { minAge: 17, maxAge: 25, incomeMax: 450000 }),
  entry("post-matric-scholarship", "Post-Matric Scholarship", "Ministry of Social Justice & Empowerment", "Education", "Scholarship support for students who meet the applicable category and income requirements.", "Tuition support + maintenance allowance", 50000, "Central", ["student"], ["Community certificate", "Income certificate", "Marksheets", "Bank account details"], "https://scholarships.gov.in/", { minAge: 15, maxAge: 35, incomeMax: 250000 }),
  entry("tn-first-graduate", "First Graduate Tuition Concession", "Government of Tamil Nadu", "Education", "Tuition assistance for eligible first-generation graduates studying in Tamil Nadu.", "Tuition fee concession", 25000, "State", ["student"], ["First graduate certificate", "Income certificate", "Institution ID"], "https://www.tn.gov.in/", { state: "Tamil Nadu", minAge: 17, maxAge: 30 }),
  entry("education-loan-subsidy", "Education Loan Interest Support", "Ministry of Education", "Education", "Interest support for eligible education loans under applicable central guidelines.", "Interest subsidy on eligible loan", 40000, "Central", ["student"], ["Loan sanction letter", "Income certificate", "Admission letter"], "https://www.education.gov.in/", { minAge: 17, maxAge: 35, incomeMax: 450000 }),
  entry("pm-kisan", "PM-KISAN", "Department of Agriculture & Farmers Welfare", "Agriculture", "Income support for eligible landholding farmer families, subject to exclusions and verification.", "₹6,000 per year", 6000, "Central", ["farmer"], ["Aadhaar card", "Land records", "Bank account details"], "https://pmkisan.gov.in/", { minAge: 18 }),
  entry("pm-fasal-bima", "Pradhan Mantri Fasal Bima Yojana", "Department of Agriculture & Farmers Welfare", "Agriculture", "Crop insurance for notified crops and areas during the applicable season.", "Crop insurance cover", 50000, "Central", ["farmer"], ["Land records", "Bank account details", "Sowing declaration"], "https://pmfby.gov.in/", { minAge: 18, deadline: "Seasonal; see notified crop dates" }),
  entry("kisan-credit-card", "Kisan Credit Card", "Department of Financial Services", "Agriculture", "Timely credit access for eligible farmers and allied agricultural activities.", "Credit limit based on assessment", 100000, "Central", ["farmer"], ["Aadhaar card", "Land records", "Bank account details"], "https://www.myscheme.gov.in/", { minAge: 18 }),
  entry("pmfme", "PM Formalisation of Micro Food Processing Enterprises", "Ministry of Food Processing Industries", "Employment", "Support to eligible micro food-processing enterprises under programme guidelines.", "Credit-linked subsidy (terms apply)", 40000, "Central", ["self-employed", "business owner"], ["Aadhaar card", "Bank account details", "Business details"], "https://pmfme.mofpi.gov.in/", { minAge: 18 }),
  entry("pmay-urban", "PMAY–Urban 2.0", "Ministry of Housing and Urban Affairs", "Housing", "Housing assistance for eligible urban households under the active programme vertical.", "Assistance varies by vertical", 150000, "Central", ["worker", "self-employed", "unemployed"], ["Aadhaar card", "Income certificate", "Bank account details", "Land or property records"], "https://pmay-urban.gov.in/", { minAge: 18, incomeMax: 900000 }),
  entry("pmay-gramin", "Pradhan Mantri Awaas Yojana–Gramin", "Ministry of Rural Development", "Housing", "Rural housing support for eligible households identified through programme criteria.", "Assistance varies by region", 120000, "Central", ["farmer", "worker", "unemployed"], ["Aadhaar card", "Bank account details", "Residence details"], "https://pmayg.nic.in/", { minAge: 18 }),
  entry("ayushman-bharat", "Ayushman Bharat PM-JAY", "National Health Authority", "Healthcare", "Hospitalisation cover for households found eligible under programme databases.", "Up to ₹5 lakh per family per year", 500000, "Central", ["worker", "farmer", "unemployed", "student", "self-employed"], ["Aadhaar card", "Ration card or family ID"], "https://pmjay.gov.in/", { minAge: 18 }),
  entry("janani-suraksha", "Janani Suraksha Yojana", "Ministry of Health & Family Welfare", "Women & Child Welfare", "Cash assistance linked to institutional delivery for eligible women.", "Assistance varies by state", 1400, "Central", ["pregnant woman"], ["Aadhaar card", "Mother and Child Protection card", "Bank account details"], "https://nhm.gov.in/", { minAge: 18, gender: "woman", applicationMode: "Online & offline" }),
  entry("sukanya-samriddhi", "Sukanya Samriddhi Account", "Department of Economic Affairs", "Women & Child Welfare", "Small-savings account for a girl child, opened by a parent or guardian.", "Interest-bearing savings account", 0, "Central", ["parent or guardian"], ["Birth certificate", "Parent or guardian identity proof"], "https://www.indiapost.gov.in/", { maxAge: 10, gender: "girl child", applicationMode: "Offline" }),
  entry("pm-matru-vandana", "Pradhan Mantri Matru Vandana Yojana", "Ministry of Women & Child Development", "Women & Child Welfare", "Maternity benefit support for eligible women under current programme rules.", "Up to ₹5,000 (conditions apply)", 5000, "Central", ["pregnant woman"], ["Aadhaar card", "Bank account details", "Pregnancy registration"], "https://pmmvy.wcd.gov.in/", { minAge: 19, gender: "woman" }),
  entry("stand-up-india", "Stand-Up India", "Department of Financial Services", "Employment", "Bank loans to eligible women and SC/ST entrepreneurs for greenfield enterprises.", "Bank loan from ₹10 lakh to ₹1 crore", 1000000, "Central", ["entrepreneur", "business owner"], ["Aadhaar card", "Business plan", "Community certificate (if applicable)"], "https://www.standupmitra.in/", { minAge: 18, gender: "woman" }),
  entry("pm-svanidhi", "PM SVANidhi", "Ministry of Housing and Urban Affairs", "Employment", "Working-capital support for eligible street vendors under current lending rules.", "Working-capital loan; terms apply", 10000, "Central", ["street vendor", "self-employed"], ["Vendor certificate or ID", "Aadhaar card", "Bank account details"], "https://pmsvanidhi.mohua.gov.in/", { minAge: 18 }),
  entry("pm-vishwakarma", "PM Vishwakarma", "Ministry of Micro, Small & Medium Enterprises", "Employment", "Training, toolkit and credit support for eligible traditional artisans and craftspeople.", "Toolkit incentive + credit support", 15000, "Central", ["artisan", "self-employed"], ["Aadhaar card", "Bank account details", "Occupation details"], "https://pmvishwakarma.gov.in/", { minAge: 18 }),
  entry("atal-pension", "Atal Pension Yojana", "Department of Financial Services", "Employment", "Pension savings option for eligible subscribers aged 18–40.", "Pension based on contribution option", 60000, "Central", ["worker", "self-employed"], ["Aadhaar card", "Bank account details"], "https://www.npscra.nsdl.co.in/atal-pension-yojana.php", { minAge: 18, maxAge: 40 }),
  entry("tamilnadu-marriage", "Tamil Nadu Marriage Assistance", "Government of Tamil Nadu", "Women & Child Welfare", "State support for qualifying applicants; scheme-specific terms and openings apply.", "Assistance varies by scheme", 25000, "State", ["woman"], ["Age proof", "Income certificate", "Community certificate"], "https://www.tn.gov.in/", { state: "Tamil Nadu", minAge: 18, gender: "woman", applicationMode: "Online & offline" }),
  entry("national-apprenticeship", "National Apprenticeship Promotion Scheme", "Ministry of Skill Development & Entrepreneurship", "Employment", "Apprenticeship opportunities with prescribed training and stipend rules.", "Stipend support varies by apprenticeship", 12000, "Central", ["student", "job seeker", "worker"], ["Aadhaar card", "Education certificates", "Bank account details"], "https://www.apprenticeshipindia.gov.in/", { minAge: 14, maxAge: 35 }),
  entry("pm-uy", "PM Ujjwala Yojana", "Ministry of Petroleum & Natural Gas", "Women & Child Welfare", "LPG connection support for eligible adult women in qualifying households.", "Deposit-free LPG connection (conditions apply)", 3000, "Central", ["woman"], ["Aadhaar card", "Ration card or family ID", "Bank account details"], "https://www.pmuy.gov.in/", { minAge: 18, gender: "woman" }),
  entry("pm-surya-ghar", "PM Surya Ghar: Muft Bijli Yojana", "Ministry of New and Renewable Energy", "Housing", "Rooftop solar subsidy for eligible residential consumers under current programme rules.", "Subsidy depends on system capacity", 78000, "Central", ["homeowner"], ["Electricity consumer number", "Bank account details", "Residence details"], "https://pmsuryaghar.gov.in/", { minAge: 18 }),
];

export const categories: SchemeCategory[] = [
  "Education",
  "Agriculture",
  "Employment",
  "Housing",
  "Healthcare",
  "Women & Child Welfare",
];

export const documentTypes = [
  "Aadhaar card",
  "Income certificate",
  "Bank account details",
  "Marksheets",
  "Institution ID",
  "Community certificate",
  "Land records",
  "Residence proof",
];

export type ApplicationRecord = {
  id: string;
  schemeId: string;
  appliedAt: string;
  status: "Submitted" | "Under Review" | "Approved" | "Rejected";
};