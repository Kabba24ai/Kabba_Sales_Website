import { XCircle, RefreshCw, ArrowLeft, Mail } from 'lucide-react';

interface SetupCanceledProps {
  onRestartSetup: () => void;
  onBackToPricing: () => void;
}

export default function SetupCanceled({ onRestartSetup, onBackToPricing }: SetupCanceledProps) {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">

        <div className="max-w-2xl mx-auto">

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 border border-gray-700 mb-6">
              <XCircle className="w-8 h-8 text-gray-400" />
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold mb-3">
              Setup Canceled
            </h1>
            <p className="text-xl text-emerald-400 font-medium">
              No charge was made.
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 mb-8">
            <p className="text-lg text-gray-300 leading-relaxed mb-4">
              You have not been charged, and your trial has not been activated.
            </p>
            <p className="text-gray-300 leading-relaxed mb-6">
              If you decide to come back later, you can restart the setup anytime.
            </p>

            <div className="pt-6 border-t border-gray-800">
              <p className="text-sm text-gray-400 leading-relaxed">
                We only activate trials after a consultation time is confirmed — no surprises.
              </p>
            </div>
          </div>

          <div className="space-y-3 mb-8">
            <button
              onClick={onRestartSetup}
              className="w-full flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-4 px-6 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <RefreshCw className="w-5 h-5" />
              Restart Setup
            </button>

            <button
              onClick={onBackToPricing}
              className="w-full flex items-center justify-center gap-3 bg-gray-800 hover:bg-gray-750 text-gray-300 font-medium py-4 px-6 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Pricing
            </button>

            <a
              href="mailto:support@kabba.com"
              className="w-full flex items-center justify-center gap-2 text-gray-500 hover:text-gray-400 font-medium py-3 transition-colors text-sm"
            >
              <Mail className="w-4 h-4" />
              Contact Us
            </a>

            <a
              href="tel:6152896429"
              className="w-full flex items-center justify-center text-red-500 hover:text-red-400 font-bold py-2 transition-colors text-lg"
            >
              Call or Text Us: (615) 289-6429
            </a>
          </div>

          <div className="bg-gray-900/50 border border-gray-800/50 rounded-lg p-6 mb-8">
            <p className="text-sm text-gray-400 leading-relaxed text-center">
              We build rental websites and onboarding correctly the first time. If scheduling doesn't work right now, that's okay.
            </p>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-600">
              Transparent pricing • No contracts • Operator-built
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
