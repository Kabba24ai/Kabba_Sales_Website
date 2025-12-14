import { AlertCircle, CreditCard, MapPin, Phone, RefreshCw } from 'lucide-react';

interface PaymentErrorProps {
  onRetry: () => void;
  onCancel: () => void;
}

export default function PaymentError({ onRetry, onCancel }: PaymentErrorProps) {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center">
              <AlertCircle className="w-12 h-12 text-red-500" />
            </div>
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Payment Processing Issue
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            We encountered a problem while processing your credit card
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-6 text-white">Please check the following and resubmit:</h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">MOST COMMON</span>
                    Billing Address Mismatch
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    The billing address you submitted must exactly match the billing address on file with your credit or debit card issuer.
                    Even small differences like abbreviations, apartment numbers, or ZIP code variations can cause the payment to be declined.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">
                    Card Status & Authorization
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Contact your bank or credit card company to ensure:
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-gray-400">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-1">•</span>
                      <span>Your card is still active and not expired</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-1">•</span>
                      <span>Your card is authorized for new online transactions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-1">•</span>
                      <span>You have sufficient available credit or funds</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-1">•</span>
                      <span>There are no fraud holds or security blocks on your card</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <CreditCard className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-white mb-2">Alternative Payment Method</h3>
                <p className="text-gray-400 text-sm">
                  If the issue persists, you may want to try a different credit or debit card.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onRetry}
              className="flex-1 flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-4 px-6 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <RefreshCw className="w-5 h-5" />
              Try Again
            </button>

            <button
              onClick={onCancel}
              className="flex-1 bg-gray-800 hover:bg-gray-750 text-gray-300 font-semibold py-4 px-6 rounded-lg transition-colors"
            >
              Cancel Setup
            </button>
          </div>

          <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-4">
            <p className="text-sm text-cyan-400 text-center">
              Need help? Contact our support team and we'll assist you with getting set up.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
