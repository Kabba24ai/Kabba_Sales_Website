import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { useEffect, useState } from "react";

/* ===========================
   Components
=========================== */
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import AntiDemo from "./components/AntiDemo";
import RealShop from "./components/RealShop";
import ValueProposition from "./components/ValueProposition";
import Features from "./components/Features";
import Pricing from "./components/Pricing";
import Consultation from "./components/Consultation";
import SocialProof from "./components/SocialProof";
import FinalCTA from "./components/FinalCTA";
import Footer from "./components/Footer";

import PricingPageV2 from "./components/PricingPageV2";
import OurStory from "./components/OurStory";
import ContactPage from "./components/ContactPage";
import PrivacyPolicyPage from "./components/PrivacyPolicyPage";
import TermsOfServicePage from "./components/TermsOfServicePage";
import RefundCancellationPage from "./components/RefundCancellationPage";
import AcceptableUsePolicyPage from "./components/AcceptableUsePolicyPage";

import OnboardingSignup from "./components/OnboardingSignup";
import BookConsultation from "./components/BookConsultation";
import ImplementationServicesPage from "./components/ImplementationServicesPage";
import SupportPage from "./components/SupportPage";
import SupportCasePage from "./components/SupportCasePage";
import PaymentError from "./components/PaymentError";
import TrialActivated from "./components/TrialActivated";
import SetupCanceled from "./components/SetupCanceled";

import LiveDemoModal from "./components/LiveDemoModal";

import { readStoredToken } from "./lib/commercial-api";

/* ===========================
   Metadata Hook
=========================== */
function setMeta(selector: string, attr: "name" | "property", key: string, content: string) {
  let meta = document.querySelector(selector);
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute(attr, key);
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", content);
}

function usePageMetadata(title: string, description: string, path?: string) {
  useEffect(() => {
    document.title = title;
    setMeta('meta[name="description"]', "name", "description", description);
    if (path) {
      const url = `https://kabba.ai${path}`;
      setMeta('meta[property="og:title"]', "property", "og:title", title);
      setMeta('meta[property="og:description"]', "property", "og:description", description);
      setMeta('meta[property="og:url"]', "property", "og:url", url);
      setMeta('meta[property="og:type"]', "property", "og:type", "website");
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.setAttribute("rel", "canonical");
        document.head.appendChild(canonical);
      }
      canonical.setAttribute("href", url);
      return () => {
        // Other pages set only title and description; never leave this page's URL behind.
        document.querySelector('link[rel="canonical"]')?.remove();
        document.querySelector('meta[property="og:url"]')?.remove();
      };
    }
    return undefined;
  }, [title, description, path]);
}

/* ===========================
   Pages / Wrappers
=========================== */

