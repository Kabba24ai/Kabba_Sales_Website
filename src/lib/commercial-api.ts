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
/**
 * sessionStorage key holding the owner's checkout access code, taken from
 * `?access=` on the URL. While the checkout is restricted (before the owner's
 * live card test succeeds) the server refuses to open a session without it.
 * It gates access only; it is not a payment secret.
 */
export const CHECKOUT_ACCESS_KEY = "kabba.checkout.access";
/** Legacy sessionStorage key of a browser-only consultation time (discarded; see discardLegacyConsultationTime). */
export const CONSULTATION_TIME_KEY = "kabba.checkout.consultation";

/* ===========================
   Offer / pricing
=========================== */

export interface OfferTrial {
  enabled: boolean;
  days: number;
  charge_cents: number;
  charge: string;
  /** "exempt" | "defer_to_first_invoice" | "unresolved"; absent from older servers */
  usage_treatment?: string;
  /** True when rental transactions during the trial never carry a transaction fee. */
  transactions_exempt?: boolean;
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
  /** "advance": each period's subscription fee is charged when the period starts. */
  subscription_timing: "advance" | string;
  /** "arrears": transaction fees are charged after the period they occurred in. */
  usage_timing: "arrears" | string;
  /** "when_trial_ends" | "at_signup" */
  first_subscription_charge: string;
  one_invoice_one_payment: boolean;
  /** Older servers sent `mode` instead of the two timing fields. */
  mode?: string;
}

export interface OfferTax {
  enabled: boolean;
  /** True when a NEW customer is charged tax today (collection on, new customers taxable). */
  applies_to_new_customers?: boolean;
  /** e.g. "9.25" when enabled, otherwise null */
  rate_percent: string | null;
  /** disabled | taxable | exempt | pending | missing_rate */
  status?: string;
  /** Server-written sentence to show verbatim. */
  note: string;
}

/**
 * One amount the server computed exactly as the invoice will: base, tax and
 * total. The browser never does money arithmetic.
 */
export interface OfferCharge {
  label: string;
  subtotal_cents: number;
  subtotal: string;
  tax_cents: number;
  tax: string;
  tax_rate_percent: string | null;
  total_cents: number;
  total: string;
}

export interface CommercialOffer {
  plan_code: string;
  pricing_version: string | number | null;
  currency: string;
  trial: OfferTrial;
  subscription: OfferSubscription;
  usage: OfferUsage;
  billing: OfferBilling;
  tax?: OfferTax;
  /** The exact amount charged today (trial enrollment, or the first prepaid period), with tax. */
  initial_charge?: OfferCharge;
  /** Each subscription renewal before usage fees, with tax. */
  renewal_charge?: OfferCharge;
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
  /** Server-reported handoff facts; present once the trial is paid. */
  onboarding?: OnboardingStatus | null;
}

/* ===========================
   Onboarding / consultations (Kabba #267)
=========================== */

export type ConsultationStatusCode =
  | "not_requested"
  | "requested"
  | "confirmed"
  | "rescheduled"
  | "cancelled"
  | "completed"
  | "no_show";

export interface ConsultationState {
  status: ConsultationStatusCode;
  /** Server wording, e.g. "Requested (awaiting confirmation)". */
  label: string;
  starts_at: string | null;
  /** e.g. "Wed, Nov 18, 2026 at 10:00 AM CST" (always Central Time). */
  when: string | null;
  timezone?: string;
}

export interface OnboardingStatus {
  registration: "complete" | "pending";
  payment: "paid" | "processing" | "failed" | "pending" | "not_applicable";
  website: "not_started" | "provisioning" | "ready" | "needs_attention" | "failed";
  website_label: string;
  website_ready_at: string | null;
  admin_url: string | null;
  login_email: string | null;
  go_live: "not_ready" | "locked" | "authorized" | "unknown";
  go_live_label: string;
  consultation: ConsultationState;
}

export type ConsultationKind = "onboarding" | "implementation";

export interface ConsultationSlot {
  /** Server-signed slot id: the only thing a booking sends back. */
  id: string;
  starts_at: string;
  ends_at: string;
  /** Business date (America/Chicago), YYYY-MM-DD. */
  date: string;
  weekday: string;
  /** "Wednesday, November 18 at 10:00 AM CST" */
  label: string;
  time_label: string;
}

export interface AvailabilityBatch {
  timezone: string;
  timezone_label: string;
  duration_minutes: number;
  slots: ConsultationSlot[];
  /** Pass back as `after` for the next three weekdays; null when there are no more. */
  next_after: string | null;
  notice: string;
}

export interface BookingResult {
  consultation: ConsultationState;
  message: string;
  created?: boolean;
  changed?: boolean;
}

export interface BookingLinkInfo {
  business_name: string;
  consultation: ConsultationState;
  expires_at: string;
}

export type ImplementationPackage = "launch" | "professional" | "growth" | "not_sure";

