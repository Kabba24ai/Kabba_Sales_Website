import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { useState, useEffect } from "react";
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
import PricingPage from "./components/PricingPage";
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

// Store signup data globally for the session
let globalSignupData: SignupFormData | null = null;
let globalConsultationTime: string = "";

function HomePage() {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState<PageType>(
    "onboarding-analyzing"
  );
  const [signupData, setSignupData] = useState<SignupFormData | null>({
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "(555) 123-4567",
    businessName: "Demo Rentals",
    businessType: "equipment",
  });
  const [consultationTime, setConsultationTime] = useState<string>(
    "2024-01-15T10:00:00"
  );
  const [scrollToComparison, setScrollToComparison] = useState(false);

  const navigateToSignup = () => {
    navigate("/start-trial");
    window.scrollTo(0, 0);
  };

  const navigateToPricing = () => {
    navigate("/pricing");
    window.scrollTo(0, 0);
  };

  const navigateToPricingComparison = () => {
    navigate("/pricing?scroll=comparison");
  };

  const navigateToOurStory = () => {
    navigate("/our-story");
    window.scrollTo(0, 0);
  };

  const navigateToContact = () => {
    navigate("/contact");
    window.scrollTo(0, 0);
  };

  const navigateToHome = () => {
    navigate("/");
    window.scrollTo(0, 0);
  };

  const navigateToHomeProduct = () => {
    navigate("/?scroll=product");
  };

  const navigateToHomeConsultation = () => {
    navigate("/?scroll=consultation");
  };

  const location = useLocation();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const scrollTarget = searchParams.get("scroll");
    if (scrollTarget) {
      setTimeout(() => {
        const element = document.getElementById(scrollTarget);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  }, [location, searchParams]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar
        onStartTrial={navigateToSignup}
        onViewPricing={navigateToPricing}
        onViewOurStory={navigateToOurStory}
        onViewContact={navigateToContact}
        onBackToHome={navigateToHome}
      />
      <Hero onStartTrial={navigateToSignup} />
      <AntiDemo />
      <RealShop />
      <ValueProposition />
      <Features />
      <Pricing
        onStartTrial={navigateToSignup}
        onViewDetailedPricing={navigateToPricingComparison}
      />
      <Consultation onStartTrial={navigateToSignup} />
      <SocialProof />
      <FinalCTA onStartTrial={navigateToSignup} />
      <Footer
        onViewOurStory={navigateToOurStory}
        onViewContact={navigateToContact}
        onViewProduct={navigateToHomeProduct}
        onViewPricing={navigateToPricing}
        onViewConsultation={navigateToHomeConsultation}
        onViewPrivacyPolicy={() => navigate("/privacy-policy")}
        onViewTermsOfService={() => navigate("/terms-of-service")}
        onViewRefundPolicy={() => navigate("/refund-cancellation")}
        onViewAcceptableUsePolicy={() => navigate("/acceptable-use-policy")}
      />
    </div>
  );
}

function PricingPageWrapper() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [scrollToComparison, setScrollToComparison] = useState(false);

  useEffect(() => {
    const scroll = searchParams.get("scroll");
    setScrollToComparison(scroll === "comparison");
  }, [searchParams]);

  return (
    <PricingPage
      onBack={() => navigate("/")}
      onStartTrial={() => navigate("/start-trial")}
      onViewOurStory={() => navigate("/our-story")}
      onViewContact={() => navigate("/contact")}
      onViewProduct={() => navigate("/?scroll=product")}
      onViewConsultation={() => navigate("/?scroll=consultation")}
      scrollToComparison={scrollToComparison}
    />
  );
}

