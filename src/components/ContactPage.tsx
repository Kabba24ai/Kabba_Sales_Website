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
  onViewPrivacyPolicy?: () => void;
  onViewTermsOfService?: () => void;
  onViewRefundPolicy?: () => void;
}

export default function ContactPage({ onBack, onStartTrial, onViewPricing, onViewOurStory, onViewProduct, onViewConsultation, onViewPrivacyPolicy, onViewTermsOfService, onViewRefundPolicy }: ContactPageProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
      <Footer onViewOurStory={onViewOurStory} onViewContact={scrollToTop} onViewProduct={onViewProduct} onViewPricing={onViewPricing} onViewConsultation={onViewConsultation} onViewPrivacyPolicy={onViewPrivacyPolicy} onViewTermsOfService={onViewTermsOfService} onViewRefundPolicy={onViewRefundPolicy} />
    </div>
  );
}
