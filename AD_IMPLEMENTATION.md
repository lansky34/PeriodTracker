# AdMob Implementation Guide for FlowTracker

## Current Implementation Status

FlowTracker uses **Google AdMob test IDs** for initial store submission. After both Google Play and App Store approve the app, follow this guide to switch to production ad units.

## Test vs Production Ad Units

### Current Test Configuration (.env.release)
```env
# AdMob Test IDs (Active during store review)
ADMOB_ANDROID_APP_ID=ca-app-pub-3940256099942544~3347511713
ADMOB_IOS_APP_ID=ca-app-pub-3940256099942544~1458002511

ADMOB_BANNER_ANDROID=ca-app-pub-3940256099942544/6300978111
ADMOB_BANNER_IOS=ca-app-pub-3940256099942544/2934735716
ADMOB_INTERSTITIAL_ANDROID=ca-app-pub-3940256099942544/1033173712
ADMOB_INTERSTITIAL_IOS=ca-app-pub-3940256099942544/4411468910
ADMOB_REWARDED_ANDROID=ca-app-pub-3940256099942544/5224354917
ADMOB_REWARDED_IOS=ca-app-pub-3940256099942544/1712485313
```

### Production Configuration (After Approval)
```env
# AdMob Production IDs (Replace after store approval)
ADMOB_ANDROID_APP_ID=ca-app-pub-YOUR_PUBLISHER_ID~YOUR_ANDROID_APP_ID
ADMOB_IOS_APP_ID=ca-app-pub-YOUR_PUBLISHER_ID~YOUR_IOS_APP_ID

ADMOB_BANNER_ANDROID=ca-app-pub-YOUR_PUBLISHER_ID/YOUR_ANDROID_BANNER_ID
ADMOB_BANNER_IOS=ca-app-pub-YOUR_PUBLISHER_ID/YOUR_IOS_BANNER_ID  
ADMOB_INTERSTITIAL_ANDROID=ca-app-pub-YOUR_PUBLISHER_ID/YOUR_ANDROID_INTERSTITIAL_ID
ADMOB_INTERSTITIAL_IOS=ca-app-pub-YOUR_PUBLISHER_ID/YOUR_IOS_INTERSTITIAL_ID
ADMOB_REWARDED_ANDROID=ca-app-pub-YOUR_PUBLISHER_ID/YOUR_ANDROID_REWARDED_ID
ADMOB_REWARDED_IOS=ca-app-pub-YOUR_PUBLISHER_ID/YOUR_IOS_REWARDED_ID
```

## AdMob Integration Architecture

### Pro User Gating Logic
```typescript
// From client/src/lib/admob.ts
export class AdMobService {
  async initialize(): Promise<void> {
    // 1. Check feature flags
    if (import.meta.env.VITE_ADS_ENABLED !== 'true') return;
    
    // 2. Initialize RevenueCat first (critical order)
    const customerInfo = await purchasesService.getCustomerInfo();
    
    // 3. Skip ad initialization for Pro users
    if (customerInfo.isPro) {
      console.log('AdMob: User is Pro - ads disabled');
      return;
    }
    
    // 4. Initialize AdMob only for free users
    await AdMob.initialize(options);
  }
}
```

### Ad Display Strategy
- **Banner Ads:** Bottom of main screens (Dashboard, Calendar)
- **Interstitial Ads:** Between major app transitions (NOT on first launch, purchase flow, or core tracking)
- **Rewarded Ads:** Optional premium insights unlock
- **Frequency Caps:** Respectful limits to maintain user experience

### Pro User Experience
- **No Ad SDK Initialization:** AdMob never initializes for Pro users
- **No Layout Gaps:** Ad containers completely removed from UI
- **Immediate Effect:** Pro status checked on every app launch

## Switching to Production (Post-Approval)

### Step 1: Create AdMob Account & Apps
1. Go to https://admob.google.com
2. Create AdMob account linked to your developer account
3. Add Android app (package: xyz.flowtracker.app)
4. Add iOS app (bundle ID: xyz.flowtracker.app)

### Step 2: Create Ad Units
For each platform, create:
- **Banner Ad Unit** (320x50 standard banner)
- **Interstitial Ad Unit** (full-screen)  
- **Rewarded Video Ad Unit** (optional rewards)

### Step 3: Update Environment Variables
```bash
# Create .env.production with your real AdMob IDs
cp .env.release .env.production

# Edit .env.production with production ad unit IDs
# Replace all test IDs with your actual AdMob unit IDs
```

### Step 4: Update App Configuration
```typescript
// Ensure environment variables are accessible
// In vite.config.ts, verify VITE_ prefixed vars are exposed
```

### Step 5: Build & Deploy Update
```bash
# Update version for production ad unit deployment
# Update version in capacitor.config.ts and android/app/build.gradle

# Android
npx cap sync android
# Build new AAB with production ad IDs

# iOS  
npx cap sync ios
cd ios/App && pod install
# Build new IPA with production ad IDs

# Deploy as version 1.0.1 to both stores
```

## Privacy & Compliance

### GDPR/CCPA Compliance
- **User Consent:** Required for personalized ads in EU/CA
- **App Tracking Transparency (iOS):** Implemented in AdMob service
- **Privacy Settings:** Users can opt out of personalized ads

### Store Requirements
**Google Play Data Safety:**
- Ads: Yes
- Analytics: Yes  
- User data: Health info stays local
- Ad personalization: Based on consent

**Apple App Privacy:**
- IDFA Usage: Yes (for ad personalization)
- Data Linked to User: Health tracking (local only)
- Third-Party Tracking: AdMob analytics

## Revenue Optimization

### Ad Placement Strategy
1. **Primary Revenue:** Pro subscriptions (ad-free experience)
2. **Secondary Revenue:** AdMob ads for free users
3. **Balance:** Ads generate revenue while encouraging Pro upgrades

### Performance Monitoring
- **AdMob Console:** Track revenue, eCPM, fill rates
- **RevenueCat Dashboard:** Monitor subscription conversions
- **User Analytics:** Balance ad frequency vs. conversion rates

## Technical Implementation Files

### Key Files Modified:
- `client/src/lib/admob.ts` - Core AdMob service
- `client/src/lib/purchases.ts` - RevenueCat integration  
- `client/src/components/ad-banner.tsx` - Ad display component
- `android/app/src/main/AndroidManifest.xml` - Android permissions
- `ios/App/Podfile` - iOS dependencies

### Testing Checklist:
- [ ] Test ads display for non-Pro users
- [ ] Verify Pro users see no ads
- [ ] Test subscription flow disables ads immediately
- [ ] Verify ad placement doesn't break UI
- [ ] Test offline behavior (cached Pro status)

## Support & Troubleshooting

### Common Issues:
1. **Ads not showing:** Check feature flags and Pro status
2. **AdMob initialization failed:** Verify API keys and platform setup
3. **Pro users seeing ads:** Check RevenueCat initialization order
4. **Layout issues:** Ensure ad containers removed for Pro users

### Debug Mode:
```typescript
// Enable verbose logging for troubleshooting
await Purchases.setLogLevel({ level: LOG_LEVEL.VERBOSE });
```

### Contact:
- **Technical Issues:** support@flowtracker.xyz
- **AdMob Support:** https://support.google.com/admob
- **RevenueCat Support:** https://support.revenuecat.com

---
**Remember:** Never switch to production AdMob IDs until both app stores have approved your initial submission with test IDs.