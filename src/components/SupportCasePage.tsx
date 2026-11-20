import { FormEvent, useEffect, useRef, useState } from "react";
import { AlertCircle, ArrowLeft, Loader2, Send } from "lucide-react";
import SupportLinkRequest from "./SupportLinkRequest";
import {
  CommercialApiError,
  SupportCaseView,
  getSupportCase,
  newIdempotencyKey,
  replyToSupportCase,
} from "../lib/commercial-api";

/**
 * /support/case?t=… — one support case, through the private link Kabba
 * emailed to the address on it (Kabba #276). Shows the customer's own
 * messages and Kabba's replies (never internal notes) and lets them reply.
 * The token is moved out of the address bar as soon as it is read, so it is
 * not left in browser history or shared by copying the URL.
 */
const LINK_KEY = "kabba.support.link";
const TOKEN_PATTERN = /^[A-Za-z0-9_-]{16,128}$/;

function readToken(): string | null {
  try {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get("t");
    if (fromUrl && TOKEN_PATTERN.test(fromUrl)) {
      window.sessionStorage.setItem(LINK_KEY, fromUrl);
      window.history.replaceState(null, "", window.location.pathname);
      return fromUrl;
    }
    const stored = window.sessionStorage.getItem(LINK_KEY);
    return stored && TOKEN_PATTERN.test(stored) ? stored : null;
  } catch {
    return null;
  }
}

const statusTone: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  in_progress: "bg-amber-100 text-amber-800",
  waiting_on_customer: "bg-purple-100 text-purple-800",
  resolved: "bg-emerald-100 text-emerald-800",
  closed: "bg-slate-200 text-slate-700",
};

function when(iso: string): string {
  try {
    return new Date(iso).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
  } catch {
    return iso;
  }
}

