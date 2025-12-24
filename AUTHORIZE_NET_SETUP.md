# Authorize.Net Trial Signup Integration - Setup Guide

## Overview

The trial signup flow now integrates with Authorize.Net for secure payment processing. When users sign up for the $4.95 trial, their credit card information is tokenized client-side using Accept.js and processed server-side using the Authorize.Net API.

## What's Been Implemented

### Frontend Changes

1. **Accept.js Integration** ([index.html](index.html))
   - Added Authorize.Net Accept.js library for secure tokenization
   - Currently using test environment (sandbox)

2. **Authorize.Net Configuration** ([src/lib/authorizenet.ts](src/lib/authorizenet.ts))
   - TypeScript interfaces for Accept.js
   - Card tokenization function
   - Card validation utilities (Luhn algorithm, expiry validation, CVC validation)
   - Card type detection

3. **Payment Service** ([src/lib/payment-service.ts](src/lib/payment-service.ts))
   - API client functions for backend communication
   - Charge payment endpoint integration
   - Customer profile creation

4. **Enhanced Signup Form** ([src/components/OnboardingSignup.tsx](src/components/OnboardingSignup.tsx))
   - Real-time card validation with visual feedback
   - Card type detection (Visa, Mastercard, Amex, Discover)
   - Secure client-side tokenization before submission
   - Error handling for payment issues
   - No sensitive card data is sent to your server

5. **Payment Processing Screen** ([src/components/ProcessingPayment.tsx](src/components/ProcessingPayment.tsx))
   - Real payment processing with Authorize.Net
   - Dynamic status messages
   - Proper error handling

## Setup Instructions

### 1. Get Authorize.Net Credentials

