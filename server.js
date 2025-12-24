import express from 'express';
import pkg from 'authorizenet';
import dotenv from 'dotenv';

const { APIContracts, APIControllers, Constants: SDKConstants } = pkg;
const ApiContracts = APIContracts;
const ApiControllers = APIControllers;

dotenv.config();

const app = express();
app.use(express.json());

// Enable CORS for local development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Set environment
const environment =
  process.env.AUTHORIZENET_ENVIRONMENT === 'production'
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

    console.log('Received payment request:', {
      amount: initialPaymentAmount,
      customer: `${customerInfo.firstName} ${customerInfo.lastName}`,
      scheduledDate,
      fullAmount,
    });

    // Validate required fields
    if (!opaqueDataDescriptor || !opaqueDataValue || !initialPaymentAmount) {
      return res.status(400).json({
        success: false,
        error: 'Missing required payment information',
      });
    }

    // Check if Authorize.Net credentials are configured
    if (
      !process.env.AUTHORIZENET_API_LOGIN_ID ||
      !process.env.AUTHORIZENET_TRANSACTION_KEY
    ) {
      console.error('Authorize.Net credentials not configured');
      return res.status(500).json({
        success: false,
        error:
          'Payment gateway not configured. Please set AUTHORIZENET_API_LOGIN_ID and AUTHORIZENET_TRANSACTION_KEY in .env file',
      });
    }

    // ✅ DEBUG: verify credential lengths (do NOT print actual secrets)
    const loginIdRaw = process.env.AUTHORIZENET_API_LOGIN_ID ?? '';
    const txKeyRaw = process.env.AUTHORIZENET_TRANSACTION_KEY ?? '';

    console.log('AUTHORIZENET_API_LOGIN_ID length:', loginIdRaw.length);
    console.log('AUTHORIZENET_TRANSACTION_KEY length:', txKeyRaw.length);
    console.log(
      'AUTHORIZENET_TRANSACTION_KEY trimmed length:',
      txKeyRaw.trim().length
    );

    // Create merchant authentication
    const merchantAuth = new ApiContracts.MerchantAuthenticationType();
    merchantAuth.setName(loginIdRaw.trim());
    merchantAuth.setTransactionKey(txKeyRaw.trim());

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
    customerProfile.setDescription(
      `${customerInfo.firstName} ${customerInfo.lastName} - ${customerInfo.businessName}`
    );
    customerProfile.setPaymentProfiles([customerPaymentProfile]);

    // Create profile request
    const createRequest = new ApiContracts.CreateCustomerProfileRequest();
    createRequest.setMerchantAuthentication(merchantAuth);
    createRequest.setProfile(customerProfile);

    // ✅ Better: use TESTMODE in sandbox, LIVEMODE in production
    const isProd = process.env.AUTHORIZENET_ENVIRONMENT === 'production';
    createRequest.setValidationMode(
      isProd
        ? ApiContracts.ValidationModeEnum.LIVEMODE
        : ApiContracts.ValidationModeEnum.TESTMODE
    );

    // Execute create profile
    const ctrl = new ApiControllers.CreateCustomerProfileController(
      createRequest.getJSON()
    );
    ctrl.setEnvironment(environment);

    // Process the request
    ctrl.execute(async () => {
      const apiResponse = ctrl.getResponse();
      const response = new ApiContracts.CreateCustomerProfileResponse(apiResponse);

      if (response != null) {
        if (
          response.getMessages().getResultCode() ===
          ApiContracts.MessageTypeEnum.OK
        ) {
          const customerProfileId = response.getCustomerProfileId();
          const paymentProfileId =
            response.getCustomerPaymentProfileIdList().getNumericString()[0];

          console.log('✓ Customer Profile Created:', customerProfileId);
          console.log('✓ Payment Profile ID:', paymentProfileId);

          try {
            const chargeResult = await chargeCustomerProfile(
              merchantAuth,
              customerProfileId,
              paymentProfileId,
              initialPaymentAmount,
              'KABBA Trial Fee - $4.95'
            );

            console.log('✓ Initial payment charged:', chargeResult.transactionId);
            console.log('✓ Scheduled payment date:', scheduledDate);
            console.log('✓ Amount to charge on scheduled date: $' + fullAmount);

            res.json({
              success: true,
              customerId: null,
              customerProfileId: customerProfileId,
              paymentProfileId: paymentProfileId,
              transactionId: chargeResult.transactionId,
              authCode: chargeResult.authCode,
              message: 'Customer created and initial payment processed successfully',
            });
          } catch (chargeError) {
            console.error('× Payment charge failed:', chargeError.message);
            res.json({
              success: false,
              error: 'Failed to charge initial payment: ' + chargeError.message,
            });
          }
        } else {
          const errors = response.getMessages().getMessage();
          const errorMessage =
            errors && errors.length > 0
              ? errors[0].getText()
              : 'Failed to create customer profile';

          console.error('× Customer profile creation failed:', errorMessage);
          res.json({
            success: false,
            error: errorMessage,
          });
        }
      } else {
        console.error('× No response from payment gateway');
        res.json({
          success: false,
          error: 'No response from payment gateway',
        });
      }
    });
  } catch (error) {
    console.error('× Customer creation error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    });
  }
});

