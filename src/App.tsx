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

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'signup'>('home');

  const navigateToSignup = () => {
    setCurrentPage('signup');
    window.scrollTo(0, 0);
  };

  const navigateToHome = () => {
    setCurrentPage('home');
    window.scrollTo(0, 0);
  };

  if (currentPage === 'signup') {
    return <SignupTrial onBack={navigateToHome} />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar onStartTrial={navigateToSignup} />
      <Hero onStartTrial={navigateToSignup} />
      <AntiDemo />
      <RealShop />
      <ValueProposition />
      <Features />
      <Pricing onStartTrial={navigateToSignup} />
      <Consultation />
      <SocialProof />
      <FinalCTA onStartTrial={navigateToSignup} />
      <Footer />
    </div>
  );
}

export default App;
