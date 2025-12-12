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

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <AntiDemo />
      <RealShop />
      <ValueProposition />
      <Features />
      <Pricing />
      <Consultation />
      <SocialProof />
      <FinalCTA />
      <Footer />
    </div>
  );
}

export default App;