/**
 * Charge a customer profile
 */
function chargeCustomerProfile(
  merchantAuth,
  customerProfileId,
  paymentProfileId,
  amount,
  description
) {
  return new Promise((resolve, reject) => {
    // Set profile IDs
    const profileToCharge = new ApiContracts.CustomerProfilePaymentType();
    profileToCharge.setCustomerProfileId(customerProfileId);

    const paymentProfile = new ApiContracts.PaymentProfile();
    paymentProfile.setPaymentProfileId(paymentProfileId);
    profileToCharge.setPaymentProfile(paymentProfile);

    // Create transaction request
    const transactionRequest = new ApiContracts.TransactionRequestType();
    transactionRequest.setTransactionType(
      ApiContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION
    );
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
        if (
          response.getMessages().getResultCode() ===
          ApiContracts.MessageTypeEnum.OK
        ) {
          const transactionResponse = response.getTransactionResponse();

          if (transactionResponse.getMessages() != null) {
            resolve({
              success: true,
              transactionId: transactionResponse.getTransId(),
              authCode: transactionResponse.getAuthCode(),
            });
          } else {
            const errors = transactionResponse.getErrors();
            const errorMessage =
              errors && errors.getError().length > 0
                ? errors.getError()[0].getErrorText()
                : 'Transaction failed';
            reject(new Error(errorMessage));
          }
        } else {
          const errors = response.getTransactionResponse().getErrors();
          const errorMessage =
            errors && errors.getError().length > 0
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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    environment: process.env.AUTHORIZENET_ENVIRONMENT || 'sandbox',
    configured: !!(
      process.env.AUTHORIZENET_API_LOGIN_ID && process.env.AUTHORIZENET_TRANSACTION_KEY
    ),
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🚀 Backend API server running on http://localhost:${PORT}`);
  console.log(`\n📝 Environment: ${process.env.AUTHORIZENET_ENVIRONMENT || 'sandbox'}`);

  if (process.env.AUTHORIZENET_API_LOGIN_ID && process.env.AUTHORIZENET_TRANSACTION_KEY) {
    console.log('✓ Authorize.Net credentials configured');
  } else {
    console.log('⚠ WARNING: Authorize.Net credentials not configured!');
    console.log('  Set AUTHORIZENET_API_LOGIN_ID and AUTHORIZENET_TRANSACTION_KEY in .env file');
  }

  console.log('\n📍 Available endpoints:');
  console.log('  POST /api/create-customer-with-payment');
  console.log('  GET  /api/health\n');
});
