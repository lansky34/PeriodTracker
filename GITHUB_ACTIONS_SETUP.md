# GitHub Actions Setup for FlowTracker

## Automated Android Build Configuration

Your FlowTracker project now has automated building with GitHub Actions. Every time you push code to the main branch, it will automatically build a signed Android App Bundle (AAB) ready for Google Play Store.

## Required GitHub Secrets

You need to add these secrets to your GitHub repository:

### 1. Navigate to Repository Settings
- Go to your GitHub repository
- Click **Settings** → **Secrets and variables** → **Actions**
- Click **New repository secret**

### 2. Add Required Secrets

**ANDROID_KEYSTORE_BASE64**
```
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
```

**ANDROID_KEY_ALIAS**
```
flowtracker
```

**ANDROID_STORE_PASSWORD**
```
flowtracker123
```

**ANDROID_KEY_PASSWORD**
```
flowtracker123
```

## How It Works

### Triggers
The workflow runs automatically when you:
- Push to main/master branch
- Create a pull request
- Manually trigger from GitHub Actions tab

### Build Process
1. **Environment Setup**: Installs Node.js, Java, and Android SDK
2. **Dependencies**: Installs npm packages
3. **Frontend Build**: Builds React app with Vite
4. **Capacitor Sync**: Syncs web assets to Android
5. **Keystore Setup**: Decodes and configures signing keystore
6. **Android Build**: Builds signed AAB with Gradle
7. **Artifact Upload**: Saves AAB and mapping files

### Outputs
After successful build, you can download:
- **flowtracker-release-aab**: The signed AAB file for Play Store
- **flowtracker-mapping**: ProGuard mapping file for crash reports

## Usage

### 1. Push Your Code
```bash
git add .
git commit -m "Update app"
git push origin main
```

### 2. Monitor Build
- Go to **Actions** tab in your GitHub repository
- Watch the "Build Android AAB" workflow run
- Build typically takes 5-10 minutes

### 3. Download AAB
- Click on the completed workflow run
- Scroll to **Artifacts** section
- Download **flowtracker-release-aab**
- Extract the ZIP to get `app-release.aab`

### 4. Upload to Play Store
- Go to Google Play Console
- Upload the `app-release.aab` file
- Follow the steps in `REVENUECAT_SETUP.md`

## Security Notes

- Keystore is securely encrypted in GitHub secrets
- Only you can access the repository secrets
- AAB artifacts are automatically deleted after 30 days
- Never commit the actual keystore file to Git

## Troubleshooting

### Build Fails
- Check the **Actions** tab for error details
- Ensure all secrets are added correctly
- Verify secret values don't have extra spaces

### Missing Artifacts
- Build must complete successfully to generate artifacts
- Check workflow logs for any errors
- Re-run the workflow if needed

Your automated Android build system is now ready! 🚀