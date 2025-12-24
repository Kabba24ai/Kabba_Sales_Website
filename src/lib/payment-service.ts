// Authorize.Net Payment Service
// This handles payment processing using Authorize.Net API

export interface CreateSubscriptionRequest {
  opaqueDataDescriptor: string;
  opaqueDataValue: string;
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    businessName: string;
  };
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  subscriptionAmount: number;
  subscriptionName: string;
}

export interface CreateSubscriptionResponse {
  success: boolean;
  subscriptionId?: string;
  transactionId?: string;
  message?: string;
  error?: string;
}

/**
 * Create a subscription using Authorize.Net ARB (Automatic Recurring Billing)
 * This should be called from your backend API to keep API credentials secure
 */
export const createSubscription = async (
  request: CreateSubscriptionRequest
): Promise<CreateSubscriptionResponse> => {
  try {
    // This would call your backend API endpoint
    // The backend will use the Authorize.Net SDK to create the subscription
    const response = await fetch('/create-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Failed to create subscription');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Subscription creation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

/**
 * Charge a one-time payment using Authorize.Net
 */
export interface ChargePaymentRequest {
  opaqueDataDescriptor: string;
  opaqueDataValue: string;
  amount: number;
  description: string;
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    businessName?: string;
  };
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
}

export interface ChargePaymentResponse {
  success: boolean;
  transactionId?: string;
  authCode?: string;
  message?: string;
  error?: string;
}

/**
 * Process a one-time payment
 * Note: This requires a backend API endpoint at /api/charge-payment
 */
export const chargePayment = async (
  request: ChargePaymentRequest
): Promise<ChargePaymentResponse> => {
  try {
    // Call backend API endpoint
    const response = await fetch('/api/charge-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to process payment');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Payment processing error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

/**
 * Create customer profile in Authorize.Net with payment method
 */
export interface CreateCustomerProfileRequest {
  opaqueDataDescriptor: string;
  opaqueDataValue: string;
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    businessName: string;
  };
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
}

export interface CreateCustomerProfileResponse {
  success: boolean;
  customerProfileId?: string;
  paymentProfileId?: string;
  message?: string;
  error?: string;
}

/**
 * Create customer profile with payment method for future billing
 * Note: This requires a backend API endpoint at /api/create-customer-profile
 */
export const createCustomerProfile = async (
  request: CreateCustomerProfileRequest
): Promise<CreateCustomerProfileResponse> => {
  try {
    const response = await fetch('/api/create-customer-profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to create customer profile');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Customer profile creation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

/**
 * Create customer profile and process initial payment with scheduled future billing
 */
export interface CreateCustomerWithPaymentRequest {
  opaqueDataDescriptor: string;
  opaqueDataValue: string;
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    businessName: string;
  };
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  initialPaymentAmount: number;
  scheduledDate: string; // ISO date string for when to charge full amount
  fullAmount: number;
}

export interface CreateCustomerWithPaymentResponse {
  success: boolean;
  customerProfileId?: string;
  paymentProfileId?: string;
  transactionId?: string;
  authCode?: string;
  message?: string;
  error?: string;
}

/**
 * Create customer profile, charge initial fee, and schedule future payment
 * Note: This requires a backend API endpoint at /api/create-customer-with-payment
 */
export const createCustomerWithPayment = async (
  request: CreateCustomerWithPaymentRequest
): Promise<CreateCustomerWithPaymentResponse> => {
  try {
    const response = await fetch('/api/create-customer-with-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to process payment and create customer');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Customer and payment creation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
