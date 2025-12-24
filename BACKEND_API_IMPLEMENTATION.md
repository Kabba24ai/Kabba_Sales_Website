# Backend API Implementation for Payment Processing

## Overview

Your frontend now expects a backend API to handle payment processing with Authorize.Net. The payment flow is:

1. **Create customer profile** in Authorize.Net with payment method
2. **Charge initial $4.95 trial fee**
3. **Schedule future payment** of $397 on the consultation date

## Required Endpoint

### POST `/api/create-customer-with-payment`

This endpoint must:
- Create a customer profile in Authorize.Net
- Add the payment method to the profile
- Charge the initial trial fee ($4.95)
- Store the scheduled payment date for future processing

**Request Body:**
```json
{
  "opaqueDataDescriptor": "COMMON.ACCEPT.INAPP.PAYMENT",
  "opaqueDataValue": "eyJjb2RlIjoiNTBfMl8wNjAwMD...",
  "customerInfo": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phoneNumber": "555-1234",
    "businessName": "John's Shop"
  },
  "billingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zip": "10001"
  },
  "initialPaymentAmount": 4.95,
  "scheduledDate": "2025-12-27T14:00:00.000Z",
  "fullAmount": 397.00
}
```

**Success Response:**
```json
{
  "success": true,
  "customerProfileId": "123456",
  "paymentProfileId": "654321",
  "transactionId": "60218234567",
  "authCode": "ABC123",
  "message": "Customer created and payment processed successfully"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Transaction declined: Insufficient funds"
}
```

## Node.js/Express Implementation

### 1. Install Dependencies

```bash
npm install express authorizenet dotenv
```

### 2. Environment Variables

Create a `.env` file:

```env
AUTHORIZENET_API_LOGIN_ID=your_api_login_id
AUTHORIZENET_TRANSACTION_KEY=your_transaction_key
AUTHORIZENET_ENVIRONMENT=sandbox  # or 'production'
PORT=3000
```

### 3. Server Implementation

Create `server.js`:

