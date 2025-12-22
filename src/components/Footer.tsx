interface FooterProps {
  onViewOurStory?: () => void;
  onViewContact?: () => void;
  onViewProduct?: () => void;
  onViewPricing?: () => void;
  onViewConsultation?: () => void;
  onViewPrivacyPolicy?: () => void;
  onViewTermsOfService?: () => void;
  onViewRefundPolicy?: () => void;
}

export default function Footer({ onViewOurStory, onViewContact, onViewProduct, onViewPricing, onViewConsultation, onViewPrivacyPolicy, onViewTermsOfService, onViewRefundPolicy }: FooterProps) {
  return (
    <footer className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <img
              src="/footer_logo.png"
              alt="KABBA.ai"
              className="h-20 w-auto mb-4"
            />
            <p className="text-slate-400">
              Rental software built by real rental operators.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Features</h4>
            <ul className="space-y-2 text-slate-400">
              {onViewProduct ? (
                <li><button onClick={onViewProduct} className="hover:text-white transition text-left">Product</button></li>
              ) : (
                <li><a href="#product" className="hover:text-white transition">Product</a></li>
              )}
              {onViewPricing ? (
                <li><button onClick={onViewPricing} className="hover:text-white transition text-left">Pricing</button></li>
              ) : (
                <li><a href="#pricing" className="hover:text-white transition">Pricing</a></li>
              )}
              {onViewConsultation ? (
                <li><button onClick={onViewConsultation} className="hover:text-white transition text-left">Consultation</button></li>
              ) : (
                <li><a href="#consultation" className="hover:text-white transition">Consultation</a></li>
              )}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-slate-400">
              {onViewOurStory ? (
                <li><button onClick={onViewOurStory} className="hover:text-white transition text-left">Our Story</button></li>
              ) : (
                <li><a href="#" className="hover:text-white transition">Our Story</a></li>
              )}
              {onViewContact ? (
                <li><button onClick={onViewContact} className="hover:text-white transition text-left">Contact</button></li>
              ) : (
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              )}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-slate-400">
              {onViewPrivacyPolicy ? (
                <li><button onClick={onViewPrivacyPolicy} className="hover:text-white transition text-left">Privacy Policy</button></li>
              ) : (
                <li><a href="#privacy" className="hover:text-white transition">Privacy Policy</a></li>
              )}
              {onViewTermsOfService ? (
                <li><button onClick={onViewTermsOfService} className="hover:text-white transition text-left">Terms of Service</button></li>
              ) : (
                <li><a href="#terms" className="hover:text-white transition">Terms of Service</a></li>
              )}
              {onViewRefundPolicy ? (
                <li><button onClick={onViewRefundPolicy} className="hover:text-white transition text-left">Refund & Cancellation Policy</button></li>
              ) : (
                <li><a href="#refund" className="hover:text-white transition">Refund & Cancellation Policy</a></li>
              )}
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-8 text-center text-slate-400">
          <p>&copy; 2024 KABBA.ai. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
