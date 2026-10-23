import { useEffect, useState } from "react";
import { getCurrentPricing, type CommercialOffer } from "./commercial-api";

/**
 * The published offer, fetched once per page load and shared by every
 * component that shows a price. There is deliberately NO hard-coded
 * fallback: a price the backend did not publish is never shown.
 */
export type OfferState =
  | { status: "loading"; offer: null }
  | { status: "ready"; offer: CommercialOffer }
  | { status: "unavailable"; offer: null };

let cached: CommercialOffer | null = null;
let inflight: Promise<CommercialOffer> | null = null;

function load(): Promise<CommercialOffer> {
  if (cached) return Promise.resolve(cached);
  if (!inflight) {
    inflight = getCurrentPricing()
      .then((offer) => {
        cached = offer;
        return offer;
      })
      .finally(() => {
        inflight = null;
      });
  }
  return inflight;
}

export function useCommercialOffer(): OfferState {
  const [state, setState] = useState<OfferState>(
    cached ? { status: "ready", offer: cached } : { status: "loading", offer: null },
  );

  useEffect(() => {
    if (cached) return;
    let cancelled = false;
    load()
      .then((offer) => {
        if (!cancelled) setState({ status: "ready", offer });
      })
      .catch(() => {
        if (!cancelled) setState({ status: "unavailable", offer: null });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

/** Test/HMR helper. */
export function resetOfferCache(): void {
  cached = null;
  inflight = null;
}
