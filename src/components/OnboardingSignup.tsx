import { useEffect, useState, FormEvent, ReactNode } from "react";
import { Shield, Check, AlertCircle, Loader2, Lock } from "lucide-react";
import {
  CommercialApiError,
  CommercialOffer,
  CheckoutConfig,
  CheckoutSession,
  FieldErrors,
  RegistrationPayload,
  SessionRegistration,
  SessionStatus,
  clearStoredToken,
  createCheckoutSession,
  formatMoney,
  getCheckoutConfig,
  getCheckoutSession,
  getCurrentPricing,
  newIdempotencyKey,
  readStoredToken,
  storeToken,
  submitPayment,
  submitRegistration,
} from "../lib/commercial-api";
import {
  detectCardType,
  loadAcceptJs,
  tokenizeCardData,
  validateCVC,
  validateCardNumber,
  validateExpiry,
} from "../lib/authorizenet";

interface OnboardingSignupProps {
  /** Payment accepted: the caller navigates to /trial-activated. */
  onSuccess: () => void;
  onBack?: () => void;
}

type Phase =
  | "loading"
  | "closed"
  | "unavailable"
  | "register"
  | "payment"
  | "processing_hold";

interface AddressForm {
  street: string;
  street2: string;
  city: string;
  state: string;
  zip: string;
}

interface RegistrationForm {
  businessName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  website: string;
  business: AddressForm;
  billing: AddressForm;
  sameBilling: boolean;
  password: string;
  passwordConfirm: string;
  acceptTerms: boolean;
  acceptRecurring: boolean;
}

interface CardForm {
  cardNumber: string;
  expiry: string;
  cvc: string;
  zip: string;
}

const MIN_PASSWORD_LENGTH = 10;

const US_STATES = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" },
  { code: "DC", name: "District of Columbia" },
];

const emptyAddress = (): AddressForm => ({
  street: "",
  street2: "",
  city: "",
  state: "",
  zip: "",
});

const emptyForm = (): RegistrationForm => ({
  businessName: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  website: "",
  business: emptyAddress(),
  billing: emptyAddress(),
  sameBilling: true,
  password: "",
  passwordConfirm: "",
  acceptTerms: false,
  acceptRecurring: false,
});

const formatPhoneNumber = (value: string) => {
  const cleaned = value.replace(/\D/g, "");
  if (cleaned.length <= 3) return cleaned;
  if (cleaned.length <= 6) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
  return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
};

const formatCardNumber = (value: string) => {
  const cleaned = value.replace(/\D/g, "");
  const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
  return formatted.slice(0, 23);
};

const formatExpiry = (value: string) => {
  const cleaned = value.replace(/\D/g, "");
  if (cleaned.length >= 2) return cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4);
  return cleaned;
};

/** Prefill the form from what the server echoes back on a resumed session. */
const formFromRegistration = (
  registration: SessionRegistration | null | undefined,
): Partial<RegistrationForm> => {
  if (!registration) return {};
  const addr = (a?: Partial<RegistrationPayload["business_address"]>): AddressForm => ({
    street: a?.street || "",
    street2: a?.street2 || "",
    city: a?.city || "",
    state: a?.state || "",
    zip: a?.zip || "",
  });
  const business = addr(registration.business_address);
  const billing = addr(registration.billing_address);
  const same =
    JSON.stringify(business) === JSON.stringify(billing) || !billing.street;
  return {
    businessName: registration.business_name || "",
    firstName: registration.first_name || "",
    lastName: registration.last_name || "",
    email: registration.email || "",
    phone: registration.phone ? formatPhoneNumber(registration.phone) : "",
    website: registration.website || "",
    business,
    billing: same ? emptyAddress() : billing,
    sameBilling: same,
  };
};

/* Shared session-opening promise so React StrictMode's double effect run
   (dev only) cannot open two sessions. */
let openingSession: Promise<OpenedSession> | null = null;

interface OpenedSession {
  token: string;
  status: SessionStatus;
  agreementText: string;
  session: CheckoutSession | null;
}

const RESUMABLE: SessionStatus[] = [
  "registered",
  "payment_failed",
  "payment_processing",
  "paid",
  "provisioning",
];

