import { ArrowLeft } from 'lucide-react';
import Contact from './Contact';
import Footer from './Footer';

interface ContactPageProps {
  onBack: () => void;
}

export default function ContactPage({ onBack }: ContactPageProps) {
  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition"
            >
              <ArrowLeft size={20} />
              <span className="font-medium">Back to Home</span>
            </button>
            <img
              src="/kabba_logo_-_text.png"
              alt="KABBA"
              className="h-8"
            />
          </div>
        </div>
      </nav>

      <Contact />
      <Footer />
    </div>
  );
}
