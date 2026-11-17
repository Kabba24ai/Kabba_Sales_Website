import { useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Bell,
  CalendarClock,
  Check,
  CheckCircle2,
  CreditCard,
  FileSignature,
  LayoutDashboard,
  Mail,
  MessageSquare,
  Package,
  Palette,
  RefreshCw,
  Repeat,
  ShieldCheck,
  Star,
  Store,
  Truck,
  Undo2,
  Users,
  Workflow,
} from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ImplementationConsultationForm from "./ImplementationConsultationForm";
import type { ImplementationPackage } from "../lib/commercial-api";
import {
  automation,
  certification,
  challenge,
  finalCta,
  hero,
  packages,
  packagesHeading,
  partnership,
  platform,
} from "../lib/implementation-content";

/**
 * /implementation-services (Kabba_Sales_Website #19): the owner-approved PDF
 * content as a responsive page. Prices are optional professional services,
 * separate from the Kabba software subscription; every call to action opens
 * the consultation request at the bottom of the page — never a checkout.
 */
interface Props {
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
  onViewAcceptableUsePolicy?: () => void;
}

const challengeIcons = [Palette, Package, CreditCard, MessageSquare, Users, ShieldCheck];
const systemIcons = [Store, Workflow, LayoutDashboard];
const touchpointIcons = [CalendarClock, Mail, FileSignature, CreditCard, CheckCircle2, Bell, Truck, RefreshCw, Undo2, Star, Repeat];

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function ImplementationServicesPage(props: Props) {
  const [preselected, setPreselected] = useState<ImplementationPackage | null>(null);

  const discuss = (code: ImplementationPackage) => {
    setPreselected(code);
    scrollToId("consultation-request");
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar
        onStartTrial={props.onStartTrial}
        onViewPricing={props.onViewPricing}
        onViewOurStory={props.onViewOurStory}
        onViewContact={props.onViewContact}
        onBackToHome={props.onBack}
        onViewProduct={props.onViewProduct}
        onViewConsultation={props.onViewConsultation}
      />

      <main>
        {/* ================= Hero ================= */}
        <section aria-labelledby="impl-hero" className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 pt-28 pb-20 sm:pt-32 sm:pb-24 px-4 sm:px-6 lg:px-8">
          <div className="absolute inset-0 opacity-30" aria-hidden="true" style={{ background: "radial-gradient(circle at 80% 20%, rgba(37,99,235,0.45), transparent 45%), radial-gradient(circle at 10% 90%, rgba(16,185,129,0.25), transparent 40%)" }} />
          <div className="relative max-w-6xl mx-auto">
            <p className="inline-flex flex-wrap items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1.5 text-xs sm:text-sm font-semibold tracking-wide text-blue-200">
              <span className="uppercase">{hero.eyebrow}</span>
              <span aria-hidden="true" className="text-blue-400">•</span>
              <span>{hero.label}</span>
            </p>
            <h1 id="impl-hero" className="mt-6 max-w-4xl text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-white">
              {hero.headline}
            </h1>
            <p className="mt-6 max-w-3xl text-lg sm:text-xl leading-relaxed text-slate-300">{hero.subhead}</p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => scrollToId("packages")}
                className="group inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-7 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-amber-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                {hero.cta}
                <ArrowRight className="w-5 h-5 transition group-hover:translate-x-1" aria-hidden="true" />
              </button>
              <button
                onClick={() => scrollToId("consultation-request")}
                className="inline-flex items-center justify-center rounded-lg border-2 border-slate-500 px-7 py-4 text-lg font-semibold text-white transition hover:border-white hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                {finalCta.cta}
              </button>
            </div>
            <dl className="mt-12 grid grid-cols-3 gap-3 sm:gap-4 max-w-3xl">
              {hero.stats.map((s) => (
                <div key={s.label} className="rounded-xl border border-white/10 bg-white/5 px-3 py-4 sm:px-5 backdrop-blur-sm">
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="text-3xl sm:text-4xl font-bold text-[#02ffff]">{s.value}</dd>
                  <dd className="mt-1 text-xs sm:text-sm font-medium leading-snug text-slate-300">{s.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ================= Challenge ================= */}
        <section aria-labelledby="impl-challenge" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-3xl">
              <h2 id="impl-challenge" className="text-3xl sm:text-4xl font-bold text-slate-900">{challenge.heading}</h2>
              <p className="mt-4 text-lg leading-relaxed text-slate-600">{challenge.intro}</p>
            </div>
            <ol className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {challenge.cards.map((card, i) => {
                const Icon = challengeIcons[i];
                return (
                  <li key={card.title} className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50 p-6">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white" aria-hidden="true">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <Icon className="w-6 h-6 text-blue-600" aria-hidden="true" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-slate-900">
                      <span className="sr-only">{i + 1}. </span>
                      {card.title}
                    </h3>
                    <p className="mt-2 leading-relaxed text-slate-600">{card.body}</p>
                  </li>
                );
              })}
            </ol>
            <div className="mt-10 flex flex-col gap-4 rounded-2xl bg-slate-900 p-6 sm:flex-row sm:items-center sm:gap-8 sm:p-8">
              <span className="inline-flex w-fit flex-shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-emerald-500/15 px-4 py-1.5 text-sm font-semibold text-emerald-300">
                <BadgeCheck className="w-4 h-4" aria-hidden="true" /> {challenge.assurance.label}
              </span>
              <div>
                <p className="text-2xl font-bold text-white">{challenge.assurance.heading}</p>
                <p className="mt-2 leading-relaxed text-slate-300">{challenge.assurance.body}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= Platform ================= */}
        <section aria-labelledby="impl-platform" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-white">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-3xl">
              <h2 id="impl-platform" className="text-3xl sm:text-4xl font-bold text-slate-900">{platform.heading}</h2>
              <p className="mt-4 text-lg leading-relaxed text-slate-600">{platform.intro}</p>
            </div>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              {platform.systems.map((system, i) => {
                const Icon = systemIcons[i];
                return (
                  <article key={system.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/10">
                      <Icon className="w-6 h-6 text-blue-700" aria-hidden="true" />
                    </span>
                    <h3 className="mt-4 text-xl font-semibold text-slate-900">{system.title}</h3>
                    <ul className="mt-4 space-y-2">
                      {system.items.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-slate-700">
                          <Check className="mt-0.5 w-5 h-5 flex-shrink-0 text-emerald-600" aria-hidden="true" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================= Packages ================= */}
        <section id="packages" aria-labelledby="impl-packages" className="scroll-mt-20 py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-3xl mx-auto">
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Implementation packages</p>
              <h2 id="impl-packages" className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900">{packagesHeading}</h2>
              <p className="mt-4 text-slate-600">
                Optional professional services, priced separately from your Kabba software subscription. Nothing is charged online: start with a consultation.
              </p>
            </div>
            <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
              {packages.map((p) => {
                const featured = !!p.badge;
                return (
                  <article
                    key={p.code}
                    aria-labelledby={`pkg-${p.code}`}
                    className={`relative flex flex-col rounded-2xl p-6 sm:p-8 ${
                      featured ? "bg-slate-900 text-white shadow-2xl ring-2 ring-amber-400 lg:-my-4 lg:py-12" : "border border-slate-200 bg-white shadow-sm"
                    }`}
                  >
                    {featured && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-amber-400 px-4 py-1 text-xs font-bold uppercase tracking-wider text-slate-900">
                        {p.badge}
                      </span>
                    )}
                    <p className={`text-sm font-bold uppercase tracking-wider ${featured ? "text-amber-300" : "text-blue-700"}`}>{p.tagline}</p>
                    <h3 id={`pkg-${p.code}`} className="mt-1 text-2xl font-bold">{p.name}</h3>
                    <p className="mt-4 flex items-baseline gap-2">
                      <span className="text-4xl font-bold">{p.price}</span>
                      <span className={featured ? "text-slate-300" : "text-slate-500"}>{p.cadence}</span>
                    </p>
                    <p className={`mt-4 leading-relaxed ${featured ? "text-slate-300" : "text-slate-600"}`}>{p.description}</p>
                    <ul className="mt-6 flex-1 space-y-3">
                      {p.includes.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <Check className={`mt-0.5 w-5 h-5 flex-shrink-0 ${featured ? "text-emerald-400" : "text-emerald-600"}`} aria-hidden="true" />
                          <span className={featured ? "text-slate-100" : "text-slate-700"}>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => discuss(p.code)}
                      className={`mt-8 inline-flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3.5 font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                        featured
                          ? "bg-amber-500 text-white hover:bg-amber-600 focus-visible:ring-amber-400 focus-visible:ring-offset-slate-900"
                          : "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-600"
                      }`}
                    >
                      {p.cta} <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================= Automation ================= */}
        <section aria-labelledby="impl-automation" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-950 text-white">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-3xl">
              <h2 id="impl-automation" className="text-3xl sm:text-4xl font-bold">{automation.heading}</h2>
              <p className="mt-4 text-lg leading-relaxed text-slate-300">{automation.intro}</p>
            </div>
            <ol className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {automation.touchpoints.map((t, i) => {
                const Icon = touchpointIcons[i];
                return (
                  <li key={t.title} className="flex gap-4 rounded-xl border border-white/10 bg-white/5 p-4">
                    <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#02ffff]/15 text-sm font-bold text-[#02ffff]" aria-hidden="true">
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="flex items-center gap-2 font-semibold">
                        <span className="sr-only">Step {i + 1}: </span>
                        {t.title}
                        <Icon className="w-4 h-4 flex-shrink-0 text-slate-400" aria-hidden="true" />
                      </p>
                      <p className="mt-1 text-sm text-slate-400">{t.detail}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
            <div className="mt-12 rounded-2xl border border-emerald-400/20 bg-emerald-500/5 p-6 sm:p-8">
              <h3 className="text-xl font-bold text-emerald-300">{automation.metricsHeading}</h3>
              <dl className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
                {automation.metrics.map((m) => (
                  <div key={m.label}>
                    <dt className="sr-only">{m.label}</dt>
                    <dd className="text-4xl font-bold text-white">{m.value}</dd>
                    <dd className="mt-1 text-slate-300">{m.label}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* ================= Go-Live Certification ================= */}
        <section aria-labelledby="impl-certification" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
            <div className="lg:col-span-2">
              <h2 id="impl-certification" className="text-3xl sm:text-4xl font-bold text-slate-900">{certification.heading}</h2>
              <p className="mt-4 text-lg leading-relaxed text-slate-600">{certification.intro}</p>
              <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3" aria-label="Go-Live Certification checklist">
                {certification.checklist.map((item) => (
                  <li key={item} className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50 px-4 py-3">
                    <CheckCircle2 className="mt-0.5 w-5 h-5 flex-shrink-0 text-emerald-600" aria-hidden="true" />
                    <span className="text-slate-800">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <aside className="flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-blue-700 to-slate-900 p-8 text-center text-white">
              <div className="flex h-36 w-36 flex-col items-center justify-center rounded-full border-4 border-amber-400 bg-slate-900/40 shadow-inner" role="img" aria-label="Go-Live Certified seal">
                <ShieldCheck className="w-10 h-10 text-amber-400" aria-hidden="true" />
                <span className="mt-1 px-3 text-sm font-bold uppercase leading-tight tracking-wider text-amber-300">{certification.badge}</span>
              </div>
              <p className="mt-6 text-2xl font-bold">{certification.closeHeading}</p>
              <p className="mt-3 leading-relaxed text-blue-100">{certification.closeBody}</p>
              <p className="mt-4 text-xs text-blue-200">Included with Kabba Professional.</p>
            </aside>
          </div>
        </section>

        {/* ================= Growth Partnership ================= */}
        <section aria-labelledby="impl-partnership" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-blue-50">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
              <div className="lg:col-span-2">
                <h2 id="impl-partnership" className="text-3xl sm:text-4xl font-bold text-slate-900">{partnership.heading}</h2>
                <p className="mt-4 text-lg leading-relaxed text-slate-600">{partnership.intro}</p>
                <div className="mt-6 rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm">
                  <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">{partnership.priceLabel}</p>
                  <p className="mt-1 text-3xl font-bold text-slate-900">{partnership.price}</p>
                  <blockquote className="mt-4 border-l-4 border-amber-400 pl-4 italic text-slate-700">“{partnership.quote}”</blockquote>
                  <button
                    onClick={() => discuss("growth")}
                    className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                  >
                    Discuss Growth <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
              <div className="lg:col-span-3">
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {partnership.values.map((v) => (
                    <div key={v.title} className="rounded-xl border border-slate-200 bg-white p-5">
                      <dt className="flex items-center gap-2 font-semibold text-slate-900">
                        <Check className="w-5 h-5 flex-shrink-0 text-emerald-600" aria-hidden="true" /> {v.title}
                      </dt>
                      <dd className="mt-1 pl-7 text-slate-600">{v.body}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-6 rounded-xl bg-slate-900 px-6 py-5 text-slate-200">
                  <strong className="text-white">{partnership.closingLead}</strong> {partnership.closing}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= Final CTA + consultation request ================= */}
        <section id="consultation-request" aria-labelledby="impl-final" className="scroll-mt-20 py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
            <div className="lg:sticky lg:top-24">
              <h2 id="impl-final" className="text-3xl sm:text-4xl font-bold leading-tight">{finalCta.heading}</h2>
              <p className="mt-5 text-lg leading-relaxed text-slate-300">{finalCta.body}</p>
              <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-300">
                <CalendarClock className="w-4 h-4" aria-hidden="true" /> {finalCta.followUp}
              </p>
              <ul className="mt-8 divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/5" aria-label="Implementation package prices">
                {finalCta.summary.map((s) => (
                  <li key={s.name} className="flex items-center justify-between gap-4 px-5 py-4">
                    <span className="font-semibold">{s.name}</span>
                    <span className="text-[#02ffff] font-semibold">{s.price}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-slate-400">
                Separate from the Kabba software subscription. Want the software first?{" "}
                <button onClick={props.onStartTrial} className="font-semibold text-amber-300 underline hover:text-amber-200">Start your Kabba trial</button>.
              </p>
            </div>
            <ImplementationConsultationForm preselected={preselected} />
          </div>
        </section>
      </main>

      <Footer
        onViewOurStory={props.onViewOurStory}
        onViewContact={props.onViewContact}
        onViewProduct={props.onViewProduct}
        onViewPricing={props.onViewPricing}
        onViewConsultation={props.onViewConsultation}
        onViewPrivacyPolicy={props.onViewPrivacyPolicy}
        onViewTermsOfService={props.onViewTermsOfService}
        onViewRefundPolicy={props.onViewRefundPolicy}
        onViewAcceptableUsePolicy={props.onViewAcceptableUsePolicy}
      />
    </div>
  );
}
