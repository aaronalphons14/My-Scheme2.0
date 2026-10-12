# myScheme 2.0 — National Government Benefits & Services Discovery Portal

> **"Discovering benefits made for you."**  
> An AI-powered redesign of India's national scheme discovery portal ([myscheme.gov.in](https://www.myscheme.gov.in)). Built on core principles: **Simple, Personalized, Explainable, Accessible, and Action-oriented**.

---

## 🌟 Key Features

1. **Smart Scheme Finder (Conversational AI)**
   - Chat in natural language (e.g. *"I am a 20-year-old student from Tamil Nadu with family income ₹2.5 lakh. What can I apply for?"*).
   - Real-time parameter extraction into editable profile chips (Age, State, Occupation, Income, Gender, Category).
   - Voice input via Web Speech API in 6 Indian languages.
   - Missing information detection and conversational follow-up questions.

2. **Personalized Recommendations & Explanations**
   - Match percentage scoring with badges:
     - 🟢 90%+ **Highly Recommended**
     - 🔵 75–89% **Good Match**
     - 🟡 <75% **Possible Match**
   - *"Matched on"* checklist chips (Age ✓, State ✓, Occupation ✓, Income ✓).
   - Plain-language explanations for unmet criteria (e.g. *"Your family income is ₹40,000 above the ₹2,50,000 limit"*).

3. **Explore Schemes Catalog**
   - 24+ verified central and state schemes covering Education, Agriculture, Employment, Housing, Healthcare, and Women & Child Welfare.
   - Multi-facet filters: Government level (Central vs State), State domicile, Beneficiary type, and Sort by Match %, Benefit amount, or Deadline.
   - Fast Grid / List view toggle.

4. **Scheme Detail Pages**
   - 5 structured tabs: **Overview**, **Benefits Breakdown**, **Eligibility Checklist**, **Required Documents**, and **Dates & FAQs**.
   - Interactive *"Why am I eligible / not eligible?"* explainer.
   - Text-to-Speech audio reader in regional languages.

5. **Compare Schemes Matrix**
   - Side-by-side comparison matrix for 2–4 schemes.
   - Highlights best value per row and provides a *"Best For You"* recommendation badge.
   - Horizontally swipeable on mobile devices.

6. **Document Readiness Checker**
   - Digital Citizen Vault with DigiLocker verification statuses.
   - Per-scheme circular progress ring (*"80% Ready - 4 of 5 documents verified"*).
   - Mock document upload and *"How to obtain"* guides.
   - Pre-application warnings if mandatory certificates are missing.

7. **Guided Apply Flow & Applications Tracker**
   - Guided 4-step wizard: Readiness check → Profile review → Department portal redirect → Record tracking reference.
   - Live status tabs: **Submitted**, **Under Review**, **Approved**, **Rejected**.
   - 4-stage tracking timeline (Submitted → Scrutiny → Verification → Sanctioned/DBT).

8. **Multilingual & WCAG AAA Accessibility**
   - Native language switcher: **English**, **हिन्दी (Hindi)**, **தமிழ் (Tamil)**, **తెలుగు (Telugu)**, **ಕನ್ನಡ (Kannada)**, and **മലയാളം (Malayalam)**.
   - Accessibility Options Panel: Text sizing (Small, Normal, Large, Extra Large), WCAG AAA High Contrast mode, Voice assistance (TTS), Voice search, and Reduced Motion.

---

## 🛠️ Tech Stack

- **Framework**: React 19, TypeScript, Vite 8, TanStack Router
- **Styling**: Tailwind CSS v4, Lucide Icons
- **State & Storage**: React Context + localStorage persistence
- **Speech APIs**: Web Speech API (`SpeechRecognition` & `SpeechSynthesis`)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or pnpm

### Installation

```bash
git clone https://github.com/aaronalphons14/My-Scheme2.0.git
cd My-Scheme2.0
npm install --legacy-peer-deps
npm run dev
```

Open `http://localhost:8080/` in your browser.

---

## 🔒 Citizen Privacy Charter

All personal criteria, vault document states, and application logs are stored **exclusively within your local browser storage (`localStorage`)**. No personal data is transmitted, collected, or shared with third-party networks.
