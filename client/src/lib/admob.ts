import { AdMob, BannerAdOptions, BannerAdPosition, BannerAdSize, RewardAdOptions } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';
import { purchasesService } from './purchases';

class AdMobService {
  private initialized = false;
  private shouldShowAds = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Only initialize on mobile platforms
      if (!Capacitor.isNativePlatform()) {
        console.log('AdMob: Web platform - ads disabled');
        return;
      }

      // Check if ads are enabled via feature flag
      if (import.meta.env.VITE_ADS_ENABLED !== 'true') {
        console.log('AdMob: Ads disabled via feature flag');
        return;
      }

      // Initialize RevenueCat first and check Pro status
      const customerInfo = await purchasesService.getCustomerInfo();
      
      if (customerInfo.isPro) {
        console.log('AdMob: User is Pro - ads disabled');
        this.shouldShowAds = false;
        return;
      }

      // Initialize AdMob for non-Pro users
      const options = {
        requestTrackingAuthorization: true,
        testingDevices: ['YOUR_TESTING_DEVICE_ID'], // Add real device IDs for testing
        initializeForTesting: true, // Using test ads
      };

      await AdMob.initialize(options);
      this.initialized = true;
      this.shouldShowAds = true;
      
      console.log('AdMob initialized successfully');
    } catch (error) {
      console.error('Failed to initialize AdMob:', error);
      // Don't throw - gracefully handle ad failures
    }
  }

  async showBannerAd(position: BannerAdPosition = BannerAdPosition.BOTTOM_CENTER): Promise<void> {
    if (!this.shouldShowAds || !this.initialized) {
      console.log('AdMob: Banner ad skipped - ads disabled or not initialized');
      return;
    }

    try {
      const adId = Capacitor.getPlatform() === 'ios' 
        ? import.meta.env.VITE_ADMOB_BANNER_IOS
        : import.meta.env.VITE_ADMOB_BANNER_ANDROID;

      const options: BannerAdOptions = {
        adId,
        adSize: BannerAdSize.BANNER,
        position,
        margin: 0,
      };

      await AdMob.showBanner(options);
      console.log('Banner ad shown');
    } catch (error) {
      console.error('Failed to show banner ad:', error);
    }
  }

  async hideBannerAd(): Promise<void> {
    if (!this.initialized) return;

    try {
      await AdMob.hideBanner();
      console.log('Banner ad hidden');
    } catch (error) {
      console.error('Failed to hide banner ad:', error);
    }
  }

  async showInterstitialAd(): Promise<void> {
    if (!this.shouldShowAds || !this.initialized) {
      console.log('AdMob: Interstitial ad skipped - ads disabled or not initialized');
      return;
    }

    try {
      const adId = Capacitor.getPlatform() === 'ios' 
        ? import.meta.env.VITE_ADMOB_INTERSTITIAL_IOS
        : import.meta.env.VITE_ADMOB_INTERSTITIAL_ANDROID;

      const options = {
        adId,
      };

      // Preload the ad
      await AdMob.prepareInterstitial(options);
      
      // Show the ad
      await AdMob.showInterstitial();
      
      console.log('Interstitial ad shown');
    } catch (error) {
      console.error('Failed to show interstitial ad:', error);
    }
  }

  async showRewardedAd(): Promise<boolean> {
    if (!this.shouldShowAds || !this.initialized) {
      console.log('AdMob: Rewarded ad skipped - ads disabled or not initialized');
      return false;
    }

    try {
      const adId = Capacitor.getPlatform() === 'ios' 
        ? import.meta.env.VITE_ADMOB_REWARDED_IOS
        : import.meta.env.VITE_ADMOB_REWARDED_ANDROID;

      const options: RewardAdOptions = {
        adId,
      };

      // Preload the ad
      await AdMob.prepareRewardVideoAd(options);
      
      // Show the ad
      const result = await AdMob.showRewardVideoAd();
      
      console.log('Rewarded ad completed:', result);
      return true; // If no error, assume rewarded
    } catch (error) {
      console.error('Failed to show rewarded ad:', error);
      return false;
    }
  }

  async refreshProStatus(): Promise<void> {
    const customerInfo = await purchasesService.getCustomerInfo();
    const wasShowingAds = this.shouldShowAds;
    
    this.shouldShowAds = !customerInfo.isPro && this.initialized;
    
    // If user just became Pro, hide any visible ads
    if (wasShowingAds && !this.shouldShowAds) {
      await this.hideBannerAd();
      console.log('User became Pro - ads disabled');
    }
  }

  // Check if ads should be shown without initializing
  getShouldShowAds(): boolean {
    return this.shouldShowAds;
  }
}

export const adMobService = new AdMobService();