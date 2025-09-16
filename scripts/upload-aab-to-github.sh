#!/bin/bash

# Script to upload signed AAB file to GitHub releases
# Usage: ./scripts/upload-aab-to-github.sh <aab-file> <version> <build-number>

set -e

# Check if required tools are installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed. Please install it first:"
    echo "   https://cli.github.com/"
    exit 1
fi

# Check arguments
if [ $# -ne 3 ]; then
    echo "Usage: $0 <aab-file> <version> <build-number>"
    echo "Example: $0 app-release.aab 1.0.0 1"
    exit 1
fi

AAB_FILE="$1"
APP_VERSION="$2"
BUILD_NUMBER="$3"

# Validate AAB file exists
if [ ! -f "$AAB_FILE" ]; then
    echo "❌ AAB file not found: $AAB_FILE"
    exit 1
fi

# Set variables
RELEASE_TAG="v${APP_VERSION}-build${BUILD_NUMBER}"
RELEASE_NAME="FlowTracker v${APP_VERSION} (Build ${BUILD_NUMBER})"
AAB_NAME="FlowTracker-v${APP_VERSION}-signed.aab"
AAB_SIZE=$(du -h "$AAB_FILE" | cut -f1)

echo "🚀 Uploading AAB to GitHub releases..."
echo "📁 File: $AAB_FILE ($AAB_SIZE)"
echo "🏷️  Tag: $RELEASE_TAG"
echo "📱 Name: $AAB_NAME"

# Create release notes
cat > /tmp/release_notes.md << EOF
# 🤖 FlowTracker Android Release

**Version:** ${APP_VERSION}  
**Build:** ${BUILD_NUMBER}  
**Package:** xyz.flowtracker.app  
**Signed:** ✅ Ready for Play Store  
**Size:** ${AAB_SIZE}

## 📱 Installation
- Download the AAB file below
- Upload to Google Play Console for distribution
- Or convert to APK using bundletool for direct installation

## 🔐 Security
- Signed with production keystore
- Ready for Play Store submission
- All security checks passed

## 📊 Build Info
- Built on: $(date -u +"%Y-%m-%d %H:%M:%S UTC")
- Uploaded via manual script
EOF

# Check if release already exists and delete if so
if gh release view "$RELEASE_TAG" >/dev/null 2>&1; then
    echo "⚠️  Release $RELEASE_TAG already exists, deleting..."
    gh release delete "$RELEASE_TAG" --yes
fi

# Create new release
echo "📝 Creating GitHub release..."
gh release create "$RELEASE_TAG" \
    --title "$RELEASE_NAME" \
    --notes-file /tmp/release_notes.md \
    --draft=false \
    --prerelease=false

# Upload AAB file with custom name
echo "📤 Uploading AAB file..."
gh release upload "$RELEASE_TAG" "$AAB_FILE" --clobber --name "$AAB_NAME"

# Clean up
rm -f /tmp/release_notes.md

echo "✅ Upload completed successfully!"
echo ""
echo "🔗 Release URL: https://github.com/$(gh repo view --json owner,name --jq '.owner.login + "/" + .name')/releases/tag/$RELEASE_TAG"
echo "📱 Download AAB: $AAB_NAME"
echo ""
echo "Next steps:"
echo "1. Go to Google Play Console"
echo "2. Upload the AAB file for review"
echo "3. Submit for Play Store distribution"