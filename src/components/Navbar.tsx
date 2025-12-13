import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <img
              src="/kabba_logo_-_png_-_circle_-_cut.png"
              alt="KABBA.ai"
              className="h-12 w-12"
            />
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#product" className="text-slate-600 hover:text-slate-900 transition">Product</a>
            <a href="#pricing" className="text-slate-600 hover:text-slate-900 transition">Pricing</a>
            <a href="#consultation" className="text-slate-600 hover:text-slate-900 transition">Consultation</a>
            <button className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-semibold transition">
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
            <a href="#pricing" className="block py-2 text-slate-600 hover:text-slate-900">Pricing</a>
            <a href="#consultation" className="block py-2 text-slate-600 hover:text-slate-900">Consultation</a>
            <button className="w-full mt-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-semibold">
              Start $4.95 Trial
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
