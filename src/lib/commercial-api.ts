// Typed client for the Kabba commercial checkout API.
//
// Card data NEVER passes through this module. The payment call carries only
// the Accept.js opaque token (descriptor + value) produced in the browser.

const DEFAULT_BASE = "https://api.kabba.ai";

export const API_BASE: string = (
  (import.meta.env.VITE_COMMERCIAL_API_BASE as string | undefined) ||
  DEFAULT_BASE
).replace(/\/+$/, "");

/** sessionStorage key holding the checkout session token. */
export const CHECKOUT_TOKEN_KEY = "kabba.checkout.token";
/** sessionStorage key holding the (optional) onboarding-call time (ISO). */
export const CONSULTATION_TIME_KEY = "kabba.checkout.consultation";

/* ===========================
   Offer / pricing
=========================== */

export interface OfferTrial {
  enabled: boolean;
  days: number;
  charge_cents: number;
  charge: string;
}

export interface OfferSubscription {
  fee_cents: number;
  fee: string;
  interval_days: number;
  periods_per_year: number;
}

export interface OfferUsage {
  transaction_fee_cents: number;
  transaction_fee: string;
  minimum_qualifying_cents: number;
  minimum_qualifying: string;
  threshold_inclusive: boolean;
}

export interface OfferBilling {
  mode: string;
  one_invoice_one_payment: boolean;
}

export interface CommercialOffer {
  plan_code: string;
  pricing_version: string | number;
  currency: string;
  trial: OfferTrial;
  subscription: OfferSubscription;
  usage: OfferUsage;
  billing: OfferBilling;
  /** Canonical one-sentence description of the offer, written by the server. */
  description: string;
}

/* ===========================
   Checkout config
=========================== */

export interface AcceptJsConfig {
  script_url: string;
  api_login_id: string;
  client_key: string;
  sandbox: boolean;
}

export interface CheckoutConfig {
  accept_js: AcceptJsConfig;
  terms_url: string;
  refund_url: string;
}

/* ===========================
   Sessions
=========================== */

export type SessionStatus =
  | "started"
  | "registered"
  | "payment_processing"
  | "payment_failed"
  | "paid"
  | "provisioning"
  | "completed"
  | "expired";

export type ProvisioningStatus =
  | "requested"
  | "in_progress"
  | "provisioned"
  | "failed"
  | null;

export interface Address {
  street: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
  country: "US";
}

export interface RegistrationPayload {
  business_name: string;
  contact_name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  website?: string;
  timezone?: string;
  business_address: Address;
  billing_address: Address;
  admin_password: string;
  admin_password_confirmation: string;
  accept_terms: true;
  accept_recurring_billing: true;
}

/**
 * What GET /sessions/{token} echoes back as `registration`. The server owns
 * the exact shape, so every field is optional and read defensively.
 */
export type SessionRegistration = Partial<
  Omit<
    RegistrationPayload,
    | "admin_password"
    | "admin_password_confirmation"
    | "accept_terms"
    | "accept_recurring_billing"
  >
>;

export interface CreatedSession {
  token: string;
  expires_at: string;
  offer: CommercialOffer;
  /** Multi-line plain-text disclosure. Must be shown verbatim. */
  agreement_text: string;
}

export interface CheckoutSession {
  status: SessionStatus;
  message?: string | null;
  customer_reference?: string | null;
  provisioning: ProvisioningStatus;
  offer?: CommercialOffer | null;
  registration?: SessionRegistration | null;
  /** Not part of the documented GET shape; used only if the server sends it. */
  agreement_text?: string | null;
  expires_at?: string | null;
}

export interface RegistrationResult {
  status: "registered";
  agreement_hash: string;
}

export interface OpaqueData {
  opaque_data_descriptor: string;
  opaque_data_value: string;
}

export type PaymentOutcome =
  | {
      ok: true;
      status: "provisioning" | "completed" | "paid";
      message?: string;
      customer_reference?: string | null;
      provisioning: ProvisioningStatus;
    }
  | {
      ok: false;
      status: "payment_failed" | "payment_processing";
      message: string;
    };

