import Contact from './Contact';
import Footer from './Footer';
import Navbar from './Navbar';

interface ContactPageProps {
  onBack: () => void;
  onStartTrial: () => void;
  onViewPricing: () => void;
  onViewOurStory: () => void;
  onViewProduct: () => void;
  onViewConsultation: () => void;
}

export default function ContactPage({ onBack, onStartTrial, onViewPricing, onViewOurStory, onViewProduct, onViewConsultation }: ContactPageProps) {
  return (
    <div className="min-h-screen bg-white">
      <Navbar
        onStartTrial={onStartTrial}
        onViewPricing={onViewPricing}
        onViewOurStory={onViewOurStory}
        onViewContact={onBack}
        onBackToHome={onBack}
        onViewProduct={onViewProduct}
        onViewConsultation={onViewConsultation}
      />
      <Contact />
      <Footer />
    </div>
  );
}
