import { Loader2, CreditCard } from 'lucide-react';
import { useEffect, useState } from 'react';
import { SignupFormData } from './OnboardingSignup';
import { createCustomerWithPayment } from '../lib/payment-service';

interface ProcessingPaymentProps {
  formData: SignupFormData;
  onSuccess: () => void;
  onError: () => void;
}

export default function ProcessingPayment({ formData, onSuccess, onError }: ProcessingPaymentProps) {
  const [processingMessage, setProcessingMessage] = useState('Verifying payment information...');

  useEffect(() => {
    const processPayment = async () => {
      try {
        // Check if we have payment token data
        if (!formData.opaqueDataDescriptor || !formData.opaqueDataValue) {
          throw new Error('Payment information is missing');
        }

        setProcessingMessage('Creating your customer profile...');
        
        // Calculate scheduled date (consultation date)
        // Parse the consultation time to get the date
        const consultationDate = new Date(formData.consultationTime || Date.now());
        
        setProcessingMessage('Processing your $4.95 trial payment...');

        // Create customer profile, charge trial fee, and schedule future payment
        const paymentResult = await createCustomerWithPayment({
          opaqueDataDescriptor: formData.opaqueDataDescriptor,
          opaqueDataValue: formData.opaqueDataValue,
          customerInfo: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phoneNumber: formData.phoneNumber,
            businessName: formData.businessName,
          },
          billingAddress: {
            street: formData.billingStreet,
            city: formData.billingCity,
            state: formData.billingState,
            zip: formData.billingZip,
          },
          initialPaymentAmount: 4.95, // Trial fee
          scheduledDate: consultationDate.toISOString(),
          fullAmount: 397.00, // Full monthly amount to charge on consultation date
        });

        if (paymentResult.success) {
          setProcessingMessage('Payment successful! Setting up your account...');
          
          // Store customer profile IDs for future reference
          console.log('Customer Profile ID:', paymentResult.customerProfileId);
          console.log('Payment Profile ID:', paymentResult.paymentProfileId);
          console.log('Transaction ID:', paymentResult.transactionId);
          
          // TODO: Store these IDs in your database
          // - paymentResult.customerProfileId
          // - paymentResult.paymentProfileId
          // - paymentResult.transactionId
          // - consultationDate
          
          // TODO: Send welcome email with consultation details
          
          setTimeout(() => {
            onSuccess();
          }, 1500);
        } else {
          console.error('Payment failed:', paymentResult.error);
          onError();
        }
      } catch (error) {
        console.error('Payment processing error:', error);
        onError();
      }
    };

    // Start payment processing after a brief delay
    const timer = setTimeout(() => {
      processPayment();
    }, 1000);

    return () => clearTimeout(timer);
  }, [formData, onSuccess, onError]);

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
              {processingMessage}
            </h1>
            <p className="text-gray-400">
              Please don't close this window or press the back button.
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
            <span>Secure payment processing</span>
          </div>
        </div>
      </div>
    </div>
  );
}
