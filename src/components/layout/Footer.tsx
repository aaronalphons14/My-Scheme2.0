import React from "react";
import { Link } from "@tanstack/react-router";
import { Shield, PhoneCall, Globe, CheckCircle, ExternalLink, Heart, Sparkles } from "lucide-react";
import { useSchemeStore } from "@/lib/store";
import { getSiteText } from "@/lib/site-translations";

const footerContent = {
  en: {
    brandDesc:
      "myScheme 2.0 transforms scheme discovery from endless searching into instant, explainable, personalized benefits discovery for 1.4 billion Indian citizens.",
    digitalIndia: "🇮🇳 Digital India Initiative",
    wcag: "✓ WCAG 2.1 AA Certified",
    categoriesTitle: "Scheme Categories",
    catEducation: "Education & Scholarships",
    catAgriculture: "Agriculture & Farming",
    catEmployment: "Employment & Skill Training",
    catHousing: "Housing & Rooftop Solar",
    catHealthcare: "Healthcare & Medical Cover",
    catWomen: "Women & Child Welfare",
    citizenToolsTitle: "Citizen Tools",
    toolFinder: "AI Scheme Discovery",
    toolCompare: "Compare Schemes Matrix",
    toolDocs: "Document Readiness Checker",
    toolApplications: "Application Tracker",
    toolProfile: "Eligibility Profile Manager",
    toolHelp: "Help Centre & Video Guides",
    officialPortalsTitle: "Official Portals",
    portalNsp: "National Scholarship Portal",
    portalKisan: "PM-KISAN Portal",
    portalPmjay: "Ayushman Bharat PM-JAY",
    portalDigilocker: "DigiLocker National Vault",
    portalServices: "National Services Portal",
    copyright:
      "© 2026 National Informatics Centre (NIC) & Ministry of Electronics and Information Technology. Content owned by respective Ministries.",
    a11yStatement: "Accessibility Statement",
    privacyCharter: "Citizen Privacy Charter",
    termsOfUse: "Terms of Use",
    edition: "v2.4.0 (AI Edition)",
  },
  hi: {
    brandDesc:
      "myScheme 2.0 अंतहीन खोज के बजाय 140 करोड़ भारतीय नागरिकों के लिए त्वरित, पारदर्शी और व्यक्तिगत लाभ खोज प्रदान करता है।",
    digitalIndia: "🇮🇳 डिजिटल इंडिया पहल",
    wcag: "✓ WCAG 2.1 AA प्रमाणित",
    categoriesTitle: "योजना श्रेणियां",
    catEducation: "शिक्षा और छात्रवृत्तियां",
    catAgriculture: "कृषि और किसानी",
    catEmployment: "रोजगार और कौशल प्रशिक्षण",
    catHousing: "आवास और सोलर रूफटॉप",
    catHealthcare: "स्वास्थ्य और चिकित्सा कवर",
    catWomen: "महिला एवं बाल कल्याण",
    citizenToolsTitle: "नागरिक उपकरण",
    toolFinder: "एआई योजना खोज",
    toolCompare: "योजना तुलना मैट्रिक्स",
    toolDocs: "दस्तावेज़ तत्परता जांचकर्ता",
    toolApplications: "आवेदन ट्रैकर",
    toolProfile: "पात्रता प्रोफाइल प्रबंधक",
    toolHelp: "सहायता केंद्र और वीडियो गाइड",
    officialPortalsTitle: "आधिकारिक पोर्टल",
    portalNsp: "राष्ट्रीय छात्रवृत्ति पोर्टल (NSP)",
    portalKisan: "पीएम-किसान पोर्टल",
    portalPmjay: "आयुष्मान भारत पीएम-जेएवाई",
    portalDigilocker: "डिजिलॉकर राष्ट्रीय वॉल्ट",
    portalServices: "राष्ट्रीय सेवा पोर्टल",
    copyright:
      "© 2026 राष्ट्रीय सूचना विज्ञान केंद्र (NIC) एवं इलेक्ट्रॉनिक्स और सूचना प्रौद्योगिकी मंत्रालय। सामग्री संबंधित मंत्रालयों के स्वामित्व में है।",
    a11yStatement: "अभिगम्यता वक्तव्य",
    privacyCharter: "नागरिक गोपनीयता चार्टर",
    termsOfUse: "उपयोग की शर्तें",
    edition: "v2.4.0 (एआई संस्करण)",
  },
  ta: {
    brandDesc:
      "myScheme 2.0 முடிவில்லா தேடலுக்குப் பதிலாக 140 கோடி இந்திய குடிமக்களுக்கு உடனடி, தனிப்பயனாக்கப்பட்ட திட்ட பலன்களை வழங்குகிறது.",
    digitalIndia: "🇮🇳 டிஜிட்டல் இந்தியா முன்முயற்சி",
    wcag: "✓ WCAG 2.1 AA சான்றளிக்கப்பட்டது",
    categoriesTitle: "திட்டப் பிரிவுகள்",
    catEducation: "கல்வி மற்றும் உதவித்தொகை",
    catAgriculture: "விவசாயம் மற்றும் பண்ணை",
    catEmployment: "வேலைவாய்ப்பு மற்றும் திறன் பயிற்சி",
    catHousing: "வீட்டுவசதி & சூரிய ஒளி மின்சாரம்",
    catHealthcare: "சுகாதாரம் மற்றும் மருத்துவக் காப்பீடு",
    catWomen: "மகளிர் மற்றும் குழந்தைகள் நலம்",
    citizenToolsTitle: "குடிமக்கள் கருவிகள்",
    toolFinder: "AI திட்ட கண்டறிதல்",
    toolCompare: "திட்ட ஒப்பீட்டு அட்டவணை",
    toolDocs: "ஆவண தயார்நிலை சரிபார்ப்பான்",
    toolApplications: "விண்ணப்ப கண்காணிப்பு",
    toolProfile: "தகுதி சுயவிவர மேலாளர்",
    toolHelp: "உதவி மையம் & வீடியோ வழிகாட்டிகள்",
    officialPortalsTitle: "அதிகாரப்பூர்வ இணையதளங்கள்",
    portalNsp: "தேசிய உதவித்தொகை இணையதளம் (NSP)",
    portalKisan: "பிஎம்-கிசான் போர்ட்டல்",
    portalPmjay: "ஆயுஷ்மான் பாரத் பிஎம்-ஜேஏஒய்",
    portalDigilocker: "டிஜிலாக்கர் தேசிய பெட்டகம்",
    portalServices: "தேசிய சேவைகள் இணையதளம்",
    copyright:
      "© 2026 தேசிய தகவலியல் மையம் (NIC) மற்றும் மின்னணுவியல் & தகவல் தொழில்நுட்ப அமைச்சகம். உள்ளடக்கம் அந்தந்த அமைச்சகங்களுக்கு சொந்தமானது.",
    a11yStatement: "அணுகல்தன்மை அறிக்கை",
    privacyCharter: "குடிமக்கள் தனியுரிமை சாசனம்",
    termsOfUse: "பயன்பாட்டு விதிமுறைகள்",
    edition: "v2.4.0 (AI பதிப்பு)",
  },
  te: {
    brandDesc:
      "మైస్కీమ్ 2.0 అంతులేని శోధన నుండి 140 కోట్ల మంది భారతీయ పౌరులకు తక్షణ, వ్యక్తిగతీకరించిన పథకాల ఆవిష్కరణగా మారుస్తుంది.",
    digitalIndia: "🇮🇳 డిజిటల్ ఇండియా చొరవ",
    wcag: "✓ WCAG 2.1 AA ధృవీకరించబడింది",
    categoriesTitle: "పథకం వర్గాలు",
    catEducation: "విద్య & స్కాలర్‌షిప్‌లు",
    catAgriculture: "వ్యవసాయం & రైతు సంక్షేమం",
    catEmployment: "ఉపాధి & నైపుణ్య శిక్షణ",
    catHousing: "గృహ నిర్మాణం & రూఫ్‌టాప్ సోలార్",
    catHealthcare: "ఆరోగ్య సంరక్షణ & వైద్య బీమా",
    catWomen: "మహిళా & శిశు సంక్షేమం",
    citizenToolsTitle: "పౌర సాధనాలు",
    toolFinder: "AI పథకం అన్వేషణ",
    toolCompare: "పథకాల పోలిక మాత్రిక",
    toolDocs: "పత్రాల సంసిద్ధత తనిఖీ",
    toolApplications: "దరఖాస్తు ట్రాకర్",
    toolProfile: "అర్హత ప్రొఫైల్ మేనేజర్",
    toolHelp: "సహాయ కేంద్రం & వీడియో గైడ్‌లు",
    officialPortalsTitle: "అధికారిక పోర్టల్‌లు",
    portalNsp: "జాతీయ స్కాలర్‌షిప్ పోర్టల్ (NSP)",
    portalKisan: "పీఎం-కిసాన్ పోర్టల్",
    portalPmjay: "ఆయుష్మాన్ భారత్ పీఎం-జేఏవై",
    portalDigilocker: "డిజిలాకర్ జాతీయ వాల్ట్",
    portalServices: "జాతీయ సేవల పోర్టల్",
    copyright:
      "© 2026 నేషనల్ ఇన్ఫర్మేటిక్స్ సెంటర్ (NIC) & ఎలక్ట్రానిక్స్ మరియు సమాచార సాంకేతిక మంత్రిత్వ శాఖ. కంటెంట్ సంబంధిత మంత్రిత్వ శాఖల స్వంతం.",
    a11yStatement: "యాక్సెసిబిలిటీ ప్రకటన",
    privacyCharter: "పౌర గోప్యతా చార్టర్",
    termsOfUse: "వినియోగ నిబంధనలు",
    edition: "v2.4.0 (AI ఎడిషన్)",
  },
  kn: {
    brandDesc:
      "myScheme 2.0 ಅಂತ್ಯವಿಲ್ಲದ ಹುಡುಕಾಟದಿಂದ 140 ಕೋಟಿ ಭಾರತೀಯ ನಾಗರಿಕರಿಗೆ ತಕ್ಷಣದ, ವೈಯಕ್ತಿಕಗೊಳಿಸಿದ ಯೋಜನೆಗಳ ಆವಿಷ್ಕಾರವನ್ನು ನೀಡುತ್ತದೆ.",
    digitalIndia: "🇮🇳 ಡಿಜಿಟಲ್ ಇಂಡಿಯಾ ಉಪಕ್ರಮ",
    wcag: "✓ WCAG 2.1 AA ಪ್ರಮಾಣೀಕರಿಸಲಾಗಿದೆ",
    categoriesTitle: "ಯೋಜನೆ ವರ್ಗಗಳು",
    catEducation: "ಶಿಕ್ಷಣ & ವಿದ್ಯಾರ್ಥಿವೇತನಗಳು",
    catAgriculture: "ಕೃಷಿ ಮತ್ತು ಕೃಷಿಕರು",
    catEmployment: "ಉದ್ಯೋಗ ಮತ್ತು ಕೌಶಲ್ಯ ತರಬೇತಿ",
    catHousing: "ವಸತಿ & ರೂಫ್‌ಟಾಪ್ ಸೋಲಾರ್",
    catHealthcare: "ಆರೋಗ್ಯ ರಕ್ಷಣೆ & ವೈದ್ಯಕೀಯ ವಿಮೆ",
    catWomen: "ಮಹಿಳಾ ಮತ್ತು ಮಕ್ಕಳ ಕಲ್ಯಾಣ",
    citizenToolsTitle: "ನಾಗರಿಕ ಪರಿಕರಗಳು",
    toolFinder: "AI ಯೋಜನೆ ಅನ್ವೇಷಣೆ",
    toolCompare: "ಯೋಜನೆ ಹೋಲಿಕೆ ಮ್ಯಾಟ್ರಿಕ್ಸ್",
    toolDocs: "ದಾಖಲೆ ಸಿದ್ಧತೆ ಪರೀಕ್ಷಕ",
    toolApplications: "ಅರ್ಜಿ ಟ್ರ್ಯಾಕರ್",
    toolProfile: "ಅರ್ಹತೆ ಪ್ರೊಫೈಲ್ ಮ್ಯಾನೇಜರ್",
    toolHelp: "ಸಹಾಯ ಕೇಂದ್ರ & ವೀಡಿಯೊ ಮಾರ್ಗದರ್ಶಿಗಳು",
    officialPortalsTitle: "ಅಧಿಕೃತ ಪೋರ್ಟಲ್‌ಗಳು",
    portalNsp: "ರಾಷ್ಟ್ರೀಯ ವಿದ್ಯಾರ್ಥಿವೇತನ ಪೋರ್ಟಲ್ (NSP)",
    portalKisan: "ಪಿಎಂ-ಕಿಸಾನ್ ಪೋರ್ಟಲ್",
    portalPmjay: "ಆಯುಷ್ಮಾನ್ ಭಾರತ್ ಪಿಎಂ-ಜೆಎವೈ",
    portalDigilocker: "ಡಿಜಿಲಾಕರ್ ರಾಷ್ಟ್ರೀಯ ವಾಲ್ಟ್",
    portalServices: "ರಾಷ್ಟ್ರೀಯ ಸೇವೆಗಳ ಪೋರ್ಟಲ್",
    copyright:
      "© 2026 ರಾಷ್ಟ್ರೀಯ ಮಾಹಿತಿ ಕೇಂದ್ರ (NIC) ಮತ್ತು ಎಲೆಕ್ಟ್ರಾನಿಕ್ಸ್ ಮತ್ತು ಮಾಹಿತಿ ತಂತ್ರಜ್ಞಾನ ಸಚಿವಾಲಯ. ವಿಷಯವು ಆಯಾ ಸಚಿವಾಲಯಗಳ ಒಡೆತನದಲ್ಲಿದೆ.",
    a11yStatement: "ಪ್ರವೇಶಿಸುವಿಕೆ ಹೇಳಿಕೆ",
    privacyCharter: "ನಾಗರಿಕ ಗೌಪ್ಯತೆ ಚಾರ್ಟರ್",
    termsOfUse: "ಬಳಕೆಯ ನಿಯಮಗಳು",
    edition: "v2.4.0 (AI ಆವೃತ್ತಿ)",
  },
  ml: {
    brandDesc:
      "myScheme 2.0 അനന്തമായ തിരച്ചിലിൽ നിന്ന് 140 കോടി ഇന്ത്യൻ പൗരന്മാർക്ക് ഉടനടിയുള്ളതും വ്യക്തിഗതവുമായ ആനുകൂല്യ കണ്ടെത്തൽ നൽകുന്നു.",
    digitalIndia: "🇮🇳 ഡിജിറ്റൽ ഇന്ത്യ സംരംഭം",
    wcag: "✓ WCAG 2.1 AA സാക്ഷ്യപ്പെടുത്തിയത്",
    categoriesTitle: "പദ്ധതി വിഭാഗങ്ങൾ",
    catEducation: "വിദ്യാഭ്യാസവും സ്കോളർഷിപ്പുകളും",
    catAgriculture: "കൃഷിയും കർഷക ക്ഷേമവും",
    catEmployment: "തൊഴിലും നൈപുണ്യ പരിശീലനവും",
    catHousing: "ഭവനനിർമ്മാണവും സൗരോർജ്ജവും",
    catHealthcare: "ആരോഗ്യ സംരക്ഷണവും ചികിത്സാ കവറേജും",
    catWomen: "വനിതാ ശിശു ക്ഷേമം",
    citizenToolsTitle: "പൗര ഉപകരണങ്ങൾ",
    toolFinder: "AI പദ്ധതി കണ്ടെത്തൽ",
    toolCompare: "പദ്ധതി താരതമ്യ മാട്രിക്സ്",
    toolDocs: "രേഖാ സന്നദ്ധതാ പരിശോധന",
    toolApplications: "അപേക്ഷാ ട്രാക്കർ",
    toolProfile: "യോഗ്യതാ പ്രൊഫൈൽ മാനേജർ",
    toolHelp: "സഹായ കേന്ദ്രവും വീഡിയോ ഗൈഡുകളും",
    officialPortalsTitle: "ഔദ്യോഗിക പോർട്ടലുകൾ",
    portalNsp: "ദേശീയ സ്കോളർഷിപ്പ് പോർട്ടൽ (NSP)",
    portalKisan: "പിഎം-കിസാൻ പോർട്ടൽ",
    portalPmjay: "ആയുഷ്മാൻ ഭാരത് പിഎം-ജെഎവൈ",
    portalDigilocker: "ഡിജിലോക്കർ നാഷണൽ വോൾട്ട്",
    portalServices: "ദേശീയ സേവന പോർട്ടൽ",
    copyright:
      "© 2026 നാഷണൽ ഇൻഫോർമാറ്റിക്സ് സെന്റർ (NIC) & ഇലക്ട്രോണിക്സ് ആൻഡ് ഇൻഫർമേഷൻ ടെക്നോളജി മന്ത്രാലയം. വിവരങ്ങൾ ബന്ധപ്പെട്ട മന്ത്രാലയങ്ങളുടെ ഉടമസ്ഥതയിലാണ്.",
    a11yStatement: "ആക്സസിബിലിറ്റി പ്രസ്താവന",
    privacyCharter: "പൗര സ്വകാര്യതാ ചാർട്ടർ",
    termsOfUse: "ഉപയോഗ നിബന്ധനകൾ",
    edition: "v2.4.0 (AI പതിപ്പ്)",
  },
};

