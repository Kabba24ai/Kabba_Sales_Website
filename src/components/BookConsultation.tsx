import { useEffect, useState } from "react";
import { AlertCircle, ArrowLeft, CalendarCheck, CheckCircle2, Clock, Loader2, Phone } from "lucide-react";
import ConsultationPicker from "./ConsultationPicker";
import {
  BookingResult,
  CommercialApiError,
  ConsultationSlot,
  ConsultationState,
  bookConsultationWithCheckout,
  bookConsultationWithLink,
  cancelConsultationWithCheckout,
  cancelConsultationWithLink,
  getBookingLink,
  getCheckoutSession,
} from "../lib/commercial-api";

/**
 * The optional onboarding consultation for a paid trial customer (Kabba #267).
 * Reached from the success page (the checkout session token in this browser)
 * or from the private link in the customer's email. Times come from Kabba
 * Central; a booking is saved there and is a REQUEST until Kabba confirms it.
 * The trial is active either way.
 */
export type BookingAccess = { via: "checkout"; token: string } | { via: "link"; token: string };

interface BookConsultationProps {
  access: BookingAccess | null;
  onBack: () => void;
  backLabel: string;
}

const ACTIVE = ["requested", "confirmed", "rescheduled"];

export default function BookConsultation({ access, onBack, backLabel }: BookConsultationProps) {
  const [state, setState] = useState<"loading" | "ready" | "missing" | "error">("loading");
  const [business, setBusiness] = useState<string | null>(null);
  const [consultation, setConsultation] = useState<ConsultationState | null>(null);
  const [selected, setSelected] = useState<ConsultationSlot | null>(null);
  const [changing, setChanging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!access) {
      setState("missing");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        if (access.via === "link") {
          const info = await getBookingLink(access.token);
          if (cancelled) return;
          setBusiness(info.business_name);
          setConsultation(info.consultation);
        } else {
          const session = await getCheckoutSession(access.token);
          if (cancelled) return;
          if (!session.onboarding) {
            setState("missing");
            return;
          }
          setBusiness(session.registration?.business_name ?? null);
          setConsultation(session.onboarding.consultation);
        }
        setState("ready");
      } catch (e) {
        if (cancelled) return;
        if (e instanceof CommercialApiError && (e.isSessionGone || e.httpStatus === 404)) {
          setState("missing");
        } else {
          setError(e instanceof Error ? e.message : "We couldn't load your consultation.");
          setState("error");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [access]);

  const hasOpen = !!consultation && ACTIVE.includes(consultation.status);
  const showPicker = state === "ready" && (!hasOpen || changing);

  const book = async () => {
    if (!access || !selected) return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const result: BookingResult =
        access.via === "link"
          ? await bookConsultationWithLink(access.token, selected.id)
          : await bookConsultationWithCheckout(access.token, selected.id);
      setConsultation(result.consultation);
      setMessage(result.message);
      setChanging(false);
      setSelected(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "We couldn't save that time.");
      setSelected(null);
      setReloadKey((k) => k + 1); // the times may have changed: show the current ones
    } finally {
      setBusy(false);
    }
  };

  const cancel = async () => {
    if (!access || !window.confirm("Cancel your consultation request? Your trial is not affected.")) return;
    setBusy(true);
    setError("");
    try {
      const result =
        access.via === "link" ? await cancelConsultationWithLink(access.token) : await cancelConsultationWithCheckout(access.token);
      setConsultation(result.consultation);
      setMessage(result.message);
      setChanging(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "We couldn't cancel the consultation.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 lg:py-16">
        <button onClick={onBack} className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-200 mb-8">
          <ArrowLeft className="w-4 h-4" aria-hidden="true" /> {backLabel}
        </button>

        <header className="mb-8">
          <p className="text-emerald-400 text-sm font-semibold uppercase tracking-wide mb-2">Optional · Free with your trial</p>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Book your onboarding consultation</h1>
          <p className="text-gray-400 leading-relaxed">
            Meet with the operators who built KABBA to finalize your rental website, confirm equipment, pricing and workflows, and
            share proven growth strategies.{business ? ` For ${business}.` : ""} Your trial is active whether or not you book.
          </p>
        </header>

        {state === "loading" && (
          <div className="flex items-center gap-3 text-gray-400 py-12 justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-500" aria-hidden="true" /> Loading your consultation…
          </div>
        )}

        {state === "missing" && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
            <AlertCircle className="w-10 h-10 text-gray-400 mx-auto mb-3" aria-hidden="true" />
            <h2 className="text-xl font-semibold mb-2">This booking link is not available</h2>
            <p className="text-gray-400 text-sm mb-4">
              It may have expired, or it was opened in a different browser. Use the link in your Kabba welcome email, or call us and we
              will schedule it with you.
            </p>
            <a href="tel:+16152896429" className="inline-flex items-center gap-2 text-emerald-400 font-semibold">
              <Phone className="w-4 h-4" aria-hidden="true" /> (615) 289-6429
            </a>
          </div>
        )}

        {state === "error" && (
          <div role="alert" className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-red-200">{error}</div>
        )}

        {state === "ready" && (
          <div className="space-y-6">
            <div aria-live="polite">
              {message && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-emerald-200 text-sm flex gap-3">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" aria-hidden="true" />
                  <span>{message}</span>
                </div>
              )}
              {error && (
                <div role="alert" className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-200 text-sm mt-3">{error}</div>
              )}
            </div>

            {hasOpen && consultation && (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  {consultation.status === "requested" ? (
                    <Clock className="w-6 h-6 text-amber-400 flex-shrink-0" aria-hidden="true" />
                  ) : (
                    <CalendarCheck className="w-6 h-6 text-emerald-400 flex-shrink-0" aria-hidden="true" />
                  )}
                  <div className="flex-1">
                    <div className="text-sm text-gray-400">
                      {consultation.status === "requested" ? "Requested — awaiting confirmation from Kabba" : "Confirmed by Kabba"}
                    </div>
                    <div className="text-lg font-semibold text-white">{consultation.when}</div>
                    <p className="text-xs text-gray-500 mt-1">
                      {consultation.status === "requested"
                        ? "We'll email you as soon as a specialist confirms this time."
                        : "A Kabba specialist will call you at the number on your account."}
                    </p>
                    {!changing && (
                      <div className="flex flex-wrap gap-4 mt-4 text-sm">
                        <button onClick={() => setChanging(true)} disabled={busy} className="text-emerald-400 hover:text-emerald-300 font-semibold">
                          Choose a different time
                        </button>
                        <button onClick={cancel} disabled={busy} className="text-gray-400 hover:text-gray-200 underline">
                          Cancel consultation
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {showPicker && (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <ConsultationPicker kind="onboarding" tone="dark" selectedId={selected?.id ?? null} onSelect={setSelected} reloadKey={reloadKey} />
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <button
                    onClick={book}
                    disabled={!selected || busy}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-semibold py-3 px-5 rounded-lg transition"
                  >
                    {busy ? <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" /> : null}
                    {hasOpen ? "Request this new time" : "Request this consultation time"}
                  </button>
                  {changing && (
                    <button onClick={() => { setChanging(false); setSelected(null); }} className="py-3 px-5 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800">
                      Keep my current time
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  A requested time is saved with Kabba immediately and confirmed by a specialist, usually within one business day.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
