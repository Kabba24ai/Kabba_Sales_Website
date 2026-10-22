import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Calendar,
  DollarSign,
  Phone,
  Loader2,
  AlertCircle,
  Hash,
  RefreshCw,
} from "lucide-react";
import {
  CheckoutSession,
  CommercialApiError,
  clearStoredToken,
  formatMoney,
  getCheckoutSession,
  readConsultationTime,
  readStoredToken,
} from "../lib/commercial-api";

interface TrialActivatedProps {
  /** Opens the optional onboarding-call picker. */
  onBookCall: () => void;
  /** Sends the customer back to /start-trial. */
  onStartOver: () => void;
}

type ViewState = "loading" | "missing" | "error" | "ready";

const POLL_MS = 10_000;

/** Session statuses that mean money changed hands and the trial exists. */
const ACTIVE_STATUSES = ["paid", "provisioning", "completed"] as const;
/** Session statuses we keep polling on. */
const POLLING_STATUSES = ["paid", "provisioning", "payment_processing"] as const;

export default function TrialActivated({
  onBookCall,
  onStartOver,
}: TrialActivatedProps) {
  const [view, setView] = useState<ViewState>("loading");
  const [session, setSession] = useState<CheckoutSession | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [consultationTime] = useState<string | null>(() => readConsultationTime());

  useEffect(() => {
    const token = readStoredToken();
    if (!token) {
      setView("missing");
      return;
    }

    let cancelled = false;
    let timer: number | undefined;

    const load = async () => {
      try {
        const next = await getCheckoutSession(token);
        if (cancelled) return;

        setSession(next);
        setErrorMessage("");
        setView("ready");

        if (next.status === "completed") {
          clearStoredToken();
        } else if (next.status === "expired") {
          clearStoredToken();
          setView("missing");
        } else if ((POLLING_STATUSES as readonly string[]).includes(next.status)) {
          timer = window.setTimeout(load, POLL_MS);
        }
      } catch (error) {
        if (cancelled) return;
        if (error instanceof CommercialApiError && error.isSessionGone) {
          clearStoredToken();
          setView("missing");
          return;
        }
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "We couldn't check your account status.",
        );
        // Keep whatever we last saw and retry quietly.
        setView((prev) => (prev === "ready" ? "ready" : "error"));
        timer = window.setTimeout(load, POLL_MS);
      }
    };

    load();

    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  /* ---------- derived ---------- */

  const isActive =
    !!session && (ACTIVE_STATUSES as readonly string[]).includes(session.status);
  const provisioning = session?.provisioning ?? null;
  const offer = session?.offer ?? null;

  const consultation = consultationTime ? new Date(consultationTime) : null;
  const consultationValid = !!consultation && !Number.isNaN(consultation.getTime());

  const provisioningCard = (() => {
    if (!isActive) return null;
    if (provisioning === "provisioned") {
      return {
        tone: "emerald" as const,
        icon: <CheckCircle2 className="w-6 h-6 text-emerald-500" />,
        title: "Your account is ready",
        body: "Check your inbox for your login details and the link to your Kabba instance.",
      };
    }
    if (provisioning === "failed") {
      return {
        tone: "amber" as const,
        icon: <AlertCircle className="w-6 h-6 text-amber-500" />,
        title: "We hit a snag; our team has been notified",
        body: "Your trial is paid for and nothing more will be charged while we sort this out. We'll email you as soon as your instance is ready.",
      };
    }
    return {
      tone: "cyan" as const,
      icon: <Loader2 className="w-6 h-6 text-cyan-500 animate-spin" />,
      title: "We're setting up your Kabba instance",
      body: "You'll get an email when it's ready. You can close this page; nothing else is needed from you right now.",
    };
  })();

  const toneClasses = {
    emerald: "bg-emerald-500/10 border-emerald-500/20",
    amber: "bg-amber-500/10 border-amber-500/20",
    cyan: "bg-cyan-500/10 border-cyan-500/20",
  };

  /* ---------- non-active states ---------- */

  if (view === "loading") {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-4 text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
          <p>Checking your account status…</p>
        </div>
      </div>
    );
  }

  if (view === "missing" || view === "error" || !session) {
    const missing = view === "missing" || !session;
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-gray-400" />
            </div>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">
            {missing ? "We couldn't find your checkout" : "We couldn't check your account status"}
          </h1>
          <p className="text-gray-400 mb-8">
            {missing
              ? "Your checkout session isn't available in this browser. If you already paid, check your email for your confirmation; otherwise you can start a trial now."
              : errorMessage}
          </p>
          <button
            onClick={onStartOver}
            className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-4 px-6 rounded-lg transition-all"
          >
            <RefreshCw className="w-5 h-5" />
            {missing ? "Start a trial" : "Back to checkout"}
          </button>
        </div>
      </div>
    );
  }

  if (!isActive) {
    const processing = session.status === "payment_processing";
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 text-center">
          <div className="flex justify-center mb-6">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center ${processing ? "bg-amber-500/20" : "bg-gray-800 border border-gray-700"}`}>
              {processing ? (
                <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
              ) : (
                <AlertCircle className="w-10 h-10 text-gray-400" />
              )}
            </div>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">
            {processing ? "Your payment is being processed" : "Your checkout isn't finished yet"}
          </h1>
          <p className="text-gray-400 mb-8">
            {processing
              ? session.message ||
                "Please don't resubmit your card. We'll email you as soon as your payment is confirmed."
              : session.message ||
                "Your trial hasn't been activated. Head back to checkout to finish registration and payment."}
          </p>
          {!processing && (
            <button
              onClick={onStartOver}
              className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-4 px-6 rounded-lg transition-all"
            >
              <RefreshCw className="w-5 h-5" />
              Back to checkout
            </button>
          )}
        </div>
      </div>
    );
  }

  /* ---------- active trial ---------- */

  const trialCharge = offer
    ? formatMoney(offer.trial.charge_cents, offer.currency, offer.trial.charge)
    : "";

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-500" />
            </div>
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Your Trial Is Activated
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Your payment went through and your trial is active.
          </p>

          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6 max-w-2xl mx-auto">
            <p className="text-lg text-emerald-400 font-medium">
              {trialCharge
                ? `Your ${trialCharge} KABBA trial is now active.`
                : "Your KABBA trial is now active."}
            </p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto space-y-8">
          {session.customer_reference && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <Hash className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm text-gray-400 mb-1">Customer reference</div>
                  <div className="text-lg font-semibold text-white tracking-wider">
                    {session.customer_reference}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Keep this handy if you need to contact support about your account.
                  </p>
                </div>
              </div>
            </div>
          )}

          {provisioningCard && (
            <div className={`border rounded-xl p-6 ${toneClasses[provisioningCard.tone]}`}>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">{provisioningCard.icon}</div>
                <div>
                  <h2 className="text-lg font-semibold text-white mb-1">
                    {provisioningCard.title}
                  </h2>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {provisioningCard.body}
                  </p>
                  {session.message && (
                    <p className="text-gray-500 text-xs mt-3">{session.message}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-6">What happens next</h2>
            <ol className="space-y-6">
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-sm">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-gray-200 mb-2">Watch your inbox</h3>
                  <p className="text-gray-400 text-sm">
                    We'll email you the link to your Kabba instance and your login as soon as it's provisioned.
                  </p>
                </div>
              </li>

              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-sm">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-gray-200 mb-2">Add your equipment and pricing</h3>
                  <p className="text-gray-400 text-sm">
                    Start building your catalog the moment your instance is ready.
                  </p>
                </div>
              </li>

              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-sm">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-gray-200 mb-2">Book an onboarding call (optional)</h3>
                  <p className="text-gray-400 text-sm">
                    We'll finalize your rental website setup, confirm equipment/pricing/workflows, and share proven growth strategies.
                  </p>
                </div>
              </li>
            </ol>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                {consultationValid && consultation ? (
                  <>
                    <div className="font-semibold mb-1">Your onboarding call is booked:</div>
                    <div className="text-emerald-400 mb-4">
                      {consultation.toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}{" "}
                      at{" "}
                      {consultation.toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </div>
                    <button
                      onClick={onBookCall}
                      className="text-sm text-gray-400 hover:text-gray-200 underline"
                    >
                      Change the time
                    </button>
                  </>
                ) : (
                  <>
                    <div className="font-semibold mb-1">Want a hand getting set up?</div>
                    <p className="text-gray-400 text-sm mb-4">
                      Pick a time for a setup &amp; strategy session with the operators who built KABBA.
                    </p>
                    <button
                      onClick={onBookCall}
                      className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 px-5 rounded-lg transition-all"
                    >
                      <Calendar className="w-5 h-5" />
                      Book your onboarding call (optional)
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {offer && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
              <div className="flex items-start gap-3">
                <DollarSign className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-200 mb-4">Billing Transparency</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Today:</span>
                      <span className="text-emerald-400 font-semibold">{trialCharge} trial</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-gray-400">After trial:</span>
                      <div className="text-right">
                        <div className="text-gray-300 font-semibold">
                          {formatMoney(offer.subscription.fee_cents, offer.currency, offer.subscription.fee)}{" "}
                          every {offer.subscription.interval_days} days
                        </div>
                        <div className="text-gray-500 text-xs">
                          + {formatMoney(offer.usage.transaction_fee_cents, offer.currency, offer.usage.transaction_fee)}{" "}
                          per qualifying rental of{" "}
                          {formatMoney(offer.usage.minimum_qualifying_cents, offer.currency, offer.usage.minimum_qualifying)}
                          {offer.usage.threshold_inclusive ? " or more" : " or over"}
                        </div>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-gray-800">
                      <p className="text-gray-500 text-xs text-center">
                        Your subscription renews every {offer.subscription.interval_days} days (about{" "}
                        {offer.subscription.periods_per_year} periods a year), not monthly. No contracts. Cancel anytime.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-gray-300 text-sm mb-2">
                  Need anything while we get you set up? We're here.
                </p>
                <div className="flex justify-center mt-4">
                  <a
                    href="tel:+16152896429"
                    className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-bold text-lg transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    Call Us: (615) 289-6429
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center py-8">
            <p className="text-2xl font-semibold text-emerald-400">
              Welcome to KABBA.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
