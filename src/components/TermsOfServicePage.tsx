import Footer from './Footer';
import Navbar from './Navbar';

interface TermsOfServicePageProps {
  onBack: () => void;
  onStartTrial: () => void;
  onViewPricing: () => void;
  onViewOurStory: () => void;
  onViewContact: () => void;
  onViewProduct: () => void;
  onViewConsultation: () => void;
  onViewPrivacyPolicy?: () => void;
}

export default function TermsOfServicePage({
  onBack,
  onStartTrial,
  onViewPricing,
  onViewOurStory,
  onViewContact,
  onViewProduct,
  onViewConsultation,
  onViewPrivacyPolicy
}: TermsOfServicePageProps) {
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
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Terms of Service</h1>
        <p className="text-slate-600 mb-12">Last updated: 12/20/2025</p>

        <div className="prose prose-slate max-w-none">
          <p className="text-slate-700 leading-relaxed mb-8">
            These Terms of Service ("Terms") govern your access to and use of the KABBA.ai website, software, and related services (collectively, the "Services") provided by KABBA.ai ("KABBA," "we," "us," or "our").
          </p>

          <p className="text-slate-700 leading-relaxed mb-12">
            By accessing or using the Services, you agree to be bound by these Terms. If you do not agree, you may not use the Services.
          </p>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Eligibility</h2>
            <p className="text-slate-700 leading-relaxed">
              You must be at least 18 years old and have the authority to enter into these Terms on behalf of yourself or your business to use the Services.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Account Registration</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              To access certain features, you must create an account and provide accurate, complete, and current information.
            </p>
            <p className="text-slate-700 leading-relaxed mb-3">
              You are responsible for:
            </p>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-1">
              <li>Maintaining the confidentiality of your login credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us promptly of any unauthorized use</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Free Trial & Subscription</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              KABBA may offer a $4.95 trial that provides limited or full access to the Services for a trial period.
            </p>
            <p className="text-slate-700 leading-relaxed mb-3">
              By starting a trial:
            </p>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-1">
              <li>You authorize KABBA to charge the trial fee disclosed at signup</li>
              <li>You acknowledge that onboarding may require a consultation before full setup</li>
              <li>Trial access may be limited until onboarding requirements are completed</li>
            </ul>
            <p className="text-slate-700 leading-relaxed">
              Unless otherwise stated, trial subscriptions will convert to a paid subscription unless canceled.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Fees & Payment</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              KABBA operates on a subscription plus transaction-based pricing model.
            </p>
            <p className="text-slate-700 leading-relaxed mb-3">
              Fees may include:
            </p>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-1">
              <li>A monthly subscription fee</li>
              <li>Per-transaction usage fees</li>
              <li>Applicable taxes</li>
            </ul>
            <p className="text-slate-700 leading-relaxed mb-4">
              You authorize KABBA to charge all applicable fees to the payment method on file.
            </p>
            <p className="text-slate-700 leading-relaxed">
              All fees are non-refundable, except where required by law or expressly stated otherwise.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Delayed Billing & Consultation Process</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Certain services may require a consultation or setup process before billing begins.
            </p>
            <p className="text-slate-700 leading-relaxed mb-3">
              You acknowledge and agree that:
            </p>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-1">
              <li>Charges may be delayed until onboarding or consultation steps are completed</li>
              <li>Failure to complete onboarding may limit or delay access to certain features</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Acceptable Use</h2>
            <p className="text-slate-700 leading-relaxed mb-3">
              You agree not to:
            </p>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-1">
              <li>Use the Services for unlawful purposes</li>
              <li>Interfere with or disrupt the platform</li>
              <li>Attempt to access unauthorized systems or data</li>
              <li>Reverse engineer, copy, or misuse the software</li>
            </ul>
            <p className="text-slate-700 leading-relaxed">
              We reserve the right to suspend or terminate accounts that violate these Terms.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Data & Content</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              You retain ownership of your data.
            </p>
            <p className="text-slate-700 leading-relaxed">
              By using the Services, you grant KABBA a limited license to process and store your data solely to provide the Services.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Intellectual Property</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              All software, trademarks, logos, and content provided by KABBA are owned by KABBA or its licensors and are protected by intellectual property laws.
            </p>
            <p className="text-slate-700 leading-relaxed">
              You may not copy, modify, or distribute any portion of the Services without prior written consent.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Third-Party Services</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              The Services may integrate with third-party tools or services.
            </p>
            <p className="text-slate-700 leading-relaxed">
              KABBA is not responsible for the availability, accuracy, or functionality of third-party services.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Termination</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              You may cancel your account at any time through your account settings.
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              KABBA may suspend or terminate your account if you violate these Terms or fail to pay applicable fees.
            </p>
            <p className="text-slate-700 leading-relaxed mb-3">
              Upon termination:
            </p>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-1">
              <li>Access to the Services will end</li>
              <li>Outstanding fees remain due</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Disclaimer of Warranties</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              The Services are provided "as is" and "as available."
            </p>
            <p className="text-slate-700 leading-relaxed">
              KABBA makes no warranties, express or implied, including fitness for a particular purpose or uninterrupted operation.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Limitation of Liability</h2>
            <p className="text-slate-700 leading-relaxed mb-3">
              To the maximum extent permitted by law, KABBA shall not be liable for:
            </p>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-1">
              <li>Indirect, incidental, or consequential damages</li>
              <li>Loss of profits, data, or business opportunities</li>
            </ul>
            <p className="text-slate-700 leading-relaxed">
              KABBA's total liability shall not exceed the amounts paid by you to KABBA in the twelve (12) months preceding the claim.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Indemnification</h2>
            <p className="text-slate-700 leading-relaxed">
              You agree to indemnify and hold harmless KABBA from claims arising out of your use of the Services or violation of these Terms.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Changes to These Terms</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              We may update these Terms from time to time.
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              Changes will be posted on this page with an updated "Last updated" date.
            </p>
            <p className="text-slate-700 leading-relaxed">
              Continued use of the Services constitutes acceptance of the revised Terms.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Governing Law</h2>
            <p className="text-slate-700 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of the applicable jurisdiction where KABBA operates, without regard to conflict of law principles.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Contact Us</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              If you have questions about these Terms, please contact us by completing the form on our Contact Us page. We will respond as promptly as possible.
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
        onViewTermsOfService={scrollToTop}
      />
    </div>
  );
}
