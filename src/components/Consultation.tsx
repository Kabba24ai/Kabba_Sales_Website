import { Target, TrendingUp, Calendar, Repeat, BarChart3, Zap, ArrowRight } from 'lucide-react';

interface ConsultationProps {
  onStartTrial: () => void;
}

export default function Consultation({ onStartTrial }: ConsultationProps) {
  const learnings = [
    { icon: Target, text: 'How to price for profit' },
    { icon: Calendar, text: 'How to eliminate scheduling chaos' },
    { icon: Repeat, text: 'How to drive repeat rentals automatically' },
    { icon: TrendingUp, text: 'How to scale from one yard to many' },
    { icon: BarChart3, text: 'The hidden metrics most shops ignore' },
    { icon: Zap, text: 'And yes — how KABBA automates all of it' }
  ];

  return (
    <section id="consultation" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block bg-amber-100 text-amber-700 px-6 py-2 rounded-full text-sm font-bold mb-6">
            EXCLUSIVE OFFER
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            This isn't a demo.
            <span className="block text-blue-600 mt-2">It's a Rental Business Growth Consultation.</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Activate your $4.95 trial and receive a free strategy session based on the exact methods we used to grow our rental shop from zero to millions in under 3 years.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 border border-slate-200">
          <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">You'll learn:</h3>

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {learnings.map((item, index) => (
              <div key={index} className="flex items-start gap-4 bg-slate-50 rounded-lg p-4 border border-slate-200">
                <div className="bg-blue-100 rounded-lg p-2 flex-shrink-0">
                  <item.icon className="text-blue-600" size={24} />
                </div>
                <span className="text-lg text-slate-700 font-medium pt-1">{item.text}</span>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-blue-900 text-white rounded-xl p-8 mb-8">
            <p className="text-lg mb-2">
              <span className="font-bold text-xl">Important Note:</span>
            </p>
            <p className="text-lg leading-relaxed">
              This consultation is only available to trial users. We do this because we only spend time with people who are serious enough to take action.
            </p>
          </div>

          <div className="flex justify-center">
            <button onClick={onStartTrial} className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition shadow-lg hover:shadow-xl inline-flex items-center group">
              Start Trial & Claim Consultation
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition" size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
