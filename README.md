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
│   │   ├── AdminSignupDetails.tsx        # Admin: Individual signup details view
│   │   ├── AdminSignupsList.tsx          # Admin: Signups list/summary view
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
│   │   ├── ProcessingPayment.tsx         # Payment processing & data persistence
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
│       ├── 20251222023246_create_contact_submissions.sql
│       └── 20251225165258_create_signups_table.sql
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

**Public Pages:**
1. **home** - Main landing page with all marketing sections
2. **pricing** - Detailed pricing information page
3. **our-story** - About KABBA and company story
4. **contact** - Contact form and information
5. **privacy-policy** - Privacy policy page
6. **terms-of-service** - Terms of service page
7. **refund-cancellation** - Refund and cancellation policy
8. **acceptable-use-policy** - Acceptable use policy

**Onboarding Flow:**
9. **onboarding-signup** - Trial signup form
10. **onboarding-analyzing** - Consultation time selection
11. **processing-payment** - Payment processing screen
12. **payment-error** - Payment failure recovery
13. **onboarding-activated** - Trial activation success
14. **setup-canceled** - Setup cancellation confirmation

**Admin Section:**
15. **admin-signups** - Signups list/summary view
16. **admin-signup-details** - Individual signup details view

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

## Admin Section

### Overview

The admin section provides a simple interface to view and manage trial signups. This is a foundational implementation designed to grow as the business scales.

### Access Instructions

**Temporary Access (Development)**:
To access the admin section during development, you can modify line 32 in `src/App.tsx`:

```typescript
// Change from:
const [currentPage, setCurrentPage] = useState<PageType>('home');

// To:
const [currentPage, setCurrentPage] = useState<PageType>('admin-signups');
```

Then refresh the browser to load directly into the admin dashboard.

**Production Access Note**: Currently there is no authentication system. Before deploying to production, implement proper authentication to protect the admin section. Recommended: Supabase Auth with email/password or magic links.

### Admin Features

**Signups List Page** (`AdminSignupsList.tsx`):
- Displays all trial signups in reverse chronological order
- Shows key information: name, business, email, phone, consultation time
- Color-coded status badges (pending, trial, active, canceled)
- Real-time data from Supabase
- Refresh button to reload data
- Click any signup to view full details

**Signup Details Page** (`AdminSignupDetails.tsx`):
- Complete customer information
- Full billing address
- Consultation scheduling information
- Status management (update status with one click)
- Timeline showing creation and update timestamps
- Clickable email/phone for quick contact

### Database Schema

**Table: `signups`**

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| first_name | text | Customer's first name |
| last_name | text | Customer's last name |
| email | text | Email address |
| phone_number | text | Phone number |
| business_name | text | Business name |
| billing_street | text | Billing street address |
| billing_city | text | Billing city |
| billing_state | text | Billing state (2-letter code) |
| billing_zip | text | Billing ZIP code |
| consultation_time | timestamptz | Scheduled consultation date/time |
| status | text | Current status (pending/trial/active/canceled) |
| created_at | timestamptz | Signup timestamp |
| updated_at | timestamptz | Last update timestamp |

**Security**: Row Level Security (RLS) is enabled. Authenticated users can view and update all signups.

**Note**: Payment card information (card numbers, CVC, expiry) is **never stored** in the database. Only business and contact information is persisted.

### Data Flow

1. User completes signup form (`OnboardingSignup.tsx`)
2. User selects consultation time (`AnalyzingAvailability.tsx`)
3. Payment is processed (`ProcessingPayment.tsx`)
4. On successful payment, signup data is inserted into Supabase
5. Admin can view signup immediately in admin section

### Future Enhancements

Planned improvements for the admin section:

**Phase 1 - Security & Access**:
- [ ] Implement Supabase Authentication
- [ ] Add admin login page
- [ ] Protect admin routes with auth check
- [ ] Add user roles (admin, viewer, etc.)

**Phase 2 - Search & Filtering**:
- [ ] Search by name, email, or business
- [ ] Filter by status
- [ ] Filter by date range
- [ ] Sort options (date, name, status)

**Phase 3 - Communication**:
- [ ] Send email directly from admin panel
- [ ] SMS integration for quick contact
- [ ] Note/comment system for each signup
- [ ] Activity log (who viewed/updated)

**Phase 4 - Analytics**:
- [ ] Dashboard with key metrics
- [ ] Signup trends graph
- [ ] Conversion rate tracking
- [ ] Consultation completion rate

**Phase 5 - Export & Reporting**:
- [ ] Export to CSV
- [ ] Export to Excel
- [ ] Automated weekly reports
- [ ] Integration with CRM systems

**Phase 6 - Automation**:
- [ ] Automated follow-up email sequences
- [ ] Calendar integration (Google/Outlook)
- [ ] Automated consultation reminders
- [ ] Status update triggers

## State Management

The application uses React useState hooks for:
- Page navigation (currentPage)
- Form data persistence (signupData)
- Consultation time (consultationTime)
- Admin navigation (selectedSignupId)

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

### Sales Website
- Real payment integration (Stripe recommended)
- Email confirmation flows
- Analytics tracking (Google Analytics, Mixpanel)
- A/B testing capabilities
- Blog/content section
- Live chat integration
- Email marketing integration (Mailchimp, ConvertKit)

### Admin Section
See detailed admin enhancement roadmap in the "Admin Section" section above.

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
