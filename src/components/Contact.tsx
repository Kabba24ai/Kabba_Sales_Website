import { Link } from 'react-router-dom';
import { Phone, CalendarDays, LifeBuoy } from 'lucide-react';

interface ContactProps {
  id?: string;
}

export default function Contact({ id = 'contact' }: ContactProps) {
  return (
    <section id={id} className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            Get in Touch
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Have questions? We're here to help you grow your rental business.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Contact Information</h3>
            <div className="space-y-6">
              <a
                href="tel:6152896429"
                className="flex items-start gap-4 p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition group"
              >
                <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-200 transition">
                  <Phone className="text-blue-600" size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Call or Text</h4>
                  <p className="text-lg text-blue-600 font-semibold">(615) 289-6429</p>
                  <p className="text-sm text-slate-600 mt-1">Questions about Kabba? We're here to help.</p>
                </div>
              </a>

              <Link
                to="/support"
                className="flex items-start gap-4 p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition group"
              >
                <div className="bg-emerald-100 p-3 rounded-lg group-hover:bg-emerald-200 transition">
                  <LifeBuoy className="text-emerald-700" size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Already a Kabba customer? Get Support</h4>
                  <p className="text-sm text-slate-600">
                    Open a trackable support case, even if you can't sign in.
                  </p>
                </div>
              </Link>
            </div>

            <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-100">
              <h4 className="font-semibold text-slate-900 mb-2">Why reach out?</h4>
              <ul className="space-y-2 text-slate-700">
                <li>Questions about features or pricing</li>
                <li>Help migrating from another system</li>
                <li>Discussion of custom solutions</li>
                <li>General inquiries about Kabba</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col justify-center">
            <div className="bg-amber-100 rounded-lg p-3 w-fit mb-5">
              <CalendarDays className="text-amber-700" size={30} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Let's talk about your rental business</h3>
            <p className="text-slate-600 mb-8">
              Interested in Kabba? Explore our solutions or arrange a conversation with our team.
              If you need help with an existing Kabba account, use Get Support instead.
            </p>
            <Link
              to="/?scroll=consultation"
              className="w-full bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              Discuss Kabba <CalendarDays size={20} />
            </Link>
            <Link
              to="/implementation-services"
              className="mt-4 text-center font-semibold text-blue-700 hover:text-blue-800 underline underline-offset-4"
            >
              Explore Implementation Services
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
