import { Loader2, CreditCard } from 'lucide-react';
import { useEffect } from 'react';
import { SignupFormData } from './OnboardingSignup';
import { supabase } from '../lib/supabase';

interface ProcessingPaymentProps {
  formData: SignupFormData;
  consultationTime: string;
  onSuccess: () => void;
  onError: () => void;
}

export default function ProcessingPayment({ formData, consultationTime, onSuccess, onError }: ProcessingPaymentProps) {
  useEffect(() => {
    const processPayment = async () => {
      const cleanCardNumber = formData.cardNumber.replace(/\s/g, '');
      const isTestCard = cleanCardNumber === '4242424242424242' &&
                        formData.cardExpiry === '10/29' &&
                        formData.cardCvc === '123';

      if (!isTestCard) {
        onError();
        return;
      }

      try {
        const { error: insertError } = await supabase
          .from('signups')
          .insert({
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone_number: formData.phoneNumber,
            business_name: formData.businessName,
            billing_street: formData.billingStreet,
            billing_city: formData.billingCity,
            billing_state: formData.billingState,
            billing_zip: formData.billingZip,
            consultation_time: consultationTime,
            status: 'trial'
          });

        if (insertError) {
          console.error('Failed to save signup:', insertError);
          onError();
          return;
        }

        onSuccess();
      } catch (error) {
        console.error('Error processing payment:', error);
        onError();
      }
    };

    const timer = setTimeout(processPayment, 3000);

    return () => clearTimeout(timer);
  }, [formData, consultationTime, onSuccess, onError]);

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