export const Footer: React.FC = () => {
  const { t, language } = useSchemeStore();
  const site = getSiteText(language);

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 pb-16 lg:pb-0">
      {/* Upper Information Banner */}
      <div className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start space-x-3.5">
              <div className="p-2.5 rounded-lg bg-blue-900/60 text-blue-300 border border-blue-700/50">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">
                  {site.footer.privacyTitle}
                </h2>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {site.footer.privacyDesc}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5">
              <div className="p-2.5 rounded-lg bg-amber-900/40 text-amber-300 border border-amber-700/50">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">
                  {site.footer.helplineTitle}
                </h2>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {site.footer.helplineDesc}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5">
              <div className="p-2.5 rounded-lg bg-emerald-900/40 text-emerald-300 border border-emerald-700/50">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">
                  {site.footer.verifiedTitle}
                </h2>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {site.footer.verifiedDesc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Column 1: Brand & Logo */}
          <div className="col-span-2">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-blue-800 text-white flex items-center justify-center font-black">
                <svg className="w-5 h-5 text-amber-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 3v18" />
                  <path d="M3 12h18" />
                  <circle cx="12" cy="12" r="2.5" fill="currentColor" />
                </svg>
              </div>
              <div>
                <div className="text-lg font-extrabold text-white">
                  {t.portalName}
                </div>
                <div className="text-xs text-slate-400">
                  {t.portalSubtitle}
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400 mt-4 leading-relaxed max-w-sm">
              {footerContent[language].brandDesc}
            </p>

            <div className="mt-5 flex items-center space-x-3">
              <span className="inline-flex items-center px-2 py-1 rounded-sm text-[10px] font-semibold bg-slate-800 text-amber-300 border border-slate-700">
                {footerContent[language].digitalIndia}
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded-sm text-[10px] font-semibold bg-slate-800 text-emerald-400 border border-slate-700">
                {footerContent[language].wcag}
              </span>
            </div>
          </div>

          {/* Column 2: Explore Portals */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              {footerContent[language].categoriesTitle}
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/explore" search={{ category: "Education" } as any} className="hover:text-white transition-colors">
                  {footerContent[language].catEducation}
                </Link>
              </li>
              <li>
                <Link to="/explore" search={{ category: "Agriculture" } as any} className="hover:text-white transition-colors">
                  {footerContent[language].catAgriculture}
                </Link>
              </li>
              <li>
                <Link to="/explore" search={{ category: "Employment" } as any} className="hover:text-white transition-colors">
                  {footerContent[language].catEmployment}
                </Link>
              </li>
              <li>
                <Link to="/explore" search={{ category: "Housing" } as any} className="hover:text-white transition-colors">
                  {footerContent[language].catHousing}
                </Link>
              </li>
              <li>
                <Link to="/explore" search={{ category: "Healthcare" } as any} className="hover:text-white transition-colors">
                  {footerContent[language].catHealthcare}
                </Link>
              </li>
              <li>
                <Link to="/explore" search={{ category: "Women & Child Welfare" } as any} className="hover:text-white transition-colors">
                  {footerContent[language].catWomen}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Tools */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              {footerContent[language].citizenToolsTitle}
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/finder" className="hover:text-white transition-colors flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>{footerContent[language].toolFinder}</span>
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-white transition-colors">
                  {footerContent[language].toolCompare}
                </Link>
              </li>
              <li>
                <Link to="/documents" className="hover:text-white transition-colors">
                  {footerContent[language].toolDocs}
                </Link>
              </li>
              <li>
                <Link to="/applications" className="hover:text-white transition-colors">
                  {footerContent[language].toolApplications}
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-white transition-colors">
                  {footerContent[language].toolProfile}
                </Link>
              </li>
              <li>
                <Link to="/help" className="hover:text-white transition-colors">
                  {footerContent[language].toolHelp}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Official Portals */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              {footerContent[language].officialPortalsTitle}
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://scholarships.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center space-x-1"
                >
                  <span>{footerContent[language].portalNsp}</span>
                  <ExternalLink className="w-2.5 h-2.5 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://pmkisan.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center space-x-1"
                >
                  <span>{footerContent[language].portalKisan}</span>
                  <ExternalLink className="w-2.5 h-2.5 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://pmjay.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center space-x-1"
                >
                  <span>{footerContent[language].portalPmjay}</span>
                  <ExternalLink className="w-2.5 h-2.5 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.digilocker.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center space-x-1"
                >
                  <span>{footerContent[language].portalDigilocker}</span>
                  <ExternalLink className="w-2.5 h-2.5 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://services.india.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center space-x-1"
                >
                  <span>{footerContent[language].portalServices}</span>
                  <ExternalLink className="w-2.5 h-2.5 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Accessibility Statement */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-[11px] text-slate-500 space-y-4 md:space-y-0">
          <div>
            {footerContent[language].copyright}
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/help" className="hover:text-slate-300">
              {footerContent[language].a11yStatement}
            </Link>
            <span>·</span>
            <Link to="/help" className="hover:text-slate-300">
              {footerContent[language].privacyCharter}
            </Link>
            <span>·</span>
            <Link to="/help" className="hover:text-slate-300">
              {footerContent[language].termsOfUse}
            </Link>
            <span>·</span>
            <span className="text-slate-400">{footerContent[language].edition}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
