import { useState, FormEvent } from 'react';
import { Shield, Check, AlertCircle } from 'lucide-react';
import { validateCardNumber, validateExpiry, validateCVC, detectCardType } from '../lib/authorizenet';

interface OnboardingSignupProps {
  onComplete: (formData: SignupFormData) => void;
  onBack?: () => void;
  initialData?: Partial<SignupFormData>;
}

export interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  businessName: string;
  billingStreet: string;
  billingCity: string;
  billingState: string;
  billingZip: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  cardName: string;
  consultationTime?: string; // ISO date string for scheduled consultation
  // Authorize.Net payment token data
  opaqueDataDescriptor?: string;
  opaqueDataValue?: string;
  // API response data
  reference?: string;
  customerProfileId?: string;
  paymentProfileId?: string;
}

const US_STATES = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' },
];

export default function OnboardingSignup({ onComplete, onBack, initialData }: OnboardingSignupProps) {
  const [formData, setFormData] = useState<SignupFormData>({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    email: initialData?.email || '',
    phoneNumber: initialData?.phoneNumber || '',
    password: initialData?.password || '',
    businessName: initialData?.businessName || '',
    billingStreet: initialData?.billingStreet || '',
    billingCity: initialData?.billingCity || '',
    billingState: initialData?.billingState || '',
    billingZip: initialData?.billingZip || '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    cardName: initialData?.cardName || `${initialData?.firstName || ''} ${initialData?.lastName || ''}`.trim() || '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState<string>('');
  const [cardType, setCardType] = useState<string>('');
  const [cardErrors, setCardErrors] = useState({
    cardNumber: '',
    expiry: '',
    cvc: '',
  });
  const [apiValidationErrors, setApiValidationErrors] = useState<string[]>([]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setPaymentError('');
    setApiValidationErrors([]);

    // Validate card data before tokenization
    const errors = {
      cardNumber: '',
      expiry: '',
      cvc: '',
    };

    if (!validateCardNumber(formData.cardNumber)) {
      errors.cardNumber = 'Invalid card number';
    }

    if (!validateExpiry(formData.cardExpiry)) {
      errors.expiry = 'Invalid or expired date';
    }

    if (!validateCVC(formData.cardCvc, cardType)) {
      errors.cvc = 'Invalid CVC';
    }

    if (errors.cardNumber || errors.expiry || errors.cvc) {
      setCardErrors(errors);
      setIsSubmitting(false);
      return;
    }

    try {
      // Prepare the payload for the authorization API
      // For schedule_datetime, we use a placeholder (3 days from now) as the actual scheduling happens in the next step
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 3);
      const scheduleDatetime = futureDate.toISOString().slice(0, 19).replace('T', ' ');

      const payload = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone_number: formData.phoneNumber.replace(/\D/g, ''),
        email: formData.email,
        password: formData.password,
        business_name: formData.businessName,
        street_address: formData.billingStreet,
        city: formData.billingCity,
        state: formData.billingState,
        zip_code: formData.billingZip,
        card_name: formData.cardName,
        card_number: formData.cardNumber.replace(/\s/g, ''),
        expiry_date: formData.cardExpiry,
        cvc: formData.cardCvc,
        amount: 4.95,
        schedule_datetime: scheduleDatetime
      };

      const response = await fetch("https://s-api.kabba.ai/api/admin/v1/authorize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Success: move forward
        const completeFormData: SignupFormData = {
          ...formData,
          reference: result.data.reference,
          customerProfileId: result.data.customer_profile_id,
          paymentProfileId: result.data.payment_profile_id,
        };
        onComplete(completeFormData);
      } else if (response.status === 422) {
        // Validation failed
        const apiErrors = result.errors || {};
        const errorMessages: string[] = [];

        // Flatten all API errors into a single list
        Object.values(apiErrors).forEach((messages: any) => {
          if (Array.isArray(messages)) {
            errorMessages.push(...messages);
          } else if (typeof messages === 'string') {
            errorMessages.push(messages);
          }
        });

        setApiValidationErrors(errorMessages);

        const newCardErrors = { ...errors };

        if (apiErrors.card_number) newCardErrors.cardNumber = apiErrors.card_number[0];
        if (apiErrors.expiry_date) newCardErrors.expiry = apiErrors.expiry_date[0];
        if (apiErrors.cvc) newCardErrors.cvc = apiErrors.cvc[0];

        setCardErrors(newCardErrors);
        setPaymentError(result.message || 'Validation failed. Please check your information.');
        setIsSubmitting(false);
      } else {
        // Other errors
        throw new Error(result.message || 'Failed to process authorization');
      }
    } catch (error) {
      console.error('Authorization API error:', error);
      setPaymentError(
        error instanceof Error
          ? error.message
          : 'Unable to process payment information. Please check your card details and try again.'
      );
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof SignupFormData, value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };

      if (field === 'firstName' || field === 'lastName') {
        const firstName = field === 'firstName' ? value : prev.firstName;
        const lastName = field === 'lastName' ? value : prev.lastName;
        updated.cardName = `${firstName} ${lastName}`.trim();
      }

      return updated;
    });

    // Clear errors when user starts typing
    if (field === 'cardNumber' || field === 'cardExpiry' || field === 'cardCvc') {
      setCardErrors(prev => ({ ...prev, [field === 'cardExpiry' ? 'expiry' : field]: '' }));
      setPaymentError('');
      setApiValidationErrors([]);
    }

    // Detect card type
    if (field === 'cardNumber') {
      setCardType(detectCardType(value));
    }
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.slice(0, 19);
  };

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 3) {
      return cleaned;
    } else if (cleaned.length <= 6) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    } else {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {onBack && (
        <div className="border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <button
              onClick={onBack}
              className="text-gray-400 hover:text-gray-200 transition-colors text-sm"
            >
              ← Back to home
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">

          <div className="space-y-8">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight text-white">
                This is exactly how we'd start if we were opening a rental shop today.
              </h1>

              <div className="space-y-3 text-lg text-gray-300">
                <p>You're not booking a demo.</p>
                <p>You're not sitting through a sales pitch.</p>
                <p>You're starting with the same tools and strategies we used ourselves.</p>
              </div>
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-emerald-400">Here's what you're getting today for $4.95:</h2>
              <ul className="space-y-3">
                {[
                  'Full access to the KABBA platform',
                  'Transparent pricing — no hidden fees',
                  'No demos. No pressure. No sales reps',
                  'Software built inside a real rental shop',
                  'Access to our Rental Business Growth Consultation',
                  'Pay only when you rent — just $0.49 per transaction',
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-white">There's no risk here.</h2>
              <ul className="space-y-3">
                {[
                  'Cancel anytime',
                  'No contracts',
                  'No setup fees',
                  'No long-term commitment',
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-4 text-gray-400 leading-relaxed italic">
                If you don't rent anything, you don't pay transaction fees — and after your trial you pay only the $9.95 monthly fee unless you rent.
              </p>
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-white">Why we ask for a credit card</h2>
              <p className="text-gray-300 mb-4 leading-relaxed">
                We ask for a card for two simple reasons:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-gray-300 mb-4 ml-2">
                <li>To make sure we're working with serious rental businesses</li>
                <li>To securely process transactions when you actually rent equipment</li>
              </ol>
              <p className="text-gray-300 leading-relaxed">
                Your billing address (including ZIP code) is required for standard card security checks.
              </p>
              <p className="mt-4 text-emerald-400 font-medium">
                No surprise charges. No upfront fees. No games.
              </p>
            </div>

            <div className="bg-gray-800/50 border border-emerald-900/30 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-white">Built by rental operators who actually run a rental shop</h2>
              <p className="text-gray-300 mb-4 leading-relaxed">
                KABBA wasn't designed in a boardroom. It was built inside a real rental business that grew from zero to a multi-million-dollar, multi-location operation in under three years.
              </p>
              <p className="text-emerald-400 font-semibold">
                If it doesn't work in our shop, it doesn't ship.
              </p>
            </div>

            <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-white">What happens after you sign up</h2>
              <ol className="space-y-3">
                {[
                  'Create your account (about 2 minutes)',
                  'Explore the software immediately',
                  'Add your equipment and pricing',
                  'Schedule your Business Growth Consultation',
                  'Start running your rental shop with clarity and confidence',
                ].map((step, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-semibold">
                      {index + 1}
                    </span>
                    <span className="text-gray-300 pt-1">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="text-center lg:text-left pt-4">
              <p className="text-2xl text-gray-200 italic font-light">
                You don't need to be "ready." You just need to be willing to start.
              </p>
            </div>
          </div>

          <div className="lg:sticky lg:top-8 lg:self-start">
            <div className="bg-white rounded-2xl p-8 shadow-2xl">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Start Your $4.95 Trial
                </h2>
                <p className="text-gray-600">
                  Get instant access to everything
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">

                {paymentError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-semibold text-red-800 mb-1">Payment Error</h4>
                        <p className="text-sm text-red-700">{paymentError}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      First Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => handleChange('firstName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-gray-900"
                      placeholder="John"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Last Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => handleChange('lastName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-gray-900"
                      placeholder="Smith"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phoneNumber}
                    onChange={(e) => handleChange('phoneNumber', formatPhoneNumber(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-gray-900"
                    placeholder="(555) 123-4567"
                    maxLength={14}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-gray-900"
                    placeholder="john@rentalshop.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-gray-900"
                    placeholder="Create a secure password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Business Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.businessName}
                    onChange={(e) => handleChange('businessName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-gray-900"
                    placeholder="Your Rental Shop"
                  />
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">Billing Address</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700">
                        Street Address
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.billingStreet}
                        onChange={(e) => handleChange('billingStreet', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-gray-900"
                        placeholder="123 Main Street"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700">
                        City
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.billingCity}
                        onChange={(e) => handleChange('billingCity', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-gray-900"
                        placeholder="San Francisco"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">
                          State
                        </label>
                        <select
                          required
                          value={formData.billingState}
                          onChange={(e) => handleChange('billingState', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-gray-900"
                        >
                          <option value="" disabled>Select state</option>
                          {US_STATES.map((state) => (
                            <option key={state.code} value={state.code}>
                              {state.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">
                          ZIP Code
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={10}
                          value={formData.billingZip}
                          onChange={(e) => handleChange('billingZip', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-gray-900"
                          placeholder="94102"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">Card Information</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700">
                        Name on Card
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.cardName}
                        onChange={(e) => handleChange('cardName', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-gray-900"
                        placeholder="John Smith"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700">
                        Card Number
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={formData.cardNumber}
                          onChange={(e) => handleChange('cardNumber', formatCardNumber(e.target.value))}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-gray-900 ${cardErrors.cardNumber ? 'border-red-300' : 'border-gray-300'
                            }`}
                          placeholder="4242 4242 4242 4242"
                        />
                        {cardType && cardType !== 'Unknown' && (
                          <span className="absolute right-3 top-3 text-sm text-gray-500">{cardType}</span>
                        )}
                      </div>
                      {cardErrors.cardNumber && (
                        <p className="text-sm text-red-600 mt-1">{cardErrors.cardNumber}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.cardExpiry}
                          onChange={(e) => handleChange('cardExpiry', formatExpiry(e.target.value))}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-gray-900 ${cardErrors.expiry ? 'border-red-300' : 'border-gray-300'
                            }`}
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                        {cardErrors.expiry && (
                          <p className="text-sm text-red-600 mt-1">{cardErrors.expiry}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">
                          CVC
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={4}
                          value={formData.cardCvc}
                          onChange={(e) => handleChange('cardCvc', e.target.value.replace(/\D/g, ''))}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-gray-900 ${cardErrors.cvc ? 'border-red-300' : 'border-gray-300'
                            }`}
                          placeholder="123"
                        />
                        {cardErrors.cvc && (
                          <p className="text-sm text-red-600 mt-1">{cardErrors.cvc}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Securing payment...
                      </span>
                    ) : (
                      'Start My $4.95 Trial'
                    )}
                  </button>

                  {apiValidationErrors.length > 0 && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <ul className="list-disc list-inside space-y-1">
                          {apiValidationErrors.map((msg, i) => (
                            <li key={i} className="text-sm text-red-700">{msg}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  <p className="text-center text-sm text-gray-600 mt-4">
                    Secure checkout • Cancel anytime • No contracts
                  </p>

                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mt-6">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-emerald-700 font-medium">
                        Next Step: You'll choose your preferred consultation date & time.
                      </p>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
