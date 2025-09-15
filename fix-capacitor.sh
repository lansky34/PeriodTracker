#!/bin/bash

echo "🔧 Fixing Capacitor variant issues..."

# 1. Remove all generated Android files
echo "🗑️ Removing generated files..."
rm -rf android/.gradle
rm -rf android/build
rm -rf android/app/build
rm -rf android/capacitor-cordova-android-plugins/build
rm -rf node_modules/.cache

# 2. Clean Capacitor completely
echo "🧹 Deep cleaning Capacitor..."
npx cap clean android

# 3. Remove and reinstall problematic plugins
echo "📦 Reinstalling plugins..."
npm uninstall @capacitor-community/admob @revenuecat/purchases-capacitor @capacitor/local-notifications

# 4. Install compatible versions
npm install @capacitor-community/admob@5.1.0
npm install @revenuecat/purchases-capacitor@7.3.5  
npm install @capacitor/local-notifications@5.0.7

# 5. Sync with clean slate
echo "🔄 Syncing Capacitor..."
npx cap sync android

# 6. Build
echo "🏗️ Building AAB..."
cd android
./gradlew clean
./gradlew bundleRelease --no-daemon --warning-mode=all

echo "✅ Build completed!"