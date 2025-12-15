import { ArrowRight, Eye } from 'lucide-react';

interface HeroProps {
  onStartTrial: () => void;
}

export default function Hero({ onStartTrial }: HeroProps) {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 leading-tight">
            Born in Our Rental Shop.
            <span className="block text-blue-600">Built to Grow Yours.</span>
          </h1>

          <p className="text-xl sm:text-2xl text-slate-600 mb-4 leading-relaxed">
            KABBA is the only rental software created by real rental shop owners.
          </p>
          <p className="text-lg sm:text-xl text-slate-600 mb-6">
            See everything upfront — no demos, no pressure, no hidden pricing.
            <span className="block mt-2 font-semibold text-slate-700">
              Start for just $4.95, and only pay when you rent.
            </span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button onClick={onStartTrial} className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition shadow-lg hover:shadow-xl flex items-center justify-center group">
              Start Your $4.95 Trial
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition" size={20} />
            </button>
            <button className="bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-300 px-8 py-4 rounded-lg font-semibold text-lg transition flex items-center justify-center group">
              <Eye className="mr-2" size={20} />
              See the Product Instantly
            </button>
          </div>

          <div className="inline-block bg-white px-6 py-3 rounded-full shadow-md border border-slate-200">
            <p className="text-sm text-slate-600">
              <span className="font-semibold text-slate-800">No contracts. No sales reps. No surprises.</span>
              <br className="sm:hidden" />
              <span className="hidden sm:inline"> — </span>
              Just the software and the real-world strategies behind it.
            </p>
          </div>
        </div>

        <div className="mt-16 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 pointer-events-none"></div>
          <div className="rounded-xl shadow-2xl overflow-hidden">
            <img
              src="/home_page_-_image_1.jpg"
              alt="KABBA Sales Trend Analysis Dashboard showing real-time rental metrics and growth analytics"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