export default function SupportCasePage({ onNewRequest, onHome }: { onNewRequest: () => void; onHome: () => void }) {
  const [token] = useState<string | null>(() => readToken());
  const [view, setView] = useState<SupportCaseView | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "invalid" | "error">(token ? "loading" : "invalid");
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const requestId = useRef(newIdempotencyKey());
  const noticeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    getSupportCase(token)
      .then((v) => {
        if (cancelled) return;
        setView(v);
        setState("ready");
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof CommercialApiError && err.httpStatus === 404) {
          try {
            window.sessionStorage.removeItem(LINK_KEY);
          } catch {
            // storage unavailable
          }
          setState("invalid");
        } else {
          setError(err instanceof Error ? err.message : "We couldn't load your case.");
          setState("error");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  useEffect(() => {
    if (notice) noticeRef.current?.focus();
  }, [notice]);

  const reply = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!token || text.trim().length < 2) {
      setError("Write your message first.");
      return;
    }
    setBusy(true);
    try {
      const res = await replyToSupportCase(token, text.trim(), requestId.current);
      setView(res);
      setText("");
      setNotice(res.message);
      requestId.current = newIdempotencyKey();
    } catch (err) {
      if (err instanceof CommercialApiError && err.httpStatus === 404) {
        setState("invalid");
      } else if (err instanceof CommercialApiError && err.httpStatus === 409) {
        setError(err.message);
        setView((v) => (v ? { ...v, case: { ...v.case, can_reply: false, status: "closed", status_label: "Closed" } } : v));
      } else if (err instanceof CommercialApiError && err.httpStatus === 429) {
        setError("You've sent several messages recently. Please wait a little while or call us.");
      } else {
        setError(err instanceof Error ? err.message : "We couldn't send your message. Please try again.");
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-slate-900 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <button onClick={onHome} className="flex items-center" aria-label="KABBA home">
            <img src="/kabba_logo_-_text_only.png" alt="KABBA" className="h-8 w-auto" />
          </button>
          <span className="text-sm text-slate-300">Kabba Support</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {state === "loading" && (
          <div className="flex items-center gap-3 text-slate-600" role="status">
            <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" /> Loading your case…
          </div>
        )}

        {state === "invalid" && (
          <div className="rounded-2xl bg-white p-6 shadow-md" data-support-link-invalid>
            <div className="flex items-center gap-2 text-lg font-semibold mb-2">
              <AlertCircle className="w-5 h-5 text-amber-600" aria-hidden="true" /> This link has expired or isn't valid
            </div>
            <p className="text-slate-600 mb-4">
              Case links are private and expire. Enter your case number and the email address you used, and we'll email a new link to that
              address.
            </p>
            <SupportLinkRequest />
            <button onClick={onNewRequest} className="mt-5 inline-flex items-center gap-2 text-blue-700 font-semibold hover:underline">
              <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Open a new support request
            </button>
          </div>
        )}

        {state === "error" && (
          <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">{error}</div>
        )}

        {state === "ready" && view && (
          <div className="space-y-6" data-support-case>
            <div className="rounded-2xl bg-white p-6 shadow-md">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                <div className="text-sm font-semibold text-slate-500">Case {view.case.reference}</div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone[view.case.status] ?? statusTone.new}`}>{view.case.status_label}</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 break-words">{view.case.subject}</h1>
              <p className="text-sm text-slate-500 mt-1">{view.case.category} · opened {when(view.case.submitted_at)}</p>
            </div>

            <ol className="space-y-4" aria-label="Messages on this case">
              {view.messages.map((m) => (
                <li
                  key={m.id}
                  className={`rounded-2xl p-5 shadow-sm ${m.from === "kabba" ? "bg-emerald-50 border border-emerald-200 sm:ml-8" : "bg-white border border-slate-200 sm:mr-8"}`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2 text-sm">
                    <span className="font-semibold text-slate-900">{m.from === "kabba" ? m.author : "You"}</span>
                    <span className="text-slate-500">{when(m.at)}</span>
                  </div>
                  {m.corrects && <div className="text-xs font-semibold text-amber-800 mb-1">Correction to an earlier reply</div>}
                  <div className="whitespace-pre-line break-words text-slate-800">{m.body}</div>
                </li>
              ))}
            </ol>

            {notice && (
              <div ref={noticeRef} tabIndex={-1} role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900 outline-none">
                {notice}
              </div>
            )}

            {view.case.can_reply ? (
              <form onSubmit={reply} noValidate className="rounded-2xl bg-white p-6 shadow-md" aria-label="Reply to Kabba Support">
                <label htmlFor="support-reply" className="block font-semibold text-slate-900 mb-1">Add a message</label>
                {view.case.reply_reopens && (
                  <p className="text-sm text-slate-600 mb-2">This case is resolved. Sending a message reopens it.</p>
                )}
                <textarea
                  id="support-reply"
                  rows={5}
                  maxLength={5000}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? "support-reply-error" : undefined}
                />
                <p className="mt-1 text-xs text-slate-500">Never include passwords or full card numbers.</p>
                {error && <p id="support-reply-error" role="alert" className="mt-2 text-sm text-red-700">{error}</p>}
                <button
                  type="submit"
                  disabled={busy}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-3 font-semibold text-white hover:bg-amber-600 disabled:opacity-60"
                >
                  {busy ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> : <Send className="w-4 h-4" aria-hidden="true" />}
                  Send message
                </button>
              </form>
            ) : (
              <div className="rounded-2xl bg-white p-6 shadow-md text-slate-700">
                {error && <p role="alert" className="mb-2 text-sm text-red-700">{error}</p>}
                This case is closed. If you need more help,{" "}
                <button onClick={onNewRequest} className="font-semibold text-blue-700 hover:underline">open a new support request</button> and mention
                case {view.case.reference}.
              </div>
            )}

            <p className="text-xs text-slate-500">
              This private link works until {when(view.link_expires_at)}. Every email we send about this case includes a new one.
              {view.support_phone && <> Need to talk? Call Kabba support at {view.support_phone}.</>}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
