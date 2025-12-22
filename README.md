# KABBA Sales Website

A modern, conversion-optimized sales and onboarding website for KABBA - an equipment rental management platform built for rental operators.

## Overview

This is a full-featured sales website with an integrated trial signup and onboarding flow. The website guides potential customers through product discovery, pricing information, and a seamless trial activation process with consultation scheduling.

## Tech Stack

- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 5.4.2
- **Styling**: Tailwind CSS 3.4.1
- **Icons**: Lucide React 0.344.0
- **Backend**: Supabase (Database & Authentication ready)
- **Linting**: ESLint 9.9.1

## Project Structure

```
project/
├── .github/
│   └── workflows/
│       └── deploy.yaml                   # GitHub Actions deployment workflow
├── public/
│   ├── kabba_logo_-_circle_-_cut.png
│   ├── kabba_logo_-_png_-_circle_-_cut.png
│   ├── footer_logo.png
│   └── [other images...]
├── src/
│   ├── components/
│   │   ├── AcceptableUsePolicyPage.tsx   # Acceptable Use Policy page
│   │   ├── AnalyzingAvailability.tsx     # Consultation scheduling interface
│   │   ├── AntiDemo.tsx                  # Problem statement section
│   │   ├── Consultation.tsx              # Consultation value proposition
│   │   ├── Contact.tsx                   # Contact form component
│   │   ├── ContactPage.tsx               # Contact page wrapper
│   │   ├── Features.tsx                  # Product features showcase
│   │   ├── FinalCTA.tsx                  # Final call-to-action section
│   │   ├── Footer.tsx                    # Site footer with legal links
│   │   ├── Hero.tsx                      # Landing hero section
│   │   ├── LiveDemoModal.tsx             # Live demo modal component
│   │   ├── Navbar.tsx                    # Main navigation
│   │   ├── OnboardingSignup.tsx          # Trial signup form
│   │   ├── OurStory.tsx                  # About/Story page
│   │   ├── PaymentError.tsx              # Payment failure handling
│   │   ├── Pricing.tsx                   # Pricing overview section
│   │   ├── PricingPage.tsx               # Detailed pricing page
│   │   ├── PrivacyPolicyPage.tsx         # Privacy policy page
│   │   ├── ProcessingPayment.tsx         # Payment processing screen
│   │   ├── RealShop.tsx                  # Live demo showcase
│   │   ├── RefundCancellationPage.tsx    # Refund & Cancellation policy
│   │   ├── SetupCanceled.tsx             # Cancellation confirmation
│   │   ├── SignupTrial.tsx               # Trial signup component
│   │   ├── SocialProof.tsx               # Testimonials & trust signals
│   │   ├── TermsOfServicePage.tsx        # Terms of Service page
│   │   ├── TrialActivated.tsx            # Success confirmation page
│   │   ├── ValueProposition.tsx          # Core value propositions
│   │   └── VideoModal.tsx                # Video modal component
│   ├── lib/
│   │   └── supabase.ts                   # Supabase client configuration
│   ├── App.tsx                           # Main application with routing logic
│   ├── index.css                         # Global styles & Tailwind imports
│   ├── main.tsx                          # Application entry point
│   └── vite-env.d.ts                     # Vite type definitions
├── supabase/
│   └── migrations/
│       └── 20251222023246_create_contact_submissions.sql
├── .env                                  # Environment variables
├── .gitignore                            # Git ignore rules
├── package.json                          # Project dependencies
├── tailwind.config.js                    # Tailwind configuration
├── tsconfig.json                         # TypeScript configuration
└── vite.config.ts                        # Vite configuration
```

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Environment variables are already configured in `.env`:
   ```
   VITE_SUPABASE_URL=https://uqwwppofrcepqnystfll.supabase.co
   VITE_SUPABASE_ANON_KEY=[configured]
   ```

### Development

Start the development server:
```bash
npm run dev
```

The site will be available at `http://localhost:5173`

### Build

Create a production build:
```bash
npm run build
```

Build output will be in the `dist/` directory.

### Preview Production Build

Preview the production build locally:
```bash
npm run preview
```

### Type Checking

Run TypeScript type checking:
```bash
npm run typecheck
```

### Linting

Run ESLint:
```bash
npm run lint
```

## Application Flow

### Page Types

The application uses client-side routing with the following pages:

1. **home** - Main landing page with all marketing sections
2. **pricing** - Detailed pricing information page
3. **our-story** - About KABBA and company story
4. **contact** - Contact form and information
5. **privacy-policy** - Privacy policy page
6. **terms-of-service** - Terms of service page
7. **refund-cancellation** - Refund and cancellation policy
8. **acceptable-use-policy** - Acceptable use policy
9. **onboarding-signup** - Trial signup form
10. **onboarding-analyzing** - Consultation time selection
11. **processing-payment** - Payment processing screen
12. **payment-error** - Payment failure recovery
13. **onboarding-activated** - Trial activation success
14. **setup-canceled** - Setup cancellation confirmation

### User Journey

