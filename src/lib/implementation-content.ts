// Implementation Services page content (Kabba_Sales_Website #19).
// Transcribed from the owner-approved PDF. Keep wording, order and prices as
// approved; layout lives in ImplementationServicesPage.tsx. These are
// optional professional services, priced separately from the Kabba software
// subscription — nothing here is charged online.

import type { ImplementationPackage } from "./commercial-api";

export const hero = {
  eyebrow: "Professional Services",
  label: "Implementation Services",
  headline: "We Build Your Online Rental Business.",
  subhead:
    "Your Kabba platform is ready. Your online rental business doesn't build itself. Our implementation specialists handle everything — from your first category to your first confirmed booking.",
  cta: "Explore Implementation Packages",
  stats: [
    { value: "11", label: "Systems Configured" },
    { value: "3", label: "Packages Available" },
    { value: "0", label: "Guesswork Required" },
  ],
};

export const challenge = {
  heading: "Most rental companies underestimate the work.",
  intro:
    "A successful launch requires far more than a website. Every system must work together before your first customer books — and our specialists handle all of it.",
  cards: [
    { title: "Branding & Visual Identity", body: "Colors, typography, and professional design that makes a first impression worth trusting." },
    { title: "Equipment Catalog Setup", body: "Every product needs pricing, photos, descriptions, and proper category structure." },
    { title: "Payment & Billing", body: "Gateway config, deposit handling, and billing automation must be tested before launch." },
    { title: "Communication & Automation", body: "SMS, email, confirmations, and reminders — every touchpoint configured and tested." },
    { title: "Team & Employee Setup", body: "Staff roles, permissions, and dispatch workflows built before your first busy day." },
    { title: "Testing & Go-Live Verification", body: "Every flow tested by someone who knows what a working system looks like." },
  ],
  assurance: {
    label: "Proven Process",
    heading: "We handle all of it.",
    body: "Our specialists have configured dozens of Kabba businesses. We don't experiment — we execute a proven process that gets you operational faster and right the first time.",
  },
};

export const platform = {
  heading: "Three systems. One seamless platform.",
  intro: "Kabba integrates three complete systems. Implementation means configuring all three so your business runs right from day one.",
  systems: [
    {
      title: "Digital Storefront",
      items: ["Professional rental website", "Online reservations & quoting", "Equipment catalog & categories", "Mobile-optimized experience", "SEO-ready architecture"],
    },
    {
      title: "Administrative Automation",
      items: ["Reservation confirmations", "Terms & Conditions reminders", "Online payment requests", "Delivery & return reminders", "Review & retention follow-ups"],
    },
    {
      title: "Rental Operations",
      items: ["Scheduling & dispatch", "Inventory management", "Employee & role management", "Reporting & analytics", "Mobile app for your team"],
    },
  ],
};

export interface ImplementationPackageInfo {
  code: Exclude<ImplementationPackage, "not_sure">;
  name: string;
  tagline: string;
  price: string;
  cadence: string;
  description: string;
  includes: string[];
  cta: string;
  badge?: string;
}

export const packagesHeading = "The fastest path to operational.";

export const packages: ImplementationPackageInfo[] = [
  {
    code: "launch",
    name: "Kabba Launch",
    tagline: "Storefront Ready",
    price: "$997",
    cadence: "one-time",
    description: "Your Kabba website, professionally built and ready to take online reservations.",
    includes: ["Professional website build", "Category & product setup", "Branding & visual identity", "Pricing configuration", "FAQ, contact & terms pages", "Mobile optimization"],
    cta: "Discuss Launch",
  },
  {
    code: "professional",
    name: "Kabba Professional",
    tagline: "Fully Operational",
    price: "$1,997",
    cadence: "one-time",
    description: "Everything in Launch plus complete operational setup, training & Go-Live Certification.",
    includes: [
      "Everything in Kabba Launch",
      "Payment gateway config",
      "Twilio SMS setup & testing",
      "Business email setup",
      "CRM & comm templates",
      "Full automation config",
      "Employee & team setup",
      "Owner training session",
      "Sitemap Installation",
      "Go-Live Certification",
    ],
    cta: "Discuss Professional",
    badge: "Most Complete",
  },
  {
    code: "growth",
    name: "Kabba Growth",
    tagline: "Ongoing Partnership",
    price: "$495",
    cadence: "/month",
    description: "Your dedicated Kabba success partner — continuously optimizing as your business grows.",
    includes: ["Continuous optimization", "New equipment onboarding", "New feature adoption", "Strategic guidance", "SEO strategy", "Ad Console implementation", "Workflow improvements", "Priority expert access"],
    cta: "Discuss Growth",
  },
];

