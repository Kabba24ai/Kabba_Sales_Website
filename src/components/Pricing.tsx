import { Check, ArrowRight } from 'lucide-react';

export default function Pricing() {
  const features = [
    '$4.95 Starter Trial',
    'Then $9.95/month',
    '$0.39 per rental transaction',
    'No startup fees',
    'No contracts',
    'No risk'
  ];

  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Simple, transparent pricing.
            <span className="block text-blue-300 mt-2">No surprises — ever.</span>
          </h2>
          <p className="text-2xl text-slate-300">
            Start for just $4.95, then only pay after you rent.
          </p>
        </div>

        <div className="bg-white text-slate-900 rounded-2xl shadow-2xl p-8 sm:p-12 max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-block bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              MOST POPULAR
            </div>
            <h3 className="text-3xl font-bold mb-2">Pay-As-You-Grow</h3>
            <p className="text-slate-600">Perfect for rental shops of all sizes</p>
          </div>

          <div className="space-y-4 mb-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="bg-blue-100 rounded-full p-1 flex-shrink-0">
                  <Check className="text-blue-600" size={20} />
                </div>
                <span className="text-lg font-medium">{feature}</span>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 mb-8 border border-amber-200">
            <p className="text-xl font-bold text-slate-900 text-center">
              Stop paying for software.
              <span className="block text-amber-600 mt-1">Start paying only when you make money.</span>
            </p>
          </div>

          <button className="w-full bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition shadow-lg hover:shadow-xl flex items-center justify-center group">
            Start Your $4.95 Trial
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition" size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
