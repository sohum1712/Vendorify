import { useState, useEffect, useCallback } from 'react';

export const useGeolocation = (onUpdate, interval = 120000) => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  const updateLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          timestamp: position.timestamp,
        };
        setLocation(newLocation);
        setError(null);
        if (onUpdate) onUpdate(newLocation);
      },
      (err) => {
        setError(err.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  }, [onUpdate]);

  useEffect(() => {
    updateLocation();
    const id = setInterval(updateLocation, interval);
    return () => clearInterval(id);
  }, [updateLocation, interval]);

  return { location, error, refetch: updateLocation };
};
