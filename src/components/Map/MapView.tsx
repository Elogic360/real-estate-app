import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polygon, Popup } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { Plot } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import 'leaflet/dist/leaflet.css';

interface MapViewProps {
  plots: Plot[];
  center?: LatLngExpression;
  zoom?: number;
  onPlotClick?: (plot: Plot) => void;
}

export const MapView: React.FC<MapViewProps> = ({
  plots,
  center = [-6.7924, 39.2083], // Dar es Salaam coordinates
  zoom = 10,
  onPlotClick,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-full h-96 bg-gray-200 animate-pulse rounded-lg" />;
  }

  const convertGeomToLatLng = (geom: any): LatLngExpression[] => {
    if (!geom || !geom.coordinates || !geom.coordinates[0]) {
      return [];
    }

    // Convert GeoJSON polygon coordinates to Leaflet LatLng format
    return geom.coordinates[0].map((coord: [number, number]) => [coord[1], coord[0]]);
  };

  const getPlotColor = (status: string) => {
    switch (status) {
      case 'available':
        return '#10B981'; // Green
      case 'locked':
        return '#F59E0B'; // Orange
      case 'pending_payment':
        return '#EF4444'; // Red
      case 'sold':
        return '#6B7280'; // Gray
      default:
        return '#3B82F6'; // Blue
    }
  };

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className="w-full h-96 rounded-lg shadow-md"
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {plots.map((plot) => {
        if (!plot.geom) return null;
        
        const positions = convertGeomToLatLng(plot.geom);
        if (positions.length === 0) return null;

        return (
          <Polygon
            key={plot.id}
            positions={positions}
            pathOptions={{
              fillColor: getPlotColor(plot.status),
              fillOpacity: 0.6,
              color: getPlotColor(plot.status),
              weight: 2,
            }}
            eventHandlers={{
              click: () => onPlotClick?.(plot),
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-gray-900">{plot.title}</h3>
                <p className="text-sm text-gray-600">{plot.description}</p>
                <div className="mt-2 space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">Area:</span> {plot.area_sqm.toLocaleString()} sqm
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Price:</span> {formatCurrency(plot.price)}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Status:</span> 
                    <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${
                      plot.status === 'available' ? 'bg-green-100 text-green-800' :
                      plot.status === 'locked' ? 'bg-yellow-100 text-yellow-800' :
                      plot.status === 'pending_payment' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {plot.status.replace('_', ' ')}
                    </span>
                  </p>
                </div>
              </div>
            </Popup>
          </Polygon>
        );
      })}
    </MapContainer>
  );
};