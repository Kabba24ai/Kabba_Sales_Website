import { Store } from 'lucide-react';

export default function RealShop() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6 leading-tight">
              The one thing the other software companies will never show you:
              <span className="block text-blue-600 mt-2">their rental shop.</span>
            </h2>
            <p className="text-2xl font-semibold text-slate-700 mb-6">
              That's because they don't have one.
            </p>
            <div className="space-y-4 text-lg text-slate-600">
              <p>
                KABBA was built inside a real rental business — the same business that went from zero to multi-million dollars and multiple locations in under 3 years.
              </p>
              <p className="font-semibold text-slate-800">
                We built the software we needed.<br />
                Then we built the systems and strategies that turned a small local shop into a thriving operation.
              </p>
              <p className="text-xl font-bold text-blue-600">
                Now you get both.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="bg-slate-200 rounded-2xl shadow-2xl h-96 flex flex-col items-center justify-center">
              <Store className="text-slate-400 mb-4" size={64} />
              <p className="text-slate-500 text-lg">Your Rental Shop Photo</p>
              <p className="text-slate-400 text-sm mt-2">Equipment, yard, or storefront</p>
            </div>
            <div className="absolute -bottom-6 -right-6 bg-amber-500 text-white px-6 py-3 rounded-lg shadow-lg font-semibold transform rotate-3">
              Real Operators. Real Results.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
