import { TrendingUp, Store, Package } from 'lucide-react';

export default function SocialProof() {
  const stats = [
    { icon: TrendingUp, value: '0 to $M+', label: 'Revenue Growth in 3 Years' },
    { icon: Store, value: 'Multiple', label: 'Locations Built' },
    { icon: Package, value: 'Real', label: 'Rental Operations' }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Real rental operators. Real results.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="bg-slate-800 rounded-xl p-8 text-center border border-slate-700">
              <div className="bg-blue-900/50 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                <stat.icon className="text-blue-400" size={32} />
              </div>
              <div className="text-4xl font-bold text-blue-400 mb-2">{stat.value}</div>
              <div className="text-slate-300 text-lg">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 sm:p-12 border border-slate-700">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-4">Built in a shop. Proven in a shop.</h3>
              <p className="text-xl text-slate-300 leading-relaxed">
                While other software companies are guessing what rental operators need, we're running a thriving multi-million dollar rental business with the same software we're offering you.
              </p>
            </div>
            <div className="bg-slate-700 rounded-xl h-64 flex items-center justify-center">
              <div className="text-center">
                <Store className="text-slate-500 mx-auto mb-4" size={64} />
                <p className="text-slate-400">Your Shop & Growth Photos</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
