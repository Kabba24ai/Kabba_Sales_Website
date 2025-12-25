# Admin Section - Quick Start Guide

## For Team Members: Access the Admin Dashboard

### Step 1: Access During Development

**Option A: Temporarily Change Default Page**
1. Open `src/App.tsx`
2. Go to line 32
3. Change:
   ```typescript
   const [currentPage, setCurrentPage] = useState<PageType>('home');
   ```
   To:
   ```typescript
   const [currentPage, setCurrentPage] = useState<PageType>('admin-signups');
   ```
4. Save and refresh browser
5. **Remember to revert before committing!**

**Option B: Navigate via Console**
1. Open browser DevTools (F12)
2. Type in console:
   ```javascript
   window.location.hash = '#admin';
   ```

### Step 2: View Signups

Once in the admin section, you'll see:
- List of all trial signups
- Status badges (color-coded)
- Customer name, business, email, phone
- Consultation date/time
- Click any row to view full details

### Step 3: View Individual Signup

Click any signup row to see:
- Complete customer information
- Full billing address
- Consultation schedule
- Timeline (created/updated dates)
- Status management buttons

### Step 4: Update Status

In the details view:
- Click any status button (pending, trial, active, canceled)
- Status updates immediately
- Returns to same page

## Test the Full Flow

### Create a Test Signup

1. Start dev server: `npm run dev`
2. Go to homepage
3. Click "Start Trial"
4. Fill out form with test data
5. Select consultation time
6. Use test card:
   - Number: `4242 4242 4242 4242`
   - Expiry: `10/29`
   - CVC: `123`
7. Submit
8. Navigate to admin to see the new signup

## Common Actions

### Refresh Data
Click the "Refresh" button in the top right

### Return to Signup List
Click "Back to list" in details view

### Contact Customer
- Click email address to open mail client
- Click phone number to initiate call

## Status Meanings

| Status | Meaning |
|--------|---------|
| 🟡 Pending | New signup, not yet contacted |
| 🔵 Trial | Trial activated, in trial period |
| 🟢 Active | Paying customer, consultation completed |
| ⚪ Canceled | Customer canceled, trial not activated |

## Important Notes

⚠️ **Security**: No authentication yet - don't deploy admin to production without adding auth!

✅ **Data Safety**: Card numbers are NEVER stored in database

📊 **Real-time**: Data loads directly from Supabase

## Need Help?

- Full documentation: See `ADMIN.md`
- Technical issues: Check browser console for errors
- Feature requests: Document and share with team

## Quick Links

- **Supabase Dashboard**: [https://supabase.com/dashboard/project/uqwwppofrcepqnystfll](https://supabase.com/dashboard/project/uqwwppofrcepqnystfll)
- **Database Table**: Go to Table Editor → `signups`
- **Policies**: Go to Authentication → Policies → `signups`

---

**Version**: 1.0
**Last Updated**: December 25, 2024
