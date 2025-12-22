import Footer from './Footer';
import Navbar from './Navbar';

interface AcceptableUsePolicyPageProps {
  onBack: () => void;
  onStartTrial: () => void;
  onViewPricing: () => void;
  onViewOurStory: () => void;
  onViewContact: () => void;
  onViewProduct: () => void;
  onViewConsultation: () => void;
  onViewPrivacyPolicy?: () => void;
  onViewTermsOfService?: () => void;
  onViewRefundPolicy?: () => void;
}

export default function AcceptableUsePolicyPage({
  onBack,
  onStartTrial,
  onViewPricing,
  onViewOurStory,
  onViewContact,
  onViewProduct,
  onViewConsultation,
  onViewPrivacyPolicy,
  onViewTermsOfService,
  onViewRefundPolicy
}: AcceptableUsePolicyPageProps) {
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
      <div className="max-w-4xl mx-auto px-6 py-24">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Acceptable Use Policy</h1>

        <p className="text-gray-600 mb-12">Last updated: 12/20/2025</p>

        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 leading-relaxed mb-8">
            This Acceptable Use Policy ("AUP") governs the use of the KABBA.ai website, software, and related services ("Services"). This policy is intended to ensure lawful, respectful, and secure use of the platform.
          </p>

          <p className="text-gray-700 leading-relaxed mb-8">
            By accessing or using the Services, you agree to comply with this Acceptable Use Policy.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Permitted Use</h2>
          <p className="text-gray-700 leading-relaxed mb-4">You may use KABBA.ai only for:</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-8">
            <li>lawful rental business operations</li>
            <li>managing equipment, inventory, customers, and transactions</li>
            <li>activities consistent with the intended purpose of the Services</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Prohibited Activities</h2>
          <p className="text-gray-700 leading-relaxed mb-4">You may not use KABBA.ai to:</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-8">
            <li>Violate any applicable laws or regulations</li>
            <li>Engage in fraudulent, deceptive, or misleading activities</li>
            <li>Process unauthorized, false, or fictitious transactions</li>
            <li>Infringe upon intellectual property rights</li>
            <li>Upload malicious code, malware, or harmful scripts</li>
            <li>Attempt to gain unauthorized access to systems or data</li>
            <li>Interfere with platform security, integrity, or performance</li>
            <li>Use the Services to harass, abuse, or harm others</li>
            <li>Reverse engineer, copy, or exploit the software</li>
            <li>Circumvent usage limits, pricing, or billing mechanisms</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Data Integrity & Accuracy</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            You are responsible for ensuring that all data entered into the platform is accurate, lawful, and authorized.
          </p>
          <p className="text-gray-700 leading-relaxed mb-8">
            KABBA is not responsible for errors, losses, or disputes arising from inaccurate or unauthorized data entry.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Account Security</h2>
          <p className="text-gray-700 leading-relaxed mb-4">You are responsible for:</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
            <li>maintaining the confidentiality of your login credentials</li>
            <li>all activity conducted through your account</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mb-8">
            You must notify KABBA immediately of any suspected unauthorized access or security breach.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Monitoring & Enforcement</h2>
          <p className="text-gray-700 leading-relaxed mb-4">KABBA reserves the right to:</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
            <li>monitor usage to ensure compliance</li>
            <li>investigate suspected violations</li>
            <li>suspend or terminate access without notice for violations of this policy</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mb-8">
            Violations may result in account suspension, termination, or legal action where appropriate.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">No Circumvention of Fees</h2>
          <p className="text-gray-700 leading-relaxed mb-4">You may not attempt to:</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
            <li>avoid transaction fees</li>
            <li>manipulate transaction data</li>
            <li>bypass billing mechanisms</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mb-8">
            Any attempt to circumvent fees constitutes a material breach of this policy.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Service Availability</h2>
          <p className="text-gray-700 leading-relaxed mb-4">You may not:</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-8">
            <li>interfere with the availability or performance of the Services</li>
            <li>attempt denial-of-service or similar attacks</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Reporting Violations</h2>
          <p className="text-gray-700 leading-relaxed mb-8">
            If you believe someone is violating this policy, please report it via the Contact Us page.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Changes to This Policy</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            We may update this Acceptable Use Policy from time to time.
          </p>
          <p className="text-gray-700 leading-relaxed mb-8">
            Changes will be posted on this page with an updated "Last updated" date. Continued use of the Services constitutes acceptance of the revised policy.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Contact Us</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            If you have questions about this Acceptable Use Policy, please contact us by completing the form on our Contact Us page. We will respond as promptly as possible.
          </p>
          <button
            onClick={onViewContact}
            className="text-blue-600 hover:text-blue-700 font-medium underline"
          >
            Contact Us
          </button>
        </div>
      </div>
      <Footer
        onViewOurStory={onViewOurStory}
        onViewContact={onViewContact}
        onViewProduct={onViewProduct}
        onViewPricing={onViewPricing}
        onViewConsultation={onViewConsultation}
        onViewPrivacyPolicy={onViewPrivacyPolicy}
        onViewTermsOfService={onViewTermsOfService}
        onViewRefundPolicy={onViewRefundPolicy}
        onViewAcceptableUsePolicy={scrollToTop}
      />
    </div>
  );
}
