import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SchemeStoreProvider } from "../lib/store";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { QuickSearchModal } from "../components/modals/QuickSearchModal";
import { AccessibilityModal } from "../components/modals/AccessibilityModal";
import { GuidedApplyModal } from "../components/modals/GuidedApplyModal";
import { OnboardingTourModal } from "../components/modals/OnboardingTourModal";
import { CompareDrawer } from "../components/schemes/CompareDrawer";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md text-center p-8 bg-white rounded-2xl border border-slate-200 shadow-xl">
        <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center mx-auto mb-4 font-black text-2xl">
          404
        </div>
        <h1 className="text-xl font-bold text-slate-900">Scheme or Page Not Found</h1>
        <p className="mt-2 text-xs text-slate-500 leading-relaxed">
          The requested government scheme or portal page does not exist or has been shifted to a new category.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-xl bg-blue-950 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-blue-900 shadow-md"
          >
            Go to Home
          </Link>
          <Link
            to="/explore"
            className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-50"
          >
            Explore All Schemes
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md text-center p-8 bg-white rounded-2xl border border-slate-200 shadow-xl">
        <h1 className="text-xl font-bold text-slate-900">
          Temporary Portal Service Issue
        </h1>
        <p className="mt-2 text-xs text-slate-500">
          Something went wrong while retrieving portal data. You can retry or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-xl bg-blue-950 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-blue-900"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-50"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=5" },
      { title: "myScheme 2.0 | National Government Benefits & Services Discovery" },
      {
        name: "description",
        content:
          "Discover Indian Central and State Government schemes tailored specifically to you. AI-powered eligibility, regional languages, document locker, and application tracking.",
      },
      { name: "author", content: "National Informatics Centre (NIC) & Digital India" },
      { property: "og:title", content: "myScheme 2.0 | Government Benefits Made For You" },
      {
        property: "og:description",
        content: "Discover 24+ central and state schemes with AI eligibility matching and document readiness.",
      },
      { property: "og:type", content: "website" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Noto+Sans:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body
        suppressHydrationWarning
        className="bg-slate-50/50 text-slate-900 antialiased font-sans min-h-screen selection:bg-blue-900 selection:text-white"
      >
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function MainLayout() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isA11yOpen, setIsA11yOpen] = useState(false);

  // Keyboard shortcut Ctrl+K or Cmd+K to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenA11y={() => setIsA11yOpen(true)}
      />

      <main id="main-content" className="flex-1">
        <Outlet />
      </main>

      <Footer />

      {/* Global Modals & Drawers */}
      <QuickSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      <AccessibilityModal
        isOpen={isA11yOpen}
        onClose={() => setIsA11yOpen(false)}
      />

      <GuidedApplyModal />

      <OnboardingTourModal />

      <CompareDrawer />
    </div>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <SchemeStoreProvider>
        <MainLayout />
      </SchemeStoreProvider>
    </QueryClientProvider>
  );
}
