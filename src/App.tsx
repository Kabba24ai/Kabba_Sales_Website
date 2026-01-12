import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
  useSearchParams,
  useParams,
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

import OnboardingSignup, {
  SignupFormData,
} from "./components/OnboardingSignup";
import AnalyzingAvailability from "./components/AnalyzingAvailability";
import ProcessingPayment from "./components/ProcessingPayment";
import PaymentError from "./components/PaymentError";
import TrialActivated from "./components/TrialActivated";
import SetupCanceled from "./components/SetupCanceled";

import AdminSignupsList from "./components/AdminSignupsList";
import AdminSignupDetails from "./components/AdminSignupDetails";

import LiveDemoModal from "./components/LiveDemoModal";

/* ===========================
   Session Globals (same as new code)
=========================== */
let globalSignupData: SignupFormData | null = null;
let globalConsultationTime = "";

/* ===========================
   Metadata Hook
=========================== */
function usePageMetadata(title: string, description: string) {
  useEffect(() => {
    document.title = title;

    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", description);
  }, [title, description]);
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

const AcceptableUsePolicyPageWrapper = simpleWrapper(
  AcceptableUsePolicyPage,
  "Acceptable Use Policy | KABBA",
  "Guidelines for acceptable use."
);

/* ---------- Onboarding ---------- */

function OnboardingSignupWrapper() {
  const navigate = useNavigate();

  return (
    <OnboardingSignup
      initialData={globalSignupData || undefined}
      onBack={() => navigate("/")}
      onComplete={(data) => {
        globalSignupData = data;
        navigate("/analyzing-availability");
      }}
    />
  );
}

function AnalyzingAvailabilityWrapper() {
  const navigate = useNavigate();

  if (!globalSignupData) {
    navigate("/start-trial");
    return null;
  }

  return (
    <AnalyzingAvailability
      formData={globalSignupData}
      initialConsultationTime={globalConsultationTime || undefined}
      onCancel={() => navigate("/setup-canceled")}
      onComplete={(time) => {
        globalConsultationTime = time;
        globalSignupData!.consultationTime = time;
        navigate("/charge-payment");
      }}
    />
  );
}

function ProcessingPaymentWrapper() {
  const navigate = useNavigate();

  if (!globalSignupData) {
    navigate("/start-trial");
    return null;
  }

  return (
    <ProcessingPayment
      formData={globalSignupData}
      onSuccess={() => navigate("/trial-activated")}
      onError={() => navigate("/payment-error")}
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
      onRestartSetup={() => navigate("/analyzing-availability")}
      onBackToPricing={() => navigate("/pricing")}
    />
  );
}

function TrialActivatedWrapper() {
  const navigate = useNavigate();

  if (!globalSignupData || !globalConsultationTime) {
    navigate("/start-trial");
    return null;
  }

  return (
    <TrialActivated
      formData={globalSignupData}
      consultationTime={globalConsultationTime}
      onGoToDashboard={() => window.scrollTo(0, 0)}
      onViewDetails={() => window.scrollTo(0, 0)}
    />
  );
}

/* ---------- Admin ---------- */

function AdminSignupsWrapper() {
  usePageMetadata("Admin - Signups", "Admin signups list");
  const navigate = useNavigate();

  return (
    <AdminSignupsList
      onViewDetails={(id) => navigate(`/admin/signups/${id}`)}
    />
  );
}

function AdminSignupDetailsWrapper() {
  usePageMetadata("Admin - Signup Details", "Admin signup details");

  const { signupId } = useParams();
  if (!signupId) return null;

  return (
    <AdminSignupDetails
      signupId={signupId}
      onBack={() => window.history.back()}
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
        <Route path="/contact" element={<ContactPageWrapper />} />

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
        <Route
          path="/analyzing-availability"
          element={<AnalyzingAvailabilityWrapper />}
        />
        <Route path="/charge-payment" element={<ProcessingPaymentWrapper />} />
        <Route path="/payment-error" element={<PaymentErrorWrapper />} />
        <Route path="/setup-canceled" element={<SetupCanceledWrapper />} />
        <Route path="/trial-activated" element={<TrialActivatedWrapper />} />

        <Route path="/admin/signups" element={<AdminSignupsWrapper />} />
        <Route
          path="/admin/signups/:signupId"
          element={<AdminSignupDetailsWrapper />}
        />
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