/** Laravel-style validation errors: `{ "business_address.city": ["..."] }`. */
export type FieldErrors = Record<string, string[]>;

/* ===========================
   Errors
=========================== */

export class CommercialApiError extends Error {
  readonly httpStatus: number;
  readonly errors: FieldErrors;
  /** The `status` field from the response body, when the server sent one. */
  readonly sessionStatus?: string;

  constructor(
    message: string,
    httpStatus: number,
    errors: FieldErrors = {},
    sessionStatus?: string,
  ) {
    super(message);
    this.name = "CommercialApiError";
    this.httpStatus = httpStatus;
    this.errors = errors;
    this.sessionStatus = sessionStatus;
  }

  /** 422: field-level validation problems. */
  get isValidation(): boolean {
    return this.httpStatus === 422;
  }

  /** 409/404/410: the session is expired or unknown and must be restarted. */
  get isSessionGone(): boolean {
    return (
      this.httpStatus === 409 ||
      this.httpStatus === 404 ||
      this.httpStatus === 410
    );
  }

  /** 503: signup is closed. */
  get isSignupClosed(): boolean {
    return this.httpStatus === 503;
  }

  /** 0: the request never reached the server. */
  get isNetwork(): boolean {
    return this.httpStatus === 0;
  }
}

/* ===========================
   Transport
=========================== */

interface ApiEnvelope {
  success?: boolean;
  message?: string;
  errors?: FieldErrors;
  status?: string;
  [key: string]: unknown;
}

async function parseJson(response: Response): Promise<ApiEnvelope> {
  const text = await response.text();
  if (!text) return {};
  try {
    const parsed = JSON.parse(text);
    return parsed && typeof parsed === "object" ? (parsed as ApiEnvelope) : {};
  } catch {
    return {};
  }
}

async function rawRequest(
  path: string,
  init: RequestInit = {},
): Promise<{ response: Response; body: ApiEnvelope }> {
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(init.body ? { "Content-Type": "application/json" } : {}),
    ...((init.headers as Record<string, string> | undefined) || {}),
  };

  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, { ...init, headers });
  } catch {
    throw new CommercialApiError(
      "We couldn't reach Kabba. Check your connection and try again.",
      0,
    );
  }

  const body = await parseJson(response);
  return { response, body };
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const { response, body } = await rawRequest(path, init);

  if (!response.ok || body.success === false) {
    throw new CommercialApiError(
      body.message || `Request failed (${response.status})`,
      response.status,
      body.errors || {},
      body.status,
    );
  }

  return body as unknown as T;
}

/* ===========================
   Calls
=========================== */

/** GET /api/commercial/v1/pricing/current */
export async function getCurrentPricing(): Promise<CommercialOffer> {
  const body = await request<{ offer: CommercialOffer }>(
    "/api/commercial/v1/pricing/current",
  );
  return body.offer;
}

/** GET /api/commercial/v1/checkout/config */
export async function getCheckoutConfig(): Promise<CheckoutConfig> {
  const body = await request<CheckoutConfig>(
    "/api/commercial/v1/checkout/config",
  );
  return {
    accept_js: body.accept_js,
    terms_url: body.terms_url,
    refund_url: body.refund_url,
  };
}

/** POST /api/commercial/v1/checkout/sessions */
export async function createCheckoutSession(
  planCode = "standard",
): Promise<CreatedSession> {
  const body = await request<CreatedSession>(
    "/api/commercial/v1/checkout/sessions",
    {
      method: "POST",
      body: JSON.stringify({ plan_code: planCode }),
    },
  );
  return {
    token: body.token,
    expires_at: body.expires_at,
    offer: body.offer,
    agreement_text: body.agreement_text,
  };
}

