import { useEffect } from 'react';
import { ArrowRight, Check, X, Play } from 'lucide-react';
import Navbar from './Navbar';

interface PricingPageV2Props {
  onBack: () => void;
  onStartTrial: () => void;
  onViewOurStory: () => void;
  onViewContact: () => void;
  onViewProduct: () => void;
  onViewConsultation: () => void;
  onViewLiveDemo: () => void;
  scrollToComparison?: boolean;
}

export default function PricingPageV2({
  onBack,
  onStartTrial,
  onViewOurStory,
  onViewContact,
  onViewProduct,
  onViewConsultation,
  onViewLiveDemo,
  scrollToComparison
}: PricingPageV2Props) {
  useEffect(() => {
    if (scrollToComparison) {
      const element = document.getElementById('comparison');
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [scrollToComparison]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar
        onStartTrial={onStartTrial}
        onViewPricing={onBack}
        onViewOurStory={onViewOurStory}
        onViewContact={onViewContact}
        onBackToHome={onBack}
        onViewProduct={onViewProduct}
        onViewConsultation={onViewConsultation}
      />

      {/* SECTION 1 — HERO */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 text-white">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            A premier rental platform — with smarter ways to pay.
          </h1>
          <p className="text-xl sm:text-2xl text-slate-300 mb-10 leading-relaxed max-w-4xl mx-auto">
            KABBA is the only modern, full-featured rental system built by real rental operators.
            It's designed around how you actually run your business — from the features you need to grow, to pricing that respects your cash flow in a seasonal industry.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
            <button
              onClick={onStartTrial}
              className="bg-amber-500 hover:bg-amber-600 text-white px-10 py-5 rounded-lg font-bold text-xl transition shadow-2xl hover:shadow-3xl inline-flex items-center group"
            >
              Start My $4.95 Trial
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition" size={24} />
            </button>

            <button
              onClick={onViewLiveDemo}
              className="bg-white/10 hover:bg-white/20 border-2 border-white/30 hover:border-white/50 text-white px-10 py-5 rounded-lg font-bold text-xl transition inline-flex items-center group"
            >
              <Play className="mr-2" size={24} />
              View the Live Demo
            </button>
          </div>

          <p className="text-slate-400 text-sm">
            No contracts • Cancel anytime • Transparent pricing
          </p>
        </div>
      </section>

      {/* SECTION 2 — REALITY CHECK */}
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

      {/* SECTION 3 — PRICING MODELS INTRO */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Choose the pricing model that fits how you operate.
            </h2>
            <p className="text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
              Every option is fully featured, giving you access to the complete KABBA platform.
              <br />
              The difference is how you prefer to pay as your business grows.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* MODEL 1 — HIGH-VOLUME BUY-OUT */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 border-2 border-slate-600 rounded-2xl p-8 shadow-xl">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">High-Volume Buy-Out</h3>
                <p className="text-slate-400 text-sm font-semibold">Best for established, high-volume operations</p>
              </div>

              <div className="bg-white/5 rounded-xl p-6 mb-6 text-center">
                <div className="text-4xl font-bold text-white mb-1">$6,000</div>
                <div className="text-slate-300 mb-1">one-time fee per location</div>
                <div className="text-slate-400 text-sm">(No transaction fees)</div>
              </div>

              <ul className="space-y-3 mb-8 text-slate-300">
                {[
                  'Eliminates per-transaction fees',
                  'One-time software investment per location',
                  'Same KABBA system, different payment structure',
                  'Designed for predictable, high-volume workflows'
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check className="text-slate-400 flex-shrink-0 mt-1" size={20} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={onStartTrial}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white px-6 py-4 rounded-lg font-bold text-lg transition shadow-xl hover:shadow-2xl inline-flex items-center justify-center group mb-3"
              >
                Start My $4.95 Trial
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition" size={20} />
              </button>

              <p className="text-cyan-300 text-center text-sm">
                Cancel anytime • No long-term commitment
              </p>
            </div>

            {/* MODEL 2 — FLEXIBLE / GROWTH-ALIGNED (PRIMARY) */}
            <div className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border-4 border-cyan-500/70 rounded-2xl p-8 shadow-2xl transform lg:scale-105 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-amber-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                  <span>⭐</span> Most Popular
                </div>
              </div>

              <div className="text-center mb-6 mt-4">
                <h3 className="text-2xl font-bold text-white mb-2">Flexible / Growth-Aligned</h3>
                <p className="text-cyan-300 text-sm font-semibold">Best for new and growing rental businesses</p>
              </div>

              <div className="bg-white/10 rounded-xl p-6 mb-6 text-center backdrop-blur-sm">
                <div className="text-4xl font-bold text-white mb-1">$9.95</div>
                <div className="text-slate-300 mb-3">monthly</div>
                <div className="text-3xl font-bold text-cyan-400">+ $0.49</div>
                <div className="text-slate-300">per transaction</div>
              </div>

              <div className="bg-cyan-400/10 border border-cyan-400/30 rounded-lg p-4 mb-6">
                <p className="text-cyan-300 text-center font-semibold">
                  Start with a $4.95 trial (28 days)
                </p>
              </div>

              <ul className="space-y-3 mb-8 text-white">
                {[
                  'Pay more only when rentals are processed',
                  'Keep costs low during slow months',
                  'Scale naturally as volume increases',
                  'Personalized onboarding included'
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check className="text-cyan-400 flex-shrink-0 mt-1" size={20} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={onStartTrial}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white px-6 py-4 rounded-lg font-bold text-lg transition shadow-xl hover:shadow-2xl inline-flex items-center justify-center group mb-3"
              >
                Start My $4.95 Trial
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition" size={20} />
              </button>

              <p className="text-cyan-300 text-center text-sm">
                Cancel anytime • No long-term commitment
              </p>
            </div>

            {/* MODEL 3 — ENTERPRISE / CUSTOM */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 border-2 border-slate-600 rounded-2xl p-8 shadow-xl">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Enterprise / Custom</h3>
                <p className="text-slate-400 text-sm font-semibold">Best for multi-location or enterprise rental companies</p>
              </div>

              <div className="bg-white/5 rounded-xl p-6 mb-6 text-center">
                <div className="text-slate-400 text-sm mb-1">Starting at</div>
                <div className="text-4xl font-bold text-white mb-1">$15,000</div>
                <div className="text-slate-300 mb-1">per year</div>
                <div className="text-slate-400 text-sm">(Custom pricing)</div>
              </div>

              <ul className="space-y-3 mb-8 text-slate-300">
                {[
                  'Custom implementation',
                  'Advanced workflows',
                  'Dedicated onboarding resources',
                  'Tailored pricing and support structure'
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check className="text-slate-400 flex-shrink-0 mt-1" size={20} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={onViewConsultation}
                className="w-full bg-slate-700 hover:bg-slate-600 border-2 border-slate-500 text-white px-6 py-4 rounded-lg font-bold text-lg transition"
              >
                Request a Consultation
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — INTELLIGENT DEFAULT */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-8 text-center">
            Most rental shops choose flexibility first.
          </h2>
          <p className="text-xl text-slate-300 mb-8 text-center leading-relaxed">
            New and growth-stage businesses don't need fewer features — they need pricing that adapts to real-world conditions.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {[
              'Keep cash available for equipment and marketing',
              'Avoid committing thousands before revenue is steady',
              'Adjust naturally to seasonal demand',
              'Upgrade later when volume justifies it'
            ].map((item) => (
              <div key={item} className="bg-cyan-900/20 border border-cyan-500/30 rounded-xl p-6 flex items-start gap-3">
                <Check className="text-cyan-400 flex-shrink-0 mt-1" size={24} />
                <span className="text-slate-300 text-lg">{item}</span>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-slate-800 to-slate-700 border border-slate-600 rounded-xl p-8 text-center">
            <p className="text-xl font-semibold text-white">
              You can move into a buy-out or enterprise model anytime as your business evolves.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 5 — SEASONALITY & CASH FLOW */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-8">
            Seasonality is real. Your pricing should reflect that.
          </h2>
          <p className="text-xl text-slate-300 mb-8 leading-relaxed">
            Some businesses benefit from upfront pricing.<br />
            Others need flexibility to stay healthy year-round.
          </p>
          <p className="text-2xl font-semibold text-cyan-400">
            KABBA supports both — because your business doesn't operate on a flat line.
          </p>
        </div>
      </section>

      {/* SECTION 6 — COMPARISON CHART */}
      <section id="comparison" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              How KABBA compares to other rental platforms.
            </h2>
            <p className="text-xl text-slate-400 leading-relaxed">
              This comparison isn't about feature checklists.<br />
              It's about transparency, flexibility, and how software fits your operation.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl overflow-hidden shadow-xl">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left p-6 text-slate-700 font-semibold">Feature</th>
                  <th className="p-6 text-center bg-cyan-50 border-x border-cyan-200">
                    <div className="text-cyan-700 font-bold text-lg">KABBA</div>
                  </th>
                  <th className="p-6 text-center text-slate-700 font-semibold">Quipli</th>
                  <th className="p-6 text-center text-slate-700 font-semibold">Renterra</th>
                </tr>
              </thead>
              <tbody className="text-slate-800">
                {[
                  { feature: 'Pricing transparency', kabba: true, quipli: true, renterra: false },
                  { feature: 'Upfront cash required', kabba: false, quipli: true, renterra: true },
                  { feature: 'Flexibility during slow seasons', kabba: true, quipli: false, renterra: false },
                  { feature: 'Ability to see pricing before commitment', kabba: true, quipli: true, renterra: false },
                  { feature: 'Built around real rental workflows', kabba: true, quipli: false, renterra: false },
                  { feature: 'Pricing that scales with growth', kabba: true, quipli: false, renterra: false },
                ].map((row, idx) => (
                  <tr key={idx} className="border-b border-slate-200">
                    <td className="p-6 text-slate-700">{row.feature}</td>
                    <td className="p-6 text-center bg-cyan-50/50 border-x border-cyan-100">
                      {row.kabba ? (
                        <Check className="text-green-600 mx-auto" size={24} />
                      ) : (
                        <X className="text-red-500 mx-auto" size={24} />
                      )}
                    </td>
                    <td className="p-6 text-center">
                      {row.quipli ? (
                        <Check className="text-green-600 mx-auto" size={24} />
                      ) : (
                        <X className="text-red-500 mx-auto" size={24} />
                      )}
                    </td>
                    <td className="p-6 text-center">
                      {row.renterra ? (
                        <Check className="text-green-600 mx-auto" size={24} />
                      ) : (
                        <X className="text-red-500 mx-auto" size={24} />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SECTION 7 — TRANSPARENCY STATEMENT */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-8">
            Pricing shouldn't be a mystery.
          </h2>
          <p className="text-xl text-slate-300 mb-8 leading-relaxed">
            Some platforms require sales calls just to understand cost.<br />
            Others lock you into pricing models before you know if the system fits.
          </p>
          <p className="text-2xl font-semibold text-cyan-400">
            KABBA shows you your options up front — so you can choose confidently.
          </p>
        </div>
      </section>

      {/* SECTION 8 — FAQ (PRICING) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-12">
            Common Questions
          </h2>
          <div className="space-y-6">
            {[
              {
                q: 'Do all pricing models include the same features?',
                a: 'Yes. The difference is how you pay, not what you get.'
              },
              {
                q: 'Which option should I start with?',
                a: 'Most businesses start with the flexible model and adjust as volume grows.'
              },
              {
                q: 'Can I change pricing models later?',
                a: 'Yes. KABBA is designed to evolve with your business.'
              }
            ].map((faq, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-8">
                <h3 className="text-xl font-bold text-white mb-3">
                  <span className="text-cyan-400">Q:</span> {faq.q}
                </h3>
                <p className="text-lg text-slate-300">
                  <span className="text-cyan-400 font-semibold">A:</span> {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 9 — FINAL CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Start with the model that fits your business today.
          </h2>
          <p className="text-2xl text-slate-300 mb-10 leading-relaxed">
            Begin with the $4.95 trial and choose pricing that aligns with how you operate now — and where you're headed next.
          </p>

          <button
            onClick={onStartTrial}
            className="bg-amber-500 hover:bg-amber-600 text-white px-12 py-6 rounded-lg font-bold text-2xl transition shadow-2xl hover:shadow-3xl inline-flex items-center group mb-4"
          >
            Start My $4.95 Trial
            <ArrowRight className="ml-3 group-hover:translate-x-1 transition" size={28} />
          </button>

          <p className="text-slate-400">
            No contracts • Cancel anytime • Only pay when you rent
          </p>
        </div>
      </section>
    </div>
  );
}
