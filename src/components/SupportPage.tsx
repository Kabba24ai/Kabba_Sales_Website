import { useEffect, useState } from "react";
import { KeyRound, LifeBuoy, Phone } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import SupportRequestForm from "./SupportRequestForm";
import SupportLinkRequest from "./SupportLinkRequest";
import { SUPPORT_CATEGORIES, SupportOptions, getSupportOptions } from "../lib/commercial-api";

/**
 * /support — Get Kabba Support (Kabba #276). For Kabba software customers,
 * including anyone who can't sign in. Cases are answered by the Kabba team
 * from Kabba Commercial Administration; nothing here is a rental shop's
 * equipment service request.
 */
interface Props {
  onBack: () => void;
  onStartTrial: () => void;
  onViewPricing: () => void;
  onViewOurStory: () => void;
  onViewContact: () => void;
  onViewProduct: () => void;
  onViewConsultation: () => void;
  onViewPrivacyPolicy?: () => void;
  onViewTermsOfService?: () => void;
  onViewRefundPolicy?: () => void;
  onViewAcceptableUsePolicy?: () => void;
}

/** Already printed on kabba.ai (Contact); Central's settings value replaces it when it loads. */
const FALLBACK_PHONE = "(615) 289-6429";

export default function SupportPage(props: Props) {
  const [options, setOptions] = useState<SupportOptions>({ categories: SUPPORT_CATEGORIES, support_phone: FALLBACK_PHONE, link_days: 14 });

  useEffect(() => {
    let cancelled = false;
    getSupportOptions()
      .then((o) => {
        if (!cancelled) setOptions(o);
      })
      .catch(() => {
        // Keep the built-in list; the form still submits to the same server.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const phone = options.support_phone;
  const tel = phone ? phone.replace(/[^\d+]/g, "") : "";

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar
        onStartTrial={props.onStartTrial}
        onViewPricing={props.onViewPricing}
        onViewOurStory={props.onViewOurStory}
        onViewContact={props.onViewContact}
        onBackToHome={props.onBack}
        onViewProduct={props.onViewProduct}
        onViewConsultation={props.onViewConsultation}
      />

      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white pt-28 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm text-cyan-200 mb-4">
            <LifeBuoy className="w-4 h-4" aria-hidden="true" /> Kabba Support
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Get Kabba Support</h1>
          <p className="text-lg text-slate-200 max-w-3xl">
            Tell us what's going on with your Kabba software and we'll open a support case. You don't need to be signed in, so this works
            even if you're locked out of your admin.
          </p>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 py-12 bg-slate-50">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <SupportRequestForm categories={options.categories} linkDays={options.link_days} />
          </div>
          <aside className="space-y-4">
            {phone && (
              <a href={`tel:${tel}`} className="flex items-start gap-3 rounded-xl bg-white p-5 shadow-md hover:shadow-lg transition">
                <div className="bg-blue-100 p-2.5 rounded-lg"><Phone className="w-5 h-5 text-blue-700" aria-hidden="true" /></div>
                <div>
                  <div className="font-semibold text-slate-900">Prefer to talk?</div>
                  <div className="text-lg font-semibold text-blue-700">{phone}</div>
                  <div className="text-sm text-slate-600">Call Kabba support.</div>
                </div>
              </a>
            )}
            <div className="rounded-xl bg-white p-5 shadow-md">
              <div className="flex items-center gap-2 font-semibold text-slate-900 mb-2">
                <KeyRound className="w-5 h-5 text-amber-600" aria-hidden="true" /> Can't sign in?
              </div>
              <p className="text-sm text-slate-600">
                Try <strong>Forgot password?</strong> on your Kabba admin sign-in page first. If that doesn't work, choose "Login" above. We
                verify who you are before restoring access, and we'll never ask for your password.
              </p>
            </div>
            <div className="rounded-xl bg-white p-5 shadow-md">
              <div className="font-semibold text-slate-900 mb-2">Already have a case?</div>
              <p className="text-sm text-slate-600 mb-3">
                Use the private link in your latest email from Kabba Support. Lost it? We'll email a new one to the address on the case.
              </p>
              <SupportLinkRequest />
            </div>
          </aside>
        </div>
      </section>

      <Footer
        onViewOurStory={props.onViewOurStory}
        onViewContact={props.onViewContact}
        onViewProduct={props.onViewProduct}
        onViewPricing={props.onViewPricing}
        onViewConsultation={props.onViewConsultation}
        onViewPrivacyPolicy={props.onViewPrivacyPolicy}
        onViewTermsOfService={props.onViewTermsOfService}
        onViewRefundPolicy={props.onViewRefundPolicy}
        onViewAcceptableUsePolicy={props.onViewAcceptableUsePolicy}
      />
    </div>
  );
}
