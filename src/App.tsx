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
import SignupTrial from './components/SignupTrial';
import PricingPage from './components/PricingPage';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'signup' | 'pricing'>('home');

  const navigateToSignup = () => {
    setCurrentPage('signup');
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

  if (currentPage === 'signup') {
    return <SignupTrial onBack={navigateToHome} />;
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
