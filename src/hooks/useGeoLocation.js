import { useState, useCallback } from 'react';
import { geoService } from '../services/geoService';
import toast from 'react-hot-toast';

export const useGeoLocation = () => {
  const [geoData, setGeoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCurrentLocation = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await geoService.getGeo();
      
      if (result.success) {
        setGeoData(result.data);
      } else {
        setError(result.message || 'Failed to fetch current location');
        toast.error(result.message || 'Failed to fetch current location');
      }
    } catch {
      const errorMessage = 'Failed to fetch current location';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchByIP = useCallback(async (ipAddress) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await geoService.getGeo(ipAddress);
      
      if (result.success) {
        setGeoData(result.data);
        toast.success(`Location found for ${ipAddress}`);
        return { success: true, data: result.data };
      } else {
        setError(result.message || 'Failed to fetch location');
        toast.error(result.message || 'Failed to fetch location');
        
        if (result.errors?.ip) {
          toast.error(result.errors.ip[0]);
        }
        return { success: false, error: result.message };
      }
    } catch {
      const errorMessage = 'Failed to fetch location';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const clearData = useCallback(() => {
    setGeoData(null);
    setError(null);
  }, []);

  const setGeoDataDirect = useCallback((data) => {
    setGeoData(data);
    setError(null);
  }, []);

  return {
    geoData,
    loading,
    error,
    fetchCurrentLocation,
    searchByIP,
    clearData,
    setGeoDataDirect,
  };
};
