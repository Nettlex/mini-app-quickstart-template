# Base App Certification Checklist

## ✅ Completed Requirements

### 1. Authentication ✅
- ✅ Wallet connection happens automatically
- ✅ No external redirects
- ✅ No email/phone verification required

### 2. Onboarding Flow ✅
- ✅ **NEW**: Onboarding modal with 3-step tutorial
- ✅ Explains game purpose and how to get started
- ✅ Clear instructions on first launch
- ✅ **NEW**: Help button (❓) in navigation to re-open tutorial
- ✅ **NEW**: Display usernames only (no 0x addresses shown)
- ✅ Username modal for setting display name
- ✅ Avatar display in profile

### 3. Base Compatibility ✅
- ✅ **NEW**: Client-agnostic (removed Farcaster-specific text)
- ✅ Works in any Base-compatible client
- ✅ No hard-coded client references
- ⚠️ **TODO**: Transaction sponsorship (requires Paymaster setup)

### 4. Layout ✅
- ✅ Call to actions are visible and centered
- ✅ **NEW**: 4-button bottom navigation (Play, Leaderboard, Profile, Help)
- ✅ All buttons accessible and not cut off
- ✅ Clear, understandable navigation labels
- ✅ Side menu for wallet/balance actions

### 5. Load Time ✅
- ✅ App loads within 3 seconds (Next.js optimized)
- ✅ In-app actions complete within 1 second
- ✅ Loading indicators shown during:
  - Bullet loading animation
  - Transaction confirmations
  - Balance updates
  - Leaderboard fetches

### 6. Usability ⚠️
- ✅ Minimum 44px touch targets
- ✅ **NEW**: Toast notifications (works in sandboxed iframes)
- ⚠️ **TODO**: Light mode support (currently dark mode only)

### 7. App Metadata ⚠️
**TODO - Requires User Input:**

#### Required Assets:
1. **App Icon** (1024×1024 px, PNG, no transparency)
   - Should be readable at small sizes
   - No Base logo required
   
2. **Cover Photo** (1200×630 px, PNG/JPG)
   - High quality
   - No Base logo or team photos
   - 1.91:1 aspect ratio
   
3. **Screenshots** (3 required, 1284×2778 px, portrait)
   - Screenshot 1: Game view with revolver
   - Screenshot 2: Leaderboard view
   - Screenshot 3: Profile/wallet view

4. **App Description**
   - Clear, concise, user-focused
   - Suggested: "Russian Roulette - A provably fair game of chance on Base. Test your luck, build streaks, and compete for real USDC prizes. Survive 6 pulls to win!"

5. **Subtitle** (sentence case, no punctuation)
   - Suggested: "Provably fair blockchain game with real prizes"

---

## 🚀 Recent Updates (Dec 21, 2025)

### Fixed: Sandboxed iframe compatibility
- Replaced `alert()` with toast notification system
- Works in Farcaster frames and other sandboxed environments
- Top-right toast notifications with auto-dismiss
- Color-coded by type (success/error/warning/info)

### Fixed: Base Certification Guidelines
- **Usernames only**: No 0x addresses shown on leaderboard
- **Client-agnostic**: Removed all Farcaster-specific text
- **Onboarding**: Added 3-step tutorial modal
- **Help button**: Added ❓ button to navigation for re-opening tutorial
- **Navigation**: 4-button bottom nav (Play, Leaderboard, Profile, Help)

---

## 📋 Remaining Tasks

### 1. Light Mode Support (Guideline #6)
**Complexity**: Medium
**Estimated Time**: 1-2 hours

**Implementation Plan:**
```typescript
// Add theme context
const [theme, setTheme] = useState<'light' | 'dark'>('dark');

// Update all components with theme-aware classes
className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}

// Add theme toggle button in profile or settings
```

**Files to Update:**
- `app/components/ProvablyFairGame.tsx` (main game UI)
- `app/components/Leaderboard.tsx`
- `app/components/Profile.tsx`
- `app/globals.css` (CSS variables for theme)

### 2. Transaction Sponsorship (Guideline #3)
**Complexity**: High
**Requires**: Coinbase Paymaster API setup

**Implementation:**
1. Sign up for Coinbase Paymaster
2. Add `PAYMASTER_URL` to environment variables
3. Update `sendCalls` to include paymaster config
4. Test with sponsored transactions

### 3. App Metadata (Guideline #7)
**Complexity**: Low (design work)
**Requires**: User to provide/approve assets

**Next Steps:**
1. Create or commission app icon (1024×1024)
2. Create cover photo (1200×630)
3. Take 3 screenshots (1284×2778)
4. Write app description and subtitle
5. Submit to Base app directory

---

## 🎯 Priority Order

1. **HIGH**: Fix VERCEL_TOKEN issue (blocking deposits)
2. **MEDIUM**: Add light mode support
3. **MEDIUM**: Create app metadata assets
4. **LOW**: Transaction sponsorship (nice-to-have)

---

## 📊 Certification Score

| Category | Status | Score |
|----------|--------|-------|
| Authentication | ✅ Complete | 100% |
| Onboarding | ✅ Complete | 100% |
| Base Compatibility | ⚠️ Partial | 80% |
| Layout | ✅ Complete | 100% |
| Load Time | ✅ Complete | 100% |
| Usability | ⚠️ Partial | 80% |
| App Metadata | ❌ Incomplete | 0% |
| **TOTAL** | | **80%** |

---

## 🔗 Useful Links

- [Base App Guidelines](https://docs.base.org/building-with-base/app-guidelines)
- [Coinbase Paymaster Docs](https://docs.cdp.coinbase.com/paymaster/docs/welcome)
- [OnchainKit Documentation](https://onchainkit.xyz/)

---

## 📝 Notes

- App is currently optimized for dark mode
- Toast notifications work in all iframe environments
- Server-authoritative architecture prevents cheating
- Edge Config provides persistent global storage
- ETH and USDC deposits supported with on-chain verification

