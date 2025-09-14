import { Purchases, LOG_LEVEL } from '@revenuecat/purchases-capacitor';
import { Capacitor } from '@capacitor/core';

export interface CustomerInfo {
  isPro: boolean;
  activeSubscriptions: string[];
  latestExpirationDate?: string;
}

class PurchasesService {
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Only initialize on mobile platforms
      if (!Capacitor.isNativePlatform()) {
        console.log('RevenueCat: Web platform - skipping native initialization');
        return;
      }

      const apiKey = Capacitor.getPlatform() === 'ios' 
        ? import.meta.env.VITE_REVENUECAT_API_KEY_IOS
        : import.meta.env.VITE_REVENUECAT_API_KEY_ANDROID;

      if (!apiKey) {
        console.warn('RevenueCat API key not found for platform:', Capacitor.getPlatform());
        return;
      }

      await Purchases.setLogLevel({ level: LOG_LEVEL.INFO });
      await Purchases.configure({ apiKey });
      
      this.initialized = true;
      console.log('RevenueCat initialized successfully');
    } catch (error) {
      console.error('Failed to initialize RevenueCat:', error);
      throw error;
    }
  }

  async getCustomerInfo(): Promise<CustomerInfo> {
    if (!Capacitor.isNativePlatform()) {
      // For web, check localStorage for debug/testing
      const debugPro = localStorage.getItem('debug_pro') === 'true';
      return {
        isPro: debugPro,
        activeSubscriptions: debugPro ? ['pro'] : [],
      };
    }

    try {
      await this.initialize();
      const customerInfo = await Purchases.getCustomerInfo();
      
      const isPro = !!customerInfo.customerInfo.entitlements.active['pro'];
      const activeSubscriptions = Object.keys(customerInfo.customerInfo.entitlements.active);
      
      // Get the latest expiration date
      const latestExpirationDate = isPro 
        ? customerInfo.customerInfo.entitlements.active['pro']?.expirationDate || undefined
        : undefined;

      return {
        isPro,
        activeSubscriptions,
        latestExpirationDate,
      };
    } catch (error) {
      console.error('Failed to get customer info:', error);
      return {
        isPro: false,
        activeSubscriptions: [],
      };
    }
  }

  async getOfferings() {
    if (!Capacitor.isNativePlatform()) {
      // Mock offerings for web development - match RevenueCat Offerings structure exactly
      return {
        current: {
          availablePackages: [
            {
              identifier: 'monthly_pro',
              packageType: 'MONTHLY',
              storeProduct: {
                identifier: 'monthly_pro',
                priceString: '$4.99',
              },
            },
            {
              identifier: 'annual_pro', 
              packageType: 'ANNUAL',
              storeProduct: {
                identifier: 'annual_pro',
                priceString: '$39.99',
              },
            },
          ],
        },
      };
    }

    try {
      await this.initialize();
      // Get offerings from RevenueCat v11 response structure
      const result = await Purchases.getOfferings();
      return result;
    } catch (error) {
      console.error('Failed to get offerings:', error);
      return null;
    }
  }

  async purchasePackage(packageIdentifier: string) {
    if (!Capacitor.isNativePlatform()) {
      // For web testing, simulate purchase
      localStorage.setItem('debug_pro', 'true');
      return { customerInfo: { isPro: true } };
    }

    try {
      await this.initialize();
      
      // Get offerings and find the package
      const offerings = await this.getOfferings();
      if (!offerings?.current?.availablePackages) {
        throw new Error('No packages available');
      }
      
      const targetPackage = offerings.current.availablePackages.find(
        (pkg: any) => pkg.identifier === packageIdentifier
      );
      
      if (!targetPackage) {
        throw new Error(`Package ${packageIdentifier} not found`);
      }
      
      // Use purchasePackage for proper RevenueCat integration  
      const result = await Purchases.purchasePackage(targetPackage);
      return result;
    } catch (error) {
      console.error('Purchase failed:', error);
      throw error;
    }
  }

  async restorePurchases() {
    if (!Capacitor.isNativePlatform()) {
      return { customerInfo: { isPro: localStorage.getItem('debug_pro') === 'true' } };
    }

    try {
      await this.initialize();
      const result = await Purchases.restorePurchases();
      return result;
    } catch (error) {
      console.error('Restore failed:', error);
      throw error;
    }
  }

  // Trial-aware Pro state management
  async getProState() {
    if (!Capacitor.isNativePlatform()) {
      // Debug Pro only available in development
      const isDebugPro = import.meta.env.DEV && localStorage.getItem('debug_pro') === 'true';
      return { 
        isPro: isDebugPro, 
        isTrialActive: false,
        trialDaysRemaining: 0,
        activeUntil: isDebugPro ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) : null
      };
    }

    try {
      await this.initialize();
      const info = await Purchases.getCustomerInfo();
      
      // Check for active Pro entitlement (includes trial and paid)
      const proEntitlement = info.entitlements.active["pro"];
      const isPro = !!proEntitlement;
      
      let isTrialActive = false;
      let trialDaysRemaining = 0;
      let activeUntil = null;

      if (proEntitlement) {
        activeUntil = new Date(proEntitlement.expirationDate || proEntitlement.latestPurchaseDate);
        
        // Check if this is a trial period
        isTrialActive = proEntitlement.periodType === "trial";
        
        if (isTrialActive && activeUntil) {
          const now = new Date();
          const msRemaining = activeUntil.getTime() - now.getTime();
          trialDaysRemaining = Math.max(0, Math.ceil(msRemaining / (24 * 60 * 60 * 1000)));
        }
      }

      return {
        isPro,
        isTrialActive,
        trialDaysRemaining,
        activeUntil
      };
    } catch (error) {
      console.error('Failed to get Pro state:', error);
      return { 
        isPro: false, 
        isTrialActive: false,
        trialDaysRemaining: 0,
        activeUntil: null
      };
    }
  }

  // Cache Pro state in secure storage
  async cacheProState(state: any) {
    try {
      localStorage.setItem('flowtracker_pro_cache', JSON.stringify({
        ...state,
        cachedAt: Date.now()
      }));
    } catch (error) {
      console.error('Failed to cache Pro state:', error);
    }
  }

  async getCachedProState() {
    try {
      const cached = localStorage.getItem('flowtracker_pro_cache');
      if (!cached) return null;
      
      const data = JSON.parse(cached);
      const cacheAge = Date.now() - (data.cachedAt || 0);
      
      // Cache expires after 1 hour
      if (cacheAge > 60 * 60 * 1000) {
        return null;
      }
      
      return {
        isPro: data.isPro,
        isTrialActive: data.isTrialActive,
        trialDaysRemaining: data.trialDaysRemaining,
        activeUntil: data.activeUntil ? new Date(data.activeUntil) : null
      };
    } catch (error) {
      console.error('Failed to get cached Pro state:', error);
      return null;
    }
  }

  // Helper to clear debug pro status for testing
  clearDebugPro() {
    localStorage.removeItem('debug_pro');
    localStorage.removeItem('flowtracker_pro_cache');
  }
}

export const purchasesService = new PurchasesService();