function OurStoryWrapper() {
  const navigate = useNavigate();
  return (
    <OurStory
      onStartTrial={() => navigate("/start-trial")}
      onViewPricing={() => navigate("/pricing")}
      onBack={() => navigate("/")}
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

function ContactPageWrapper() {
  const navigate = useNavigate();
  return (
    <ContactPage
      onBack={() => navigate("/")}
      onStartTrial={() => navigate("/start-trial")}
      onViewPricing={() => navigate("/pricing")}
      onViewOurStory={() => navigate("/our-story")}
      onViewProduct={() => navigate("/?scroll=product")}
      onViewConsultation={() => navigate("/?scroll=consultation")}
      onViewPrivacyPolicy={() => navigate("/privacy-policy")}
      onViewTermsOfService={() => navigate("/terms-of-service")}
      onViewRefundPolicy={() => navigate("/refund-cancellation")}
      onViewAcceptableUsePolicy={() => navigate("/acceptable-use-policy")}
    />
  );
}

function PrivacyPolicyPageWrapper() {
  const navigate = useNavigate();
  return (
    <PrivacyPolicyPage
      onBack={() => navigate("/")}
      onStartTrial={() => navigate("/start-trial")}
      onViewPricing={() => navigate("/pricing")}
      onViewOurStory={() => navigate("/our-story")}
      onViewContact={() => navigate("/contact")}
      onViewProduct={() => navigate("/?scroll=product")}
      onViewConsultation={() => navigate("/?scroll=consultation")}
      onViewTermsOfService={() => navigate("/terms-of-service")}
      onViewRefundPolicy={() => navigate("/refund-cancellation")}
      onViewAcceptableUsePolicy={() => navigate("/acceptable-use-policy")}
    />
  );
}

function TermsOfServicePageWrapper() {
  const navigate = useNavigate();
  return (
    <TermsOfServicePage
      onBack={() => navigate("/")}
      onStartTrial={() => navigate("/start-trial")}
      onViewPricing={() => navigate("/pricing")}
      onViewOurStory={() => navigate("/our-story")}
      onViewContact={() => navigate("/contact")}
      onViewProduct={() => navigate("/?scroll=product")}
      onViewConsultation={() => navigate("/?scroll=consultation")}
      onViewPrivacyPolicy={() => navigate("/privacy-policy")}
      onViewRefundPolicy={() => navigate("/refund-cancellation")}
      onViewAcceptableUsePolicy={() => navigate("/acceptable-use-policy")}
    />
  );
}

function RefundCancellationPageWrapper() {
  const navigate = useNavigate();
  return (
    <RefundCancellationPage
      onBack={() => navigate("/")}
      onStartTrial={() => navigate("/start-trial")}
      onViewPricing={() => navigate("/pricing")}
      onViewOurStory={() => navigate("/our-story")}
      onViewContact={() => navigate("/contact")}
      onViewProduct={() => navigate("/?scroll=product")}
      onViewConsultation={() => navigate("/?scroll=consultation")}
      onViewPrivacyPolicy={() => navigate("/privacy-policy")}
      onViewTermsOfService={() => navigate("/terms-of-service")}
      onViewAcceptableUsePolicy={() => navigate("/acceptable-use-policy")}
    />
  );
}

function AcceptableUsePolicyPageWrapper() {
  const navigate = useNavigate();
  return (
    <AcceptableUsePolicyPage
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
    />
  );
}

function OnboardingSignupWrapper() {
  const navigate = useNavigate();

  const handleComplete = (formData: SignupFormData) => {
    globalSignupData = formData;
    navigate("/analyzing-availability");
    window.scrollTo(0, 0);
  };

  return (
    <OnboardingSignup
      onComplete={handleComplete}
      onBack={() => navigate("/")}
      initialData={globalSignupData || undefined}
    />
  );
}

function AnalyzingAvailabilityWrapper() {
  const navigate = useNavigate();

  const handleComplete = (time: string) => {
    globalConsultationTime = time;
    // Also store it in the signup data for easy access
    if (globalSignupData) {
      globalSignupData.consultationTime = time;
    }
    navigate("/charge-payment");
    window.scrollTo(0, 0);
  };

  if (!globalSignupData) {
    navigate("/start-trial");
    return null;
  }

  return (
    <AnalyzingAvailability
      formData={globalSignupData}
      onComplete={handleComplete}
      onCancel={() => navigate("/setup-canceled")}
      initialConsultationTime={globalConsultationTime || undefined}
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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pricing" element={<PricingPageWrapper />} />
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
      </Routes>
    </Router>
  );
}

export default App;