/** GET /api/commercial/v1/checkout/sessions/{token} */
export async function getCheckoutSession(
  token: string,
): Promise<CheckoutSession> {
  const body = await request<CheckoutSession>(
    `/api/commercial/v1/checkout/sessions/${encodeURIComponent(token)}`,
  );
  return {
    status: body.status,
    message: body.message ?? null,
    customer_reference: body.customer_reference ?? null,
    provisioning: body.provisioning ?? null,
    offer: body.offer ?? null,
    registration: body.registration ?? null,
    agreement_text: body.agreement_text ?? null,
    expires_at: body.expires_at ?? null,
  };
}

/** PUT /api/commercial/v1/checkout/sessions/{token}/registration */
export async function submitRegistration(
  token: string,
  payload: RegistrationPayload,
): Promise<RegistrationResult> {
  const body = await request<RegistrationResult>(
    `/api/commercial/v1/checkout/sessions/${encodeURIComponent(token)}/registration`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    },
  );
  return { status: body.status, agreement_hash: body.agreement_hash };
}

/**
 * POST /api/commercial/v1/checkout/sessions/{token}/payment
 *
 * Sends ONLY the Accept.js opaque data. A 402 is an expected outcome
 * (declined / still processing) and is returned, not thrown. Everything
 * else that is not a success throws a CommercialApiError.
 */
export async function submitPayment(
  token: string,
  opaque: OpaqueData,
  idempotencyKey: string = newIdempotencyKey(),
): Promise<PaymentOutcome> {
  const payload: OpaqueData = {
    opaque_data_descriptor: opaque.opaque_data_descriptor,
    opaque_data_value: opaque.opaque_data_value,
  };

  const { response, body } = await rawRequest(
    `/api/commercial/v1/checkout/sessions/${encodeURIComponent(token)}/payment`,
    {
      method: "POST",
      headers: { "Idempotency-Key": idempotencyKey },
      body: JSON.stringify(payload),
    },
  );

  if (response.status === 402) {
    const status =
      body.status === "payment_processing"
        ? "payment_processing"
        : "payment_failed";
    return {
      ok: false,
      status,
      message:
        body.message ||
        (status === "payment_processing"
          ? "Your payment is still being processed. Please do not resubmit."
          : "Your card was declined. Please try a different card."),
    };
  }

  if (!response.ok || body.success === false) {
    throw new CommercialApiError(
      body.message || `Payment request failed (${response.status})`,
      response.status,
      body.errors || {},
      body.status,
    );
  }

  const status =
    body.status === "completed" || body.status === "paid"
      ? body.status
      : "provisioning";

  return {
    ok: true,
    status,
    message: body.message,
    customer_reference: (body.customer_reference as string | null) ?? null,
    provisioning: (body.provisioning as ProvisioningStatus) ?? null,
  };
}

/* ===========================
   Helpers
=========================== */

export function newIdempotencyKey(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
}

function safeStorage(): Storage | null {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

export function readStoredToken(): string | null {
  return safeStorage()?.getItem(CHECKOUT_TOKEN_KEY) || null;
}

export function storeToken(token: string): void {
  safeStorage()?.setItem(CHECKOUT_TOKEN_KEY, token);
}

export function clearStoredToken(): void {
  safeStorage()?.removeItem(CHECKOUT_TOKEN_KEY);
}

export function readConsultationTime(): string | null {
  return safeStorage()?.getItem(CONSULTATION_TIME_KEY) || null;
}

export function storeConsultationTime(iso: string): void {
  safeStorage()?.setItem(CONSULTATION_TIME_KEY, iso);
}

/**
 * Format an amount from the offer. Prefers integer cents; falls back to the
 * decimal string the server also sends (e.g. "9.95").
 */
export function formatMoney(
  cents: number | undefined | null,
  currency: string | undefined,
  fallbackDecimal?: string,
): string {
  if (typeof cents === "number" && Number.isFinite(cents)) {
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency || "USD",
      }).format(cents / 100);
    } catch {
      // fall through to the decimal fallback
    }
  }
  return fallbackDecimal ? `$${fallbackDecimal}` : "";
}