1. User lands on home page
2. Clicks "Start Trial" → navigates to signup
3. Fills out signup form → analyzing availability
4. Selects consultation time → payment processing
5. Payment succeeds → trial activated
6. Alternative: Payment fails → error page with retry option
7. Alternative: User cancels → canceled confirmation page

## Component Details

### Core Marketing Components

- **Hero**: First impression section with primary CTA
- **AntiDemo**: Addresses common industry pain points
- **RealShop**: Live product demonstration section
- **ValueProposition**: Core benefits and differentiators
- **Features**: Detailed feature breakdown
- **Pricing**: Transparent pricing overview
- **Consultation**: Value of consultation call
- **SocialProof**: Customer testimonials and trust signals
- **FinalCTA**: Last conversion opportunity
- **Footer**: Contact information and links

### Onboarding Flow Components

- **OnboardingSignup**: Multi-field form collecting business information
- **AnalyzingAvailability**: Consultation time picker with calendar UI
- **ProcessingPayment**: Simulated payment processing with progress indicator
- **TrialActivated**: Success confirmation with next steps
- **PaymentError**: Error handling with retry option
- **SetupCanceled**: Cancellation confirmation with restart option

### Navigation Components

- **Navbar**: Main navigation with CTA buttons
- **PricingPage**: Standalone pricing details page

## Key Features

### Design

- Dark mode optimized UI (gray-950 background)
- Emerald green accent color scheme
- Fully responsive design (mobile-first)
- Smooth transitions and hover effects
- Professional typography and spacing

### UX Considerations

- Clear conversion path with multiple CTAs
- Transparent pricing information
- No-surprises trial activation
- Helpful error recovery flows
- Progress indication during multi-step processes
- Auto-scroll to top on page transitions

### Contact Information

- Phone: **(615) 289-6429**
- Email: support@kabba.com
- Locations: Tennessee, Florida, Georgia

### Pricing Model

- **Trial**: $4.95 one-time
- **Monthly**: $9.95/month after trial
- **Per Transaction**: $0.39 per rental transaction
- No contracts, cancel anytime

## State Management

The application uses React useState hooks for:
- Page navigation (currentPage)
- Form data persistence (signupData)
- Consultation time (consultationTime)

State flows through the component tree via props and callbacks.

## Styling Approach

- Utility-first CSS with Tailwind
- Component-scoped styles
- Consistent design tokens (spacing, colors, typography)
- Mobile-first responsive breakpoints

## Browser Support

Modern browsers supporting:
- ES2020+
- CSS Grid & Flexbox
- CSS Custom Properties

## Future Enhancements

Potential areas for expansion:
- Real payment integration (Stripe recommended)
- Supabase database integration for lead capture
- Email confirmation flows
- Analytics tracking
- A/B testing capabilities
- Blog/content section
- Live chat integration

## Development Notes

### Code Organization

- Each component is self-contained in its own file
- Consistent naming conventions (PascalCase for components)
- TypeScript interfaces for type safety
- Props passed explicitly (no implicit any types)

### Best Practices

- All images use descriptive alt text (currently empty, should be updated)
- Semantic HTML structure
- Accessible button and link elements
- Form validation ready (currently client-side only)
- Error boundaries recommended for production

## Testing

No testing framework is currently configured. Recommended additions:
- Vitest for unit testing
- React Testing Library for component testing
- Playwright or Cypress for E2E testing

## Deployment

### Automatic Deployment (GitHub Actions)

This project is configured with automated deployment via GitHub Actions to a VPS server.

**Deployment Trigger**: Push to `develop` branch

**Workflow Process**:
1. Checks out the repository
2. Sets up Node.js v20
3. Installs dependencies with `npm ci`
4. Builds the project with `npm run build`
5. Creates backup of existing site files
6. Deploys new build to `/home/kabba/www` via rsync over SSH

**Required GitHub Secrets**:
- `SSH_PRIVATE_KEY` - SSH private key for server access
- `SSH_PORT` - SSH port number
- `SSH_HOST` - Server hostname/IP
- `SSH_USER` - SSH username (kabba)

**Deployment Steps for Team**:
1. Make your changes to the codebase
2. Test locally with `npm run dev`
3. Verify build succeeds with `npm run build`
4. Commit changes (automatic via system)
5. Push to `develop` branch
6. GitHub Actions will automatically deploy to live server
7. Monitor deployment progress in GitHub Actions tab
8. Verify changes on live site

**Manual Deployment (Alternative)**:

If needed, you can also deploy to any static hosting platform:
- Vercel (recommended for Vite projects)
- Netlify
- Cloudflare Pages
- AWS S3 + CloudFront

Build command: `npm run build`
Output directory: `dist`

## Environment Variables

Required environment variables:
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key

These are prefixed with `VITE_` to be accessible in the browser.

## Contact & Support

For questions about this codebase:
- Business Contact: (615) 289-6429
- Technical Support: support@kabba.com

## License

Proprietary - All rights reserved

---

**Built for rental operators, by rental operators.**
