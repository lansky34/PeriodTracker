import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { adMobService } from '@/lib/admob';
import { purchasesService } from '@/lib/purchases';

interface AdBannerProps {
  position?: 'top' | 'bottom';
  showUpgrade?: boolean;
  onUpgradeClick?: () => void;
}

export function AdBanner({ position = 'bottom', showUpgrade = true, onUpgradeClick }: AdBannerProps) {
  const [shouldShow, setShouldShow] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkProStatus = async () => {
      try {
        const customerInfo = await purchasesService.getCustomerInfo();
        setIsPro(customerInfo.isPro);
        setShouldShow(!customerInfo.isPro);
        
        // Initialize and show ads for non-Pro users
        if (!customerInfo.isPro) {
          await adMobService.initialize();
          // Small delay to ensure ad service is ready
          setTimeout(() => {
            adMobService.showBannerAd(
              position === 'top' ? 'TOP_CENTER' as any : 'BOTTOM_CENTER' as any
            );
          }, 1000);
        }
      } catch (error) {
        console.error('Failed to check pro status:', error);
        // Default to showing ads on error
        setShouldShow(true);
      } finally {
        setLoading(false);
      }
    };

    checkProStatus();

    // Cleanup: hide banner ads when component unmounts
    return () => {
      adMobService.hideBannerAd();
    };
  }, [position]);

  // Hide if Pro user or loading
  if (loading || isPro) {
    return null;
  }

  // For web users, show a placeholder ad banner
  if (!shouldShow) {
    return null;
  }

  return (
    <div 
      className={`w-full bg-slate-100 dark:bg-slate-800 border-t border-border relative ${
        position === 'top' ? 'order-first' : 'order-last'
      }`}
      data-testid={`ad-banner-${position}`}
    >
      {/* Web fallback ad placeholder */}
      <div className="flex items-center justify-center h-16 text-sm text-muted-foreground">
        <div className="text-center">
          <div className="font-medium mb-1">Advertisement</div>
          <div className="text-xs opacity-75">
            Ads help keep FlowTracker free and accessible
          </div>
        </div>
        
        {showUpgrade && onUpgradeClick && (
          <div className="absolute right-2 top-2">
            <Button
              size="sm"
              variant="outline"
              onClick={onUpgradeClick}
              className="h-6 px-2 text-xs"
              data-testid="button-upgrade-to-pro"
            >
              Go Pro
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}