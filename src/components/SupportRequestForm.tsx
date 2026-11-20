import { FormEvent, useEffect, useRef, useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import {
  CommercialApiError,
  SUPPORT_CATEGORIES,
  SupportCategory,
  SupportCategoryOption,
  SupportSubmitResult,
  newIdempotencyKey,
  submitSupportRequest,
} from "../lib/commercial-api";

/**
 * The Get Support form (Kabba #276). Works without a Kabba login, so someone
 * locked out of their admin can still reach us. It opens a support CASE in
 * Kabba Commercial Administration — never an account, a subscription or a
 * charge — and the case number shown is the server's. "Urgent" is a request,
 * not a promised response time.
 */
interface Props {
  categories: SupportCategoryOption[];
  linkDays: number;
}

type Fields = {
  name: string;
  business: string;
  email: string;
  phone: string;
  subject: string;
  description: string;
  related_url: string;
};
type FieldKey = keyof Fields | "category" | "form";
type FieldErrors = Partial<Record<FieldKey, string>>;

const empty: Fields = { name: "", business: "", email: "", phone: "", subject: "", description: "", related_url: "" };
const MAX_DESCRIPTION = 5000;

export default function SupportRequestForm({ categories, linkDays }: Props) {
  const [fields, setFields] = useState<Fields>(empty);
  const [category, setCategory] = useState<SupportCategory | "">("");
  const [urgent, setUrgent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SupportSubmitResult | null>(null);
  const startedAt = useRef(Date.now());
  const requestId = useRef(newIdempotencyKey());
  const resultRef = useRef<HTMLDivElement>(null);
  const options = categories.length > 0 ? categories : SUPPORT_CATEGORIES;

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
    if (fields.phone.trim() !== "" && fields.phone.replace(/\D/g, "").length < 10) er.phone = "Enter a phone number we can call, or leave it blank.";
    if (!category) er.category = "Choose what your request is about.";
    if (fields.subject.trim().length < 3) er.subject = "Give your request a short subject.";
    if (fields.description.trim().length < 10) er.description = "Tell us a little more about what is happening.";
    if (fields.related_url.trim() !== "" && !/^https?:\/\/\S+$/i.test(fields.related_url.trim()))
      er.related_url = "Enter the full address starting with https://, or leave it blank.";
    return er;
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError("");
    const er = validate();
    setErrors(er);
    if (Object.keys(er).length > 0) {
      document.getElementById(`support-${Object.keys(er)[0]}`)?.focus();
      return;
    }
    setSubmitting(true);
    try {
      const res = await submitSupportRequest({
        name: fields.name.trim(),
        business: fields.business.trim(),
        email: fields.email.trim(),
        phone: fields.phone.trim() || undefined,
        category: category as SupportCategory,
        subject: fields.subject.trim(),
        description: fields.description.trim(),
        related_url: fields.related_url.trim() || undefined,
        priority: urgent ? "urgent" : "normal",
        request_id: requestId.current,
        elapsed_ms: Date.now() - startedAt.current,
        company_website: honeypot,
      });
      setResult(res);
    } catch (err) {
      if (err instanceof CommercialApiError && err.isValidation) {
        const server: FieldErrors = {};
        for (const [k, v] of Object.entries(err.errors)) server[k as FieldKey] = v[0];
        setErrors(server);
        setFormError(server.form ?? err.message);
        // Re-arm the spam timer so a genuine second attempt is accepted.
        startedAt.current = Date.now() - 3000;
      } else if (err instanceof CommercialApiError && err.httpStatus === 429) {
        setFormError("We have received several requests from you recently. Please call us, or try again in a little while.");
      } else {
        setFormError(err instanceof Error ? err.message : "We couldn't send your request. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    return (
      <div ref={resultRef} tabIndex={-1} className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-slate-900 outline-none" aria-live="polite" data-support-result>
        <CheckCircle2 className="w-12 h-12 text-emerald-600 mb-4" aria-hidden="true" />
        <h2 className="text-2xl font-bold mb-2">Your support request is in.</h2>
        {result.reference && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 mb-4">
            <div className="text-sm text-emerald-800 font-semibold">Your case number</div>
            <div className="text-3xl font-bold tracking-wide text-slate-900" data-support-reference>{result.reference}</div>
          </div>
        )}
        <p className="text-slate-700 mb-3">{result.message}</p>
        <p className="text-sm text-slate-600">
          The email includes a private link to follow your case and send us more details. The link works for {linkDays} days, and every email
          we send about this case includes a fresh one. Replies to the email itself aren't added to your case, so please use the link.
        </p>
      </div>
    );
  }

  const input =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/30";
  const label = "block text-sm font-semibold text-slate-800 mb-1";
  const err = (k: FieldKey) =>
    errors[k] ? (
      <p id={`support-${k}-error`} className="mt-1 text-sm text-red-700">
        {errors[k]}
      </p>
    ) : null;
  const aria = (k: FieldKey) => ({
    "aria-invalid": errors[k] ? true : undefined,
    "aria-describedby": errors[k] ? `support-${k}-error` : undefined,
  });

  return (
    <form onSubmit={submit} noValidate className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-slate-900" aria-label="Request Kabba support" data-support-form>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="support-name" className={label}>Your name</label>
          <input id="support-name" className={input} value={fields.name} onChange={set("name")} autoComplete="name" maxLength={120} {...aria("name")} />
          {err("name")}
        </div>
        <div>
          <label htmlFor="support-business" className={label}>Business name</label>
          <input id="support-business" className={input} value={fields.business} onChange={set("business")} autoComplete="organization" maxLength={160} {...aria("business")} />
          {err("business")}
        </div>
        <div>
          <label htmlFor="support-email" className={label}>Email</label>
          <input id="support-email" type="email" className={input} value={fields.email} onChange={set("email")} autoComplete="email" maxLength={150} {...aria("email")} />
          {err("email")}
        </div>
        <div>
          <label htmlFor="support-phone" className={label}>
            Phone <span className="font-normal text-slate-500">(optional)</span>
          </label>
          <input id="support-phone" type="tel" className={input} value={fields.phone} onChange={set("phone")} autoComplete="tel" maxLength={40} placeholder="(615) 555-0123" {...aria("phone")} />
          {err("phone")}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="support-category" className={label}>What is this about?</label>
          <select
            id="support-category"
            className={input}
            value={category}
            onChange={(e) => {
              setCategory(e.target.value as SupportCategory);
              setErrors((er) => ({ ...er, category: undefined }));
            }}
            {...aria("category")}
          >
            <option value="">Choose a category…</option>
            {options.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          {err("category")}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="support-subject" className={label}>Subject</label>
          <input id="support-subject" className={input} value={fields.subject} onChange={set("subject")} maxLength={200} placeholder="e.g. I can't sign in to my admin" {...aria("subject")} />
          {err("subject")}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="support-description" className={label}>What's happening?</label>
          <textarea
            id="support-description"
            rows={6}
            className={input}
            value={fields.description}
            onChange={set("description")}
            maxLength={MAX_DESCRIPTION}
            placeholder="What you were trying to do, what happened instead, and when it started."
            {...aria("description")}
          />
          <div className="mt-1 flex justify-between gap-2 text-xs text-slate-500">
            <span>Never include passwords or full card numbers. Kabba will never ask for them.</span>
            <span aria-hidden="true">{fields.description.length}/{MAX_DESCRIPTION}</span>
          </div>
          {err("description")}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="support-related_url" className={label}>
            Related page in your Kabba admin <span className="font-normal text-slate-500">(optional)</span>
          </label>
          <input id="support-related_url" type="url" className={input} value={fields.related_url} onChange={set("related_url")} maxLength={500} placeholder="https://admin.yourbusiness.com/…" {...aria("related_url")} />
          {err("related_url")}
        </div>
        <div className="sm:col-span-2">
          <label className="flex items-start gap-3 rounded-lg border border-slate-200 p-3 cursor-pointer">
            <input type="checkbox" className="mt-1 h-4 w-4" checked={urgent} onChange={(e) => setUrgent(e.target.checked)} />
            <span className="text-sm text-slate-700">
              <span className="font-semibold text-slate-900">Request urgent priority</span> — for example, you can't take orders. We review urgent
              requests first; this is a request, not a guaranteed response time.
            </span>
          </label>
        </div>
      </div>

      {/* Honeypot: hidden from people and assistive technology; bots fill it. */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
        <label htmlFor="support-company-website">Company website</label>
        <input id="support-company-website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
      </div>

      {formError && (
        <div role="alert" className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{formError}</div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-6 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-amber-600 disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
      >
        {submitting ? <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" /> : <Send className="w-5 h-5" aria-hidden="true" />}
        Send to Kabba Support
      </button>
      <p className="mt-3 text-center text-xs text-slate-500">
        You'll get a case number right away and an email with a private link to follow your case.
      </p>
    </form>
  );
}
