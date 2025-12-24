# Authorize.Net Backend API Implementation Guide

This guide explains how to implement the backend API endpoints for processing Authorize.Net payments.

## Overview

The frontend uses Authorize.Net Accept.js to securely tokenize credit card information. The tokenized data (opaque data) is then sent to your backend API, which processes the actual payment transaction.

## Required NPM Package

Install the official Authorize.Net SDK for Node.js:

```bash
npm install authorizenet
```

## Environment Variables (Backend)

Store these securely on your backend server (DO NOT expose these in the frontend):

```
AUTHORIZENET_API_LOGIN_ID=your_api_login_id
AUTHORIZENET_TRANSACTION_KEY=your_transaction_key
AUTHORIZENET_ENVIRONMENT=sandbox  # or 'production'
```

## API Endpoint: Charge Payment

**Endpoint:** `POST /api/charge-payment`

**Purpose:** Process a one-time payment (e.g., $4.95 trial fee)

### Example Implementation (Node.js/Express)

```javascript
const express = require('express');
const ApiContracts = require('authorizenet').APIContracts;
const ApiControllers = require('authorizenet').APIControllers;
const SDKConstants = require('authorizenet').Constants;

const router = express.Router();

// Set the environment
const environment = process.env.AUTHORIZENET_ENVIRONMENT === 'production'
  ? SDKConstants.endpoint.production
  : SDKConstants.endpoint.sandbox;

router.post('/charge-payment', async (req, res) => {
  try {
    const {
      opaqueDataDescriptor,
      opaqueDataValue,
      amount,
      description,
      customerInfo,
      billingAddress,
    } = req.body;

    // Validate required fields
    if (!opaqueDataDescriptor || !opaqueDataValue || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Missing required payment information',
      });
    }

    // Create merchant authentication
    const merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
    merchantAuthenticationType.setName(process.env.AUTHORIZENET_API_LOGIN_ID);
    merchantAuthenticationType.setTransactionKey(process.env.AUTHORIZENET_TRANSACTION_KEY);

    // Set opaque data (tokenized card data from Accept.js)
    const opaqueData = new ApiContracts.OpaqueDataType();
    opaqueData.setDataDescriptor(opaqueDataDescriptor);
    opaqueData.setDataValue(opaqueDataValue);

    // Set payment method
    const paymentType = new ApiContracts.PaymentType();
    paymentType.setOpaqueData(opaqueData);

    // Set transaction amount
    const transactionAmount = amount.toFixed(2);

    // Set customer billing address
    const billTo = new ApiContracts.CustomerAddressType();
    billTo.setFirstName(customerInfo.firstName);
    billTo.setLastName(customerInfo.lastName);
    billTo.setAddress(billingAddress.street);
    billTo.setCity(billingAddress.city);
    billTo.setState(billingAddress.state);
    billTo.setZip(billingAddress.zip);
    billTo.setCountry('US');
    billTo.setPhoneNumber(customerInfo.phoneNumber);

    // Set customer email
    const customerData = new ApiContracts.CustomerDataType();
    customerData.setEmail(customerInfo.email);

    // Create transaction request
    const transactionRequestType = new ApiContracts.TransactionRequestType();
    transactionRequestType.setTransactionType(ApiContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION);
    transactionRequestType.setPayment(paymentType);
    transactionRequestType.setAmount(transactionAmount);
    transactionRequestType.setBillTo(billTo);
    transactionRequestType.setCustomer(customerData);
    
    // Add description/invoice
    const lineItem = new ApiContracts.LineItemType();
    lineItem.setItemId('TRIAL001');
    lineItem.setName(description);
    lineItem.setDescription(description);
    lineItem.setQuantity('1');
    lineItem.setUnitPrice(transactionAmount);
    transactionRequestType.setLineItems([lineItem]);

    // Create request
    const createRequest = new ApiContracts.CreateTransactionRequest();
    createRequest.setMerchantAuthentication(merchantAuthenticationType);
    createRequest.setTransactionRequest(transactionRequestType);

    // Execute transaction
    const ctrl = new ApiControllers.CreateTransactionController(createRequest.getJSON());
    ctrl.setEnvironment(environment);

    // Process the transaction
    ctrl.execute(() => {
      const apiResponse = ctrl.getResponse();
      const response = new ApiContracts.CreateTransactionResponse(apiResponse);

      if (response != null) {
        if (response.getMessages().getResultCode() === ApiContracts.MessageTypeEnum.OK) {
          const transactionResponse = response.getTransactionResponse();
          
          if (transactionResponse.getMessages() != null) {
            // Transaction successful
            return res.json({
              success: true,
              transactionId: transactionResponse.getTransId(),
              authCode: transactionResponse.getAuthCode(),
              message: 'Payment processed successfully',
            });
          } else {
            // Transaction failed
            const errors = transactionResponse.getErrors();
            const errorMessage = errors && errors.getError().length > 0
              ? errors.getError()[0].getErrorText()
              : 'Transaction failed';
            
            return res.json({
              success: false,
              error: errorMessage,
            });
          }
        } else {
          // API call failed
          const errors = response.getTransactionResponse().getErrors();
          const errorMessage = errors && errors.getError().length > 0
            ? errors.getError()[0].getErrorText()
            : 'Transaction failed';
          
          return res.json({
            success: false,
            error: errorMessage,
          });
        }
      } else {
        return res.json({
          success: false,
          error: 'No response from payment gateway',
        });
      }
    });
  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

module.exports = router;
```

