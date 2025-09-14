# RevenueCat 7-Day Free Trial Setup Guide

## Overview
This guide walks through setting up a 7-day free trial for FlowTracker Pro using RevenueCat with iOS App Store Connect and Google Play Console.

## Prerequisites
- RevenueCat account with project configured
- Apple Developer Account (for iOS)
- Google Play Console account (for Android)
- App submitted to both stores (can be in testing)

## Product Configuration

### 1. App Store Connect (iOS)

#### Create In-App Purchase Products
1. Log into App Store Connect
2. Navigate to **My Apps** → **FlowTracker** → **Features** → **In-App Purchases**
3. Click **+** to create new products:

**Monthly Pro Subscription**
- **Product ID**: `flowtracker_pro_monthly`
- **Reference Name**: FlowTracker Pro Monthly
- **Type**: Auto-Renewable Subscription
- **Subscription Group**: FlowTracker Pro
- **Subscription Duration**: 1 Month
- **Price**: $4.99 USD

**Annual Pro Subscription**
- **Product ID**: `flowtracker_pro_yearly`
- **Reference Name**: FlowTracker Pro Yearly
- **Type**: Auto-Renewable Subscription  
- **Subscription Group**: FlowTracker Pro
- **Subscription Duration**: 1 Year
- **Price**: $39.99 USD

#### Configure 7-Day Free Trial
1. For each subscription, click **Subscription Pricing**
2. Click **Add Introductory Offer**
3. Select **Free Trial**
4. Duration: **7 days**
5. Eligibility: **New subscribers only**
6. Save changes

#### Subscription Group Setup
1. Create subscription group: **FlowTracker Pro**
2. Add both monthly and annual subscriptions
3. Set **Level 1** for both (same features, different pricing)

### 2. Google Play Console (Android)

#### Create Subscription Products
1. Log into Google Play Console
2. Navigate to **FlowTracker** → **Monetize** → **Subscriptions**
3. Click **Create subscription**:

**Monthly Pro Subscription**
- **Product ID**: `flowtracker_pro_monthly`
- **Name**: FlowTracker Pro Monthly
- **Description**: Premium features including AI Health Coach, advanced analytics, custom themes, and ad-free experience
- **Billing period**: 1 month
- **Price**: $4.99 USD
- **Free trial period**: 7 days
- **Grace period**: 3 days

**Annual Pro Subscription**
- **Product ID**: `flowtracker_pro_yearly` 
- **Name**: FlowTracker Pro Yearly
- **Description**: Premium features including AI Health Coach, advanced analytics, custom themes, and ad-free experience (save 33%)
- **Billing period**: 1 year
- **Price**: $39.99 USD
- **Free trial period**: 7 days
- **Grace period**: 3 days

## 3. RevenueCat Configuration

### Create Products in RevenueCat Dashboard
1. Log into RevenueCat Dashboard
2. Navigate to **Products**
3. Click **+ New**

**Monthly Product**
- **Product ID**: `flowtracker_pro_monthly`
- **Type**: Subscription
- **Store**: iOS App Store & Google Play Store
- **Duration**: P1M (1 month)

**Annual Product**  
- **Product ID**: `flowtracker_pro_yearly`
- **Type**: Subscription
- **Store**: iOS App Store & Google Play Store
- **Duration**: P1Y (1 year)

### Create Entitlement
1. Navigate to **Entitlements**
2. Click **+ New Entitlement**
3. **Identifier**: `pro`
4. **Description**: FlowTracker Pro features
5. Attach both products to this entitlement

### Create Offering
1. Navigate to **Offerings**
2. Click **+ New Offering**
3. **Identifier**: `default`
4. **Description**: Default FlowTracker Pro offering
5. Add packages:
   - **Monthly Package**: `flowtracker_pro_monthly` product
   - **Annual Package**: `flowtracker_pro_yearly` product

## 4. Environment Configuration

### Development Environment (.env.local)
```
REVENUECAT_API_KEY=your_revenuecat_public_sdk_key
ADS_ENABLED=true
FEATURE_INSIGHTS=true
FEATURE_EXPORT=true  
FEATURE_THEMES=true
```

### Production Environment (.env.release)
```
REVENUECAT_API_KEY=your_production_revenuecat_key
ADS_ENABLED=true
FEATURE_INSIGHTS=true
FEATURE_EXPORT=true
FEATURE_THEMES=true
```

## 5. Testing Configuration

### Sandbox Testing (iOS)
1. Create sandbox test accounts in App Store Connect
2. Sign out of App Store on test device
3. Install app and test purchase flow
4. Verify trial period shows correctly in app

### Internal Testing (Android)  
1. Add test accounts to Play Console internal testing
2. Install internal test version
3. Test purchase flow with test payment methods
4. Verify trial period functionality

## 6. Key Implementation Points

### Trial Detection Logic
```typescript
// In getProState() function
const proEntitlement = info.entitlements.active["pro"];
const isTrialActive = proEntitlement.periodType === "trial";
const isPro = !!proEntitlement; // Includes both trial and paid
```

### Ad Removal During Trial
```typescript
// Trial users are treated as Pro users
const initializeAds = async () => {
  const { isPro } = await purchasesService.getProState();
  if (!isPro) { // This excludes trial users
    await adMobService.initialize();
  }
};
```

## 7. Store Review Preparation

### App Store Review
- Use **demo account** for reviewers if needed
- Include **trial cancellation instructions** in app description
- Test trial flow thoroughly before submission

### Play Store Review
- Ensure **Data Safety** section mentions subscriptions
- Include trial terms in app description
- Test on multiple devices before release

## 8. Post-Launch Monitoring

### Key Metrics to Track
- Trial conversion rate (trial → paid)
- Trial abandonment rate
- Average trial duration
- Revenue per user (trial vs direct purchase)

### RevenueCat Analytics
- Monitor trial starts in RevenueCat dashboard
- Track conversion events
- Set up webhooks for trial expiration notifications

## Troubleshooting

### Common Issues
1. **Trial not showing**: Check offering configuration in RevenueCat
2. **Products not found**: Verify product IDs match exactly across platforms
3. **Entitlements not working**: Ensure products are attached to entitlement
4. **Sandbox issues**: Clear app data and re-test

### Testing Checklist
- [ ] Trial starts correctly on both platforms
- [ ] Pro features unlock during trial
- [ ] Ads disabled during trial
- [ ] Trial countdown shows in settings
- [ ] Subscription management links work
- [ ] Trial expiration handled gracefully
- [ ] Purchase restoration works correctly

## Next Steps
1. Complete store submission with trial configured
2. Test thoroughly in production with small user group
3. Monitor conversion metrics and optimize trial experience
4. Consider A/B testing trial duration (7 vs 14 days)