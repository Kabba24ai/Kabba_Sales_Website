# KABBA Admin Section Documentation

## Quick Start

### Accessing the Admin Section (Development)

**Method 1: Modify App.tsx**
1. Open `src/App.tsx`
2. Find line 32: `const [currentPage, setCurrentPage] = useState<PageType>('home');`
3. Change to: `const [currentPage, setCurrentPage] = useState<PageType>('admin-signups');`
4. Save and refresh browser
5. Remember to revert this before committing!

**Method 2: Browser Console**
```javascript
// In your browser console, navigate to admin
window.location.pathname = '/admin-signups';
```

### Test Signup Flow

To test the admin section with real data:

1. Start the app: `npm run dev`
2. Go to the homepage
3. Click "Start Trial"
4. Fill out the signup form with test data:
   - Use any valid email format
   - Phone: any format
   - Business name: anything
5. Select a consultation time
6. Use test card details:
   - Card Number: `4242 4242 4242 4242`
   - Expiry: `10/29`
   - CVC: `123`
7. Submit payment
8. Data will be saved to database
9. Navigate to admin section to see the signup

## Admin Pages

### 1. Signups List (`/admin-signups`)

**Component**: `AdminSignupsList.tsx`

**Purpose**: View all trial signups in a summary table format

**Features**:
- Real-time data loading from Supabase
- Displays key customer information:
  - Name
  - Business name
  - Email
  - Phone number
  - Consultation date/time
  - Status badge
  - Signup date
- Click any row to view full details
- Refresh button to reload data
- Responsive design (mobile-friendly)

**Status Colors**:
- 🟢 Active: Green badge
- 🔵 Trial: Cyan badge
- 🟡 Pending: Yellow badge
- ⚪ Canceled: Gray badge

### 2. Signup Details (`/admin-signup-details/:id`)

**Component**: `AdminSignupDetails.tsx`

**Purpose**: View and manage individual signup records

**Information Displayed**:
- **Personal Information**
  - Full name
  - Email (clickable to send email)
  - Phone (clickable to call)
  - Business name

- **Billing Address**
  - Street address
  - City, State, ZIP

- **Consultation**
  - Scheduled date and time

- **Timeline**
  - Created date
  - Last updated date

- **Status Management**
  - One-click status updates
  - Options: pending, trial, active, canceled

**Actions**:
- Click "Back to list" to return to summary
- Click email/phone to contact customer directly
- Click status buttons to update signup status

## Database Structure

### Signups Table Schema

```sql
CREATE TABLE signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone_number text NOT NULL,
  business_name text NOT NULL,
  billing_street text NOT NULL,
  billing_city text NOT NULL,
  billing_state text NOT NULL,
  billing_zip text NOT NULL,
  consultation_time timestamptz,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### Indexes

```sql
CREATE INDEX signups_email_idx ON signups(email);
CREATE INDEX signups_created_at_idx ON signups(created_at DESC);
CREATE INDEX signups_status_idx ON signups(status);
```

### Row Level Security (RLS)

RLS is enabled on the signups table:
- **SELECT**: Authenticated users can view all signups
- **UPDATE**: Authenticated users can update all signups
- **INSERT**: Anyone can insert (used during signup flow)

## Data Flow

```
User Signup Flow:
┌─────────────────────┐
│  OnboardingSignup   │ ← User fills form
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ AnalyzingAvailability│ ← User selects consultation time
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  ProcessingPayment   │ ← Payment processed & data saved
└──────────┬──────────┘
           │
           ▼
      [Supabase]
     signups table
           │
           ▼
┌─────────────────────┐
│  AdminSignupsList   │ ← Admin views signups
└─────────────────────┘
```

## Code Structure

### Key Files

```
src/
├── components/
│   ├── AdminSignupsList.tsx       # Summary view
│   ├── AdminSignupDetails.tsx     # Details view
│   └── ProcessingPayment.tsx      # Saves data to DB
├── lib/
│   └── supabase.ts                # Database client
└── App.tsx                        # Routing logic

supabase/
└── migrations/
    └── 20251225165258_create_signups_table.sql