export interface ImplementationInquiry {
  name: string;
  business: string;
  email: string;
  phone: string;
  package: ImplementationPackage;
  message?: string;
  slot?: string | null;
  /** One id per form submission: a retried submit finds the same request. */
  request_id: string;
  /** Milliseconds the visitor spent on the form (spam guard). */
  elapsed_ms: number;
  /** Hidden honeypot field; people never fill it. */
  company_website?: string;
}

export interface InquiryResult {
  status: string;
  duplicate?: boolean;
  consultation?: ConsultationState;
  message: string;
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

/** Remember an `?access=` code from the current URL for this browser session. */
export function captureAccessCodeFromUrl(): void {
  try {
    const code = new URLSearchParams(window.location.search).get("access");
    if (code && /^[A-Za-z0-9]{4,64}$/.test(code)) {
      safeStorage()?.setItem(CHECKOUT_ACCESS_KEY, code);
    }
  } catch {
    // no window / storage: nothing to capture
  }
}

export function readAccessCode(): string | null {
  return safeStorage()?.getItem(CHECKOUT_ACCESS_KEY) || null;
}

/** POST /api/commercial/v1/checkout/sessions */
export async function createCheckoutSession(
  planCode = "standard",
): Promise<CreatedSession> {
  captureAccessCodeFromUrl();
  const access = readAccessCode();
  const body = await request<CreatedSession>(
    "/api/commercial/v1/checkout/sessions",
    {
      method: "POST",
      headers: access ? { "X-Kabba-Checkout-Access": access } : {},
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
    onboarding: body.onboarding ?? null,
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
   Consultations (Kabba #267)
=========================== */

/** GET /api/commercial/v1/consultations/availability — three weekday times (Central Time). */
export async function getConsultationAvailability(
  kind: ConsultationKind,
  after?: string | null,
): Promise<AvailabilityBatch> {
  const qs = new URLSearchParams({ kind });
  if (after) qs.set("after", after);
  const body = await request<AvailabilityBatch>(
    `/api/commercial/v1/consultations/availability?${qs.toString()}`,
  );
  return {
    timezone: body.timezone,
    timezone_label: body.timezone_label,
    duration_minutes: body.duration_minutes,
    slots: Array.isArray(body.slots) ? body.slots : [],
    next_after: body.next_after ?? null,
    notice: body.notice ?? "",
  };
}

function bookingResult(body: BookingResult): BookingResult {
  return {
    consultation: body.consultation,
    message: body.message,
    created: body.created,
    changed: body.changed,
  };
}

/** POST checkout/sessions/{token}/consultation — the paid customer books from the success page. */
export async function bookConsultationWithCheckout(
  checkoutToken: string,
  slotId: string,
): Promise<BookingResult> {
  return bookingResult(
    await request<BookingResult>(
      `/api/commercial/v1/checkout/sessions/${encodeURIComponent(checkoutToken)}/consultation`,
      { method: "POST", body: JSON.stringify({ slot: slotId }) },
    ),
  );
}

export async function cancelConsultationWithCheckout(
  checkoutToken: string,
): Promise<BookingResult> {
  return bookingResult(
    await request<BookingResult>(
      `/api/commercial/v1/checkout/sessions/${encodeURIComponent(checkoutToken)}/consultation/cancel`,
      { method: "POST" },
    ),
  );
}

/** GET consultations/access/{token} — the private booking link from the customer's email. */
export async function getBookingLink(linkToken: string): Promise<BookingLinkInfo> {
  const body = await request<BookingLinkInfo>(
    `/api/commercial/v1/consultations/access/${encodeURIComponent(linkToken)}`,
  );
  return {
    business_name: body.business_name,
    consultation: body.consultation,
    expires_at: body.expires_at,
  };
}

export async function bookConsultationWithLink(
  linkToken: string,
  slotId: string,
): Promise<BookingResult> {
  return bookingResult(
    await request<BookingResult>(
      `/api/commercial/v1/consultations/access/${encodeURIComponent(linkToken)}`,
      { method: "POST", body: JSON.stringify({ slot: slotId }) },
    ),
  );
}

export async function cancelConsultationWithLink(
  linkToken: string,
): Promise<BookingResult> {
  return bookingResult(
    await request<BookingResult>(
      `/api/commercial/v1/consultations/access/${encodeURIComponent(linkToken)}/cancel`,
      { method: "POST" },
    ),
  );
}

/**
 * POST implementation-inquiries — a prospect's Implementation Services
 * consultation request. Records a request only: never a subscription or a charge.
 */
export async function submitImplementationInquiry(
  inquiry: ImplementationInquiry,
): Promise<InquiryResult> {
  const body = await request<InquiryResult & { success?: boolean }>(
    "/api/commercial/v1/implementation-inquiries",
    { method: "POST", body: JSON.stringify(inquiry) },
  );
  if (body.success !== true) {
    throw new CommercialApiError(
      body.message || "We couldn't send your request. Please try again.",
      0,
    );
  }
  return {
    status: body.status,
    duplicate: body.duplicate,
    consultation: body.consultation,
    message: body.message,
  };
}

/* ===========================
   Customer support (Kabba #276)
=========================== */

export type SupportCategory =
  | "login"
  | "website"
  | "payments_billing"
  | "product_catalog"
  | "reservations_operations"
  | "other";

export interface SupportCategoryOption {
  value: SupportCategory;
  label: string;
}

/** The same list Kabba Central validates against; used if the options call fails. */
export const SUPPORT_CATEGORIES: SupportCategoryOption[] = [
  { value: "login", label: "Login" },
  { value: "website", label: "Website" },
  { value: "payments_billing", label: "Payments & Billing" },
  { value: "product_catalog", label: "Product Catalog" },
  { value: "reservations_operations", label: "Reservations & Operations" },
  { value: "other", label: "Other" },
];

export interface SupportOptions {
  categories: SupportCategoryOption[];
  /** Kabba's verified support line from Central settings, or null. */
  support_phone: string | null;
  link_days: number;
}

export interface SupportRequest {
  name: string;
  business: string;
  email: string;
  phone?: string;
  category: SupportCategory;
  subject: string;
  description: string;
  related_url?: string;
  /** A request only: Kabba promises no response time. */
  priority: "normal" | "urgent";
  /** One id per form: a retried submit finds the same case. */
  request_id: string;
  /** Milliseconds the visitor spent on the form (spam guard). */
  elapsed_ms: number;
  /** Hidden honeypot field; people never fill it. */
  company_website?: string;
}

export interface SupportSubmitResult {
  /** e.g. "KS-00012"; null only when the server silently dropped spam. */
  reference: string | null;
  duplicate: boolean;
  message: string;
}

export interface SupportCaseMessage {
  id: string;
  from: "customer" | "kabba";
  author: string;
  body: string;
  at: string;
  /** Set when this message corrects an earlier one (its id). */
  corrects: string | null;
}

export interface SupportCase {
  reference: string;
  subject: string;
  category: string;
  status: "new" | "in_progress" | "waiting_on_customer" | "resolved" | "closed";
  status_label: string;
  submitted_at: string;
  can_reply: boolean;
  reply_reopens: boolean;
}

export interface SupportCaseView {
  case: SupportCase;
  messages: SupportCaseMessage[];
  link_expires_at: string;
  support_phone: string | null;
}

/** GET support/options — categories and Kabba's support line. */
export async function getSupportOptions(): Promise<SupportOptions> {
  const body = await request<SupportOptions>("/api/commercial/v1/support/options");
  return {
    categories: Array.isArray(body.categories) && body.categories.length > 0 ? body.categories : SUPPORT_CATEGORIES,
    support_phone: body.support_phone ?? null,
    link_days: body.link_days ?? 14,
  };
}

/** POST support/tickets — opens a support case. Never creates an account or a charge. */
export async function submitSupportRequest(req: SupportRequest): Promise<SupportSubmitResult> {
  const body = await request<SupportSubmitResult & { success?: boolean }>(
    "/api/commercial/v1/support/tickets",
    { method: "POST", body: JSON.stringify(req) },
  );
  return {
    reference: body.reference ?? null,
    duplicate: body.duplicate === true,
    message: body.message,
  };
}

function supportCaseView(body: SupportCaseView): SupportCaseView {
  return {
    case: body.case,
    messages: Array.isArray(body.messages) ? body.messages : [],
    link_expires_at: body.link_expires_at,
    support_phone: body.support_phone ?? null,
  };
}

/** GET support/access/{token} — the reporter's own case, through the emailed link. */
export async function getSupportCase(token: string): Promise<SupportCaseView> {
  return supportCaseView(
    await request<SupportCaseView>(`/api/commercial/v1/support/access/${encodeURIComponent(token)}`),
  );
}

/** POST support/access/{token}/replies */
export async function replyToSupportCase(
  token: string,
  text: string,
  requestId: string,
): Promise<SupportCaseView & { message: string; reopened: boolean }> {
  const body = await request<SupportCaseView & { message: string; reopened?: boolean }>(
    `/api/commercial/v1/support/access/${encodeURIComponent(token)}/replies`,
    { method: "POST", body: JSON.stringify({ body: text, request_id: requestId }) },
  );
  return { ...supportCaseView(body), message: body.message, reopened: body.reopened === true };
}

/** POST support/links — "email me a new link". The answer is the same whether or not anything matched. */
export async function requestSupportLink(reference: string, email: string): Promise<string> {
  const body = await request<{ message: string }>("/api/commercial/v1/support/links", {
    method: "POST",
    body: JSON.stringify({ reference, email }),
  });
  return body.message;
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

/**
 * Older versions of this site kept a chosen consultation time only in the
 * browser. The server is now the record of every consultation, so any stale
 * local value is discarded and never shown as an appointment.
 */
export function discardLegacyConsultationTime(): void {
  try {
    safeStorage()?.removeItem(CONSULTATION_TIME_KEY);
  } catch {
    // storage unavailable: nothing to discard
  }
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
