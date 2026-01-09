import { ArrowLeft, Lock, CreditCard } from 'lucide-react';

interface SignupTrialProps {
  onBack: () => void;
}

export default function SignupTrial({ onBack }: SignupTrialProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="text-white space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                This is exactly how we'd start if we were opening a rental shop today.
              </h1>
              <p className="text-xl text-slate-300 leading-relaxed">
                Full access to the software for just $4.95. No demos, no sales reps, no hidden pricing.
              </p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
              <h3 className="text-xl font-semibold text-cyan-400">What's Included</h3>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-start">
                  <span className="text-cyan-400 mr-2">✓</span>
                  <span>Full platform access for complete exploration</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-400 mr-2">✓</span>
                  <span>Pay only when you rent - $0.49 per transaction</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-400 mr-2">✓</span>
                  <span>Access to Rental Business Growth Consultation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-400 mr-2">✓</span>
                  <span>Built by real rental shop owners who understand your business</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Zero Risk Guarantee</h3>
              <div className="grid sm:grid-cols-2 gap-4 text-slate-300">
                <div className="flex items-center">
                  <span className="text-cyan-400 mr-2">•</span>
                  <span>Cancel anytime</span>
                </div>
                <div className="flex items-center">
                  <span className="text-cyan-400 mr-2">•</span>
                  <span>No contracts</span>
                </div>
                <div className="flex items-center">
                  <span className="text-cyan-400 mr-2">•</span>
                  <span>No setup fees</span>
                </div>
                <div className="flex items-center">
                  <span className="text-cyan-400 mr-2">•</span>
                  <span>No long-term commitment</span>
                </div>
              </div>
              <p className="mt-4 text-slate-400 italic">
                If you don't rent anything, you don't pay us anything beyond the $4.95 trial.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center">
                <Lock className="w-5 h-5 mr-2 text-cyan-400" />
                Why We Need Your Card
              </h3>
              <p className="text-slate-300 leading-relaxed">
                We require a credit card and billing address (including ZIP code) for security and transaction processing. This helps us verify your identity and ensure a smooth experience. There are no surprise charges - you'll always know exactly what you're paying for.
              </p>
            </div>

            <div className="bg-slate-800/50 border border-cyan-900/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">Built by Operators, For Operators</h3>
              <p className="text-slate-300 leading-relaxed">
                KABBA was built inside a real rental business that grew from zero to a multi-million-dollar, multi-location operation. Every feature you see was battle-tested in real-world conditions.
              </p>
              <p className="text-cyan-400 font-semibold mt-4">
                If it doesn't work in our shop, it doesn't ship.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">What Happens Next</h3>
              <ol className="space-y-3 text-slate-300">
                {[
                  'Create your account instantly',
                  'Explore the software immediately',
                  'Add your equipment and pricing',
                  'Schedule your Business Growth Consultation',
                  'Start running your rental shop confidently'
                ].map((step, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="flex-shrink-0 w-8 h-8 bg-cyan-400/20 text-cyan-400 rounded-full flex items-center justify-center mr-3 font-semibold">
                      {idx + 1}
                    </span>
                    <span className="pt-1">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="text-center lg:text-left pt-4">
              <p className="text-2xl text-slate-200 italic font-light">
                You don't need to be "ready." You just need to be willing to start.
              </p>
            </div>
          </div>

          <div className="lg:sticky lg:top-24">
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">
                  Start Your $4.95 Trial
                </h2>
                <p className="text-slate-600">
                  Get instant access to everything
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-semibold text-slate-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                      placeholder="John"
                    />
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-semibold text-slate-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                      placeholder="Smith"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-semibold text-slate-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                    placeholder="Create a secure password"
                  />
                </div>

                <div className="border-t border-slate-200 pt-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Billing Address</h3>

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="street" className="block text-sm font-semibold text-slate-700 mb-2">
                        Street Address
                      </label>
                      <input
                        type="text"
                        id="street"
                        name="street"
                        required
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                        placeholder="123 Main Street"
                      />
                    </div>

                    <div>
                      <label htmlFor="city" className="block text-sm font-semibold text-slate-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        required
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                        placeholder="San Francisco"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="state" className="block text-sm font-semibold text-slate-700 mb-2">
                          State
                        </label>
                        <input
                          type="text"
                          id="state"
                          name="state"
                          required
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                          placeholder="CA"
                        />
                      </div>
                      <div>
                        <label htmlFor="zip" className="block text-sm font-semibold text-slate-700 mb-2">
                          ZIP Code
                        </label>
                        <input
                          type="text"
                          id="zip"
                          name="zip"
                          required
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                          placeholder="94102"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                    <CreditCard className="w-5 h-5 mr-2 text-cyan-600" />
                    Payment Information
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="cardNumber" className="block text-sm font-semibold text-slate-700 mb-2">
                        Card Number
                      </label>
                      <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        required
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                        placeholder="1234 5678 9012 3456"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="expiry" className="block text-sm font-semibold text-slate-700 mb-2">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          id="expiry"
                          name="expiry"
                          required
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                          placeholder="MM/YY"
                        />
                      </div>
                      <div>
                        <label htmlFor="cvc" className="block text-sm font-semibold text-slate-700 mb-2">
                          CVC
                        </label>
                        <input
                          type="text"
                          id="cvc"
                          name="cvc"
                          required
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                          placeholder="123"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-cyan-600 hover:to-cyan-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Start My $4.95 Trial
                </button>

                <div className="flex items-center justify-center space-x-4 text-sm text-slate-600">
                  <span className="flex items-center">
                    <Lock className="w-4 h-4 mr-1" />
                    Secure checkout
                  </span>
                  <span>•</span>
                  <span>Cancel anytime</span>
                  <span>•</span>
                  <span>No contracts</span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