```

### Component Props

**AdminSignupsList.tsx**:
```typescript
interface AdminSignupsListProps {
  onViewDetails: (signupId: string) => void;
}
```

**AdminSignupDetails.tsx**:
```typescript
interface AdminSignupDetailsProps {
  signupId: string;
  onBack: () => void;
}
```

## Security Notes

### Current Implementation

⚠️ **WARNING**: Currently there is NO authentication protecting the admin section.

**Current Security Measures**:
- RLS enabled on database
- Only authenticated Supabase users can read/update data
- Payment card data is never stored

**What's NOT Secure Yet**:
- No login required to access admin pages
- Anyone who knows the URL can attempt to access
- No role-based access control

### Recommended Before Production

1. **Add Authentication**
   ```typescript
   // Example: Protect admin routes
   if (!session) {
     return <AdminLogin />;
   }
   ```

2. **Implement Admin Users Table**
   ```sql
   CREATE TABLE admin_users (
     id uuid PRIMARY KEY REFERENCES auth.users(id),
     role text NOT NULL DEFAULT 'viewer',
     created_at timestamptz DEFAULT now()
   );
   ```

3. **Update RLS Policies**
   ```sql
   -- Only allow admin users
   CREATE POLICY "Admin users only"
     ON signups FOR ALL
     TO authenticated
     USING (
       EXISTS (
         SELECT 1 FROM admin_users
         WHERE admin_users.id = auth.uid()
       )
     );
   ```

## Common Tasks

### Query Recent Signups

```typescript
const { data, error } = await supabase
  .from('signups')
  .select('*')
  .order('created_at', { ascending: false })
  .limit(10);
```

### Update Signup Status

```typescript
const { error } = await supabase
  .from('signups')
  .update({
    status: 'active',
    updated_at: new Date().toISOString()
  })
  .eq('id', signupId);
```

### Search by Email

```typescript
const { data, error } = await supabase
  .from('signups')
  .select('*')
  .eq('email', 'customer@example.com')
  .maybeSingle();
```

### Get Signups by Status

```typescript
const { data, error } = await supabase
  .from('signups')
  .select('*')
  .eq('status', 'trial')
  .order('created_at', { ascending: false });
```

## Development Roadmap

### Phase 1: Security (Priority: HIGH)
- [ ] Add Supabase Auth
- [ ] Create admin login page
- [ ] Implement session management
- [ ] Add logout functionality
- [ ] Update RLS policies

### Phase 2: Search & Filtering
- [ ] Add search bar (name, email, business)
- [ ] Status filter dropdown
- [ ] Date range picker
- [ ] Sort columns (name, date, status)
- [ ] Pagination (limit 50 per page)

### Phase 3: Enhanced Details
- [ ] Add notes field to each signup
- [ ] Show activity history
- [ ] Display related consultations
- [ ] Add tags/labels

### Phase 4: Communication
- [ ] Email template system
- [ ] Send email from admin panel
- [ ] SMS integration
- [ ] Automated reminders

### Phase 5: Analytics
- [ ] Dashboard with metrics
- [ ] Signup rate graph
- [ ] Conversion funnel
- [ ] Status distribution pie chart
- [ ] Revenue projections

### Phase 6: Export & Integration
- [ ] Export to CSV
- [ ] Export to Excel
- [ ] Webhook integration
- [ ] API endpoints
- [ ] CRM sync (Salesforce, HubSpot)

## Troubleshooting

### "Failed to load signups"

**Possible Causes**:
1. Supabase connection issue
2. RLS policy blocking access
3. Network error

**Solutions**:
```typescript
// Check Supabase client
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);

// Test connection
const { data, error } = await supabase.from('signups').select('count');
console.log('Connection test:', { data, error });
```

### Status Update Not Working

**Check**:
1. RLS policies allow updates
2. User is authenticated
3. Error message in console

**Debug**:
```typescript
const { data, error } = await supabase
  .from('signups')
  .update({ status: 'active' })
  .eq('id', signupId);

if (error) {
  console.error('Update failed:', error);
}
```

### No Signups Showing

**Verify**:
1. Database has data: Check Supabase dashboard
2. Query is correct
3. RLS allows SELECT

**Test Query**:
```sql
-- Run in Supabase SQL Editor
SELECT * FROM signups ORDER BY created_at DESC;
```

## Best Practices

### When Viewing Signups

1. Always verify consultation times are in customer's timezone
2. Check for duplicate emails before following up
3. Update status after each customer interaction
4. Add notes about conversations (coming in Phase 3)

### When Updating Status

- **pending** → New signup, not yet contacted
- **trial** → Trial activated, in trial period
- **active** → Paying customer, consultation completed
- **canceled** → Customer canceled, trial not activated

### Data Privacy

- Never share customer data outside secure channels
- Follow GDPR/privacy policy guidelines
- Log all access to customer data (coming in Phase 3)
- Regularly audit admin access

## Support

### For Technical Issues

- Check this documentation first
- Review error messages in browser console
- Check Supabase dashboard for database issues
- Contact technical lead

### For Feature Requests

Document requests with:
1. What you need
2. Why you need it
3. Expected behavior
4. Priority level (low/medium/high)

## Quick Reference

### Status Options
```typescript
type SignupStatus = 'pending' | 'trial' | 'active' | 'canceled';
```

### Date Formatting
```typescript
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
};
```

### Environment Variables
```bash
VITE_SUPABASE_URL=https://uqwwppofrcepqnystfll.supabase.co
VITE_SUPABASE_ANON_KEY=[your-anon-key]
```

---

**Last Updated**: December 25, 2024
**Version**: 1.0.0 (Initial Release)
**Maintained By**: KABBA Development Team
