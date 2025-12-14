import { Loader2, CreditCard } from 'lucide-react';
import { useEffect } from 'react';

interface ProcessingPaymentProps {
  onSuccess: () => void;
  onError: () => void;
}

export default function ProcessingPayment({ onSuccess, onError }: ProcessingPaymentProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      const success = Math.random() > 0.3;
      if (success) {
        onSuccess();
      } else {
        onError();
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [onSuccess, onError]);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center space-y-8">
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-cyan-500/20 flex items-center justify-center">
                <CreditCard className="w-12 h-12 text-cyan-500" />
              </div>
              <div className="absolute -bottom-2 -right-2">
                <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center border border-gray-800">
                  <Loader2 className="w-6 h-6 text-cyan-500 animate-spin" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-white">
              Processing your trial subscription now
            </h1>
            <p className="text-gray-400">
              Please wait while we process your payment and activate your account.
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
            <span>This usually takes just a few seconds</span>
          </div>
        </div>
      </div>
    </div>
  );
}
