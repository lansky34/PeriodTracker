# 🚨 CRITICAL: iOS Bundle Identifier Fix Required

## Issue
The iOS Xcode project's `PRODUCT_BUNDLE_IDENTIFIER` may still be set to the old `com.flowtracker.app` instead of the new `xyz.flowtracker.app`, which will cause App Store submission failures.

## Required Fix Steps

### 1. Open Xcode Project
```bash
open ios/App/App.xcworkspace
```

### 2. Update Bundle Identifier
1. Select the "App" project in the navigator
2. Select the "App" target
3. Go to "General" tab
4. Change **Bundle Identifier** from `com.flowtracker.app` to `xyz.flowtracker.app`

### 3. Update Signing & Capabilities
1. Go to "Signing & Capabilities" tab
2. Ensure **In-App Purchase** capability is enabled
3. Update provisioning profile if needed
4. Verify signing certificate is valid

### 4. Clean and Rebuild
```bash
npx cap sync ios
# Then in Xcode:
# Product → Clean Build Folder
# Product → Archive (for store submission)
```

## Verification
- Bundle ID in Xcode matches `xyz.flowtracker.app`
- App Store Connect app configuration uses `xyz.flowtracker.app`
- RevenueCat app is configured for `xyz.flowtracker.app`

⚠️ **This MUST be completed before App Store submission or IAP will fail!**