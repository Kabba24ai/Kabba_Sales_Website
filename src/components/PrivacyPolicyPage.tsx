import Footer from './Footer';
import Navbar from './Navbar';

interface PrivacyPolicyPageProps {
  onBack: () => void;
  onStartTrial: () => void;
  onViewPricing: () => void;
  onViewOurStory: () => void;
  onViewContact: () => void;
  onViewProduct: () => void;
  onViewConsultation: () => void;
  onViewTermsOfService?: () => void;
  onViewRefundPolicy?: () => void;
  onViewAcceptableUsePolicy?: () => void;
}

export default function PrivacyPolicyPage({
  onBack,
  onStartTrial,
  onViewPricing,
  onViewOurStory,
  onViewContact,
  onViewProduct,
  onViewConsultation,
  onViewTermsOfService,
  onViewRefundPolicy,
  onViewAcceptableUsePolicy
}: PrivacyPolicyPageProps) {
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
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Privacy Policy</h1>
        <p className="text-slate-600 mb-12">Last updated: 11/24/2026</p>

        <div className="prose prose-slate max-w-none">
          <p className="text-slate-700 leading-relaxed mb-8">
            KABBA.ai ("KABBA," "we," "us," or "our") respects your privacy and is committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, use, disclose, and safeguard information when you visit our website, use our software, or interact with our services.
          </p>

          <p className="text-slate-700 leading-relaxed mb-12">
            By using KABBA.ai, you agree to the practices described in this Privacy Policy.
          </p>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Information We Collect</h2>
            <p className="text-slate-700 leading-relaxed mb-6">
              We collect information in the following ways:
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3">Information You Provide to Us</h3>
            <p className="text-slate-700 leading-relaxed mb-3">
              When you register, request information, sign up for a trial, complete a form, or use our services, you may provide:
            </p>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-1">
              <li>Name</li>
              <li>Business name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Billing address</li>
              <li>Payment information</li>
              <li>Website URL or domain</li>
              <li>Any other information you choose to provide</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mb-3">Payment Information</h3>
            <p className="text-slate-700 leading-relaxed mb-6">
              Payment transactions are processed securely by third-party payment processors.<br />
              KABBA does not store full credit card numbers on its servers.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3">Automatically Collected Information</h3>
            <p className="text-slate-700 leading-relaxed mb-3">
              When you visit our website, we may automatically collect:
            </p>
            <ul className="list-disc pl-6 mb-3 text-slate-700 space-y-1">
              <li>IP address</li>
              <li>Browser type</li>
              <li>Device information</li>
              <li>Pages visited</li>
              <li>Date and time of access</li>
              <li>Referring URLs</li>
            </ul>
            <p className="text-slate-700 leading-relaxed">
              This information is used to improve performance, security, and usability.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">How We Use Your Information</h2>
            <p className="text-slate-700 leading-relaxed mb-3">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-1">
              <li>Provide, operate, and maintain our services</li>
              <li>Set up and manage user accounts</li>
              <li>Process payments and transactions</li>
              <li>Communicate regarding onboarding, consultations, and support</li>
              <li>Improve our software, website, and user experience</li>
              <li>Comply with legal and regulatory requirements</li>
              <li>Prevent fraud and ensure platform security</li>
            </ul>
            <p className="text-slate-700 leading-relaxed">
              We do not sell or rent personal information to third parties.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">How We Share Information</h2>
            <p className="text-slate-700 leading-relaxed mb-3">
              We may share information only as necessary with:
            </p>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-1">
              <li>Payment processors and financial institutions</li>
              <li>Hosting, infrastructure, and technology providers</li>
              <li>Customer support and communication tools</li>
              <li>Legal or regulatory authorities when required by law</li>
            </ul>
            <p className="text-slate-700 leading-relaxed">
              All service providers are required to maintain appropriate security and confidentiality standards.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Cookies & Tracking Technologies</h2>
            <p className="text-slate-700 leading-relaxed mb-3">
              We may use cookies and similar technologies to:
            </p>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-1">
              <li>Maintain user sessions</li>
              <li>Analyze site traffic and performance</li>
              <li>Improve website functionality</li>
            </ul>
            <p className="text-slate-700 leading-relaxed">
              You may disable cookies in your browser settings; however, some features of the site may not function properly.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Google Search Console and Marketing Intelligence</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              KABBA offers an optional Marketing Intelligence feature that lets an authorized business administrator connect a Google Search Console account. The administrator expressly authorizes read-only access through Google's secure authorization process and chooses which verified website property to monitor. Connecting this account is optional.
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              With this permission, KABBA can access the list of Search Console properties available to the connected account and search performance data for the selected property, including search queries, clicks, impressions, click-through rates, average search positions, and reporting dates. Google may withhold or aggregate some search queries.
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              KABBA uses this information to show the connected business its own organic search performance in its administrative console. The current integration is read-only: it does not change website content, manage Google Ads campaigns, or use this data for personalized advertising. It does not send Search Console data to an external AI provider.
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              Google OAuth credentials are encrypted and stored on the server. The current search report is retained for display to authorized administrators of the connected business. KABBA does not sell this Google data or share it with unrelated third parties. Service providers may process data only as necessary to operate and secure the service, subject to appropriate safeguards. KABBA's use and transfer of information received from Google APIs adheres to the <a href="https://developers.google.com/terms/api-services-user-data-policy" className="text-blue-600 hover:text-blue-700 underline" target="_blank" rel="noopener noreferrer">Google API Services User Data Policy</a>, including its Limited Use requirements where applicable.
            </p>
            <p className="text-slate-700 leading-relaxed">
              Authorized administrators can disconnect Google Search Console from within Marketing Intelligence at any time. KABBA then attempts to revoke the authorization at Google and removes the stored Google credentials, selected property, and saved search report. Limited connection, security, and audit records may be retained for legitimate operational purposes. Any future use of Google data for additional features will require appropriate updated disclosures and authorization before it is enabled.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Data Security</h2>
            <p className="text-slate-700 leading-relaxed mb-6">
              We implement reasonable administrative, technical, and physical safeguards designed to protect your information.
            </p>
            <p className="text-slate-700 leading-relaxed">
              While no system can guarantee absolute security, we follow industry-standard practices to protect sensitive data, including encryption and secure access controls.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Data Retention</h2>
            <p className="text-slate-700 leading-relaxed mb-3">
              We retain personal information only as long as necessary to:
            </p>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-1">
              <li>Provide our services</li>
              <li>Meet legal, regulatory, and accounting requirements</li>
              <li>Resolve disputes</li>
              <li>Enforce agreements</li>
            </ul>
            <p className="text-slate-700 leading-relaxed">
              You may request deletion of your account and associated data, subject to applicable legal obligations.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Your Rights & Choices</h2>
            <p className="text-slate-700 leading-relaxed mb-3">
              Depending on your location, you may have the right to:
            </p>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-1">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your data</li>
              <li>Opt out of certain communications</li>
            </ul>
            <p className="text-slate-700 leading-relaxed">
              To exercise these rights, please contact us as described below.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Third-Party Links</h2>
            <p className="text-slate-700 leading-relaxed">
              Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of external sites.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Children's Privacy</h2>
            <p className="text-slate-700 leading-relaxed mb-3">
              KABBA.ai is not intended for use by individuals under the age of 18.
            </p>
            <p className="text-slate-700 leading-relaxed">
              We do not knowingly collect personal information from minors.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Changes to This Privacy Policy</h2>
            <p className="text-slate-700 leading-relaxed mb-6">
              We may update this Privacy Policy from time to time.<br />
              Any changes will be posted on this page with an updated "Last updated" date.
            </p>
            <p className="text-slate-700 leading-relaxed">
              Your continued use of our services constitutes acceptance of the revised policy.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Contact Us</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              If you have questions about this Privacy Policy or our data practices, please contact us by completing the form on our Contact Us page. We will respond as promptly as possible.
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
        onViewPrivacyPolicy={scrollToTop}
        onViewTermsOfService={onViewTermsOfService}
        onViewRefundPolicy={onViewRefundPolicy}
        onViewAcceptableUsePolicy={onViewAcceptableUsePolicy}
      />
    </div>
  );
}
