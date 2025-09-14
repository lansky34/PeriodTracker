import { useState, useEffect } from 'react';
import { purchasesService } from '@/lib/purchases';

export function usePro() {
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkProStatus = async () => {
      try {
        const customerInfo = await purchasesService.getCustomerInfo();
        setIsPro(customerInfo.isPro);
      } catch (error) {
        console.error('Failed to check Pro status:', error);
        setIsPro(false);
      } finally {
        setLoading(false);
      }
    };

    checkProStatus();
  }, []);

  const refreshProStatus = async () => {
    setLoading(true);
    try {
      const customerInfo = await purchasesService.getCustomerInfo();
      setIsPro(customerInfo.isPro);
    } catch (error) {
      console.error('Failed to refresh Pro status:', error);
      setIsPro(false);
    } finally {
      setLoading(false);
    }
  };

  return {
    isPro,
    loading,
    refreshProStatus
  };
}