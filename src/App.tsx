import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AntiDemo from './components/AntiDemo';
import RealShop from './components/RealShop';
import ValueProposition from './components/ValueProposition';
import Features from './components/Features';
import Pricing from './components/Pricing';
import Consultation from './components/Consultation';
import SocialProof from './components/SocialProof';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import PricingPage from './components/PricingPage';
import OurStory from './components/OurStory';
import ContactPage from './components/ContactPage';
import OnboardingSignup, { SignupFormData } from './components/OnboardingSignup';
import AnalyzingAvailability from './components/AnalyzingAvailability';
import ProcessingPayment from './components/ProcessingPayment';
import PaymentError from './components/PaymentError';
import TrialActivated from './components/TrialActivated';
import SetupCanceled from './components/SetupCanceled';

type PageType = 'home' | 'pricing' | 'our-story' | 'contact' | 'onboarding-signup' | 'onboarding-analyzing' | 'processing-payment' | 'payment-error' | 'onboarding-activated' | 'setup-canceled';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [signupData, setSignupData] = useState<SignupFormData | null>(null);
  const [consultationTime, setConsultationTime] = useState<string>('');
  const [scrollToComparison, setScrollToComparison] = useState(false);

  const navigateToSignup = () => {
    setCurrentPage('onboarding-signup');
    window.scrollTo(0, 0);
  };

  const navigateToPricing = () => {
    setScrollToComparison(false);
    setCurrentPage('pricing');
    window.scrollTo(0, 0);
  };

  const navigateToPricingComparison = () => {
    setScrollToComparison(true);
    setCurrentPage('pricing');
  };

  const navigateToOurStory = () => {
    setScrollToComparison(false);
    setCurrentPage('our-story');
    window.scrollTo(0, 0);
  };

  const navigateToContact = () => {
    setScrollToComparison(false);
    setCurrentPage('contact');
    window.scrollTo(0, 0);
  };

  const navigateToHome = () => {
    setScrollToComparison(false);
    setCurrentPage('home');
    window.scrollTo(0, 0);
  };

  const navigateToHomeProduct = () => {
    setScrollToComparison(false);
    setCurrentPage('home');
    setTimeout(() => {
      const element = document.getElementById('product');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const navigateToHomeConsultation = () => {
    setScrollToComparison(false);
    setCurrentPage('home');
    setTimeout(() => {
      const element = document.getElementById('consultation');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleSignupComplete = (formData: SignupFormData) => {
    setSignupData(formData);
    setCurrentPage('onboarding-analyzing');
    window.scrollTo(0, 0);
  };

  const handleAnalyzingComplete = (time: string) => {
    setConsultationTime(time);
    setCurrentPage('processing-payment');
    window.scrollTo(0, 0);
  };

  const handlePaymentSuccess = () => {
    setCurrentPage('onboarding-activated');
    window.scrollTo(0, 0);
  };

  const handlePaymentError = () => {
    setCurrentPage('payment-error');
    window.scrollTo(0, 0);
  };

  const handleRetryPayment = () => {
    setCurrentPage('onboarding-signup');
    window.scrollTo(0, 0);
  };

  const handleCancelFromError = () => {
    setCurrentPage('setup-canceled');
    window.scrollTo(0, 0);
  };

  const handleSetupCancel = () => {
    setCurrentPage('setup-canceled');
    window.scrollTo(0, 0);
  };

  const handleRestartSetup = () => {
    setCurrentPage('onboarding-analyzing');
    window.scrollTo(0, 0);
  };

  if (currentPage === 'onboarding-signup') {
    return <OnboardingSignup onComplete={handleSignupComplete} onBack={navigateToHome} initialData={signupData || undefined} />;
  }

  if (currentPage === 'onboarding-analyzing' && signupData) {
    return <AnalyzingAvailability formData={signupData} onComplete={handleAnalyzingComplete} onCancel={handleSetupCancel} initialConsultationTime={consultationTime || undefined} />;
  }

  if (currentPage === 'processing-payment' && signupData) {
    return <ProcessingPayment formData={signupData} onSuccess={handlePaymentSuccess} onError={handlePaymentError} />;
  }

  if (currentPage === 'payment-error') {
    return <PaymentError onRetry={handleRetryPayment} onCancel={handleCancelFromError} />;
  }

  if (currentPage === 'setup-canceled') {
    return <SetupCanceled onRestartSetup={handleRestartSetup} onBackToPricing={navigateToPricing} />;
  }

  if (currentPage === 'onboarding-activated' && signupData && consultationTime) {
    return (
      <TrialActivated
        formData={signupData}
        consultationTime={consultationTime}
        onGoToDashboard={() => {
          window.scrollTo(0, 0);
        }}
        onViewDetails={() => {
          window.scrollTo(0, 0);
        }}
      />
    );
  }

  if (currentPage === 'pricing') {
    return <PricingPage onBack={navigateToHome} onStartTrial={navigateToSignup} onViewOurStory={navigateToOurStory} onViewContact={navigateToContact} onViewProduct={navigateToHomeProduct} onViewConsultation={navigateToHomeConsultation} scrollToComparison={scrollToComparison} />;
  }

  if (currentPage === 'our-story') {
    return <OurStory onStartTrial={navigateToSignup} onViewPricing={navigateToPricing} onBack={navigateToHome} onViewContact={navigateToContact} onViewProduct={navigateToHomeProduct} onViewConsultation={navigateToHomeConsultation} />;
  }

  if (currentPage === 'contact') {
    return <ContactPage onBack={navigateToHome} onStartTrial={navigateToSignup} onViewPricing={navigateToPricing} onViewOurStory={navigateToOurStory} onViewProduct={navigateToHomeProduct} onViewConsultation={navigateToHomeConsultation} />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar onStartTrial={navigateToSignup} onViewPricing={navigateToPricing} onViewOurStory={navigateToOurStory} onViewContact={navigateToContact} onBackToHome={navigateToHome} />
      <Hero onStartTrial={navigateToSignup} />
      <AntiDemo />
      <RealShop />
      <ValueProposition />
      <Features />
      <Pricing onStartTrial={navigateToSignup} onViewDetailedPricing={navigateToPricingComparison} />
      <Consultation onStartTrial={navigateToSignup} />
      <SocialProof />
      <FinalCTA onStartTrial={navigateToSignup} />
      <Footer onViewOurStory={navigateToOurStory} onViewContact={navigateToContact} />
    </div>
  );
}

export default App;
