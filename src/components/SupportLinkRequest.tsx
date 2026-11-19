import { FormEvent, useState } from "react";
import { Loader2, Mail } from "lucide-react";
import { CommercialApiError, requestSupportLink } from "../lib/commercial-api";

/**
 * "Email me a new link" (Kabba #276). The link only ever goes to the address
 * already on the case, and the answer is the same whether or not the case
 * number and email matched, so nobody can use this to look up a case.
 */
export default function SupportLinkRequest({ tone = "light" }: { tone?: "light" | "card" }) {
  const [reference, setReference] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!/^\s*KS-\d{5,}\s*$/i.test(reference)) {
      setError("Enter your case number as it appears in your email, e.g. KS-00012.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter the email address you used for the case.");
      return;
    }
    setBusy(true);
    try {
      setMessage(await requestSupportLink(reference.trim().toUpperCase(), email.trim()));
    } catch (err) {
      setError(
        err instanceof CommercialApiError && err.httpStatus === 429
          ? "Too many link requests. Please wait an hour or call us."
          : err instanceof Error
            ? err.message
            : "We couldn't send the request. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  };

  if (message) {
    return (
      <p role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
        {message}
      </p>
    );
  }

  const input =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/30";
  return (
    <form onSubmit={submit} noValidate className={tone === "card" ? "rounded-xl border border-slate-200 bg-white p-4" : ""} aria-label="Email me a new case link">
      <div className="space-y-2">
        <div>
          <label htmlFor="link-reference" className="block text-xs font-semibold text-slate-700 mb-1">Case number</label>
          <input id="link-reference" className={input} value={reference} onChange={(e) => setReference(e.target.value)} placeholder="KS-00012" maxLength={20} autoComplete="off" />
        </div>
        <div>
          <label htmlFor="link-email" className="block text-xs font-semibold text-slate-700 mb-1">Email on the case</label>
          <input id="link-email" type="email" className={input} value={email} onChange={(e) => setEmail(e.target.value)} maxLength={150} autoComplete="email" />
        </div>
        <button type="submit" disabled={busy} className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-800 disabled:opacity-60">
          {busy ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> : <Mail className="w-4 h-4" aria-hidden="true" />}
          Email me a new link
        </button>
      </div>
      {error && <p role="alert" className="mt-2 text-sm text-red-700">{error}</p>}
    </form>
  );
}