export const automation = {
  heading: "Every manual task, eliminated.",
  intro:
    "Kabba's automated communication system replaces the phone calls, emails, and reminder texts your office staff currently handles by hand — so your team can focus on work that actually moves your business forward.",
  touchpoints: [
    { title: "Customer Reserves Equipment", detail: "Online or via office staff" },
    { title: "Reservation Confirmation", detail: "Instant SMS & email sent" },
    { title: "Terms & Conditions Reminder", detail: "Customer signs digitally" },
    { title: "Online Payment Request", detail: "Secure payment link delivered" },
    { title: "Payment Confirmation", detail: "Receipt sent immediately" },
    { title: "Delivery Reminder", detail: "Day-before delivery notification" },
    { title: "Rental Begins", detail: "Equipment delivered to customer" },
    { title: "Return Reminder", detail: "Advance notice before pickup" },
    { title: "Equipment Returned", detail: "Inventory automatically updated" },
    { title: "Review Request", detail: "Google review ask sent" },
    { title: "Repeat Customer Follow-Up", detail: "Re-engagement at the right moment" },
  ],
  metricsHeading: "Zero manual office work",
  metrics: [
    { value: "11", label: "automated touchpoints" },
    { value: "0", label: "manual follow-up calls needed" },
    { value: "100%", label: "consistency on every reservation" },
  ],
};

export const certification = {
  heading: "Go-Live Certification",
  intro: "We don't call it done when it looks ready. Every system is tested and verified before your launch date.",
  checklist: [
    "Website design completed & reviewed",
    "All categories built & verified",
    "Products loaded with correct pricing",
    "Mobile optimization confirmed",
    "Branding & imagery in place",
    "FAQ, terms & contact pages complete",
    "Owner training session completed",
    "Payment gateway tested & live",
    "SMS notifications tested",
    "Email communications verified",
    "Online booking flow tested end-to-end",
    "All automated messages confirmed",
    "Employee accounts & roles configured",
    "Full system walkthrough & sign-off",
  ],
  closeHeading: "You don't go live until you're ready.",
  closeBody: "Every item is verified by your specialist before we hand you the keys. No surprises. No gaps.",
  badge: "Go-Live Certified",
};

export const partnership = {
  heading: "Your Dedicated Kabba Success Partner",
  intro:
    "Implementation gets you launched. The Growth Partnership keeps you growing. New equipment, employees, and workflows — your specialist is always a step ahead.",
  priceLabel: "Kabba Growth Partnership",
  price: "$495/month",
  quote: "Your business is constantly evolving. Your Kabba system should evolve with it.",
  values: [
    { title: "Continuous Optimization", body: "Regular system review and improvement" },
    { title: "Expert Guidance On-Demand", body: "Your specialist is always a call away" },
    { title: "New Equipment Onboarding", body: "New products live and bookable, fast" },
    { title: "New Feature Adoption", body: "Always current with Kabba's latest" },
    { title: "New Employee Setup", body: "Every hire gets the right access & workflow" },
    { title: "Maximize Your ROI", body: "Get more from the platform you already own" },
  ],
  closingLead: "Not a maintenance plan.",
  closing: "The Growth Partnership is an active, strategic relationship — always improving your business.",
};

export const finalCta = {
  heading: "Launch with Confidence. Grow with Kabba.",
  body: "Implementation isn't building a website. It's building a complete online rental business — ready to take reservations, collect payments, communicate professionally, and operate at scale from day one. Let's build yours.",
  cta: "Schedule Your Implementation Consultation",
  followUp: "A Kabba specialist will reach out within one business day.",
  summary: [
    { name: "Kabba Launch", price: "$997 one-time" },
    { name: "Kabba Professional", price: "$1,997 one-time" },
    { name: "Kabba Growth", price: "$495/month" },
  ],
};

export const packageOptions: { value: ImplementationPackage; label: string }[] = [
  { value: "launch", label: "Kabba Launch — $997 one-time" },
  { value: "professional", label: "Kabba Professional — $1,997 one-time" },
  { value: "growth", label: "Kabba Growth — $495/month" },
  { value: "not_sure", label: "Not sure yet — help me choose" },
];