async function openSession(): Promise<OpenedSession> {
  if (openingSession) return openingSession;

  openingSession = (async () => {
    const stored = readStoredToken();
    if (stored) {
      try {
        const session = await getCheckoutSession(stored);
        if (RESUMABLE.includes(session.status)) {
          return {
            token: stored,
            status: session.status,
            agreementText: session.agreement_text || "",
            session,
          };
        }
        if (session.status === "started" && session.agreement_text) {
          return {
            token: stored,
            status: "started",
            agreementText: session.agreement_text,
            session,
          };
        }
      } catch {
        // Unknown/expired token: fall through and start over.
      }
      clearStoredToken();
    }

    const created = await createCheckoutSession("standard");
    storeToken(created.token);
    return {
      token: created.token,
      status: "started",
      agreementText: created.agreement_text,
      session: null,
    };
  })();

  try {
    return await openingSession;
  } finally {
    openingSession = null;
  }
}

/* ===========================
   Small presentational helpers
=========================== */

const inputClass = (invalid?: boolean) =>
  `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-gray-900 ${
    invalid ? "border-red-300" : "border-gray-300"
  }`;

function Field({
  id,
  label,
  error,
  hint,
  optional,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold mb-2 text-gray-700">
        {label}
        {optional && <span className="text-gray-400 font-normal"> (optional)</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
}

function TextInput({
  id,
  label,
  value,
  onChange,
  error,
  hint,
  optional,
  type = "text",
  placeholder,
  maxLength,
  autoComplete,
  inputMode,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  optional?: boolean;
  type?: string;
  placeholder?: string;
  maxLength?: number;
  autoComplete?: string;
  inputMode?: "text" | "tel" | "email" | "numeric" | "url";
}) {
  return (
    <Field id={id} label={label} error={error} hint={hint} optional={optional}>
      <input
        id={id}
        type={type}
        required={!optional}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass(!!error)}
        placeholder={placeholder}
        maxLength={maxLength}
        autoComplete={autoComplete}
        inputMode={inputMode}
      />
    </Field>
  );
}

function AddressFields({
  idPrefix,
  errorPrefix,
  value,
  onChange,
  errorFor,
}: {
  idPrefix: string;
  errorPrefix: "business_address" | "billing_address";
  value: AddressForm;
  onChange: (next: AddressForm) => void;
  errorFor: (key: string) => string | undefined;
}) {
  const set = (field: keyof AddressForm, v: string) =>
    onChange({ ...value, [field]: v });

  return (
    <div className="space-y-4">
      {errorFor(errorPrefix) && (
        <p className="text-sm text-red-600">{errorFor(errorPrefix)}</p>
      )}
      <TextInput
        id={`${idPrefix}-street`}
        label="Street Address"
        value={value.street}
        onChange={(v) => set("street", v)}
        error={errorFor(`${errorPrefix}.street`)}
        placeholder="123 Main Street"
        autoComplete="address-line1"
      />
      <TextInput
        id={`${idPrefix}-street2`}
        label="Suite / Unit"
        optional
        value={value.street2}
        onChange={(v) => set("street2", v)}
        error={errorFor(`${errorPrefix}.street2`)}
        placeholder="Suite 100"
        autoComplete="address-line2"
      />
      <TextInput
        id={`${idPrefix}-city`}
        label="City"
        value={value.city}
        onChange={(v) => set("city", v)}
        error={errorFor(`${errorPrefix}.city`)}
        placeholder="Nashville"
        autoComplete="address-level2"
      />
      <div className="grid grid-cols-2 gap-4">
        <Field
          id={`${idPrefix}-state`}
          label="State"
          error={errorFor(`${errorPrefix}.state`)}
        >
          <select
            id={`${idPrefix}-state`}
            required
            value={value.state}
            onChange={(e) => set("state", e.target.value)}
            className={inputClass(!!errorFor(`${errorPrefix}.state`))}
            autoComplete="address-level1"
          >
            <option value="" disabled>
              Select state
            </option>
            {US_STATES.map((state) => (
              <option key={state.code} value={state.code}>
                {state.name}
              </option>
            ))}
          </select>
        </Field>
        <TextInput
          id={`${idPrefix}-zip`}
          label="ZIP Code"
          value={value.zip}
          onChange={(v) => set("zip", v)}
          error={errorFor(`${errorPrefix}.zip`)}
          placeholder="37201"
          maxLength={10}
          autoComplete="postal-code"
        />
      </div>
    </div>
  );
}

function StepIndicator({ current }: { current: 1 | 2 }) {
  const steps = [
    { n: 1, label: "Business registration" },
    { n: 2, label: "Payment" },
  ] as const;
  return (
    <ol className="flex items-center justify-center gap-4 mb-8">
      {steps.map((step, i) => {
        const done = step.n < current;
        const active = step.n === current;
        return (
          <li key={step.n} className="flex items-center gap-2">
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold ${
                done || active
                  ? "bg-emerald-500 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {done ? <Check className="w-4 h-4" /> : step.n}
            </span>
            <span
              className={`text-sm ${active ? "text-gray-900 font-semibold" : "text-gray-500"}`}
            >
              {step.label}
            </span>
            {i < steps.length - 1 && (
              <span className="w-8 h-px bg-gray-300 mx-1" aria-hidden="true" />
            )}
          </li>
        );
      })}
    </ol>
  );
}

function Spinner() {
  return <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />;
}

/** Price summary built ONLY from the offer response. */
function OfferSummary({ offer }: { offer: CommercialOffer }) {
  const { currency, trial, subscription, usage } = offer;
  const trialCharge = formatMoney(trial.charge_cents, currency, trial.charge);
  const fee = formatMoney(subscription.fee_cents, currency, subscription.fee);
  const txn = formatMoney(
    usage.transaction_fee_cents,
    currency,
    usage.transaction_fee,
  );
  const minimum = formatMoney(
    usage.minimum_qualifying_cents,
    currency,
    usage.minimum_qualifying,
  );
  const qualifier = usage.threshold_inclusive
    ? `${minimum} or more`
    : `over ${minimum}`;

  const days = subscription.interval_days;
  const taxNote = offer.tax?.note ?? "Applicable sales taxes, if any, are added to each charge.";
  const rows = trial.enabled
    ? [
        {
          label: "Today (day 1)",
          value: `${trialCharge} trial enrollment`,
          sub: `${trial.days} days of full access — not your first subscription payment`,
        },
        {
          label: `When the trial ends (day ${trial.days + 1})`,
          value: `${fee} for your first ${days} days`,
          sub: "subscription fee, billed in advance",
        },
        {
          label: `Every ${days} days after`,
          value: `${fee} + usage`,
          sub: `next ${days}-day subscription (in advance) + ${txn} per qualifying rental of ${qualifier} from the period just completed (in arrears), on one invoice, one payment`,
        },
      ]
    : [
        {
          label: "Today (day 1)",
          value: `${fee} for your first ${days} days`,
          sub: "subscription fee, billed in advance",
        },
        {
          label: `Every ${days} days after`,
          value: `${fee} + usage`,
          sub: `next ${days}-day subscription (in advance) + ${txn} per qualifying rental of ${qualifier} from the period just completed (in arrears), on one invoice, one payment`,
        },
      ];

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-emerald-400">
        What you'll pay
      </h2>
      <dl className="space-y-3">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between items-start gap-4">
            <dt className="text-gray-400">{row.label}</dt>
            <dd className="text-right">
              <div className="text-gray-100 font-semibold">{row.value}</div>
              {row.sub && <div className="text-gray-500 text-xs">{row.sub}</div>}
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 pt-4 border-t border-gray-700 text-gray-300 text-sm">
        Your subscription renews every {subscription.interval_days} days (about{" "}
        {subscription.periods_per_year} periods a year), not monthly. Subscription fees are
        billed in advance; rental transaction fees are billed after each period.
      </p>
      <p className="mt-2 text-gray-400 text-xs leading-relaxed">{taxNote}</p>
      <p className="mt-2 text-gray-500 text-xs leading-relaxed">
        {offer.description}
      </p>
    </div>
  );
}

/* ===========================
   Component
=========================== */

export default function OnboardingSignup({
  onSuccess,
  onBack,
}: OnboardingSignupProps) {
  const [phase, setPhase] = useState<Phase>("loading");
  const [reloadKey, setReloadKey] = useState(0);

  const [offer, setOffer] = useState<CommercialOffer | null>(null);
  const [config, setConfig] = useState<CheckoutConfig | null>(null);
  const [token, setToken] = useState<string>("");
  const [agreementText, setAgreementText] = useState<string>("");

  const [form, setForm] = useState<RegistrationForm>(emptyForm);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [banner, setBanner] = useState<string>("");

  const [card, setCard] = useState<CardForm>({
    cardNumber: "",
    expiry: "",
    cvc: "",
    zip: "",
  });
  const [cardType, setCardType] = useState<string>("");
  const [cardErrors, setCardErrors] = useState({
    cardNumber: "",
    expiry: "",
    cvc: "",
    zip: "",
  });
  const [paymentError, setPaymentError] = useState<string>("");
  const [holdMessage, setHoldMessage] = useState<string>("");

  const [submitting, setSubmitting] = useState(false);

  /* ---------- bootstrap: offer + config + session ---------- */

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setPhase("loading");
      setBanner("");
      try {
        const [nextOffer, nextConfig] = await Promise.all([
          getCurrentPricing(),
          getCheckoutConfig(),
        ]);
        if (cancelled) return;
        setOffer(nextOffer);
        setConfig(nextConfig);

        // Warm the Accept.js library; any failure surfaces at payment time.
        loadAcceptJs(nextConfig.accept_js.script_url).catch(() => undefined);

        const opened = await openSession();
        if (cancelled) return;

        setToken(opened.token);
        setAgreementText(opened.agreementText);
        if (opened.session?.offer) setOffer(opened.session.offer);

        const prefill = formFromRegistration(opened.session?.registration);
        if (Object.keys(prefill).length) {
          setForm((prev) => ({ ...prev, ...prefill }));
          const resumedZip =
            (prefill.sameBilling ? prefill.business?.zip : prefill.billing?.zip) || "";
          if (resumedZip) setCard((prev) => ({ ...prev, zip: resumedZip }));
        }

        switch (opened.status) {
          case "registered":
            setPhase("payment");
            break;
          case "payment_failed":
            setPaymentError(
              opened.session?.message ||
                "Your previous payment didn't go through. Please try a different card.",
            );
            setPhase("payment");
            break;
          case "payment_processing":
            setHoldMessage(
              opened.session?.message ||
                "Your payment is still being processed. Please don't resubmit; we'll email you as soon as it's confirmed.",
            );
            setPhase("processing_hold");
            break;
          case "paid":
          case "provisioning":
            onSuccess();
            break;
          default:
            setPhase("register");
        }
      } catch (error) {
        if (cancelled) return;
        if (error instanceof CommercialApiError && error.isSignupClosed) {
          setBanner(error.message || "Signup is temporarily closed.");
          setPhase("closed");
        } else {
          setBanner(
            error instanceof CommercialApiError && error.isNetwork
              ? error.message
              : "We couldn't start your checkout right now. Please try again in a moment.",
          );
          setPhase("unavailable");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadKey]);

  /* ---------- helpers ---------- */

  const errorFor = (key: string): string | undefined => fieldErrors[key]?.[0];

  const money = (cents: number | undefined, decimal?: string) =>
    offer ? formatMoney(cents, offer.currency, decimal) : "";

  const trialCharge = offer
    ? money(offer.trial.charge_cents, offer.trial.charge)
    : "";

  const effectiveBilling: AddressForm = form.sameBilling ? form.business : form.billing;

  const startNewSession = async () => {
    clearStoredToken();
    const created = await createCheckoutSession("standard");
    storeToken(created.token);
    setToken(created.token);
    setAgreementText(created.agreement_text);
    setOffer(created.offer);
  };

  const updateForm = <K extends keyof RegistrationForm>(
    field: K,
    value: RegistrationForm[K],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  /* ---------- step 1: registration ---------- */

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setBanner("");

    const local: FieldErrors = {};
    if (form.password.length < MIN_PASSWORD_LENGTH) {
      local.admin_password = [
        `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
      ];
    }
    if (form.password !== form.passwordConfirm) {
      local.admin_password_confirmation = ["Passwords do not match."];
    }
    if (!form.acceptTerms) {
      local.accept_terms = ["Please accept the Terms of Service to continue."];
    }
    if (!form.acceptRecurring) {
      local.accept_recurring_billing = [
        "Please authorize recurring billing to continue.",
      ];
    }
    setFieldErrors(local);
    if (Object.keys(local).length) return;

    const toAddress = (a: AddressForm): RegistrationPayload["business_address"] => ({
      street: a.street.trim(),
      ...(a.street2.trim() ? { street2: a.street2.trim() } : {}),
      city: a.city.trim(),
      state: a.state,
      zip: a.zip.trim(),
      country: "US",
    });

    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();
    let timezone: string | undefined;
    try {
      timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      timezone = undefined;
    }

    const payload: RegistrationPayload = {
      business_name: form.businessName.trim(),
      contact_name: `${firstName} ${lastName}`.trim(),
      first_name: firstName,
      last_name: lastName,
      email: form.email.trim(),
      phone: form.phone.replace(/\D/g, ""),
      ...(form.website.trim() ? { website: form.website.trim() } : {}),
      ...(timezone ? { timezone } : {}),
      business_address: toAddress(form.business),
      billing_address: toAddress(effectiveBilling),
      admin_password: form.password,
      admin_password_confirmation: form.passwordConfirm,
      accept_terms: true,
      accept_recurring_billing: true,
    };

    setSubmitting(true);
    try {
      await submitRegistration(token, payload);
      setCard((prev) => ({ ...prev, zip: effectiveBilling.zip.trim() }));
      setPaymentError("");
      setPhase("payment");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      if (error instanceof CommercialApiError) {
        if (error.isValidation) {
          setFieldErrors(error.errors);
          setBanner(error.message || "Please check the highlighted fields.");
        } else if (error.isSessionGone) {
          try {
            await startNewSession();
            setBanner(
              "Your checkout session expired, so we started a new one. Please review your details and submit again.",
            );
          } catch {
            setBanner(
              "Your checkout session expired and we couldn't start a new one. Please refresh the page.",
            );
          }
        } else {
          setBanner(error.message);
        }
      } else {
        setBanner("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------- step 2: payment ---------- */

  const handleCardChange = (field: keyof CardForm, value: string) => {
    setCard((prev) => ({ ...prev, [field]: value }));
    setCardErrors((prev) => ({ ...prev, [field]: "" }));
    setPaymentError("");
    if (field === "cardNumber") setCardType(detectCardType(value));
  };

  const handlePay = async (e: FormEvent) => {
    e.preventDefault();
    setPaymentError("");

    const errors = { cardNumber: "", expiry: "", cvc: "", zip: "" };
    if (!validateCardNumber(card.cardNumber)) errors.cardNumber = "Invalid card number";
    if (!validateExpiry(card.expiry)) errors.expiry = "Invalid or expired date";
    if (!validateCVC(card.cvc, cardType)) errors.cvc = "Invalid CVV";
    if (!card.zip.trim()) errors.zip = "Billing ZIP is required";
    setCardErrors(errors);
    if (errors.cardNumber || errors.expiry || errors.cvc || errors.zip) return;

    if (!config) {
      setPaymentError("Payment configuration hasn't loaded yet. Please refresh and try again.");
      return;
    }

    setSubmitting(true);
    try {
      await loadAcceptJs(config.accept_js.script_url);

      // Card data goes to Authorize.Net only. Kabba receives the opaque token.
      const opaque = await tokenizeCardData(
        {
          apiLoginID: config.accept_js.api_login_id,
          clientKey: config.accept_js.client_key,
        },
        {
          cardNumber: card.cardNumber,
          expiry: card.expiry,
          cvc: card.cvc,
          fullName: `${form.firstName} ${form.lastName}`.trim() || undefined,
          zip: card.zip.trim(),
        },
      );

      const outcome = await submitPayment(
        token,
        {
          opaque_data_descriptor: opaque.dataDescriptor,
          opaque_data_value: opaque.dataValue,
        },
        newIdempotencyKey(),
      );

      if (outcome.ok) {
        onSuccess();
        return;
      }

      if (outcome.status === "payment_processing") {
        setHoldMessage(outcome.message);
        setPhase("processing_hold");
        return;
      }

      // payment_failed: let them try another card.
      setPaymentError(outcome.message);
      setCard((prev) => ({ ...prev, cvc: "" }));
    } catch (error) {
      if (error instanceof CommercialApiError && error.isSessionGone) {
        try {
          await startNewSession();
          setPhase("register");
          setBanner(
            "Your checkout session expired before payment, so we started a new one. Please review your details and submit again.",
          );
          window.scrollTo({ top: 0, behavior: "smooth" });
        } catch {
          setPaymentError(
            "Your checkout session expired and we couldn't start a new one. Please refresh the page.",
          );
        }
      } else {
        setPaymentError(
          error instanceof Error
            ? error.message
            : "Unable to process your card. Please check the details and try again.",
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const backToDetails = async () => {
    setPaymentError("");
    if (!agreementText) {
      // Resumed session without the disclosure text: open a fresh one so the
      // customer sees and re-accepts the agreement before re-registering.
      try {
        await startNewSession();
      } catch {
        setPaymentError("We couldn't reopen your details right now. Please refresh the page.");
        return;
      }
    }
    setPhase("register");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ---------- left-column copy (amounts come from the offer) ---------- */

  const whatYouGet = [
    "Full access to the KABBA platform",
    "Transparent pricing — no hidden fees",
    "No demos. No pressure. No sales reps",
    "Software built inside a real rental shop",
    "Access to our Rental Business Growth Consultation",
    offer
      ? `Pay only when you rent — ${money(offer.usage.transaction_fee_cents, offer.usage.transaction_fee)} per qualifying rental`
      : "Pay only when you rent",
  ];

  /* ---------- render ---------- */

  const termsHref = config?.terms_url || "/terms-of-service";
  const refundHref = config?.refund_url || "/refund-cancellation";

  const renderCardBody = () => {
    switch (phase) {
      case "loading":
        return (
          <div className="py-16 flex flex-col items-center gap-4 text-gray-600">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            <p>Preparing your secure checkout…</p>
          </div>
        );

      case "closed":
        return (
          <div className="py-10 text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center">
                <AlertCircle className="w-7 h-7 text-amber-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              Signup is temporarily closed
            </h3>
            <p className="text-gray-600">{banner}</p>
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="text-emerald-600 hover:text-emerald-700 font-semibold"
              >
                ← Back to home
              </button>
            )}
          </div>
        );

      case "unavailable":
        return (
          <div className="py-10 text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
                <AlertCircle className="w-7 h-7 text-red-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              We couldn't start your checkout
            </h3>
            <p className="text-gray-600">{banner}</p>
            <button
              type="button"
              onClick={() => setReloadKey((k) => k + 1)}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all"
            >
              Try again
            </button>
          </div>
        );

      case "processing_hold":
        return (
          <div className="py-10 text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center">
                <Loader2 className="w-7 h-7 text-amber-600 animate-spin" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              Your payment is being processed
            </h3>
            <p className="text-gray-600">{holdMessage}</p>
            <p className="text-sm text-gray-500">
              Please don't resubmit your card.
              {form.email ? ` We'll email ${form.email} as soon as it's confirmed.` : " We'll email you as soon as it's confirmed."}
            </p>
          </div>
        );

      case "register":
        return (
          <form onSubmit={handleRegister} className="space-y-6">
            <StepIndicator current={1} />

            {banner && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{banner}</p>
                </div>
              </div>
            )}

            <TextInput
              id="businessName"
              label="Business Name"
              value={form.businessName}
              onChange={(v) => updateForm("businessName", v)}
              error={errorFor("business_name")}
              placeholder="Your Rental Shop"
              autoComplete="organization"
            />

            <div className="grid grid-cols-2 gap-4">
              <TextInput
                id="firstName"
                label="First Name"
                value={form.firstName}
                onChange={(v) => updateForm("firstName", v)}
                error={errorFor("first_name") || errorFor("contact_name")}
                placeholder="John"
                autoComplete="given-name"
              />
              <TextInput
                id="lastName"
                label="Last Name"
                value={form.lastName}
                onChange={(v) => updateForm("lastName", v)}
                error={errorFor("last_name")}
                placeholder="Smith"
                autoComplete="family-name"
              />
            </div>

            <TextInput
              id="email"
              label="Email"
              type="email"
              value={form.email}
              onChange={(v) => updateForm("email", v)}
              error={errorFor("email")}
              placeholder="john@rentalshop.com"
              autoComplete="email"
              inputMode="email"
            />

            <TextInput
              id="phone"
              label="Phone Number"
              type="tel"
              value={form.phone}
              onChange={(v) => updateForm("phone", formatPhoneNumber(v))}
              error={errorFor("phone")}
              placeholder="(555) 123-4567"
              maxLength={14}
              autoComplete="tel"
              inputMode="tel"
            />

            <TextInput
              id="website"
              label="Website"
              optional
              type="text"
              value={form.website}
              onChange={(v) => updateForm("website", v)}
              error={errorFor("website")}
              placeholder="https://www.yourrentalshop.com"
              autoComplete="url"
              inputMode="url"
            />

            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">
                Business Address
              </h3>
              <AddressFields
                idPrefix="business"
                errorPrefix="business_address"
                value={form.business}
                onChange={(next) => updateForm("business", next)}
                errorFor={errorFor}
              />
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">
                Billing Address
              </h3>
              <label className="flex items-start gap-3 cursor-pointer mb-4">
                <input
                  type="checkbox"
                  checked={form.sameBilling}
                  onChange={(e) => updateForm("sameBilling", e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm text-gray-700">
                  Same as business address
                </span>
              </label>
              {!form.sameBilling && (
                <AddressFields
                  idPrefix="billing"
                  errorPrefix="billing_address"
                  value={form.billing}
                  onChange={(next) => updateForm("billing", next)}
                  errorFor={errorFor}
                />
              )}
              {form.sameBilling && errorFor("billing_address") && (
                <p className="text-sm text-red-600">{errorFor("billing_address")}</p>
              )}
              <p className="text-xs text-gray-500 mt-3">
                Your billing address must match the address on file with your card issuer.
              </p>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">
                Create Your Admin Login
              </h3>
              <div className="space-y-4">
                <TextInput
                  id="password"
                  label="Password"
                  type="password"
                  value={form.password}
                  onChange={(v) => updateForm("password", v)}
                  error={errorFor("admin_password")}
                  hint={`At least ${MIN_PASSWORD_LENGTH} characters.`}
                  placeholder="Create a secure password"
                  autoComplete="new-password"
                />
                <TextInput
                  id="passwordConfirm"
                  label="Confirm Password"
                  type="password"
                  value={form.passwordConfirm}
                  onChange={(v) => updateForm("passwordConfirm", v)}
                  error={errorFor("admin_password_confirmation")}
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-lg font-semibold mb-3 text-gray-900">
                Billing Agreement
              </h3>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-64 overflow-y-auto">
                <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                  {agreementText}
                </p>
              </div>

              <div className="space-y-3 mt-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.acceptTerms}
                    onChange={(e) => updateForm("acceptTerms", e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-gray-700">
                    I have read and accept the{" "}
                    <a
                      href={termsHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 hover:text-emerald-700 underline"
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href={refundHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 hover:text-emerald-700 underline"
                    >
                      Refund &amp; Cancellation Policy
                    </a>
                    .
                  </span>
                </label>
                {errorFor("accept_terms") && (
                  <p className="text-sm text-red-600 ml-7">{errorFor("accept_terms")}</p>
                )}

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.acceptRecurring}
                    onChange={(e) => updateForm("acceptRecurring", e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-gray-700">
                    I authorize Kabba to charge my card on file{" "}
                    {offer
                      ? `every ${offer.subscription.interval_days} days`
                      : "each billing period"}{" "}
                    for my subscription and usage fees.
                  </span>
                </label>
                {errorFor("accept_recurring_billing") && (
                  <p className="text-sm text-red-600 ml-7">
                    {errorFor("accept_recurring_billing")}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-3">
                    <Spinner />
                    Saving your details…
                  </span>
                ) : (
                  "Continue to payment"
                )}
              </button>
              <p className="text-center text-sm text-gray-600 mt-4">
                Secure checkout • Cancel anytime • No contracts
              </p>
            </div>
          </form>
        );

      case "payment":
        return (
          <form onSubmit={handlePay} className="space-y-6">
            <StepIndicator current={2} />

            {offer && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-emerald-800">
                    Charged today
                  </span>
                  <span className="text-lg font-bold text-emerald-700">{trialCharge}</span>
                </div>
                <p className="text-xs text-emerald-700 mt-1">
                  Then {money(offer.subscription.fee_cents, offer.subscription.fee)} every{" "}
                  {offer.subscription.interval_days} days, plus{" "}
                  {money(offer.usage.transaction_fee_cents, offer.usage.transaction_fee)} per
                  qualifying rental.
                </p>
              </div>
            )}

            {paymentError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-red-800 mb-1">
                      Payment Error
                    </h4>
                    <p className="text-sm text-red-700">{paymentError}</p>
                  </div>
                </div>
              </div>
            )}

            <Field id="cardNumber" label="Card Number" error={cardErrors.cardNumber}>
              <div className="relative">
                <input
                  id="cardNumber"
                  type="text"
                  required
                  value={card.cardNumber}
                  onChange={(e) => handleCardChange("cardNumber", formatCardNumber(e.target.value))}
                  className={inputClass(!!cardErrors.cardNumber)}
                  placeholder="4242 4242 4242 4242"
                  autoComplete="cc-number"
                  inputMode="numeric"
                />
                {cardType && cardType !== "Unknown" && (
                  <span className="absolute right-3 top-3 text-sm text-gray-500">
                    {cardType}
                  </span>
                )}
              </div>
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <TextInput
                id="expiry"
                label="Expiry (MM/YY)"
                value={card.expiry}
                onChange={(v) => handleCardChange("expiry", formatExpiry(v))}
                error={cardErrors.expiry}
                placeholder="MM/YY"
                maxLength={5}
                autoComplete="cc-exp"
                inputMode="numeric"
              />
              <TextInput
                id="cvc"
                label="CVV"
                value={card.cvc}
                onChange={(v) => handleCardChange("cvc", v.replace(/\D/g, "").slice(0, 4))}
                error={cardErrors.cvc}
                placeholder="123"
                maxLength={4}
                autoComplete="cc-csc"
                inputMode="numeric"
              />
            </div>

            <TextInput
              id="cardZip"
              label="Billing ZIP Code"
              value={card.zip}
              onChange={(v) => handleCardChange("zip", v)}
              error={cardErrors.zip}
              placeholder="37201"
              maxLength={10}
              autoComplete="postal-code"
            />

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-3">
                    <Spinner />
                    Securing payment…
                  </span>
                ) : trialCharge ? (
                  `Pay ${trialCharge} and start my trial`
                ) : (
                  "Start my trial"
                )}
              </button>

              <button
                type="button"
                onClick={backToDetails}
                disabled={submitting}
                className="w-full mt-3 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50"
              >
                ← Back to business details
              </button>

              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mt-6">
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-emerald-700 font-medium">
                    Your card details are sent directly to Authorize.Net and never
                    touch Kabba's servers.
                  </p>
                </div>
              </div>
            </div>
          </form>
        );
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
                This is exactly how we'd start if we were opening a rental shop
                today.
              </h1>

              <div className="space-y-3 text-lg text-gray-300">
                <p>You're not booking a demo.</p>
                <p>You're not sitting through a sales pitch.</p>
                <p>
                  You're starting with the same tools and strategies we used
                  ourselves.
                </p>
              </div>
            </div>

            {offer && <OfferSummary offer={offer} />}

            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-emerald-400">
                {trialCharge
                  ? `Here's what you're getting today for ${trialCharge}:`
                  : "Here's what you're getting today:"}
              </h2>
              <ul className="space-y-3">
                {whatYouGet.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-white">
                There's no risk here.
              </h2>
              <ul className="space-y-3">
                {[
                  "Cancel anytime",
                  "No contracts",
                  "No setup fees",
                  "No long-term commitment",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>

              {offer && (
                <p className="mt-4 text-gray-400 leading-relaxed italic">
                  If you don't rent anything, you don't pay transaction fees — and
                  after your trial you pay only the{" "}
                  {money(offer.subscription.fee_cents, offer.subscription.fee)}{" "}
                  subscription fee every {offer.subscription.interval_days} days
                  unless you rent.
                </p>
              )}
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-white">
                Why we ask for a credit card
              </h2>
              <p className="text-gray-300 mb-4 leading-relaxed">
                We ask for a card for two simple reasons:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-gray-300 mb-4 ml-2">
                <li>
                  To make sure we're working with serious rental businesses
                </li>
                <li>
                  To securely process transactions when you actually rent
                  equipment
                </li>
              </ol>
              <p className="text-gray-300 leading-relaxed">
                Your billing address (including ZIP code) is required for
                standard card security checks.
              </p>
              <div className="flex items-start gap-3 mt-4">
                <Shield className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <p className="text-gray-300 text-sm leading-relaxed">
                  Your card is tokenized by Authorize.Net in your browser. Kabba
                  never sees or stores your card number.
                </p>
              </div>
              <p className="mt-4 text-emerald-400 font-medium">
                No surprise charges. No upfront fees. No games.
              </p>
            </div>

            <div className="bg-gray-800/50 border border-emerald-900/30 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-white">
                Built by rental operators who actually run a rental shop
              </h2>
              <p className="text-gray-300 mb-4 leading-relaxed">
                KABBA wasn't designed in a boardroom. It was built inside a real
                rental business that grew from zero to a multi-million-dollar,
                multi-location operation in under three years.
              </p>
              <p className="text-emerald-400 font-semibold">
                If it doesn't work in our shop, it doesn't ship.
              </p>
            </div>

            <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-white">
                What happens after you sign up
              </h2>
              <ol className="space-y-3">
                {[
                  "Register your business and pay for your trial (about 2 minutes)",
                  "We set up your Kabba instance and email you when it's ready",
                  "Add your equipment and pricing",
                  "Book your optional Business Growth Consultation",
                  "Start running your rental shop with clarity and confidence",
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
                You don't need to be "ready." You just need to be willing to
                start.
              </p>
            </div>
          </div>

          <div className="lg:sticky lg:top-8 lg:self-start">
            <div className="bg-white rounded-2xl p-8 shadow-2xl">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {trialCharge ? `Start Your ${trialCharge} Trial` : "Start Your Trial"}
                </h2>
                <p className="text-gray-600">
                  Get instant access to everything
                </p>
              </div>

              {renderCardBody()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
