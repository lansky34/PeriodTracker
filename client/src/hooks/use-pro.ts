import { useState, useEffect } from 'react';
import { purchasesService } from '@/lib/purchases';

interface ProState {
  isPro: boolean;
  isTrialActive: boolean;
  trialDaysRemaining: number;
  activeUntil: Date | null;
}

export function usePro() {
  const [proState, setProState] = useState<ProState>({
    isPro: false,
    isTrialActive: false,
    trialDaysRemaining: 0,
    activeUntil: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkProStatus();
  }, []);

  const checkProStatus = async () => {
    try {
      setLoading(true);
      
      // Try to get cached state first for faster UI
      const cached = await purchasesService.getCachedProState();
      if (cached) {
        setProState(cached);
        setLoading(false);
        // Still fetch fresh state in background
        fetchFreshProState();
      } else {
        await fetchFreshProState();
      }
    } catch (error) {
      console.error('Error checking Pro status:', error);
      // Fallback to localStorage check (development only)
      const isDebugPro = import.meta.env.DEV && localStorage.getItem('debug_pro') === 'true';
      const fallbackState = {
        isPro: isDebugPro,
        isTrialActive: false,
        trialDaysRemaining: 0,
        activeUntil: null
      };
      setProState(fallbackState);
      setLoading(false);
    }
  };

  const fetchFreshProState = async () => {
    try {
      const freshState = await purchasesService.getProState();
      setProState(freshState);
      
      // Cache the fresh state
      await purchasesService.cacheProState(freshState);
    } catch (error) {
      console.error('Error fetching fresh Pro state:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshProStatus = async () => {
    await fetchFreshProState();
  };

  return {
    isPro: proState.isPro,
    isTrialActive: proState.isTrialActive,
    trialDaysRemaining: proState.trialDaysRemaining,
    activeUntil: proState.activeUntil,
    loading,
    checkProStatus,
    refreshProStatus
  };
}