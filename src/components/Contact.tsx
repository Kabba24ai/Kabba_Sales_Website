import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, LifeBuoy, Phone } from 'lucide-react';

interface ContactProps {
  id?: string;
}

/**
 * kabba.ai/contact (Kabba #282). Two clearly separate paths:
 *  - existing customers: the green Get Kabba Support button (kabba.ai/support works
 *    even for someone who can't sign in), first on phones;
 *  - people exploring Kabba: Implementation Services, then the orange Discuss Kabba
 *    consultation.
 * Both columns are the same height and their main buttons line up. There is no
 * contact form here on purpose: the old one never reached anyone.
 */
export default function Contact({ id = 'contact' }: ContactProps) {
  return (
    <section id={id} className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 sm:mb-14">
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            Get in Touch
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Have questions? We're here to help you grow your rental business.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 md:gap-8">
          {/* Existing customers: phone and support. On phones the support card comes first. */}
          <div className="flex flex-col gap-6">
            <a
              href="tel:6152896429"
              className="flex items-start gap-4 rounded-2xl bg-white p-6 shadow-md transition hover:shadow-lg group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
              data-contact-phone
            >
              <div className="bg-blue-100 p-3 rounded-xl shrink-0 group-hover:bg-blue-200 transition">
                <Phone className="text-blue-600" size={24} aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Call or Text</h3>
                <p className="text-lg text-blue-600 font-semibold">(615) 289-6429</p>
                <p className="text-sm text-slate-600 mt-1">Questions about Kabba? We're here to help.</p>
              </div>
            </a>

            <div
              className="order-first md:order-none flex flex-1 flex-col rounded-2xl border-2 border-emerald-200 bg-white p-6 sm:p-8 shadow-md"
              aria-labelledby="contact-support-heading"
              role="region"
              data-contact-support
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="bg-emerald-100 p-3 rounded-xl shrink-0">
                  <LifeBuoy className="text-emerald-700" size={28} aria-hidden="true" />
                </div>
                <h3 id="contact-support-heading" className="text-xl sm:text-2xl font-bold text-slate-900">
                  Already a Kabba customer?
                </h3>
              </div>
              <p className="text-slate-600 mb-6 text-pretty">
                Need help with Kabba? Open a support case, even if you can't sign in.
              </p>
              <Link
                to="/support"
                className="mt-auto w-full inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-emerald-700 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
                data-contact-support-cta
              >
                <LifeBuoy size={20} aria-hidden="true" />
                Get Kabba Support
              </Link>
            </div>
          </div>

          {/* People exploring Kabba: implementation first, then a conversation. */}
          <div
            className="flex flex-col rounded-2xl border-2 border-amber-200 bg-white p-6 sm:p-8 shadow-md"
            aria-labelledby="contact-sales-heading"
            role="region"
            data-contact-sales
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="bg-amber-100 p-3 rounded-xl shrink-0">
                <CalendarDays className="text-amber-700" size={28} aria-hidden="true" />
              </div>
              <h3 id="contact-sales-heading" className="text-xl sm:text-2xl font-bold text-slate-900">
                Let's talk about your rental business
              </h3>
            </div>
            <p className="text-slate-600 mb-6 text-pretty">
              Interested in Kabba? Explore our solutions or arrange a conversation with our team.
              If you need help with an existing Kabba account, use Get Kabba Support instead.
            </p>
            <div className="mt-auto flex flex-col gap-3">
              <Link
                to="/implementation-services"
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg border-2 border-blue-600 bg-white px-4 sm:px-8 py-3.5 text-center text-lg font-semibold leading-snug text-blue-700 transition hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                data-contact-implementation
              >
                Explore Implementation Services
                <ArrowRight size={20} className="hidden sm:block shrink-0" aria-hidden="true" />
              </Link>
              <Link
                to="/?scroll=consultation"
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-amber-600 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
                data-contact-consultation
              >
                Discuss Kabba
                <CalendarDays size={20} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