## API Endpoint: Create Customer Profile

**Endpoint:** `POST /api/create-customer-profile`

**Purpose:** Create a customer profile in Authorize.Net for future recurring billing

### Example Implementation

```javascript
router.post('/create-customer-profile', async (req, res) => {
  try {
    const {
      opaqueDataDescriptor,
      opaqueDataValue,
      customerInfo,
      billingAddress,
    } = req.body;

    // Create merchant authentication
    const merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
    merchantAuthenticationType.setName(process.env.AUTHORIZENET_API_LOGIN_ID);
    merchantAuthenticationType.setTransactionKey(process.env.AUTHORIZENET_TRANSACTION_KEY);

    // Set customer profile
    const customerProfileType = new ApiContracts.CustomerProfileType();
    customerProfileType.setMerchantCustomerId(`CUST-${Date.now()}`);
    customerProfileType.setDescription(`${customerInfo.businessName}`);
    customerProfileType.setEmail(customerInfo.email);

    // Set payment profile
    const paymentProfile = new ApiContracts.CustomerPaymentProfileType();
    
    // Set billing address
    const billTo = new ApiContracts.CustomerAddressType();
    billTo.setFirstName(customerInfo.firstName);
    billTo.setLastName(customerInfo.lastName);
    billTo.setAddress(billingAddress.street);
    billTo.setCity(billingAddress.city);
    billTo.setState(billingAddress.state);
    billTo.setZip(billingAddress.zip);
    billTo.setCountry('US');
    billTo.setPhoneNumber(customerInfo.phoneNumber);
    paymentProfile.setBillTo(billTo);

    // Set opaque data
    const opaqueData = new ApiContracts.OpaqueDataType();
    opaqueData.setDataDescriptor(opaqueDataDescriptor);
    opaqueData.setDataValue(opaqueDataValue);

    const paymentType = new ApiContracts.PaymentType();
    paymentType.setOpaqueData(opaqueData);
    paymentProfile.setPayment(paymentType);

    customerProfileType.setPaymentProfiles([paymentProfile]);

    // Create request
    const createRequest = new ApiContracts.CreateCustomerProfileRequest();
    createRequest.setMerchantAuthentication(merchantAuthenticationType);
    createRequest.setProfile(customerProfileType);
    createRequest.setValidationMode(ApiContracts.ValidationModeEnum.LIVEMODE);

    // Execute request
    const ctrl = new ApiControllers.CreateCustomerProfileController(createRequest.getJSON());
    ctrl.setEnvironment(environment);

    ctrl.execute(() => {
      const apiResponse = ctrl.getResponse();
      const response = new ApiContracts.CreateCustomerProfileResponse(apiResponse);

      if (response != null) {
        if (response.getMessages().getResultCode() === ApiContracts.MessageTypeEnum.OK) {
          return res.json({
            success: true,
            customerProfileId: response.getCustomerProfileId(),
            paymentProfileId: response.getCustomerPaymentProfileIdList().getNumericString()[0],
            message: 'Customer profile created successfully',
          });
        } else {
          const errorMessage = response.getMessages().getMessage()[0].getText();
          return res.json({
            success: false,
            error: errorMessage,
          });
        }
      } else {
        return res.json({
          success: false,
          error: 'No response from payment gateway',
        });
      }
    });
  } catch (error) {
    console.error('Customer profile creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});
```

## Security Best Practices

1. **Never expose your API Login ID and Transaction Key** in the frontend code
2. **Use HTTPS only** for all API communications
3. **Validate all input** on the backend
4. **Implement rate limiting** to prevent abuse
5. **Log all transactions** for auditing purposes
6. **Store customer profile IDs** securely in your database
7. **Use environment variables** for all sensitive configuration
8. **Implement proper error handling** without exposing sensitive information

## Testing

Use Authorize.Net's sandbox environment for testing:

- **Test Credit Card Number:** 4111111111111111
- **Expiration Date:** Any future date (e.g., 12/25)
- **CVV:** Any 3-digit number (e.g., 123)

## Going to Production

1. Change `AUTHORIZENET_ENVIRONMENT` to `production`
2. Update `VITE_AUTHORIZENET_API_ENDPOINT` to production endpoint
3. Replace sandbox credentials with production credentials
4. Update Accept.js script URL in `index.html`:
   - Test: `https://jstest.authorize.net/v1/Accept.js`
   - Production: `https://js.authorize.net/v1/Accept.js`

## Additional Resources

- [Authorize.Net Developer Documentation](https://developer.authorize.net/)
- [Accept.js Documentation](https://developer.authorize.net/api/reference/features/acceptjs.html)
- [Node.js SDK Documentation](https://github.com/AuthorizeNet/sdk-node)