#### For Testing (Sandbox):
1. Create a test account at [Authorize.Net Sandbox](https://developer.authorize.net/hello_world/sandbox/)
2. Log into the sandbox merchant interface
3. Navigate to **Account** → **Security Settings** → **API Credentials & Keys**
4. Get your:
   - API Login ID
   - Public Client Key (for Accept.js)
   - Transaction Key (for backend only)

#### For Production:
1. Sign up for an Authorize.Net merchant account
2. Navigate to **Account** → **Security Settings** → **API Credentials & Keys**
3. Generate production credentials

### 2. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Update the values in `.env`:

```env
# Authorize.Net Test Credentials
VITE_AUTHORIZENET_API_LOGIN_ID=your_sandbox_api_login_id
VITE_AUTHORIZENET_CLIENT_KEY=your_sandbox_public_client_key
VITE_AUTHORIZENET_API_ENDPOINT=https://apitest.authorize.net/xml/v1/request.api
```

> **Important:** The API Login ID and Client Key are safe to expose in the frontend because they're used only for tokenization. Your Transaction Key must NEVER be exposed and should only be stored on your backend server.

### 3. Set Up Backend API

You need to create backend API endpoints to process the payments. See [AUTHORIZE_NET_BACKEND.md](AUTHORIZE_NET_BACKEND.md) for detailed implementation guide.

Required endpoints:
- `POST /api/charge-payment` - Process one-time payment
- `POST /api/create-customer-profile` - Create customer profile for recurring billing

### 4. Test the Integration

#### Test Card Numbers (Sandbox Only):

**Successful Transactions:**
- Card: `4111 1111 1111 1111`
- Expiry: Any future date (e.g., `12/25`)
- CVC: Any 3 digits (e.g., `123`)

**Declined Transaction:**
- Card: `4000 0000 0000 0002`
- Expiry: Any future date
- CVC: Any 3 digits

**Other Test Cards:**
- Mastercard: `5424 0000 0000 0015`
- American Express: `3782 822463 10005`
- Discover: `6011 0000 0000 0012`

### 5. Frontend Testing Without Backend

If you want to test the frontend tokenization without a backend:

1. Open browser console
2. Fill out the signup form
3. The card will be tokenized and you'll see the token in the console
4. The payment processing will fail gracefully (expected without backend)

## Payment Flow

```
1. User enters signup information + card details
   ↓
2. Form validation (card number, expiry, CVC)
   ↓
3. Accept.js tokenizes card data (client-side, secure)
   ↓
4. Token sent to your backend (NO card data sent)
   ↓
5. Backend processes payment with Authorize.Net
   ↓
6. Success: User account created, consultation scheduled
   Failure: User shown error, can retry
```

## Security Features

✅ **PCI Compliance:** Card data never touches your server
✅ **Tokenization:** Accept.js securely tokenizes all card data
✅ **Validation:** Real-time card validation before submission
✅ **HTTPS Required:** All API calls must use HTTPS
✅ **Error Handling:** Secure error messages without exposing sensitive data

## Going to Production

### Frontend Changes:

1. Update [index.html](index.html) - Change Accept.js URL:
   ```html
   <!-- Change from: -->
   <script src="https://jstest.authorize.net/v1/Accept.js"></script>
   
   <!-- To: -->
   <script src="https://js.authorize.net/v1/Accept.js"></script>
   ```

2. Update `.env`:
   ```env
   VITE_AUTHORIZENET_API_LOGIN_ID=production_api_login_id
   VITE_AUTHORIZENET_CLIENT_KEY=production_public_client_key
   VITE_AUTHORIZENET_API_ENDPOINT=https://api.authorize.net/xml/v1/request.api
   ```

### Backend Changes:

1. Update environment variables to use production credentials
2. Change API endpoint to production
3. Ensure SSL/HTTPS is properly configured
4. Test with real test transactions in production mode

## Troubleshooting

### "Authorize.Net Accept.js library not loaded"
- Check that Accept.js script is loaded in [index.html](index.html)
- Verify your internet connection
- Check browser console for script loading errors

### "Authorize.Net credentials not configured"
- Verify `.env` file exists and has correct values
- Restart development server after changing `.env`
- Check that variable names match exactly

### "Payment tokenization failed"
- Verify credentials are for the correct environment (sandbox vs production)
- Check that Public Client Key (not Transaction Key) is being used
- Verify card number passes Luhn validation

### API endpoint returns 404
- Backend endpoints need to be implemented (see [AUTHORIZE_NET_BACKEND.md](AUTHORIZE_NET_BACKEND.md))
- Check that backend server is running
- Verify API endpoint URLs match your backend

## File Structure

```
src/
├── lib/
│   ├── authorizenet.ts          # Accept.js integration & card validation
│   └── payment-service.ts       # Backend API client
├── components/
│   ├── OnboardingSignup.tsx     # Signup form with payment
│   └── ProcessingPayment.tsx    # Payment processing screen
index.html                        # Accept.js script inclusion
.env                             # Environment variables (gitignored)
.env.example                     # Example environment file
AUTHORIZE_NET_BACKEND.md         # Backend implementation guide
AUTHORIZE_NET_SETUP.md           # This file
```

## Additional Resources

- [Authorize.Net Developer Portal](https://developer.authorize.net/)
- [Accept.js Integration Guide](https://developer.authorize.net/api/reference/features/acceptjs.html)
- [Authorize.Net Sandbox](https://sandbox.authorize.net/)
- [PCI Compliance Information](https://www.pcisecuritystandards.org/)

## Support

For Authorize.Net specific issues:
- [Authorize.Net Support](https://support.authorize.net/)
- [Developer Forum](https://community.developer.authorize.net/)

## Next Steps

1. ✅ Get Authorize.Net sandbox credentials
2. ✅ Configure `.env` file
3. ⏳ Implement backend API endpoints
4. ⏳ Test with sandbox
5. ⏳ Implement customer account creation in database
6. ⏳ Set up recurring billing (optional)
7. ⏳ Get production credentials
8. ⏳ Deploy and test in production
