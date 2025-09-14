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
      return result.offerings;
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
      const result = await Purchases.purchasePackage({ aPackage: targetPackage });
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

  // Helper to clear debug pro status for testing
  clearDebugPro() {
    localStorage.removeItem('debug_pro');
  }
}

export const purchasesService = new PurchasesService();