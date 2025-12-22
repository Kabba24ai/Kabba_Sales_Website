import Footer from './Footer';
import Navbar from './Navbar';

interface RefundCancellationPageProps {
  onBack: () => void;
  onStartTrial: () => void;
  onViewPricing: () => void;
  onViewOurStory: () => void;
  onViewContact: () => void;
  onViewProduct: () => void;
  onViewConsultation: () => void;
  onViewPrivacyPolicy?: () => void;
  onViewTermsOfService?: () => void;
  onViewAcceptableUsePolicy?: () => void;
}

export default function RefundCancellationPage({
  onBack,
  onStartTrial,
  onViewPricing,
  onViewOurStory,
  onViewContact,
  onViewProduct,
  onViewConsultation,
  onViewPrivacyPolicy,
  onViewTermsOfService,
  onViewAcceptableUsePolicy
}: RefundCancellationPageProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar
        onStartTrial={onStartTrial}
        onViewPricing={onViewPricing}
        onViewOurStory={onViewOurStory}
        onViewContact={onViewContact}
        onBackToHome={onBack}
        onViewProduct={onViewProduct}
        onViewConsultation={onViewConsultation}
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Refund & Cancellation Policy</h1>
        <p className="text-slate-600 mb-12">Last updated: 12/20/2025</p>

        <div className="prose prose-slate max-w-none">
          <p className="text-slate-700 leading-relaxed mb-8">
            This Refund & Cancellation Policy explains how cancellations, refunds, and billing disputes are handled for KABBA.ai ("KABBA," "we," "us," or "our"). This policy applies to all users of the KABBA.ai platform.
          </p>

          <p className="text-slate-700 leading-relaxed mb-12">
            By using our Services, you agree to the terms outlined below.
          </p>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Trial Fees</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              KABBA may offer a $4.95 trial that provides access to the platform and onboarding resources.
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              The trial fee is non-refundable.
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              The trial fee covers access to the software, demo environment, onboarding preparation, and administrative costs.
            </p>
            <p className="text-slate-700 leading-relaxed">
              If you choose not to continue using KABBA after the trial, no further charges will occur provided you cancel before any paid subscription or usage fees are incurred.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Subscription Fees</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              KABBA charges a monthly subscription fee and per-transaction usage fees, as disclosed at signup.
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              Subscription fees are billed in advance.
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              Subscription fees are non-refundable, including for partial billing periods.
            </p>
            <p className="text-slate-700 leading-relaxed">
              Canceling a subscription stops future subscription billing but does not immediately disable account access.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Transaction Fees</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Transaction-based usage fees are charged based on actual platform activity.
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              Transaction fees are incurred only when rental transactions are processed.
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              Transaction fees are non-refundable, as they are tied to completed platform usage.
            </p>
            <p className="text-slate-700 leading-relaxed">
              If your account remains active after cancellation, transaction fees will continue to apply for any transactions processed during that time.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Cancellations</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              You may cancel your KABBA account at any time through your account settings or by contacting support.
            </p>
            <p className="text-slate-700 leading-relaxed mb-3">
              Upon cancellation:
            </p>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-1">
              <li>Your subscription will not renew for the next billing cycle</li>
              <li>Your account may remain active and accessible until the end of the current subscription period</li>
              <li>You remain responsible for any transaction-based usage fees incurred while your account remains active</li>
              <li>Any outstanding fees remain due and payable</li>
            </ul>
            <p className="text-slate-700 leading-relaxed">
              If you wish to avoid additional transaction fees after cancellation, you should discontinue use of the platform immediately.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Delayed Billing & Onboarding</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Some accounts may require a consultation or onboarding process before full activation.
            </p>
            <p className="text-slate-700 leading-relaxed mb-3">
              Billing may be delayed until onboarding requirements are completed
            </p>
            <p className="text-slate-700 leading-relaxed">
              If you choose not to proceed during onboarding, no additional charges beyond the trial fee will be applied
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">No Refunds for Usage</h2>
            <p className="text-slate-700 leading-relaxed mb-3">
              KABBA does not provide refunds for:
            </p>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-1">
              <li>Used subscription time</li>
              <li>Processed transactions</li>
              <li>Transaction fees incurred during an active period</li>
              <li>Inactivity during a billing period</li>
              <li>Failure to discontinue use of the Services after cancellation</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Chargebacks & Payment Disputes</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Before initiating a chargeback or payment dispute, we strongly encourage you to contact us so we can attempt to resolve the issue.
            </p>
            <p className="text-slate-700 leading-relaxed mb-3">
              Unauthorized chargebacks may result in:
            </p>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-1">
              <li>Suspension or termination of your account</li>
              <li>Loss of access to the Services</li>
              <li>Additional fees imposed by payment processors</li>
            </ul>
            <p className="text-slate-700 leading-relaxed">
              We maintain detailed records of account activity, billing authorization, and usage to respond to disputes.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Changes to This Policy</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              We may update this Refund & Cancellation Policy from time to time.
            </p>
            <p className="text-slate-700 leading-relaxed">
              Changes will be posted on this page with an updated "Last updated" date. Continued use of the Services constitutes acceptance of the revised policy.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Contact Us</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              If you have questions about this Refund & Cancellation Policy, please contact us by completing the form on our Contact Us page. We will respond as promptly as possible.
            </p>
            <button
              onClick={onViewContact}
              className="text-blue-600 hover:text-blue-700 font-medium underline"
            >
              Contact Us
            </button>
          </section>
        </div>
      </main>

      <Footer
        onViewOurStory={onViewOurStory}
        onViewContact={onViewContact}
        onViewProduct={onViewProduct}
        onViewPricing={onViewPricing}
        onViewConsultation={onViewConsultation}
        onViewPrivacyPolicy={onViewPrivacyPolicy}
        onViewTermsOfService={onViewTermsOfService}
        onViewRefundPolicy={scrollToTop}
        onViewAcceptableUsePolicy={onViewAcceptableUsePolicy}
      />
    </div>
  );
}
