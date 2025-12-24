// Authorize.Net Configuration and Helper Functions

// TypeScript declarations for Accept.js
declare global {
  interface Window {
    Accept: {
      dispatchData: (
        secureData: SecureDataRequest,
        responseHandler: (response: AcceptResponse) => void
      ) => void;
    };
  }
}

export interface SecureDataRequest {
  authData: {
    clientKey: string;
    apiLoginID: string;
  };
  cardData: {
    cardNumber: string;
    month: string;
    year: string;
    cardCode: string;
    fullName?: string;
    zip?: string;
  };
}

export interface AcceptResponse {
  messages: {
    resultCode: 'Ok' | 'Error';
    message: Array<{
      code: string;
      text: string;
    }>;
  };
  opaqueData?: {
    dataDescriptor: string;
    dataValue: string;
  };
}

// Authorize.Net API Configuration
export const AUTHORIZENET_CONFIG = {
  // Use test environment by default - change to production URL when ready
  apiLoginID: import.meta.env.VITE_AUTHORIZENET_API_LOGIN_ID || '',
  clientKey: import.meta.env.VITE_AUTHORIZENET_CLIENT_KEY || '',
  apiEndpoint: import.meta.env.VITE_AUTHORIZENET_API_ENDPOINT || 'https://apitest.authorize.net/xml/v1/request.api',
};

/**
 * Tokenize card data using Authorize.Net Accept.js
 * This securely sends card data directly to Authorize.Net and returns a token
 */
export const tokenizeCardData = (
  cardNumber: string,
  expiry: string,
  cvc: string,
  cardName: string,
  zip: string
): Promise<AcceptResponse> => {
  return new Promise((resolve, reject) => {
    // Validate Accept.js is loaded
    if (!window.Accept) {
      reject(new Error('Authorize.Net Accept.js library not loaded'));
      return;
    }

    // Validate configuration
    if (!AUTHORIZENET_CONFIG.apiLoginID || !AUTHORIZENET_CONFIG.clientKey) {
      reject(new Error('Authorize.Net credentials not configured'));
      return;
    }

    // Parse expiry date (MM/YY format)
    const [month, year] = expiry.split('/');
    if (!month || !year || month.length !== 2 || year.length !== 2) {
      reject(new Error('Invalid expiry date format. Use MM/YY'));
      return;
    }

    // Remove spaces from card number
    const cleanCardNumber = cardNumber.replace(/\s/g, '');

    // Prepare secure data request
    const secureData: SecureDataRequest = {
      authData: {
        clientKey: AUTHORIZENET_CONFIG.clientKey,
        apiLoginID: AUTHORIZENET_CONFIG.apiLoginID,
      },
      cardData: {
        cardNumber: cleanCardNumber,
        month: month,
        year: '20' + year, // Convert YY to YYYY
        cardCode: cvc,
        fullName: cardName,
        zip: zip,
      },
    };

    // Dispatch data to Authorize.Net
    window.Accept.dispatchData(secureData, (response) => {
      if (response.messages.resultCode === 'Ok') {
        resolve(response);
      } else {
        const errorMessage = response.messages.message
          .map((msg) => msg.text)
          .join(', ');
        reject(new Error(errorMessage || 'Payment tokenization failed'));
      }
    });
  });
};

/**
 * Validate card number using Luhn algorithm
 */
export const validateCardNumber = (cardNumber: string): boolean => {
  const cleaned = cardNumber.replace(/\s/g, '');
  if (!/^\d+$/.test(cleaned)) return false;
  
  let sum = 0;
  let isEven = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};

/**
 * Detect card type from card number
 */
export const detectCardType = (cardNumber: string): string => {
  const cleaned = cardNumber.replace(/\s/g, '');
  
  if (/^4/.test(cleaned)) return 'Visa';
  if (/^5[1-5]/.test(cleaned)) return 'Mastercard';
  if (/^3[47]/.test(cleaned)) return 'American Express';
  if (/^6(?:011|5)/.test(cleaned)) return 'Discover';
  
  return 'Unknown';
};

/**
 * Validate expiry date
 */
export const validateExpiry = (expiry: string): boolean => {
  const [month, year] = expiry.split('/');
  if (!month || !year || month.length !== 2 || year.length !== 2) return false;
  
  const monthNum = parseInt(month, 10);
  const yearNum = parseInt('20' + year, 10);
  
  if (monthNum < 1 || monthNum > 12) return false;
  
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  
  if (yearNum < currentYear) return false;
  if (yearNum === currentYear && monthNum < currentMonth) return false;
  
  return true;
};

/**
 * Validate CVC/CVV
 */
export const validateCVC = (cvc: string, cardType?: string): boolean => {
  if (!/^\d+$/.test(cvc)) return false;
  
  // American Express uses 4-digit CVC
  if (cardType === 'American Express') {
    return cvc.length === 4;
  }
  
  return cvc.length === 3 || cvc.length === 4;
};
