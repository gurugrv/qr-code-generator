import { useEffect, useState } from 'react';

interface GoogleMapsLoaderProps {
  children: React.ReactNode;
}

const GoogleMapsLoader = ({ children }: GoogleMapsLoaderProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      setIsLoaded(true);
    };

    script.onerror = () => {
      window.googleMapsError = true;
      console.error('Google Maps API failed to load');
    };
    
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  if (!isLoaded) {
    return null;
  }

  return <>{children}</>;
};

export default GoogleMapsLoader;