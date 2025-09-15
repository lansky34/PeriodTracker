#!/bin/bash

echo "🔧 Fixing Android build issues..."

# Navigate to android directory
cd android

# Clean everything
echo "🧹 Cleaning build cache..."
./gradlew clean
rm -rf .gradle
rm -rf build
rm -rf app/build

# Clean Capacitor
cd ..
echo "🔄 Cleaning Capacitor..."
npx cap clean android

# Sync Capacitor with latest changes
echo "🔄 Syncing Capacitor..."
npx cap sync android

# Go back to android directory
cd android

# Refresh dependencies
echo "📦 Refreshing dependencies..."
./gradlew --refresh-dependencies

# Try building
echo "🏗️ Building AAB..."
./gradlew bundleRelease

echo "✅ Build process completed!"
echo "📱 Your AAB file should be at: android/app/build/outputs/bundle/release/app-release.aab"