import Navbar from './Navbar';
import Footer from './Footer';

interface OurStoryProps {
  onStartTrial: () => void;
  onViewPricing: () => void;
  onBack: () => void;
  onViewContact: () => void;
  onViewProduct: () => void;
  onViewConsultation: () => void;
  onViewPrivacyPolicy?: () => void;
  onViewTermsOfService?: () => void;
  onViewRefundPolicy?: () => void;
  onViewAcceptableUsePolicy?: () => void;
}

export default function OurStory({ onStartTrial, onViewPricing, onBack, onViewContact, onViewProduct, onViewConsultation, onViewPrivacyPolicy, onViewTermsOfService, onViewRefundPolicy, onViewAcceptableUsePolicy }: OurStoryProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar
        onStartTrial={onStartTrial}
        onViewPricing={onViewPricing}
        onViewOurStory={onBack}
        onViewContact={onViewContact}
        onBackToHome={onBack}
        onViewProduct={onViewProduct}
        onViewConsultation={onViewConsultation}
      />

      <main className="pt-24 pb-20">
        <article className="max-w-3xl mx-auto px-6 sm:px-8">

          <header className="mb-16">
            <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-4 leading-tight">
              About KABBA
            </h1>
            <p className="text-xl sm:text-2xl text-slate-600">
              Built by operators. Forged by necessity.
            </p>
          </header>

          <div className="max-w-none">

            <section className="mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
                We didn't start in rental software
              </h2>

              <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
                <p>
                  Before KABBA, we built software for businesses that depended on it every day.
                </p>

                <p>
                  One platform was a fully integrated e-commerce system — handling everything from online sales and payments, with built-in upselling and cross-selling, to CRM sales automation, project management, membership systems, customer support tools, and affiliate tracking.
                </p>

                <p>
                  Another platform powered soccer clubs, managing scheduling, coaching video analysis, registrations, and e-commerce — all in one system that had to work flawlessly for thousands of families and staff.
                </p>

                <p>
                  These weren't side projects.<br />
                  They were full, production-grade platforms used by real organizations with real consequences if things didn't work.
                </p>

                <p>
                  Eventually, we sold those businesses and moved on to the next chapter.
                </p>
              </div>
            </section>

            <div className="border-t border-slate-200 my-16"></div>

            <section className="mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
                Then we became rental operators
              </h2>

              <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
                <p>
                  We didn't enter the rental industry to build software.<br />
                  We entered it to run a rental business.
                </p>

                <p>
                  And very quickly, we ran into a problem.
                </p>

                <p>
                  Every rental software option we evaluated was:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>outdated</li>
                  <li>overly complex</li>
                  <li>built for large enterprises</li>
                  <li>priced in a way that ignores cash flow and seasonality</li>
                  <li>or disconnected from how independent rental shops actually operate</li>
                </ul>

                <p>
                  Nothing felt modern.<br />
                  Nothing felt flexible.<br />
                  Nothing felt aligned with the realities of day-to-day rental operations.
                </p>
              </div>
            </section>

            <div className="border-t border-slate-200 my-16"></div>

            <section className="mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
                So we built what we couldn't find
              </h2>

              <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
                <p>
                  At first, KABBA wasn't a product.<br />
                  It was survival.
                </p>

                <p>
                  We built software internally to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>track inventory accurately</li>
                  <li>manage availability in real time</li>
                  <li>handle customers, paperwork, and scheduling</li>
                  <li>move faster during busy seasons</li>
                  <li>and protect cash flow during slow ones</li>
                </ul>

                <p>
                  As our rental business grew — from zero to a multi-million-dollar, multi-location operation in under three years — the software evolved with it.
                </p>

                <p>
                  If it didn't work in our shop, it didn't ship.
                </p>
              </div>
            </section>

            <div className="border-t border-slate-200 my-16"></div>

            <section className="mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
                This wasn't just our problem
              </h2>

              <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
                <p>
                  As other rental shop owners saw what we were running, the same question kept coming up:
                </p>

                <p className="text-xl italic text-slate-700">
                  "Why doesn't everyone have this?"
                </p>

                <p>
                  That's when we decided to make KABBA available to other independent rental businesses — not as a generic SaaS product, but as the exact system we run ourselves.
                </p>

                <p>
                  No enterprise bloat.<br />
                  No hidden pricing.<br />
                  No sales games.
                </p>

                <p>
                  Just rental software built by people who actually depend on it every day.
                </p>
              </div>
            </section>

            <div className="border-t border-slate-200 my-16"></div>

            <section className="mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
                Why KABBA is different
              </h2>

              <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
                <p>
                  KABBA isn't software designed <em>for</em> rental shops.<br />
                  It's software designed <em>inside</em> one.
                </p>

                <p>
                  That shows up in:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>transparent, revenue-aligned pricing</li>
                  <li>workflows that match real rental days</li>
                  <li>tools that reduce friction instead of adding it</li>
                  <li>a platform that respects cash flow and seasonality</li>
                </ul>

                <p>
                  We don't sell demos.<br />
                  We don't hide pricing.<br />
                  We don't lock you into contracts.
                </p>

                <p>
                  We show you the real thing — because that's what we use.
                </p>
              </div>
            </section>

            <div className="border-t border-slate-200 my-16"></div>

            <section className="mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
                Who KABBA is for
              </h2>

              <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
                <p>
                  KABBA is built for:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>independent rental shop owners</li>
                  <li>new and growing rental businesses</li>
                  <li>operators who want modern tools without enterprise overhead</li>
                  <li>people who care about efficiency, cash flow, and growth</li>
                </ul>

                <p>
                  If you run a rental shop — or plan to — this is software built by people who understand your day.
                </p>
              </div>
            </section>

            <div className="border-t border-slate-200 my-16"></div>

            <section className="mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
                From our rental shop to yours
              </h2>

              <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
                <p>
                  KABBA exists for one reason:
                </p>

                <p>
                  To give independent rental operators the same modern tools we had to build ourselves — without forcing them to reinvent the wheel.
                </p>

                <p>
                  That's it.
                </p>
              </div>
            </section>

          </div>

        </article>

        <section className="mt-24 bg-slate-50 py-16">
          <div className="max-w-3xl mx-auto px-6 sm:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6 leading-tight">
              You've seen where KABBA came from. Now see how it works.
            </h2>

            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Start your $4.95 trial and explore the same system we run in our own rental shops.
            </p>

            <div className="space-y-2 mb-8">
              <p className="text-lg text-slate-600">No contracts.</p>
              <p className="text-lg text-slate-600">No upfront fees.</p>
              <p className="text-lg text-slate-600">Cancel anytime.</p>
            </div>

            <button
              onClick={onStartTrial}
              className="inline-flex items-center justify-center px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white text-lg font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Start My $4.95 Trial
            </button>

            <p className="text-sm text-slate-500 mt-6">
              Built by real rental operators • Only pay when you rent
            </p>
          </div>
        </section>

      </main>

      <Footer onViewOurStory={scrollToTop} onViewContact={onViewContact} onViewProduct={onViewProduct} onViewPricing={onViewPricing} onViewConsultation={onViewConsultation} onViewPrivacyPolicy={onViewPrivacyPolicy} onViewTermsOfService={onViewTermsOfService} onViewRefundPolicy={onViewRefundPolicy} onViewAcceptableUsePolicy={onViewAcceptableUsePolicy} />
    </div>
  );
}
