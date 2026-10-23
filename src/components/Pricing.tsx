import { Check, ArrowRight, ExternalLink } from 'lucide-react';
import { formatMoney } from '../lib/commercial-api';
import { useCommercialOffer } from '../lib/useCommercialOffer';

interface PricingProps {
  onStartTrial: () => void;
  onViewDetailedPricing: () => void;
}

/**
 * Home-page pricing block. Every amount, period length and threshold comes
 * from the published offer (GET /api/commercial/v1/pricing/current); nothing
 * is hard-coded, so a published pricing change shows here without a deploy.
 */
export default function Pricing({ onStartTrial, onViewDetailedPricing }: PricingProps) {
  const { status, offer } = useCommercialOffer();

  const money = (cents: number | undefined, decimal?: string) =>
    offer ? formatMoney(cents, offer.currency, decimal) : '';
  const trial = offer ? money(offer.trial.charge_cents, offer.trial.charge) : null;
  const fee = offer ? money(offer.subscription.fee_cents, offer.subscription.fee) : null;
  const txn = offer ? money(offer.usage.transaction_fee_cents, offer.usage.transaction_fee) : null;
  const minimum = offer ? money(offer.usage.minimum_qualifying_cents, offer.usage.minimum_qualifying) : null;
  const days = offer?.subscription.interval_days;

  const features = offer
    ? [
        offer.trial.enabled ? `${trial} starter trial (${offer.trial.days} days)` : `${fee} for your first ${days} days`,
        `Then ${fee} every ${days} days, billed in advance`,
        `${txn} per qualifying rental transaction (${minimum} or more), billed after each period`,
        'No startup fees',
        'No contracts',
        'No risk',
      ]
    : ['No startup fees', 'No contracts', 'No risk'];

  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Simple, transparent pricing.
            <span className="block text-blue-300 mt-2">No surprises — ever.</span>
          </h2>
          <p className="text-2xl text-slate-300">
            {status === 'ready' && offer
              ? offer.trial.enabled
                ? `Start for just ${trial}, then only pay after you rent.`
                : `Start for ${fee}, then only pay after you rent.`
              : status === 'loading'
                ? 'Loading current pricing…'
                : 'Current pricing is shown at signup.'}
          </p>
        </div>

        <div className="bg-white text-slate-900 rounded-2xl shadow-2xl p-8 sm:p-12 max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-block bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              MOST POPULAR
            </div>
            <h3 className="text-3xl font-bold mb-2">Pay-As-You-Grow</h3>
            <p className="text-slate-600">Perfect for rental shops of all sizes</p>
          </div>

          <div className="space-y-4 mb-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="bg-blue-100 rounded-full p-1 flex-shrink-0">
                  <Check className="text-blue-600" size={20} />
                </div>
                <span className="text-lg font-medium">{feature}</span>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 mb-8 border border-amber-200">
            <p className="text-xl font-bold text-slate-900 text-center">
              Stop paying for software.
              <span className="block text-amber-600 mt-1">Start paying only when you make money.</span>
            </p>
            {offer?.tax?.note && <p className="text-xs text-slate-500 text-center mt-3">{offer.tax.note}</p>}
          </div>

          <div className="flex justify-center mb-4">
            <button onClick={onStartTrial} className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition shadow-lg hover:shadow-xl inline-flex items-center group">
              {offer?.trial.enabled && trial ? `Start Your ${trial} Trial` : 'Start Your Trial'}
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition" size={20} />
            </button>
          </div>

          <button
            onClick={onViewDetailedPricing}
            className="w-full text-blue-600 hover:text-blue-700 font-semibold text-base transition flex items-center justify-center group"
          >
            See how KABBA compares to competitors
            <ExternalLink className="ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