function HomePage() {
  usePageMetadata(
    "KABBA | Rental Software Built by Real Rental Shop Operators",
    "KABBA is modern rental software built and used by real rental shop owners."
  );

  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const scrollTarget = searchParams.get("scroll");
    if (scrollTarget) {
      setTimeout(() => {
        document
          .getElementById(scrollTarget)
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [location, searchParams]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar
        onStartTrial={() => navigate("/start-trial")}
        onViewPricing={() => navigate("/pricing")}
        onViewOurStory={() => navigate("/our-story")}
        onViewContact={() => navigate("/contact")}
        onBackToHome={() => navigate("/")}
      />
      <Hero onStartTrial={() => navigate("/start-trial")} />
      <AntiDemo />
      <RealShop />
      <ValueProposition />
      <Features />
      <Pricing
        onStartTrial={() => navigate("/start-trial")}
        onViewDetailedPricing={() => navigate("/pricing?scroll=comparison")}
      />
      <Consultation onStartTrial={() => navigate("/start-trial")} />
      <SocialProof />
      <FinalCTA onStartTrial={() => navigate("/start-trial")} />
      <Footer
        onViewOurStory={() => navigate("/our-story")}
        onViewContact={() => navigate("/contact")}
        onViewProduct={() => navigate("/?scroll=product")}
        onViewPricing={() => navigate("/pricing")}
        onViewConsultation={() => navigate("/?scroll=consultation")}
        onViewPrivacyPolicy={() => navigate("/privacy-policy")}
        onViewTermsOfService={() => navigate("/terms-of-service")}
        onViewRefundPolicy={() => navigate("/refund-cancellation")}
        onViewAcceptableUsePolicy={() => navigate("/acceptable-use-policy")}
      />
    </div>
  );
}

function PricingPageWrapper({
  onOpenLiveDemo,
}: {
  onOpenLiveDemo: () => void;
}) {
  usePageMetadata(
    "Rental Software Pricing That Respects Cash Flow | KABBA",
    "Flexible rental software pricing built for seasonal businesses."
  );

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  return (
    <PricingPageV2
      scrollToComparison={searchParams.get("scroll") === "comparison"}
      onBack={() => navigate("/")}
      onStartTrial={() => navigate("/start-trial")}
      onViewOurStory={() => navigate("/our-story")}
      onViewContact={() => navigate("/contact")}
      onViewProduct={() => navigate("/?scroll=product")}
      onViewConsultation={() => navigate("/?scroll=consultation")}
      onViewLiveDemo={onOpenLiveDemo}
    />
  );
}

/* ---------- Legal / Content Wrappers ---------- */

function simpleWrapper(Component: any, title: string, description: string) {
  return function Wrapper() {
    usePageMetadata(title, description);
    const navigate = useNavigate();
    return (
      <Component
        onBack={() => navigate("/")}
        onStartTrial={() => navigate("/start-trial")}
        onViewPricing={() => navigate("/pricing")}
        onViewOurStory={() => navigate("/our-story")}
        onViewContact={() => navigate("/contact")}
        onViewProduct={() => navigate("/?scroll=product")}
        onViewConsultation={() => navigate("/?scroll=consultation")}
        onViewPrivacyPolicy={() => navigate("/privacy-policy")}
        onViewTermsOfService={() => navigate("/terms-of-service")}
        onViewRefundPolicy={() => navigate("/refund-cancellation")}
        onViewAcceptableUsePolicy={() => navigate("/acceptable-use-policy")}
      />
    );
  };
}

const OurStoryWrapper = simpleWrapper(
  OurStory,
  "Our Story | Built Inside a Real Rental Shop | KABBA",
  "Why KABBA was built inside a real rental business."
);

const ContactPageWrapper = simpleWrapper(
  ContactPage,
  "Contact KABBA | Talk to Real Rental Software Operators",
  "Contact the KABBA team."
);

const PrivacyPolicyPageWrapper = simpleWrapper(
  PrivacyPolicyPage,
  "Privacy Policy | KABBA Rental Software",
  "How KABBA protects your information."
);

const TermsOfServicePageWrapper = simpleWrapper(
  TermsOfServicePage,
  "Terms of Service | KABBA Rental Software",
  "Terms and conditions for using KABBA."
);

const RefundCancellationPageWrapper = simpleWrapper(
  RefundCancellationPage,
  "Refund & Cancellation Policy | KABBA",
  "KABBA refund and cancellation policy."
);

function ImplementationServicesWrapper() {
  usePageMetadata(
    "Implementation Services | Kabba Launch, Professional & Growth | KABBA",
    "We build your online rental business: website, catalog, payments, SMS and email automation, team setup and Go-Live Certification. Kabba Launch $997, Kabba Professional $1,997, Kabba Growth $495/month. Request a consultation.",
    "/implementation-services"
  );
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (!location.hash) window.scrollTo(0, 0);
  }, [location.pathname, location.hash]);

  return (
    <ImplementationServicesPage
      onBack={() => navigate("/")}
      onStartTrial={() => navigate("/start-trial")}
      onViewPricing={() => navigate("/pricing")}
      onViewOurStory={() => navigate("/our-story")}
      onViewContact={() => navigate("/contact")}
      onViewProduct={() => navigate("/?scroll=product")}
      onViewConsultation={() => navigate("/?scroll=consultation")}
      onViewPrivacyPolicy={() => navigate("/privacy-policy")}
      onViewTermsOfService={() => navigate("/terms-of-service")}
      onViewRefundPolicy={() => navigate("/refund-cancellation")}
      onViewAcceptableUsePolicy={() => navigate("/acceptable-use-policy")}
    />
  );
}

/* ---------- Customer support (Kabba #276) ----------
   /support opens a case in Kabba Commercial Administration (no login needed);
   /support/case?t=… is the private, expiring link Kabba emails to the address
   on a case. There is no lookup of cases by number or email.
*/

function SupportPageWrapper() {
  usePageMetadata(
    "Get Support | KABBA",
    "Open a Kabba support case, even if you can't sign in. You get a case number and a private link to follow it.",
    "/support"
  );
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <SupportPage
      onBack={() => navigate("/")}
      onStartTrial={() => navigate("/start-trial")}
      onViewPricing={() => navigate("/pricing")}
      onViewOurStory={() => navigate("/our-story")}
      onViewContact={() => navigate("/contact")}
      onViewProduct={() => navigate("/?scroll=product")}
      onViewConsultation={() => navigate("/?scroll=consultation")}
      onViewPrivacyPolicy={() => navigate("/privacy-policy")}
      onViewTermsOfService={() => navigate("/terms-of-service")}
      onViewRefundPolicy={() => navigate("/refund-cancellation")}
      onViewAcceptableUsePolicy={() => navigate("/acceptable-use-policy")}
    />
  );
}

function SupportCaseWrapper() {
  usePageMetadata("Your Support Case | KABBA", "Follow and reply to your Kabba support case.");
  const navigate = useNavigate();
  useEffect(() => {
    // A private page: keep it out of search results.
    setMeta('meta[name="robots"]', "name", "robots", "noindex, nofollow");
    return () => {
      document.querySelector('meta[name="robots"]')?.remove();
    };
  }, []);

  return <SupportCasePage onNewRequest={() => navigate("/support")} onHome={() => navigate("/")} />;
}

