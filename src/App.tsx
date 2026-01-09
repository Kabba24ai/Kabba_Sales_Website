import { useState, useEffect } from 'react';
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
import PricingPageV2 from './components/PricingPageV2';
import OurStory from './components/OurStory';
import ContactPage from './components/ContactPage';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import TermsOfServicePage from './components/TermsOfServicePage';
import RefundCancellationPage from './components/RefundCancellationPage';
import AcceptableUsePolicyPage from './components/AcceptableUsePolicyPage';
import OnboardingSignup, { SignupFormData } from './components/OnboardingSignup';
import AnalyzingAvailability from './components/AnalyzingAvailability';
import ProcessingPayment from './components/ProcessingPayment';
import PaymentError from './components/PaymentError';
import TrialActivated from './components/TrialActivated';
import SetupCanceled from './components/SetupCanceled';
import AdminSignupsList from './components/AdminSignupsList';
import AdminSignupDetails from './components/AdminSignupDetails';
import LiveDemoModal from './components/LiveDemoModal';

type PageType = 'home' | 'product' | 'pricing' | 'our-story' | 'contact' | 'privacy-policy' | 'terms-of-service' | 'refund-cancellation' | 'acceptable-use-policy' | 'onboarding-signup' | 'onboarding-analyzing' | 'processing-payment' | 'payment-error' | 'onboarding-activated' | 'setup-canceled' | 'admin-signups' | 'admin-signup-details';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [signupData, setSignupData] = useState<SignupFormData | null>(null);
  const [consultationTime, setConsultationTime] = useState<string | null>(null);
  const [scrollToComparison, setScrollToComparison] = useState(false);
  const [selectedSignupId, setSelectedSignupId] = useState<string | null>(null);
  const [isLiveDemoModalOpen, setIsLiveDemoModalOpen] = useState(false);

  useEffect(() => {
    const pageMetadata: Record<PageType, { title: string; description: string }> = {
      'home': {
        title: 'KABBA | Rental Software Built by Real Rental Shop Operators',
        description: 'KABBA is modern rental software built and used by real rental shop owners. Pay only when you rent, protect your cash flow, and grow without $6,000 upfront fees.'
      },
      'product': {
        title: 'Rental Software Features Built for Real Rental Shops | KABBA',
        description: 'See how KABBA simplifies scheduling, inventory, dispatch, payments, and customer management — built around how rental shops actually operate.'
      },
      'pricing': {
        title: 'Rental Software Pricing That Respects Cash Flow | KABBA',
        description: 'Flexible rental software pricing built for seasonal businesses. Start for $4.95, pay $9.95 monthly, and only pay transaction fees when you rent.'
      },
      'our-story': {
        title: 'Our Story | Built Inside a Real Rental Shop | KABBA',
        description: 'KABBA was built inside a real rental business after enterprise software failed independent operators. Learn why we built it and who it\'s for.'
      },
      'contact': {
        title: 'Contact KABBA | Talk to Real Rental Software Operators',
        description: 'Have questions about KABBA? Contact our team to speak directly with people who own and operate real rental shops.'
      },
      'privacy-policy': {
        title: 'Privacy Policy | KABBA Rental Software',
        description: 'Review how KABBA collects, uses, and protects your information. Built to meet industry and payment processor standards.'
      },
      'terms-of-service': {
        title: 'Terms of Service | KABBA Rental Software',
        description: 'Read the terms and conditions for using KABBA rental software, including subscriptions, transactions, and account responsibilities.'
      },
      'refund-cancellation': {
        title: 'Refund & Cancellation Policy | KABBA',
        description: 'Understand KABBA\'s refund and cancellation policy, including subscription terms and transaction fee responsibilities.'
      },
      'acceptable-use-policy': {
        title: 'Acceptable Use Policy | KABBA',
        description: 'Guidelines for acceptable use of the KABBA rental software platform to ensure reliability, security, and fair use.'
      },
      'onboarding-signup': {
        title: 'Start Your Trial',
        description: 'Start your KABBA trial'
      },
      'onboarding-analyzing': {
        title: 'Analyzing Availability',
        description: 'Analyzing your availability'
      },
      'processing-payment': {
        title: 'Processing Payment',
        description: 'Processing your payment'
      },
      'payment-error': {
        title: 'Payment Error',
        description: 'Payment error'
      },
      'onboarding-activated': {
        title: 'Trial Activated',
        description: 'Your trial has been activated'
      },
      'setup-canceled': {
        title: 'Setup Canceled',
        description: 'Setup has been canceled'
      },
      'admin-signups': {
        title: 'Admin - Signups',
        description: 'Admin signups list'
      },
      'admin-signup-details': {
        title: 'Admin - Signup Details',
        description: 'Admin signup details'
      }
    };

    const metadata = pageMetadata[currentPage];
    document.title = metadata.title;

    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', metadata.description);
  }, [currentPage]);

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

  const navigateToPrivacyPolicy = () => {
    setScrollToComparison(false);
    setCurrentPage('privacy-policy');
    window.scrollTo(0, 0);
  };

  const navigateToTermsOfService = () => {
    setScrollToComparison(false);
    setCurrentPage('terms-of-service');
    window.scrollTo(0, 0);
  };

  const navigateToRefundCancellation = () => {
    setScrollToComparison(false);
    setCurrentPage('refund-cancellation');
    window.scrollTo(0, 0);
  };

  const navigateToAcceptableUsePolicy = () => {
    setScrollToComparison(false);
    setCurrentPage('acceptable-use-policy');
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

  const navigateToAdminSignups = () => {
    setCurrentPage('admin-signups');
    window.scrollTo(0, 0);
  };

  const handleViewSignupDetails = (signupId: string) => {
    setSelectedSignupId(signupId);
    setCurrentPage('admin-signup-details');
    window.scrollTo(0, 0);
  };

  const handleBackToAdminList = () => {
    setSelectedSignupId(null);
    setCurrentPage('admin-signups');
    window.scrollTo(0, 0);
  };

  const handleViewLiveDemo = () => {
    setIsLiveDemoModalOpen(true);
  };

  const handleCloseLiveDemo = () => {
    setIsLiveDemoModalOpen(false);
  };

  const handleContinueToLiveDemo = () => {
    setIsLiveDemoModalOpen(false);
    window.open('https://capstonerentals.kabba.io/', '_blank');
  };

  if (currentPage === 'onboarding-signup') {
    return <OnboardingSignup onComplete={handleSignupComplete} onBack={navigateToHome} initialData={signupData || undefined} />;
  }

  if (currentPage === 'onboarding-analyzing' && signupData) {
    return <AnalyzingAvailability formData={signupData} onComplete={handleAnalyzingComplete} onCancel={handleSetupCancel} initialConsultationTime={consultationTime || undefined} />;
  }

  if (currentPage === 'processing-payment' && signupData && consultationTime) {
    return <ProcessingPayment formData={signupData} consultationTime={consultationTime} onSuccess={handlePaymentSuccess} onError={handlePaymentError} />;
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
    return <PricingPageV2 onBack={navigateToHome} onStartTrial={navigateToSignup} onViewOurStory={navigateToOurStory} onViewContact={navigateToContact} onViewProduct={navigateToHomeProduct} onViewConsultation={navigateToHomeConsultation} onViewLiveDemo={handleViewLiveDemo} scrollToComparison={scrollToComparison} />;
  }

  if (currentPage === 'our-story') {
    return <OurStory onStartTrial={navigateToSignup} onViewPricing={navigateToPricing} onBack={navigateToHome} onViewContact={navigateToContact} onViewProduct={navigateToHomeProduct} onViewConsultation={navigateToHomeConsultation} onViewPrivacyPolicy={navigateToPrivacyPolicy} onViewTermsOfService={navigateToTermsOfService} onViewRefundPolicy={navigateToRefundCancellation} onViewAcceptableUsePolicy={navigateToAcceptableUsePolicy} />;
  }

  if (currentPage === 'contact') {
    return <ContactPage onBack={navigateToHome} onStartTrial={navigateToSignup} onViewPricing={navigateToPricing} onViewOurStory={navigateToOurStory} onViewProduct={navigateToHomeProduct} onViewConsultation={navigateToHomeConsultation} onViewPrivacyPolicy={navigateToPrivacyPolicy} onViewTermsOfService={navigateToTermsOfService} onViewRefundPolicy={navigateToRefundCancellation} onViewAcceptableUsePolicy={navigateToAcceptableUsePolicy} />;
  }

  if (currentPage === 'privacy-policy') {
    return <PrivacyPolicyPage onBack={navigateToHome} onStartTrial={navigateToSignup} onViewPricing={navigateToPricing} onViewOurStory={navigateToOurStory} onViewContact={navigateToContact} onViewProduct={navigateToHomeProduct} onViewConsultation={navigateToHomeConsultation} onViewTermsOfService={navigateToTermsOfService} onViewRefundPolicy={navigateToRefundCancellation} onViewAcceptableUsePolicy={navigateToAcceptableUsePolicy} />;
  }

  if (currentPage === 'terms-of-service') {
    return <TermsOfServicePage onBack={navigateToHome} onStartTrial={navigateToSignup} onViewPricing={navigateToPricing} onViewOurStory={navigateToOurStory} onViewContact={navigateToContact} onViewProduct={navigateToHomeProduct} onViewConsultation={navigateToHomeConsultation} onViewPrivacyPolicy={navigateToPrivacyPolicy} onViewRefundPolicy={navigateToRefundCancellation} onViewAcceptableUsePolicy={navigateToAcceptableUsePolicy} />;
  }

  if (currentPage === 'refund-cancellation') {
    return <RefundCancellationPage onBack={navigateToHome} onStartTrial={navigateToSignup} onViewPricing={navigateToPricing} onViewOurStory={navigateToOurStory} onViewContact={navigateToContact} onViewProduct={navigateToHomeProduct} onViewConsultation={navigateToHomeConsultation} onViewPrivacyPolicy={navigateToPrivacyPolicy} onViewTermsOfService={navigateToTermsOfService} onViewAcceptableUsePolicy={navigateToAcceptableUsePolicy} />;
  }

  if (currentPage === 'acceptable-use-policy') {
    return <AcceptableUsePolicyPage onBack={navigateToHome} onStartTrial={navigateToSignup} onViewPricing={navigateToPricing} onViewOurStory={navigateToOurStory} onViewContact={navigateToContact} onViewProduct={navigateToHomeProduct} onViewConsultation={navigateToHomeConsultation} onViewPrivacyPolicy={navigateToPrivacyPolicy} onViewTermsOfService={navigateToTermsOfService} onViewRefundPolicy={navigateToRefundCancellation} />;
  }

  if (currentPage === 'admin-signups') {
    return <AdminSignupsList onViewDetails={handleViewSignupDetails} />;
  }

  if (currentPage === 'admin-signup-details' && selectedSignupId) {
    return <AdminSignupDetails signupId={selectedSignupId} onBack={handleBackToAdminList} />;
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
      <Footer onViewOurStory={navigateToOurStory} onViewContact={navigateToContact} onViewProduct={navigateToHomeProduct} onViewPricing={navigateToPricing} onViewConsultation={navigateToHomeConsultation} onViewPrivacyPolicy={navigateToPrivacyPolicy} onViewTermsOfService={navigateToTermsOfService} onViewRefundPolicy={navigateToRefundCancellation} onViewAcceptableUsePolicy={navigateToAcceptableUsePolicy} />
      <LiveDemoModal isOpen={isLiveDemoModalOpen} onClose={handleCloseLiveDemo} onContinue={handleContinueToLiveDemo} />
    </div>
  );
}

export default App;
