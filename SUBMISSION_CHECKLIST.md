# FlowTracker App Store Submission Checklist

## Pre-Submission Verification ✅

### ✅ App Configuration
- [x] App ID updated to `xyz.flowtracker.app` 
- [x] Version set to 1.0.0 (Build 1)
- [x] Environment configuration created (.env.release)
- [x] Feature flags enabled (ADS_ENABLED=true, IAP_ENABLED=true)

### ✅ Monetization Integration
- [x] RevenueCat SDK integrated (@revenuecat/purchases-capacitor@11.2.1)
- [x] AdMob SDK integrated (@capacitor-community/admob@7.0.3)
- [x] Pro user gating implemented (ads disabled for Pro users)
- [x] Test AdMob IDs configured (will switch to production after approval)

### ✅ Platform Configuration
**Android:**
- [x] Package name: xyz.flowtracker.app
- [x] minSdkVersion: 24 (Android 7.0+)
- [x] targetSdkVersion: 34
- [x] Minification enabled for release builds
- [x] Required permissions added (Internet, Network State, Wake Lock, etc.)

**iOS:**
- [x] Bundle ID: xyz.flowtracker.app  
- [x] iOS 14.0+ support
- [x] Native plugins configured in Podfile
- [x] App icon sets complete (all required sizes)

### ✅ Store Assets
- [x] App icons (1024x1024, adaptive icons for Android)
- [x] Screenshots (iPhone 6.7", 6.1", iPad 12.9", Android phone/tablet)
- [x] Store metadata prepared for both platforms

## Submission Links & Credentials

### Google Play Console
- **Console:** https://play.google.com/console
- **Package Name:** xyz.flowtracker.app
- **Testing Track:** Internal Testing → Alpha → Production
- **Build Type:** App Bundle (.aab)

### Apple App Store Connect  
- **Console:** https://appstoreconnect.apple.com
- **Bundle ID:** xyz.flowtracker.app
- **Testing Track:** TestFlight → App Store Review
- **Build Type:** iOS App Archive (.ipa)

### Test Accounts
**Demo Account (if needed):**
- Email: demo@flowtracker.xyz
- Password: FlowTracker2025!
- Note: App works without login - period tracking is local

### API Keys & Configuration
**RevenueCat:**
- Android API Key: [TO BE CONFIGURED]
- iOS API Key: [TO BE CONFIGURED]  
- Entitlement ID: "pro"

**AdMob (Currently Test IDs):**
- Android App ID: ca-app-pub-3940256099942544~3347511713
- iOS App ID: ca-app-pub-3940256099942544~1458002511
- See AD_IDS.md for production switch instructions

## Build Commands

### Android Release Build
```bash
# 1. Sync Capacitor
npx cap sync android

# 2. Open Android Studio  
npx cap open android

# 3. In Android Studio:
# - Build > Generate Signed Bundle/APK
# - Select "Android App Bundle" 
# - Use release keystore (create if needed)
# - Build release AAB for Play Store upload
```

### iOS Release Build
```bash
# 1. Sync Capacitor
npx cap sync ios

# 2. Install pods
cd ios/App && pod install

# 3. Open Xcode
npx cap open ios

# 4. In Xcode:
# - Set to "Any iOS Device" 
# - Product > Archive
# - Distribute App > App Store Connect
# - Upload to TestFlight
```

## Pre-Launch Checklist

### ✅ Functional Testing
- [ ] Registration/login flow works
- [ ] Period tracking and calendar display
- [ ] Symptom logging functionality  
- [ ] Notifications schedule properly
- [ ] Pro subscription flow (test mode)
- [ ] Ad display for free users (test ads)
- [ ] Data export functionality
- [ ] Offline functionality

### ✅ Store Compliance
**Google Play:**
- [ ] Data Safety form completed
- [ ] Content rating submitted  
- [ ] Target audience declared (Teen 13+)
- [ ] Ads disclosure added to description

**App Store:**
- [ ] App Privacy labels completed
- [ ] IDFA usage declared (Yes - for ads)
- [ ] Age rating set (12+ - Medical)
- [ ] In-app purchases configured

### ✅ Policy Compliance
- [ ] Privacy Policy live at https://flowtracker.xyz/privacy
- [ ] Terms of Service available
- [ ] Data collection clearly disclosed
- [ ] Ad-supported tier clearly communicated
- [ ] Subscription terms clearly stated

## Post-Approval Tasks

1. **Switch to Production AdMob IDs** (see AD_IDS.md)
2. **Configure real RevenueCat API keys**
3. **Set up production webhooks**  
4. **Monitor crash reporting**
5. **Update version to 1.0.1 for production ad units**

## Support Information

- **Website:** https://flowtracker.xyz
- **Support Email:** support@flowtracker.xyz
- **Privacy Policy:** https://flowtracker.xyz/privacy

## Submission Status
- [ ] Google Play Internal Testing uploaded
- [ ] Apple TestFlight build uploaded
- [ ] Internal testing completed
- [ ] Store reviews initiated
- [ ] Production release scheduled

---
**Next Steps:** Upload builds to respective consoles and begin internal testing phase.