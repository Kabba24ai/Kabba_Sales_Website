// Authorize.Net Accept.js helpers and client-side card validators.
//
// Card data goes from the browser straight to Authorize.Net via Accept.js.
// Nothing in this module talks to Kabba's servers.

// TypeScript declarations for Accept.js
declare global {
  interface Window {
    Accept?: {
      dispatchData: (
        secureData: SecureDataRequest,
        responseHandler: (response: AcceptResponse) => void,
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
    resultCode: "Ok" | "Error";
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

export interface AcceptAuth {
  apiLoginID: string;
  clientKey: string;
}

export interface CardInput {
  cardNumber: string;
  /** MM/YY */
  expiry: string;
  cvc: string;
  fullName?: string;
  zip?: string;
}

export interface OpaqueToken {
  dataDescriptor: string;
  dataValue: string;
}

const loaders = new Map<string, Promise<void>>();

/**
 * Load Accept.js at runtime from the URL the checkout config hands us.
 * Idempotent: repeated calls for the same URL share one script tag.
 */
export const loadAcceptJs = (scriptUrl: string): Promise<void> => {
  if (window.Accept) return Promise.resolve();

  const existing = loaders.get(scriptUrl);
  if (existing) return existing;

  const loader = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = scriptUrl;
    script.async = true;
    script.setAttribute("charset", "utf-8");
    script.onload = () => {
      if (window.Accept) {
        resolve();
      } else {
        loaders.delete(scriptUrl);
        reject(new Error("The secure payment library loaded but is unavailable."));
      }
    };
    script.onerror = () => {
      loaders.delete(scriptUrl);
      script.remove();
      reject(new Error("Could not load the secure payment library. Please try again."));
    };
    document.head.appendChild(script);
  });

  loaders.set(scriptUrl, loader);
  return loader;
};

/**
 * Tokenize card data using Authorize.Net Accept.js.
 * The card is sent directly to Authorize.Net; only the opaque token comes back.
 */
export const tokenizeCardData = (
  auth: AcceptAuth,
  card: CardInput,
): Promise<OpaqueToken> => {
  return new Promise((resolve, reject) => {
    if (!window.Accept) {
      reject(new Error("The secure payment library is not loaded yet. Please try again."));
      return;
    }

    if (!auth.apiLoginID || !auth.clientKey) {
      reject(new Error("Payment configuration is missing. Please refresh and try again."));
      return;
    }

    // Parse expiry date (MM/YY format)
    const [month, year] = card.expiry.split("/");
    if (!month || !year || month.length !== 2 || year.length !== 2) {
      reject(new Error("Invalid expiry date format. Use MM/YY"));
      return;
    }

    const secureData: SecureDataRequest = {
      authData: {
        clientKey: auth.clientKey,
        apiLoginID: auth.apiLoginID,
      },
      cardData: {
        cardNumber: card.cardNumber.replace(/\s/g, ""),
        month,
        year: "20" + year, // Convert YY to YYYY
        cardCode: card.cvc,
        ...(card.fullName ? { fullName: card.fullName } : {}),
        ...(card.zip ? { zip: card.zip } : {}),
      },
    };

    window.Accept.dispatchData(secureData, (response) => {
      if (response.messages.resultCode === "Ok" && response.opaqueData) {
        resolve({
          dataDescriptor: response.opaqueData.dataDescriptor,
          dataValue: response.opaqueData.dataValue,
        });
      } else {
        const errorMessage = response.messages.message
          .map((msg) => msg.text)
          .join(", ");
        reject(new Error(errorMessage || "Payment tokenization failed"));
      }
    });
  });
};

/**
 * Validate card number using Luhn algorithm
 */
export const validateCardNumber = (cardNumber: string): boolean => {
  const cleaned = cardNumber.replace(/\s/g, "");
  if (!/^\d+$/.test(cleaned)) return false;
  if (cleaned.length < 12 || cleaned.length > 19) return false;

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
  const cleaned = cardNumber.replace(/\s/g, "");

  if (/^4/.test(cleaned)) return "Visa";
  if (/^5[1-5]/.test(cleaned)) return "Mastercard";
  if (/^3[47]/.test(cleaned)) return "American Express";
  if (/^6(?:011|5)/.test(cleaned)) return "Discover";

  return "Unknown";
};

/**
 * Validate expiry date
 */
export const validateExpiry = (expiry: string): boolean => {
  const [month, year] = expiry.split("/");
  if (!month || !year || month.length !== 2 || year.length !== 2) return false;

  const monthNum = parseInt(month, 10);
  const yearNum = parseInt("20" + year, 10);

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
  if (cardType === "American Express") {
    return cvc.length === 4;
  }

  return cvc.length === 3 || cvc.length === 4;
};
