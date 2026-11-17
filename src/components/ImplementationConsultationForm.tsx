import { FormEvent, useEffect, useRef, useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import ConsultationPicker from "./ConsultationPicker";
import {
  CommercialApiError,
  ConsultationSlot,
  ImplementationPackage,
  InquiryResult,
  newIdempotencyKey,
  submitImplementationInquiry,
} from "../lib/commercial-api";
import { finalCta, packageOptions } from "../lib/implementation-content";

/**
 * Implementation Services consultation request (Kabba_Sales_Website #19,
 * Kabba #267). Open to anyone — no Kabba subscription needed — and it records
 * a REQUEST in Kabba Commercial Administration: it never creates an account,
 * a subscription or a charge. A chosen weekday time is a preference until a
 * Kabba specialist confirms it.
 */
interface Props {
  /** Package chosen from a pricing card ("Discuss Professional"). */
  preselected: ImplementationPackage | null;
}

type Fields = { name: string; business: string; email: string; phone: string; message: string };
type FieldErrors = Partial<Record<keyof Fields | "package" | "slot", string>>;

const empty: Fields = { name: "", business: "", email: "", phone: "", message: "" };

export default function ImplementationConsultationForm({ preselected }: Props) {
  const [fields, setFields] = useState<Fields>(empty);
  const [pkg, setPkg] = useState<ImplementationPackage | "">(preselected ?? "");
  const [slot, setSlot] = useState<ConsultationSlot | null>(null);
  const [noPreference, setNoPreference] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<InquiryResult | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const startedAt = useRef(Date.now());
  const requestId = useRef(newIdempotencyKey());
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (preselected) setPkg(preselected);
  }, [preselected]);

  useEffect(() => {
    if (result) resultRef.current?.focus();
  }, [result]);

  const set = (key: keyof Fields) => (e: { target: { value: string } }) => {
    setFields((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const validate = (): FieldErrors => {
    const er: FieldErrors = {};
    if (fields.name.trim().length < 2) er.name = "Enter your name.";
    if (fields.business.trim().length < 2) er.business = "Enter your business name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) er.email = "Enter a valid email address.";
    if (fields.phone.replace(/\D/g, "").length < 10) er.phone = "Enter a phone number we can call.";
    if (!pkg) er.package = "Choose the package you're interested in.";
    if (!slot && !noPreference) er.slot = "Choose a weekday time, or “No preference — contact me”.";
    return er;
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError("");
    const er = validate();
    setErrors(er);
    if (Object.keys(er).length > 0) {
      const first = Object.keys(er)[0];
      document.getElementById(`impl-${first}`)?.focus();
      return;
    }
    setSubmitting(true);
    try {
      const res = await submitImplementationInquiry({
        name: fields.name.trim(),
        business: fields.business.trim(),
        email: fields.email.trim(),
        phone: fields.phone.trim(),
        package: pkg as ImplementationPackage,
        message: fields.message.trim() || undefined,
        slot: slot?.id ?? null,
        request_id: requestId.current,
        elapsed_ms: Date.now() - startedAt.current,
        company_website: honeypot,
      });
      setResult(res);
    } catch (err) {
      if (err instanceof CommercialApiError && err.isValidation) {
        const server: FieldErrors = {};
        for (const [k, v] of Object.entries(err.errors)) server[k as keyof FieldErrors] = v[0];
        setErrors(server);
        if (server.slot) {
          setSlot(null);
          setReloadKey((n) => n + 1);
        }
        setFormError(err.message);
      } else {
        setFormError(err instanceof Error ? err.message : "We couldn't send your request. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    return (
      <div ref={resultRef} tabIndex={-1} className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-slate-900 outline-none" aria-live="polite">
        <CheckCircle2 className="w-12 h-12 text-emerald-600 mb-4" aria-hidden="true" />
        <h3 className="text-2xl font-bold mb-2">Your consultation request is in.</h3>
        <p className="text-slate-600 mb-4">{result.message}</p>
        {result.consultation?.when && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 mb-4">
            <div className="text-sm text-amber-800 font-semibold">Requested time — pending confirmation</div>
            <div className="text-lg font-semibold text-slate-900">{result.consultation.when}</div>
          </div>
        )}
        <p className="text-sm text-slate-500">
          We'll email you at {fields.email.trim()} when a specialist confirms. Implementation Services are optional and priced separately
          from your Kabba software subscription; requesting a consultation creates no charge.
        </p>
      </div>
    );
  }

  const input =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/30";
  const label = "block text-sm font-semibold text-slate-800 mb-1";
  const err = (k: keyof FieldErrors) =>
    errors[k] ? (
      <p id={`impl-${k}-error`} className="mt-1 text-sm text-red-700">
        {errors[k]}
      </p>
    ) : null;
  const aria = (k: keyof FieldErrors) => ({
    "aria-invalid": errors[k] ? true : undefined,
    "aria-describedby": errors[k] ? `impl-${k}-error` : undefined,
  });

  return (
    <form onSubmit={submit} noValidate className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-slate-900" aria-label="Request an Implementation Services consultation">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="impl-name" className={label}>Your name</label>
          <input id="impl-name" className={input} value={fields.name} onChange={set("name")} autoComplete="name" maxLength={120} {...aria("name")} />
          {err("name")}
        </div>
        <div>
          <label htmlFor="impl-business" className={label}>Business name</label>
          <input id="impl-business" className={input} value={fields.business} onChange={set("business")} autoComplete="organization" maxLength={160} {...aria("business")} />
          {err("business")}
        </div>
        <div>
          <label htmlFor="impl-email" className={label}>Email</label>
          <input id="impl-email" type="email" className={input} value={fields.email} onChange={set("email")} autoComplete="email" maxLength={150} {...aria("email")} />
          {err("email")}
        </div>
        <div>
          <label htmlFor="impl-phone" className={label}>Phone</label>
          <input id="impl-phone" type="tel" className={input} value={fields.phone} onChange={set("phone")} autoComplete="tel" maxLength={40} placeholder="(615) 555-0123" {...aria("phone")} />
          {err("phone")}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="impl-package" className={label}>Package of interest</label>
          <select
            id="impl-package"
            className={input}
            value={pkg}
            onChange={(e) => {
              setPkg(e.target.value as ImplementationPackage);
              setErrors((er) => ({ ...er, package: undefined }));
            }}
            {...aria("package")}
          >
            <option value="">Choose a package…</option>
            {packageOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          {err("package")}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="impl-message" className={label}>
            What would you like help with? <span className="font-normal text-slate-500">(optional)</span>
          </label>
          <textarea id="impl-message" rows={3} className={input} value={fields.message} onChange={set("message")} maxLength={2000}
            placeholder="How many items you rent, your website today, when you want to launch…" />
        </div>
      </div>

      {/* Honeypot: hidden from people and assistive technology; bots fill it. */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
        <label htmlFor="impl-company-website">Company website</label>
        <input id="impl-company-website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
      </div>

      <fieldset className="mt-6" id="impl-slot" tabIndex={-1}>
        <legend className="sr-only">Preferred consultation time</legend>
        <ConsultationPicker
          kind="implementation"
          tone="light"
          selectedId={slot?.id ?? null}
          onSelect={(s) => {
            setSlot(s);
            if (s) setNoPreference(false);
            setErrors((er) => ({ ...er, slot: undefined }));
          }}
          reloadKey={reloadKey}
          allowNone
          noneSelected={noPreference}
          onSelectNone={() => {
            setNoPreference(true);
            setErrors((er) => ({ ...er, slot: undefined }));
          }}
        />
        {err("slot")}
      </fieldset>

      {formError && (
        <div role="alert" className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{formError}</div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-6 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-amber-600 disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
      >
        {submitting ? <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" /> : <Send className="w-5 h-5" aria-hidden="true" />}
        {finalCta.cta}
      </button>
      <p className="mt-3 text-center text-sm text-slate-600">{finalCta.followUp}</p>
      <p className="mt-1 text-center text-xs text-slate-500">
        No subscription or payment required to ask. Implementation Services are priced separately from the Kabba software subscription.
      </p>
    </form>
  );
}
