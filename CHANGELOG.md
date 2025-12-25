# Changelog

All notable changes to the KABBA Sales Website will be documented in this file.

## [Unreleased]

### Added
- **Admin Section**: Complete admin dashboard for viewing and managing trial signups
  - `AdminSignupsList.tsx`: Summary view of all signups with key information
  - `AdminSignupDetails.tsx`: Detailed view of individual signup records
  - Database table `signups` with complete schema for storing signup data
  - Status management system (pending, trial, active, canceled)
  - Real-time data fetching from Supabase
  - Responsive admin UI with color-coded status badges
  - One-click status updates
  - Clickable email/phone links for quick customer contact
  - Comprehensive admin documentation (`ADMIN.md`)
- Database migration `20251225165258_create_signups_table.sql`
- Signup data persistence in ProcessingPayment component
- Admin routing in App.tsx
- Database indexes for optimized queries (email, created_at, status)
- Row Level Security (RLS) policies for admin access

### Changed
- Split Full Name field into separate First Name and Last Name fields in signup forms
- Added Phone Number field with automatic (xxx) xxx-xxxx formatting
- Updated SignupFormData interface to use firstName, lastName, and phoneNumber fields
- Updated OnboardingSignup component with new form fields and phone formatting
- Updated SignupTrial component to match new field structure for consistency
- Card name now automatically combines first and last name
- Updated consultation message to "Next Step: You'll choose your preferred consultation date & time." and moved it below the trial button
- Reordered form fields: Email now appears after Phone Number and directly above Password field (using email as login ID)
- ProcessingPayment component now saves signup data to database after successful payment
- Updated README.md with admin section documentation, database schema, and enhancement roadmap

### Security Notes
- **Important**: Admin section currently has no authentication. Must add auth before production deployment.
- Sensitive payment card data (card numbers, CVC, expiry) is never stored in database
- RLS enabled on signups table - only authenticated users can view/update records

## [1.1.0] - 2024-12-22

### Added
- Acceptable Use Policy page (`AcceptableUsePolicyPage.tsx`)
- Acceptable Use Policy link in Footer component (Legal section)
- `onViewAcceptableUsePolicy` prop to all page components for navigation
- Comprehensive deployment documentation (`DEPLOYMENT.md`)
- Updated README.md with complete project structure and deployment instructions

### Changed
- Updated Footer component to include Acceptable Use Policy link
- Updated OurStory component props to support AUP navigation
- Updated PrivacyPolicyPage component props to support AUP navigation
- Updated TermsOfServicePage component props to support AUP navigation
- Updated RefundCancellationPage component props to support AUP navigation
- Updated ContactPage component props to support AUP navigation
- Updated App.tsx routing to wire up AUP navigation across all pages
- Updated README.md with accurate page list and deployment workflow

### Fixed
- Footer now displays all legal policy links correctly
- All page components now properly pass AUP handler through to Footer

## [1.0.0] - 2024-12-21

### Added
- Initial release of KABBA Sales Website
- React + TypeScript + Vite setup
- Tailwind CSS styling
- Complete landing page with Hero, Features, Pricing sections
- Trial signup and onboarding flow
- Contact form with Supabase integration
- Privacy Policy page
- Terms of Service page
- Refund & Cancellation Policy page
- Our Story page
- Pricing details page
- GitHub Actions automated deployment workflow
- Supabase database integration for contact form submissions

### Technical Details
- Node.js v20
- React 18.3.1
- TypeScript 5.5.3
- Vite 5.4.2
- Tailwind CSS 3.4.1
- Supabase integration
- Automated deployment to VPS via GitHub Actions

---

**Note**: This project follows semantic versioning (SEMVER).
- MAJOR version for incompatible API changes
- MINOR version for added functionality in a backward compatible manner
- PATCH version for backward compatible bug fixes
