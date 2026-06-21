# Resend Email Service Setup

## API Key Configuration

Add the following to your `.env.local` file:

```env
# Email Service (Resend)
RESEND_API_KEY=re_P8FrUiXB_BVtJv9iyc2T5Kg16QQWgRxNk
```

## Verification Steps

1. Create `.env.local` in your project root
2. Add the Resend API key above
3. Restart your development server
4. Test email functionality by:
   - Creating a test account
   - Placing a test order
   - Checking console logs for email status

## Email Service Status

- ✅ Development Mode: Console logs (when API key missing)
- ✅ Production Mode: Real emails via Resend (when API key present)
- ✅ Error Handling: Graceful fallback if email service fails

## Test Scenarios

1. **Registration**: Should send welcome email
2. **Order Placement**: Should send order confirmation
3. **Payment Confirmation**: Should send payment receipt
4. **Order Status Updates**: Should send shipping notifications

The email service will automatically switch from development mode to production mode once the API key is configured.
