import { Menu, X } from 'lucide-react';
import { useState } from 'react';

interface NavbarProps {
  onStartTrial: () => void;
  onViewPricing: () => void;
  onViewOurStory?: () => void;
  onViewContact?: () => void;
  onBackToHome?: () => void;
  onViewProduct?: () => void;
  onViewConsultation?: () => void;
}

export default function Navbar({ onStartTrial, onViewPricing, onViewOurStory, onViewContact, onBackToHome, onViewProduct, onViewConsultation }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-black/95 backdrop-blur-sm shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <button onClick={onBackToHome} className="flex items-center">
            <img
              src="/kabba_logo_-_text_only.png"
              alt="KABBA.ai"
              className="h-8 w-auto"
            />
          </button>

          <div className="hidden md:flex items-center space-x-8">
            {onViewProduct ? (
              <button onClick={onViewProduct} className="text-slate-200 hover:text-[#02ffff] transition">Product</button>
            ) : (
              <a href="#product" className="text-slate-200 hover:text-[#02ffff] transition">Product</a>
            )}
            <button onClick={onViewPricing} className="text-slate-200 hover:text-[#02ffff] transition">Pricing</button>
            {onViewOurStory && (
              <button onClick={onViewOurStory} className="text-slate-200 hover:text-[#02ffff] transition">Our Story</button>
            )}
            {onViewConsultation ? (
              <button onClick={onViewConsultation} className="text-slate-200 hover:text-[#02ffff] transition">Consultation</button>
            ) : (
              <a href="#consultation" className="text-slate-200 hover:text-[#02ffff] transition">Consultation</a>
            )}
            {onViewContact && (
              <button onClick={onViewContact} className="text-slate-200 hover:text-[#02ffff] transition">Contact</button>
            )}
            <button onClick={onStartTrial} className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-semibold transition">
              Start $4.95 Trial
            </button>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-200">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4">
            {onViewProduct ? (
              <button onClick={() => { onViewProduct(); setIsOpen(false); }} className="block py-2 text-slate-200 hover:text-[#02ffff] text-left w-full">Product</button>
            ) : (
              <a href="#product" className="block py-2 text-slate-200 hover:text-[#02ffff]">Product</a>
            )}
            <button onClick={() => { onViewPricing(); setIsOpen(false); }} className="block py-2 text-slate-200 hover:text-[#02ffff] text-left w-full">Pricing</button>
            {onViewOurStory && (
              <button onClick={() => { onViewOurStory(); setIsOpen(false); }} className="block py-2 text-slate-200 hover:text-[#02ffff] text-left w-full">Our Story</button>
            )}
            {onViewConsultation ? (
              <button onClick={() => { onViewConsultation(); setIsOpen(false); }} className="block py-2 text-slate-200 hover:text-[#02ffff] text-left w-full">Consultation</button>
            ) : (
              <a href="#consultation" className="block py-2 text-slate-200 hover:text-[#02ffff]">Consultation</a>
            )}
            {onViewContact && (
              <button onClick={() => { onViewContact(); setIsOpen(false); }} className="block py-2 text-slate-200 hover:text-[#02ffff] text-left w-full">Contact</button>
            )}
            <button onClick={onStartTrial} className="w-full mt-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-semibold">
              Start $4.95 Trial
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
