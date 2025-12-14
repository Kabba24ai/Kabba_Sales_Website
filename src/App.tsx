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
import OnboardingSignup, { SignupFormData } from './components/OnboardingSignup';
import AnalyzingAvailability from './components/AnalyzingAvailability';
import TrialActivated from './components/TrialActivated';

type PageType = 'home' | 'pricing' | 'onboarding-signup' | 'onboarding-analyzing' | 'onboarding-activated';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [signupData, setSignupData] = useState<SignupFormData | null>(null);
  const [consultationTime, setConsultationTime] = useState<string>('');

  const navigateToSignup = () => {
    setCurrentPage('onboarding-signup');
    window.scrollTo(0, 0);
  };

  const navigateToPricing = () => {
    setCurrentPage('pricing');
    window.scrollTo(0, 0);
  };

  const navigateToHome = () => {
    setCurrentPage('home');
    window.scrollTo(0, 0);
  };

  const handleSignupComplete = (formData: SignupFormData) => {
    setSignupData(formData);
    setCurrentPage('onboarding-analyzing');
    window.scrollTo(0, 0);
  };

  const handleAnalyzingComplete = (time: string) => {
    setConsultationTime(time);
    setCurrentPage('onboarding-activated');
    window.scrollTo(0, 0);
  };

  if (currentPage === 'onboarding-signup') {
    return <OnboardingSignup onComplete={handleSignupComplete} onBack={navigateToHome} />;
  }

  if (currentPage === 'onboarding-analyzing' && signupData) {
    return <AnalyzingAvailability formData={signupData} onComplete={handleAnalyzingComplete} />;
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
    return <PricingPage onBack={navigateToHome} onStartTrial={navigateToSignup} />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar onStartTrial={navigateToSignup} onViewPricing={navigateToPricing} />
      <Hero onStartTrial={navigateToSignup} />
      <AntiDemo />
      <RealShop />
      <ValueProposition />
      <Features />
      <Pricing onStartTrial={navigateToSignup} onViewDetailedPricing={navigateToPricing} />
      <Consultation />
      <SocialProof />
      <FinalCTA onStartTrial={navigateToSignup} />
      <Footer />
    </div>
  );
}

export default App;
