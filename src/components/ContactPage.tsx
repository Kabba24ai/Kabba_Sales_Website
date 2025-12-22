import Contact from './Contact';
import Footer from './Footer';
import Navbar from './Navbar';

interface ContactPageProps {
  onBack: () => void;
  onStartTrial: () => void;
  onViewPricing: () => void;
  onViewOurStory: () => void;
}

export default function ContactPage({ onBack, onStartTrial, onViewPricing, onViewOurStory }: ContactPageProps) {
  return (
    <div className="min-h-screen bg-white">
      <Navbar
        onStartTrial={onStartTrial}
        onViewPricing={onViewPricing}
        onViewOurStory={onViewOurStory}
      />
      <Contact />
      <Footer />
    </div>
  );
}
