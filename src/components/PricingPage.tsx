import { ArrowRight, Check, X, ArrowLeft } from 'lucide-react';

interface PricingPageProps {
  onBack: () => void;
  onStartTrial: () => void;
}

export default function PricingPage({ onBack, onStartTrial }: PricingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <nav className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={onBack}
            className="flex items-center text-slate-300 hover:text-white transition"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </button>
        </div>
      </nav>

      <section className="py-20 px-4 sm:px-6 lg:px-8 text-white">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Rental Software Pricing That Actually Makes Sense
          </h1>
          <p className="text-2xl sm:text-3xl text-slate-300 mb-4 leading-relaxed">
            Start for $4.95. Pay only when you rent.
          </p>
          <p className="text-xl text-slate-400 mb-10">
            No upfront fees. No hidden pricing. No sales games.
          </p>

          <button
            onClick={onStartTrial}
            className="bg-amber-500 hover:bg-amber-600 text-white px-10 py-5 rounded-lg font-bold text-xl transition shadow-2xl hover:shadow-3xl inline-flex items-center group mb-4"
          >
            Start Your $4.95 Trial
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition" size={24} />
          </button>

          <p className="text-slate-400 text-sm">
            No contracts • Cancel anytime • See everything upfront
          </p>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border-2 border-cyan-500/50 rounded-2xl p-8 sm:p-12 shadow-2xl">
            <div className="text-center mb-8">
              <div className="inline-block bg-cyan-400/20 text-cyan-300 px-6 py-2 rounded-full text-sm font-bold mb-6 border border-cyan-400/30">
                KABBA PRICING
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-8">
                Simple. Transparent. Fair.
              </h2>
            </div>

            <div className="space-y-6 mb-8">
              <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                <div className="text-cyan-300 text-lg font-semibold mb-2">Start Here</div>
                <div className="text-5xl font-bold text-white mb-2">$4.95</div>
                <div className="text-slate-300 text-lg">Starter Trial</div>
              </div>

              <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                <div className="text-cyan-300 text-lg font-semibold mb-2">Then</div>
                <div className="text-4xl font-bold text-white mb-2">$9.95<span className="text-2xl text-slate-300">/month</span></div>
                <div className="text-slate-300 text-lg">Base platform fee</div>
              </div>

              <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                <div className="text-cyan-300 text-lg font-semibold mb-2">Plus</div>
                <div className="text-4xl font-bold text-white mb-2">$0.39</div>
                <div className="text-slate-300 text-lg">per rental transaction</div>
              </div>
            </div>

            <div className="space-y-3 mb-8 text-white">
              {['No setup fees', 'No long-term contracts', 'Cancel anytime'].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <Check className="text-cyan-400 flex-shrink-0" size={24} />
                  <span className="text-lg">{item}</span>
                </div>
              ))}
            </div>

            <div className="bg-cyan-400/10 border border-cyan-400/30 rounded-xl p-6 mb-8">
              <p className="text-white text-lg leading-relaxed">
                If you don't rent anything, you don't pay us anything beyond the trial — and after that, only the $9.95 monthly fee.
              </p>
            </div>

            <button
              onClick={onStartTrial}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-lg font-bold text-lg transition shadow-xl hover:shadow-2xl flex items-center justify-center group"
            >
              Start My $4.95 Trial
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition" size={20} />
            </button>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              If your rental business is seasonal, why isn't your software pricing?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-red-400 mb-4">Traditional Software</h3>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-start gap-3">
                  <X className="text-red-400 flex-shrink-0 mt-1" size={20} />
                  <span>Large upfront fees</span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="text-red-400 flex-shrink-0 mt-1" size={20} />
                  <span>Fixed monthly or annual payments</span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="text-red-400 flex-shrink-0 mt-1" size={20} />
                  <span>Same cost whether rentals happen or not</span>
                </li>
              </ul>
            </div>

            <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-cyan-400 mb-4">KABBA is Different</h3>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-start gap-3">
                  <Check className="text-cyan-400 flex-shrink-0 mt-1" size={20} />
                  <span>When rentals are strong → you pay a little more</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="text-cyan-400 flex-shrink-0 mt-1" size={20} />
                  <span>When rentals slow down → your costs drop automatically</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="text-cyan-400 flex-shrink-0 mt-1" size={20} />
                  <span>When you don't rent → you pay only $9.95 monthly</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-slate-800 to-slate-700 border border-slate-600 rounded-xl p-8 text-center">
            <p className="text-2xl font-bold text-white mb-3">
              Your software shouldn't hurt your cash flow during slow seasons.
            </p>
            <p className="text-slate-300 text-lg">
              KABBA is built to handle the busy season — with pricing designed to get you through the winter.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              How KABBA Compares
            </h2>
            <p className="text-xl text-slate-400">
              The rental software industry has a transparency problem
            </p>
          </div>

          <div className="space-y-8 mb-12">
            <div className="bg-red-900/10 border-2 border-red-500/30 rounded-xl p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="text-sm text-red-400 font-bold mb-2">COMPETITOR</div>
                  <h3 className="text-3xl font-bold text-white">Quipli</h3>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-red-400">$6,000</div>
                  <div className="text-slate-300">per year. Per location. Upfront.</div>
                </div>
              </div>

              <ul className="space-y-3 text-slate-300 mb-6">
                <li className="flex items-start gap-3">
                  <X className="text-red-400 flex-shrink-0 mt-1" size={20} />
                  <span>$6,000 before first rental</span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="text-red-400 flex-shrink-0 mt-1" size={20} />
                  <span>Paid whether money is made or not</span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="text-red-400 flex-shrink-0 mt-1" size={20} />
                  <span>Annual commitment</span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="text-red-400 flex-shrink-0 mt-1" size={20} />
                  <span>Enterprise pricing forced on new businesses</span>
                </li>
              </ul>

              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 space-y-2">
                <p className="text-red-300 font-bold text-center">
                  That's $6,000 of cash flow — before you earn a single dollar.
                </p>
                <p className="text-red-300 text-center">
                  And you pay it whether rentals are strong or slow.
                </p>
              </div>
            </div>

            <div className="bg-orange-900/10 border-2 border-orange-500/30 rounded-xl p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="text-sm text-orange-400 font-bold mb-2">COMPETITOR</div>
                  <h3 className="text-3xl font-bold text-white">Renterra</h3>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-orange-400">???</div>
                  <div className="text-slate-300">Pricing hidden</div>
                </div>
              </div>

              <ul className="space-y-3 text-slate-300 mb-6">
                <li className="flex items-start gap-3">
                  <X className="text-orange-400 flex-shrink-0 mt-1" size={20} />
                  <span>No public pricing</span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="text-orange-400 flex-shrink-0 mt-1" size={20} />
                  <span>No trial</span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="text-orange-400 flex-shrink-0 mt-1" size={20} />
                  <span>No transparency</span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="text-orange-400 flex-shrink-0 mt-1" size={20} />
                  <span>Cost unknown until after sales pitch</span>
                </li>
              </ul>

              <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4 space-y-2">
                <p className="text-orange-300 font-bold text-center">
                  If pricing is fair, why hide it?
                </p>
                <p className="text-orange-400 text-center text-sm">
                  What are they afraid to show you?
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Side-by-Side Comparison</h2>
            <p className="text-slate-400 text-lg">The facts speak for themselves</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-slate-800/50 rounded-xl overflow-hidden">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left p-6 text-slate-400 font-semibold">Feature</th>
                  <th className="p-6 text-center bg-cyan-900/30 border-x border-cyan-500/30">
                    <div className="text-cyan-400 font-bold text-lg">KABBA</div>
                  </th>
                  <th className="p-6 text-center text-slate-400 font-semibold">Quipli</th>
                  <th className="p-6 text-center text-slate-400 font-semibold">Renterra</th>
                </tr>
              </thead>
              <tbody className="text-white">
                {[
                  { feature: 'Public pricing', kabba: true, quipli: true, renterra: false },
                  { feature: 'Upfront fees', kabba: false, quipli: true, renterra: true },
                  { feature: 'Low-cost trial', kabba: true, quipli: false, renterra: false },
                  { feature: 'Pay aligned to revenue', kabba: true, quipli: false, renterra: false },
                  { feature: 'Demo required', kabba: false, quipli: false, renterra: true },
                  { feature: 'Built by rental operators', kabba: true, quipli: false, renterra: false },
                ].map((row, idx) => (
                  <tr key={idx} className="border-b border-slate-700">
                    <td className="p-6 text-slate-300">{row.feature}</td>
                    <td className="p-6 text-center bg-cyan-900/20 border-x border-cyan-500/20">
                      {row.kabba ? (
                        <Check className="text-cyan-400 mx-auto" size={24} />
                      ) : (
                        <X className="text-slate-600 mx-auto" size={24} />
                      )}
                    </td>
                    <td className="p-6 text-center">
                      {row.quipli ? (
                        <Check className="text-green-400 mx-auto" size={24} />
                      ) : (
                        <X className="text-slate-600 mx-auto" size={24} />
                      )}
                    </td>
                    <td className="p-6 text-center">
                      {row.renterra ? (
                        <Check className="text-green-400 mx-auto" size={24} />
                      ) : (
                        <X className="text-slate-600 mx-auto" size={24} />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              We charge like a rental business — not a software company
            </h2>
          </div>

          <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border border-cyan-500/30 rounded-xl p-8 sm:p-12 mb-8">
            <p className="text-xl text-slate-300 leading-relaxed mb-8">
              Rental businesses charge per rental, not upfront. KABBA mirrors that model because we believe your software costs should scale with your success, not against it.
            </p>

            <div className="grid sm:grid-cols-3 gap-6 text-center">
              <div className="bg-white/5 rounded-lg p-6">
                <div className="text-cyan-400 text-4xl font-bold mb-2">📈</div>
                <div className="text-white font-semibold mb-2">You earn money</div>
                <div className="text-slate-400">We earn money</div>
              </div>
              <div className="bg-white/5 rounded-lg p-6">
                <div className="text-cyan-400 text-4xl font-bold mb-2">🚀</div>
                <div className="text-white font-semibold mb-2">You grow</div>
                <div className="text-slate-400">We grow</div>
              </div>
              <div className="bg-white/5 rounded-lg p-6">
                <div className="text-cyan-400 text-4xl font-bold mb-2">📉</div>
                <div className="text-white font-semibold mb-2">Slow season</div>
                <div className="text-slate-400">Costs scale down</div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 text-center">
            <p className="text-2xl font-bold text-cyan-400">
              That alignment doesn't exist anywhere else in rental software.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Who This Is For</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-cyan-400 mb-6 flex items-center">
                <Check className="mr-2" size={28} />
                Built For
              </h3>
              <ul className="space-y-4 text-slate-300">
                <li className="flex items-start gap-3">
                  <span className="text-cyan-400 mt-1">•</span>
                  <span>New rental businesses</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-cyan-400 mt-1">•</span>
                  <span>Growing rental shops</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-cyan-400 mt-1">•</span>
                  <span>Owners who want to protect cash flow</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-cyan-400 mt-1">•</span>
                  <span>Shops tired of sales pressure</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-cyan-400 mt-1">•</span>
                  <span>Operators who value transparency</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-slate-400 mb-6 flex items-center">
                <X className="mr-2" size={28} />
                Probably Not For
              </h3>
              <ul className="space-y-4 text-slate-400">
                <li className="flex items-start gap-3">
                  <span className="mt-1">•</span>
                  <span>Large enterprises deeply entrenched in their current system</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1">•</span>
                  <span>Businesses locked into long-term contracts</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1">•</span>
                  <span>Companies requiring heavy legacy customization</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-xl text-slate-300 italic">
              We're built for shops that want to grow — not ones that are already stuck.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            You shouldn't need $6,000 just to see if software works
          </h2>
          <p className="text-2xl text-slate-300 mb-10 leading-relaxed">
            Start KABBA today for $4.95.
            <span className="block mt-2">See everything upfront.</span>
            <span className="block">Cancel anytime.</span>
          </p>

          <button
            onClick={onStartTrial}
            className="bg-amber-500 hover:bg-amber-600 text-white px-12 py-6 rounded-lg font-bold text-2xl transition shadow-2xl hover:shadow-3xl inline-flex items-center group mb-4"
          >
            Start Your $4.95 Trial
            <ArrowRight className="ml-3 group-hover:translate-x-1 transition" size={28} />
          </button>

          <p className="text-slate-400">
            No contracts • No sales calls • No surprises
          </p>
        </div>
      </section>
    </div>
  );
}
