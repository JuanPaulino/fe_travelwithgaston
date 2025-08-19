import { useEffect, useRef, useState } from 'react';

// Importar Leaflet solo en el cliente
let L = null;
let leafletStylesLoaded = false;

const HotelMap = ({ latitude, longitude, hotelName = 'Hotel' }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current || !latitude || !longitude) return;

    const initializeMap = async () => {
      try {
        // Cargar Leaflet dinámicamente solo en el cliente
        if (typeof window !== 'undefined' && !L) {
          const leafletModule = await import('leaflet');
          L = leafletModule.default;
          
          // Cargar estilos solo una vez
          if (!leafletStylesLoaded) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            document.head.appendChild(link);
            leafletStylesLoaded = true;
          }

          // Corregir el problema de los iconos de marcadores en Leaflet
          delete L.Icon.Default.prototype._getIconUrl;
          L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
          });
        }

        if (!L) return;

        // Crear el mapa
        const map = L.map(mapRef.current).setView([latitude, longitude], 15);

        // Agregar capa de OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 18,
        }).addTo(map);

        // Agregar marcador del hotel
        const marker = L.marker([latitude, longitude])
          .addTo(map)
          .bindPopup(hotelName);

        // Guardar referencia del mapa
        mapInstanceRef.current = map;
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    initializeMap();

    // Cleanup al desmontar
    return () => {
      if (mapInstanceRef.current && L) {
        mapInstanceRef.current.remove();
      }
    };
  }, [latitude, longitude, hotelName]);

  if (!latitude || !longitude) {
    return (
      <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Ubicación no disponible</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-neutral-darkest mb-3">Ubicación</h3>
      <div 
        ref={mapRef} 
        className="w-full h-80 rounded-lg border border-gray-200 shadow-sm"
        style={{ zIndex: 1 }}
      />
    </div>
  );
};

export default HotelMap;