```javascript
const express = require('express');
const ApiContracts = require('authorizenet').APIContracts;
const ApiControllers = require('authorizenet').APIControllers;
const SDKConstants = require('authorizenet').Constants;
require('dotenv').config();

const app = express();
app.use(express.json());

// Enable CORS for local development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://localhost:5173');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Set environment
const environment = process.env.AUTHORIZENET_ENVIRONMENT === 'production'
  ? SDKConstants.endpoint.production
  : SDKConstants.endpoint.sandbox;

/**
 * Create customer profile, charge initial payment, and store scheduled date
 */
app.post('/api/create-customer-with-payment', async (req, res) => {
  try {
    const {
      opaqueDataDescriptor,
      opaqueDataValue,
      customerInfo,
      billingAddress,
      initialPaymentAmount,
      scheduledDate,
      fullAmount,
    } = req.body;

    // Validate required fields
    if (!opaqueDataDescriptor || !opaqueDataValue || !initialPaymentAmount) {
      return res.status(400).json({
        success: false,
        error: 'Missing required payment information',
      });
    }

    // Create merchant authentication
    const merchantAuth = new ApiContracts.MerchantAuthenticationType();
    merchantAuth.setName(process.env.AUTHORIZENET_API_LOGIN_ID);
    merchantAuth.setTransactionKey(process.env.AUTHORIZENET_TRANSACTION_KEY);

    // Set opaque data (tokenized card)
    const opaqueData = new ApiContracts.OpaqueDataType();
    opaqueData.setDataDescriptor(opaqueDataDescriptor);
    opaqueData.setDataValue(opaqueDataValue);

    // Set payment profile
    const paymentType = new ApiContracts.PaymentType();
    paymentType.setOpaqueData(opaqueData);

    // Set billing address
    const billTo = new ApiContracts.CustomerAddressType();
    billTo.setFirstName(customerInfo.firstName);
    billTo.setLastName(customerInfo.lastName);
    billTo.setCompany(customerInfo.businessName);
    billTo.setAddress(billingAddress.street);
    billTo.setCity(billingAddress.city);
    billTo.setState(billingAddress.state);
    billTo.setZip(billingAddress.zip);
    billTo.setCountry('US');
    billTo.setPhoneNumber(customerInfo.phoneNumber);

    // Create payment profile
    const customerPaymentProfile = new ApiContracts.CustomerPaymentProfileType();
    customerPaymentProfile.setPayment(paymentType);
    customerPaymentProfile.setBillTo(billTo);

    // Create customer profile
    const customerProfile = new ApiContracts.CustomerProfileType();
    customerProfile.setMerchantCustomerId(`CUST-${Date.now()}`);
    customerProfile.setEmail(customerInfo.email);
    customerProfile.setDescription(\`\${customerInfo.firstName} \${customerInfo.lastName} - \${customerInfo.businessName}\`);
    customerProfile.setPaymentProfiles([customerPaymentProfile]);

    // Add custom fields for scheduled payment
    const userField1 = new ApiContracts.CustomerProfileExType();
    
    // Create profile request
    const createRequest = new ApiContracts.CreateCustomerProfileRequest();
    createRequest.setMerchantAuthentication(merchantAuth);
    createRequest.setProfile(customerProfile);
    createRequest.setValidationMode(ApiContracts.ValidationModeEnum.LIVEMODE);

    // Execute create profile
    const ctrl = new ApiControllers.CreateCustomerProfileController(createRequest.getJSON());
    ctrl.setEnvironment(environment);

    // Process the request
    await new Promise((resolve, reject) => {
      ctrl.execute(() => {
        const apiResponse = ctrl.getResponse();
        const response = new ApiContracts.CreateCustomerProfileResponse(apiResponse);

        if (response != null) {
          if (response.getMessages().getResultCode() === ApiContracts.MessageTypeEnum.OK) {
            const customerProfileId = response.getCustomerProfileId();
            const paymentProfileId = response.getCustomerPaymentProfileIdList().getNumericString()[0];

            console.log('Customer Profile Created:', customerProfileId);
            console.log('Payment Profile ID:', paymentProfileId);

            // Now charge the initial payment using the customer profile
            chargeCustomerProfile(
              merchantAuth,
              customerProfileId,
              paymentProfileId,
              initialPaymentAmount,
              'KABBA Trial Fee - $4.95'
            ).then((chargeResult) => {
              if (chargeResult.success) {
                // TODO: Store in your database:
                // - customerProfileId
                // - paymentProfileId
                // - scheduledDate
                // - fullAmount
                // - chargeResult.transactionId
                // - customerInfo
                
                console.log('Scheduled payment for:', scheduledDate);
                console.log('Amount to charge:', fullAmount);
                
                res.json({
                  success: true,
                  customerProfileId: customerProfileId,
                  paymentProfileId: paymentProfileId,
                  transactionId: chargeResult.transactionId,
                  authCode: chargeResult.authCode,
                  message: 'Customer created and initial payment processed successfully',
                });
              } else {
                res.json({
                  success: false,
                  error: chargeResult.error,
                });
              }
            }).catch((err) => {
              res.json({
                success: false,
                error: 'Failed to charge initial payment: ' + err.message,
              });
            });

            resolve();
          } else {
            const errors = response.getMessages().getMessage();
            const errorMessage = errors && errors.length > 0
              ? errors[0].getText()
              : 'Failed to create customer profile';
            
            res.json({
              success: false,
              error: errorMessage,
            });
            reject(new Error(errorMessage));
          }
        } else {
          res.json({
            success: false,
            error: 'No response from payment gateway',
          });
          reject(new Error('No response'));
        }
      });
    });

  } catch (error) {
    console.error('Customer creation error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    });
  }
});

/**
 * Charge a customer profile
 */
function chargeCustomerProfile(merchantAuth, customerProfileId, paymentProfileId, amount, description) {
  return new Promise((resolve, reject) => {
    // Set profile IDs
    const profileToCharge = new ApiContracts.CustomerProfilePaymentType();
    profileToCharge.setCustomerProfileId(customerProfileId);
    
    const paymentProfile = new ApiContracts.PaymentProfile();
    paymentProfile.setPaymentProfileId(paymentProfileId);
    profileToCharge.setPaymentProfile(paymentProfile);

    // Create transaction request
    const transactionRequest = new ApiContracts.TransactionRequestType();
    transactionRequest.setTransactionType(ApiContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION);
    transactionRequest.setProfile(profileToCharge);
    transactionRequest.setAmount(amount.toFixed(2));
    
    // Add line item
    const lineItem = new ApiContracts.LineItemType();
    lineItem.setItemId('TRIAL001');
    lineItem.setName(description);
    lineItem.setDescription(description);
    lineItem.setQuantity('1');
    lineItem.setUnitPrice(amount.toFixed(2));
    transactionRequest.setLineItems([lineItem]);

    // Create request
    const createRequest = new ApiContracts.CreateTransactionRequest();
    createRequest.setMerchantAuthentication(merchantAuth);
    createRequest.setTransactionRequest(transactionRequest);

    // Execute
    const ctrl = new ApiControllers.CreateTransactionController(createRequest.getJSON());
    ctrl.setEnvironment(environment);

    ctrl.execute(() => {
      const apiResponse = ctrl.getResponse();
      const response = new ApiContracts.CreateTransactionResponse(apiResponse);

      if (response != null) {
        if (response.getMessages().getResultCode() === ApiContracts.MessageTypeEnum.OK) {
          const transactionResponse = response.getTransactionResponse();
          
          if (transactionResponse.getMessages() != null) {
            resolve({
              success: true,
              transactionId: transactionResponse.getTransId(),
              authCode: transactionResponse.getAuthCode(),
            });
          } else {
            const errors = transactionResponse.getErrors();
            const errorMessage = errors && errors.getError().length > 0
              ? errors.getError()[0].getErrorText()
              : 'Transaction failed';
            reject(new Error(errorMessage));
          }
        } else {
          const errors = response.getTransactionResponse().getErrors();
          const errorMessage = errors && errors.getError().length > 0
            ? errors.getError()[0].getErrorText()
            : 'Transaction failed';
          reject(new Error(errorMessage));
        }
      } else {
        reject(new Error('No response from payment gateway'));
      }
    });
  });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

### 4. Start the Server

```bash
node server.js
```

### 5. Update Vite Proxy (Development)

Update your `vite.config.ts` to proxy API requests:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  }
})
```

