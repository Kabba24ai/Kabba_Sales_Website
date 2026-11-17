import { useCallback, useEffect, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, Loader2, RefreshCw } from "lucide-react";
import {
  AvailabilityBatch,
  ConsultationKind,
  ConsultationSlot,
  getConsultationAvailability,
} from "../lib/commercial-api";

/**
 * Three consultation times at a time, straight from Kabba Central: weekdays
 * only (Monday–Friday), Central Time, each a server-signed slot. "Show more"
 * asks the server for the next three weekdays. Nothing here invents a time,
 * and a choice is a REQUEST until Kabba confirms it.
 */
interface ConsultationPickerProps {
  kind: ConsultationKind;
  tone?: "dark" | "light";
  selectedId: string | null;
  onSelect: (slot: ConsultationSlot | null) => void;
  /** Bump to reload the current times (e.g. after "that time was just taken"). */
  reloadKey?: number;
  /** Offer "No preference — contact me" (implementation requests). */
  allowNone?: boolean;
  noneSelected?: boolean;
  onSelectNone?: () => void;
}

export default function ConsultationPicker({
  kind,
  tone = "dark",
  selectedId,
  onSelect,
  reloadKey = 0,
  allowNone = false,
  noneSelected = false,
  onSelectNone,
}: ConsultationPickerProps) {
  const [cursors, setCursors] = useState<(string | null)[]>([null]);
  const [batch, setBatch] = useState<AvailabilityBatch | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const current = cursors[cursors.length - 1];

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setBatch(await getConsultationAvailability(kind, current));
    } catch (e) {
      setError(e instanceof Error ? e.message : "We couldn't load consultation times.");
    } finally {
      setLoading(false);
    }
  }, [kind, current]);

  useEffect(() => {
    load();
  }, [load, reloadKey]);

  const dark = tone === "dark";
  const c = {
    muted: dark ? "text-gray-400" : "text-slate-600",
    faint: dark ? "text-gray-500" : "text-slate-500",
    card: dark
      ? "bg-gray-900 border-gray-700 hover:border-gray-500"
      : "bg-white border-slate-200 hover:border-blue-400",
    selected: dark
      ? "bg-emerald-500/10 border-emerald-500 ring-2 ring-emerald-500/40"
      : "bg-blue-50 border-blue-600 ring-2 ring-blue-600/30",
    accent: dark ? "text-emerald-400" : "text-blue-700",
    title: dark ? "text-gray-100" : "text-slate-900",
    link: dark
      ? "text-gray-300 hover:text-white"
      : "text-blue-700 hover:text-blue-900",
    errorBox: dark
      ? "bg-red-500/10 border-red-500/30 text-red-300"
      : "bg-red-50 border-red-200 text-red-800",
  };

  const showMore = () => {
    if (batch?.next_after) {
      onSelect(null);
      setCursors((prev) => [...prev, batch.next_after]);
    }
  };
  const showEarlier = () => {
    if (cursors.length > 1) {
      onSelect(null);
      setCursors((prev) => prev.slice(0, -1));
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
        <h3 className={`text-lg font-semibold ${c.title}`}>Choose a weekday time</h3>
        <span className={`text-xs ${c.faint}`}>
          Monday–Friday · {batch?.timezone_label ?? "Central Time (CT)"}
          {batch ? ` · ${batch.duration_minutes} minutes` : ""}
        </span>
      </div>

      {error && (
        <div role="alert" className={`border rounded-lg p-4 mb-3 text-sm ${c.errorBox}`}>
          <p className="mb-2">{error}</p>
          <button type="button" onClick={load} className="inline-flex items-center gap-1 font-semibold underline">
            <RefreshCw className="w-4 h-4" aria-hidden="true" /> Try again
          </button>
        </div>
      )}

      <div className="space-y-3" role="radiogroup" aria-label="Available consultation times" aria-busy={loading}>
        {loading && !batch ? (
          <div className={`flex items-center gap-2 py-6 justify-center ${c.muted}`}>
            <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" /> Loading available weekday times…
          </div>
        ) : (
          batch?.slots.map((slot) => {
            const on = slot.id === selectedId;
            const [dayPart, timePart] = slot.label.split(" at ");
            return (
              <button
                key={slot.id}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => onSelect(on ? null : slot)}
                disabled={loading}
                className={`w-full text-left border rounded-xl p-4 transition flex items-center gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                  dark ? "focus-visible:ring-emerald-500 focus-visible:ring-offset-gray-950" : "focus-visible:ring-blue-600"
                } ${on ? c.selected : c.card}`}
              >
                <Calendar className={`w-5 h-5 flex-shrink-0 ${on ? c.accent : c.faint}`} aria-hidden="true" />
                <span className="flex-1 min-w-0">
                  <span className={`block font-semibold ${c.title}`}>{dayPart}</span>
                  <span className={`block text-sm ${on ? c.accent : c.muted}`}>{timePart}</span>
                </span>
                <span className={`text-xs font-semibold whitespace-nowrap ${on ? c.accent : c.faint}`}>
                  {on ? "Selected" : "Select"}
                </span>
              </button>
            );
          })
        )}

        {batch && batch.slots.length === 0 && !loading && (
          <p className={`text-sm ${c.muted}`}>{batch.notice}</p>
        )}

        {allowNone && (
          <button
            type="button"
            role="radio"
            aria-checked={noneSelected}
            onClick={() => {
              onSelect(null);
              onSelectNone?.();
            }}
            className={`w-full text-left border rounded-xl p-4 transition focus:outline-none focus-visible:ring-2 ${
              dark ? "focus-visible:ring-emerald-500" : "focus-visible:ring-blue-600"
            } ${noneSelected ? c.selected : c.card}`}
          >
            <span className={`block font-semibold ${c.title}`}>No preference — contact me</span>
            <span className={`block text-sm ${c.muted}`}>A Kabba specialist will call or email to find a time.</span>
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
        <button
          type="button"
          onClick={showEarlier}
          disabled={cursors.length < 2 || loading}
          className={`inline-flex items-center gap-1 text-sm font-medium disabled:opacity-0 disabled:pointer-events-none ${c.link}`}
        >
          <ChevronLeft className="w-4 h-4" aria-hidden="true" /> Earlier times
        </button>
        <button
          type="button"
          onClick={showMore}
          disabled={!batch?.next_after || loading}
          className={`inline-flex items-center gap-1 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed ${c.link}`}
        >
          {loading && batch ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> : null}
          Show 3 more weekday times <ChevronRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
      {batch && batch.slots.length > 0 && (
        <p className={`text-xs mt-3 ${c.faint}`}>{batch.notice}</p>
      )}
    </div>
  );
}
