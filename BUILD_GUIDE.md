# FlowTracker Android Build Guide

## Prerequisites for Local Building

### Required Software
1. **Android Studio** (includes Android SDK)
2. **Java JDK 17+** (included with Android Studio)
3. **Node.js 18+** (for building frontend)

### Download Project
1. Download entire FlowTracker project from Replit
2. Extract to your local machine

## Build Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Build Frontend
```bash
npm run build
npx cap sync android
```

### 3. Build Signed AAB
```bash
cd android
./gradlew bundleRelease
```

## Signing Configuration (Already Set Up)

### Keystore Details
- **File**: `android/flowtracker-release-key.keystore`
- **Store Password**: `flowtracker123`
- **Key Alias**: `flowtracker`
- **Key Password**: `flowtracker123`
- **Validity**: 10,000 days

### Configuration Files
- `android/gradle.properties` - Contains signing properties
- `android/app/build.gradle` - Configured with signing config

## Output Location
The signed AAB will be generated at:
```
android/app/build/outputs/bundle/release/app-release.aab
```

## Upload to Google Play Console

### 1. Create App Listing
- App Name: FlowTracker
- Package Name: `xyz.flowtracker.app`
- Category: Health & Fitness

### 2. Upload AAB
- Navigate to Release → Production
- Create new release
- Upload `app-release.aab`

### 3. Store Listing
- Copy description from `STORE_LISTING/play_store_description.txt`
- Add screenshots from `STORE_LISTING/screenshots/`
- Set pricing: Free with in-app purchases

### 4. Configure In-App Products
Follow the steps in `REVENUECAT_SETUP.md` for:
- Monthly subscription: `flowtracker_pro_monthly` ($4.99)
- Annual subscription: `flowtracker_pro_yearly` ($39.99)
- 7-day free trial configuration

## Troubleshooting

### Common Issues
1. **Gradle not found**: Make gradlew executable: `chmod +x gradlew`
2. **SDK not found**: Install Android Studio and SDK
3. **Build fails**: Clean and rebuild: `./gradlew clean bundleRelease`

### Support
- Check `REVENUECAT_SETUP.md` for subscription setup
- Review `SUBMISSION_CHECKLIST.md` for complete submission guide
- Store descriptions ready in `STORE_LISTING/` directory

## Security Notes
- **Keystore Backup**: Save `flowtracker-release-key.keystore` securely
- **Passwords**: Store keystore credentials safely
- **Production**: This keystore will be used for all future app updates

## Next Steps After Building
1. Test AAB locally using bundletool
2. Upload to Google Play internal testing
3. Configure RevenueCat subscriptions
4. Submit for review

Your app is ready for production deployment! 🚀