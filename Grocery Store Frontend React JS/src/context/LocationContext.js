import React, { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext();

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) throw new Error('useLocation must be used within LocationProvider');
  return context;
};

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState({
    address: 'Brookefield, Bengaluru, Karnataka',
    deliveryTime: '8 minutes',
  });

  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      try {
        setLocation(JSON.parse(savedLocation));
      } catch (error) {
        console.error('Error parsing saved location:', error);
      }
    }
  }, []);

  const updateLocation = (newLocation) => {
    setLocation(newLocation);
    localStorage.setItem('userLocation', JSON.stringify(newLocation));
  };

  return <LocationContext.Provider value={{ location, updateLocation }}>{children}</LocationContext.Provider>;
};
