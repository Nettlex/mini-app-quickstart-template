# Admin Authentication Setup

## Overview

Admin endpoints are now protected with authentication to prevent unauthorized access.

## Protected Endpoints

### 1. `/api/withdraw` - GET with `action=pending`
**Purpose**: View all pending withdrawal requests

**Authentication**: Requires `Authorization` header

**Example**:
```bash
curl -H "Authorization: Bearer YOUR_ADMIN_SECRET" \
  "https://your-app.vercel.app/api/withdraw?action=pending"
```

### 2. `/api/withdraw` - POST with `action=update`
**Purpose**: Approve/reject withdrawal requests

**Authentication**: Requires `Authorization` header

**Example**:
```bash
curl -X POST https://your-app.vercel.app/api/withdraw \
  -H "Authorization: Bearer YOUR_ADMIN_SECRET" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "update",
    "requestId": "withdraw_123456",
    "status": "approved",
    "transactionHash": "0xabc...",
    "processedBy": "admin@example.com"
  }'
```

### 3. `/api/prize/distribute` - POST
**Purpose**: Trigger prize distribution

**Authentication**: Requires `Authorization` header

**Example**:
```bash
curl -X POST https://your-app.vercel.app/api/prize/distribute \
  -H "Authorization: Bearer YOUR_ADMIN_SECRET" \
  -H "Content-Type: application/json" \
  -d '{
    "leaderboardEntries": [...],
    "prizePoolAmount": 1000
  }'
```

### 4. `/api/prize/distribute` - GET
**Purpose**: View prize distribution logs

**Authentication**: Requires `Authorization` header

**Example**:
```bash
curl -H "Authorization: Bearer YOUR_ADMIN_SECRET" \
  "https://your-app.vercel.app/api/prize/distribute"
```

---

## Setup Instructions

### 1. Generate a Strong Admin Secret

```bash
# Generate a random 32-character secret
openssl rand -base64 32
```

### 2. Add to Vercel Environment Variables

1. Go to your Vercel dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add a new variable:
   - **Key**: `ADMIN_SECRET_KEY`
   - **Value**: Your generated secret (e.g., `xK8mN3pQ7rT2vW5yB9cE4fH6jL1mN8pQ`)
   - **Environment**: Production, Preview, Development

5. Redeploy your application

### 3. Save Your Secret Securely

**⚠️ IMPORTANT**: Save your admin secret in a secure location (password manager, secure notes, etc.)

You will need this secret to:
- Approve/reject withdrawals
- Trigger prize distributions
- View admin-only data

---

## Security Features

### ✅ What's Protected
- **Withdrawal Management**: Only admins can view/approve pending withdrawals
- **Prize Distribution**: Only admins can trigger prize payouts
- **Distribution Logs**: Only admins can view payout history

### ✅ Security Measures
- Header-based authentication (Bearer token)
- Environment variable secret storage
- 401 Unauthorized responses for invalid/missing auth
- Development mode warning if secret not configured

### ⚠️ Development Mode
In `NODE_ENV=development`, admin endpoints are accessible without authentication (but a warning is logged). This is for local testing only.

**In production**, the `ADMIN_SECRET_KEY` must be set, or admin endpoints will be locked.

---

## Example Admin Scripts

### View Pending Withdrawals
```bash
#!/bin/bash
ADMIN_SECRET="your_secret_here"
API_URL="https://your-app.vercel.app"

curl -H "Authorization: Bearer $ADMIN_SECRET" \
  "$API_URL/api/withdraw?action=pending" | jq
```

### Approve a Withdrawal
```bash
#!/bin/bash
ADMIN_SECRET="your_secret_here"
API_URL="https://your-app.vercel.app"
REQUEST_ID="withdraw_123456"
TX_HASH="0xabc123..."

curl -X POST "$API_URL/api/withdraw" \
  -H "Authorization: Bearer $ADMIN_SECRET" \
  -H "Content-Type: application/json" \
  -d "{
    \"action\": \"update\",
    \"requestId\": \"$REQUEST_ID\",
    \"status\": \"approved\",
    \"transactionHash\": \"$TX_HASH\",
    \"processedBy\": \"admin\"
  }" | jq
```

---

## Testing

### Test with cURL
```bash
# Should return 401 Unauthorized
curl -v https://your-app.vercel.app/api/withdraw?action=pending

# Should return withdrawal data
curl -v -H "Authorization: Bearer YOUR_SECRET" \
  https://your-app.vercel.app/api/withdraw?action=pending
```

### Test with Postman
1. Create a new GET request to: `https://your-app.vercel.app/api/withdraw?action=pending`
2. Go to **Headers** tab
3. Add header:
   - Key: `Authorization`
   - Value: `Bearer YOUR_SECRET`
4. Send request

---

## Troubleshooting

### ❌ "Unauthorized" Error
- **Check**: Is `ADMIN_SECRET_KEY` set in Vercel environment variables?
- **Check**: Are you sending the correct secret in the `Authorization` header?
- **Check**: Is the format `Bearer <secret>` (with a space)?

### ⚠️ "ADMIN_SECRET_KEY not configured" Warning
- This appears if the environment variable is missing
- In production, admin endpoints will be locked
- In development, they'll work but show a warning

### 🔄 Changes Not Taking Effect
- Redeploy your application after adding/changing `ADMIN_SECRET_KEY`
- Environment variables only apply to new deployments

---

## Best Practices

1. **Never Commit Secrets**: Don't add `ADMIN_SECRET_KEY` to `.env` files in git
2. **Use Strong Secrets**: Generate random, long secrets (32+ characters)
3. **Rotate Regularly**: Change your admin secret periodically
4. **Secure Storage**: Store in a password manager or secure vault
5. **Limit Access**: Only share with trusted administrators
6. **Monitor Logs**: Check Vercel logs for unauthorized access attempts

---

## Future Enhancements

Consider implementing:
- Role-based access control (different permission levels)
- JWT-based authentication with expiry
- Rate limiting on admin endpoints
- Audit logging for all admin actions
- Multi-factor authentication
- IP allowlisting

---

**Last Updated**: December 29, 2025

