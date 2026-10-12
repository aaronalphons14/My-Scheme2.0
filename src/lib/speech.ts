import type { LanguageCode } from "./types";

const LANG_VOICE_MAP: Record<LanguageCode, string> = {
  en: "en-IN",
  hi: "hi-IN",
  ta: "ta-IN",
  te: "te-IN",
  kn: "kn-IN",
  ml: "ml-IN",
};

export function speakText(text: string, lang: LanguageCode = "en", onEnd?: () => void): boolean {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    console.warn("Speech synthesis not supported in this browser.");
    return false;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  const targetLang = LANG_VOICE_MAP[lang] || "en-IN";
  utterance.lang = targetLang;
  utterance.rate = 0.95; // comfortable cadence
  utterance.pitch = 1.0;

  const voices = window.speechSynthesis.getVoices();
  const matchedVoice = voices.find((v) => v.lang.startsWith(targetLang.split("-")[0]));
  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = onEnd;
  }

  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopSpeaking() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === "undefined") return false;
  return "webkitSpeechRecognition" in window || "SpeechRecognition" in window;
}

export type SpeechRecognizerHandle = {
  stop: () => void;
};

export function startSpeechRecognition(
  lang: LanguageCode = "en",
  onResult: (text: string) => void,
  onError?: (err: unknown) => void,
  onEnd?: () => void,
): SpeechRecognizerHandle | null {
  if (!isSpeechRecognitionSupported()) {
    onError?.("Speech recognition not supported");
    return null;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRec();
    recognition.lang = LANG_VOICE_MAP[lang] || "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const transcript = event.results?.[0]?.[0]?.transcript;
      if (transcript) {
        onResult(transcript);
      }
    };

    recognition.onerror = (event: unknown) => {
      onError?.(event);
    };

    recognition.onend = () => {
      onEnd?.();
    };

    recognition.start();

    return {
      stop: () => {
        try {
          recognition.stop();
        } catch {
          // ignore
        }
      },
    };
  } catch (error) {
    onError?.(error);
    return null;
  }
}
