import React, { useEffect, useRef, useState } from 'react';

/// <reference types="@types/google.maps" />

declare global {
  interface Window {
    google: typeof google.maps;
    googleMapsError: boolean;
  }
}

interface MapSelectorProps {
  onLocationSelect: (lat: number, lng: number) => void;
  initialLat?: number;
  initialLng?: number;
}

const MapSelector: React.FC<MapSelectorProps> = ({
  onLocationSelect,
  initialLat = 0,
  initialLng = 0
}): JSX.Element | null => {
  const mapRef = useRef<HTMLDivElement>(null);
  const searchBoxRef = useRef<HTMLInputElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const prevInitialLat = useRef(initialLat);
  const prevInitialLng = useRef(initialLng);
  const [shouldRender, setShouldRender] = useState(true);

  // Main map initialization effect
  useEffect(() => {
    if (!shouldRender) return;
    if (!mapRef.current || window.googleMapsError) return;

    // Validate and normalize initial coordinates
    let validLat = 20.5937; // Default to India's center
    let validLng = 78.9629;
    
    if (initialLat && !isNaN(initialLat) && initialLat >= -90 && initialLat <= 90) {
      validLat = initialLat;
    }
    if (initialLng && !isNaN(initialLng) && initialLng >= -180 && initialLng <= 180) {
      validLng = initialLng;
    }
    
    const initialLocation = new window.google.maps.LatLng(validLat, validLng);
    
    // Initialize the map with better defaults
    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center: initialLocation,
      zoom: 5,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      gestureHandling: 'cooperative',
      minZoom: 3,
      maxZoom: 20,
      clickableIcons: false, // Prevent clicking on POIs
      disableDefaultUI: true, // Remove all controls
      zoomControl: true, // Add back just zoom
      mapTypeId: window.google.maps.MapTypeId.ROADMAP
    });

    // Initialize the marker with validated position
    const markerInstance = new window.google.maps.Marker({
      position: initialLocation,
      map: mapInstance,
      draggable: true,
      animation: window.google.maps.Animation.DROP // Add animation for better visibility
    });

    // If we're using initial coordinates, zoom in closer
    if (initialLat !== 0 && initialLng !== 0) {
      mapInstance.setZoom(16);
    }

    // Initialize Autocomplete instead of SearchBox
    if (searchBoxRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(searchBoxRef.current, {
        fields: ['geometry', 'formatted_address'],
        strictBounds: false
      });

      // Bias the autocomplete results to the map's viewport
      mapInstance.addListener('bounds_changed', () => {
        autocomplete.setBounds(mapInstance.getBounds() as google.maps.LatLngBounds);
      });
      
      // Listen for place selection
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry?.location) return;

        const location = place.geometry.location;
        const lat = location.lat();
        const lng = location.lng();

        // Create bounds to zoom to
        let bounds: google.maps.LatLngBounds;
        if (place.geometry.viewport) {
          bounds = place.geometry.viewport;
        } else {
          bounds = new window.google.maps.LatLngBounds();
          bounds.extend(location);
          bounds.extend(new window.google.maps.LatLng(lat + 0.001, lng + 0.001));
        }

        // Fit map to bounds and update marker
        mapInstance.fitBounds(bounds);
        markerInstance.setPosition(location);

        // Ensure appropriate zoom level
        const listener = mapInstance.addListener('idle', () => {
          if (mapInstance.getZoom()! > 17) {
            mapInstance.setZoom(17);
          }
          window.google.maps.event.removeListener(listener);
        });

        onLocationSelect(lat, lng);
      });
    }

    // Listen for marker drag events - Use raw coordinates
    markerInstance.addListener('dragend', () => {
      const position = markerInstance.getPosition();
      if (!position) return;

      // Use exact coordinates from drag
      const lat = position.lat();
      const lng = position.lng();

      // Pan to position smoothly
      mapInstance.panTo(position);
      // Use higher zoom for precise location
      mapInstance.setZoom(17);

      onLocationSelect(lat, lng);
    });

    // Listen for map click events - Use raw coordinates
    mapInstance.addListener('click', (e: { latLng: google.maps.LatLng }) => {
      const clickedLocation = e.latLng;
      const lat = clickedLocation.lat();
      const lng = clickedLocation.lng();

      // Pan to clicked location smoothly
      mapInstance.panTo(clickedLocation);
      markerInstance.setPosition(clickedLocation);
      // Use higher zoom for precise location
      mapInstance.setZoom(17);

      onLocationSelect(lat, lng);
    });

    setMap(mapInstance);
    setMarker(markerInstance);

    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
    };
  }, [onLocationSelect, initialLat, initialLng, shouldRender]);

  // Coordinate comparison effect
  useEffect(() => {
    if (initialLat === prevInitialLat.current && initialLng === prevInitialLng.current) {
      setShouldRender(false);
    } else {
      prevInitialLat.current = initialLat;
      prevInitialLng.current = initialLng;
      setShouldRender(true);
    }
  }, [initialLat, initialLng]);


  if (window.googleMapsError) {
    return (
      <div className="text-red-500 p-4 border border-red-300 rounded-lg">
        Failed to load Google Maps. Please check your internet connection and try again.
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <input
        ref={searchBoxRef}
        type="text"
        placeholder="Search for a location..."
        className="w-[calc(100%-20px)] mx-2.5 mt-2.5 p-2 border border-gray-300 rounded shadow-sm absolute z-10 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600"
        aria-label="Search for a location"
      />
      <div 
        ref={mapRef}
        className="w-full h-[300px] rounded-lg mt-14"
        role="application"
        aria-label="Google Map"
      />
    </div>
  );
}

export default MapSelector;