const AcceptableUsePolicyPageWrapper = simpleWrapper(
  AcceptableUsePolicyPage,
  "Acceptable Use Policy | KABBA",
  "Guidelines for acceptable use."
);

/* ---------- Onboarding ----------
   Critical path: /start-trial (registration + payment) → /trial-activated.
   /analyzing-availability (optional onboarding consultation, booked with the
   checkout session in this browser) is linked from /trial-activated;
   /book-consultation?t=… is the private link in the customer's emails.
   Times and bookings live in Kabba Central (Kabba #267), never only here.
*/

function OnboardingSignupWrapper() {
  usePageMetadata(
    "Start Your Trial | KABBA",
    "Register your rental business and start your KABBA trial."
  );
  const navigate = useNavigate();

  return (
    <OnboardingSignup
      onBack={() => navigate("/")}
      onSuccess={() => navigate("/trial-activated")}
    />
  );
}

function TrialActivatedWrapper() {
  usePageMetadata("Trial Activated | KABBA", "Your KABBA trial is active.");
  const navigate = useNavigate();

  return (
    <TrialActivated
      onBookCall={() => navigate("/analyzing-availability")}
      onStartOver={() => navigate("/start-trial")}
    />
  );
}

function AnalyzingAvailabilityWrapper() {
  usePageMetadata(
    "Book Your Onboarding Consultation | KABBA",
    "Request an optional weekday setup and strategy session with the KABBA team."
  );
  const navigate = useNavigate();
  const token = readStoredToken();

  return (
    <BookConsultation
      access={token ? { via: "checkout", token } : null}
      onBack={() => navigate("/trial-activated")}
      backLabel="Back to your trial"
    />
  );
}

/** The private, expiring link from the customer's email: /book-consultation?t=… */
function BookConsultationLinkWrapper() {
  usePageMetadata(
    "Book Your Onboarding Consultation | KABBA",
    "Request an optional weekday setup and strategy session with the KABBA team."
  );
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const linkToken = searchParams.get("t");
  const valid = !!linkToken && /^[A-Za-z0-9_-]{16,128}$/.test(linkToken);

  return (
    <BookConsultation
      access={valid ? { via: "link", token: linkToken as string } : null}
      onBack={() => navigate("/")}
      backLabel="KABBA home"
    />
  );
}

function PaymentErrorWrapper() {
  const navigate = useNavigate();
  return (
    <PaymentError
      onRetry={() => navigate("/start-trial")}
      onCancel={() => navigate("/setup-canceled")}
    />
  );
}

function SetupCanceledWrapper() {
  const navigate = useNavigate();
  return (
    <SetupCanceled
      onRestartSetup={() => navigate("/start-trial")}
      onBackToPricing={() => navigate("/pricing")}
    />
  );
}

/* ===========================
   App
=========================== */

function App() {
  const [isLiveDemoModalOpen, setIsLiveDemoModalOpen] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route
          path="/pricing"
          element={
            <PricingPageWrapper
              onOpenLiveDemo={() => setIsLiveDemoModalOpen(true)}
            />
          }
        />

        <Route path="/our-story" element={<OurStoryWrapper />} />
        <Route
          path="/implementation-services"
          element={<ImplementationServicesWrapper />}
        />
        <Route path="/contact" element={<ContactPageWrapper />} />
        <Route path="/support" element={<SupportPageWrapper />} />
        <Route path="/support/case" element={<SupportCaseWrapper />} />

        <Route path="/privacy-policy" element={<PrivacyPolicyPageWrapper />} />
        <Route
          path="/terms-of-service"
          element={<TermsOfServicePageWrapper />}
        />
        <Route
          path="/refund-cancellation"
          element={<RefundCancellationPageWrapper />}
        />
        <Route
          path="/acceptable-use-policy"
          element={<AcceptableUsePolicyPageWrapper />}
        />

        <Route path="/start-trial" element={<OnboardingSignupWrapper />} />
        <Route path="/trial-activated" element={<TrialActivatedWrapper />} />
        <Route
          path="/analyzing-availability"
          element={<AnalyzingAvailabilityWrapper />}
        />
        <Route
          path="/book-consultation"
          element={<BookConsultationLinkWrapper />}
        />
        <Route path="/payment-error" element={<PaymentErrorWrapper />} />
        <Route path="/setup-canceled" element={<SetupCanceledWrapper />} />
      </Routes>

      <LiveDemoModal
        isOpen={isLiveDemoModalOpen}
        onClose={() => setIsLiveDemoModalOpen(false)}
        onContinue={() => {
          setIsLiveDemoModalOpen(false);
          window.open("https://capstonerentals.kabba.io/", "_blank");
        }}
      />
    </Router>
  );
}

export default App;