## Scheduled Payment Processing

Create a cron job or scheduled task to check for payments due:

```javascript
// scheduled-payments.js
const cron = require('node-cron');

// Run every hour
cron.schedule('0 * * * *', async () => {
  console.log('Checking for scheduled payments...');
  
  // TODO: Query your database for payments due today
  // const duePayments = await db.getPaymentsDueToday();
  
  // For each payment due:
  // - Charge the customer profile
  // - Update payment status in database
  // - Send confirmation email
});
```

## Database Schema Suggestion

Store customer and payment information:

```sql
CREATE TABLE customers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  customer_profile_id VARCHAR(50) NOT NULL,
  payment_profile_id VARCHAR(50) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email VARCHAR(255),
  business_name VARCHAR(255),
  phone_number VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE scheduled_payments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  customer_id INT,
  scheduled_date DATETIME,
  amount DECIMAL(10,2),
  status ENUM('pending', 'completed', 'failed'),
  transaction_id VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  processed_at TIMESTAMP NULL,
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);
```

## Testing

Use Authorize.Net test cards:
- **Visa:** 4007000000027
- **Mastercard:** 5424000000000015
- **Amex:** 370000000000002

Expiry: Any future date
CVV: Any 3-4 digits

## Production Checklist

- [ ] Change `AUTHORIZENET_ENVIRONMENT` to `production`
- [ ] Update API credentials with production keys
- [ ] Set up SSL certificate for backend API
- [ ] Implement proper logging and monitoring
- [ ] Set up scheduled payment processing
- [ ] Implement email notifications
- [ ] Add database backups
- [ ] Test error handling thoroughly
