import { formatMoney } from "./commercial-api";
import { useCommercialOffer } from "./useCommercialOffer";

/**
 * Marketing strings that name the trial price, built from the published
 * offer. While the offer is loading or unavailable the strings are neutral:
 * no price is ever shown that the backend did not publish.
 */
export function useTrialCopy() {
  const { offer } = useCommercialOffer();
  const trialCharge =
    offer && offer.trial.enabled
      ? formatMoney(offer.trial.charge_cents, offer.currency, offer.trial.charge)
      : null;

  return {
    /** e.g. "$4.95", or null while unknown / when no paid trial is offered */
    trialCharge,
    startTrial: trialCharge ? `Start Your ${trialCharge} Trial` : "Start Your Trial",
    startMyTrial: trialCharge ? `Start My ${trialCharge} Trial` : "Start My Trial",
    startTrialShort: trialCharge ? `Start ${trialCharge} Trial` : "Start Trial",
    forJust: trialCharge
      ? `Start for just ${trialCharge}, and only pay when you rent.`
      : "Start with a low-cost trial, and only pay when you rent.",
  };
}
