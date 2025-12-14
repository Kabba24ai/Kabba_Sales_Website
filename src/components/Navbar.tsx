import { Menu, X } from 'lucide-react';
import { useState } from 'react';

interface NavbarProps {
  onStartTrial: () => void;
  onViewPricing: () => void;
}

export default function Navbar({ onStartTrial, onViewPricing }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <img
              src="/kabba_logo_-_circle_-_cut.png"
              alt="KABBA.ai"
              className="h-12 w-auto"
            />
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#product" className="text-slate-600 hover:text-slate-900 transition">Product</a>
            <button onClick={onViewPricing} className="text-slate-600 hover:text-slate-900 transition">Pricing</button>
            <a href="#consultation" className="text-slate-600 hover:text-slate-900 transition">Consultation</a>
            <button onClick={onStartTrial} className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-semibold transition">
              Start $4.95 Trial
            </button>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4">
            <a href="#product" className="block py-2 text-slate-600 hover:text-slate-900">Product</a>
            <button onClick={onViewPricing} className="block py-2 text-slate-600 hover:text-slate-900 text-left w-full">Pricing</button>
            <a href="#consultation" className="block py-2 text-slate-600 hover:text-slate-900">Consultation</a>
            <button onClick={onStartTrial} className="w-full mt-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-semibold">
              Start $4.95 Trial
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
