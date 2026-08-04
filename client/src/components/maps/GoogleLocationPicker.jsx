import { useState } from 'react';
import { MapPin, Search, Navigation } from 'lucide-react';
import { Button } from '@components/ui/Button';

export function GoogleLocationPicker({
  latitude,
  longitude,
  address,
  city,
  state,
  country,
  onChange,
}) {
  const [searchQuery, setSearchQuery] = useState(address || '');
  const [manualLat, setManualLat] = useState(latitude || '');
  const [manualLng, setManualLng] = useState(longitude || '');

  const handleApplyCoordinates = () => {
    if (onChange) {
      onChange({
        latitude: parseFloat(manualLat) || null,
        longitude: parseFloat(manualLng) || null,
        formattedAddress: searchQuery || `${city || ''}, ${state || ''}, ${country || ''}`.trim(),
      });
    }
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setManualLat(lat);
        setManualLng(lng);
        if (onChange) {
          onChange({
            latitude: lat,
            longitude: lng,
            formattedAddress: searchQuery || 'Current Device Location',
          });
        }
      });
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 rounded-2xl bg-surface-900 border border-surface-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-surface-200 font-semibold text-sm">
          <MapPin size={18} className="text-primary-400" />
          <span>Location & Google Maps Coordinates</span>
        </div>
        <Button
          type="button"
          variant="outline"
          size="xs"
          leftIcon={<Navigation size={12} />}
          onClick={handleUseCurrentLocation}
        >
          Detect Location
        </Button>
      </div>

      {/* Map Search Input */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search address or landmark..."
          className="w-full pl-9 pr-4 py-2 text-xs bg-surface-950 border border-surface-800 rounded-xl text-surface-100 placeholder-surface-500 focus:outline-none focus:border-primary-500"
        />
        <Search size={14} className="absolute left-3 top-2.5 text-surface-500" />
      </div>

      {/* Map Preview Placeholder */}
      <div className="h-44 w-full rounded-xl bg-surface-950 border border-surface-800/80 relative overflow-hidden flex flex-col items-center justify-center text-center p-4">
        <div className="w-10 h-10 rounded-full bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-primary-400 mb-2 shadow-glow">
          <MapPin size={20} />
        </div>
        <span className="text-xs font-semibold text-surface-200">
          {searchQuery || `${city || 'City'}, ${state || 'State'}, ${country || 'India'}`}
        </span>
        <span className="text-2xs font-mono text-surface-400 mt-1">
          Lat: {manualLat || '0.0000'} | Lng: {manualLng || '0.0000'}
        </span>
      </div>

      {/* Coordinate Input Controls */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-2xs font-semibold text-surface-400 uppercase tracking-wider block mb-1">
            Latitude
          </label>
          <input
            type="number"
            step="any"
            value={manualLat}
            onChange={(e) => setManualLat(e.target.value)}
            placeholder="e.g. 12.9716"
            className="w-full px-3 py-1.5 text-xs bg-surface-950 border border-surface-800 rounded-xl text-surface-100 focus:outline-none focus:border-primary-500"
          />
        </div>
        <div>
          <label className="text-2xs font-semibold text-surface-400 uppercase tracking-wider block mb-1">
            Longitude
          </label>
          <input
            type="number"
            step="any"
            value={manualLng}
            onChange={(e) => setManualLng(e.target.value)}
            placeholder="e.g. 77.5946"
            className="w-full px-3 py-1.5 text-xs bg-surface-950 border border-surface-800 rounded-xl text-surface-100 focus:outline-none focus:border-primary-500"
          />
        </div>
      </div>

      <Button type="button" variant="primary" size="xs" onClick={handleApplyCoordinates}>
        Update Map Pin & Coordinates
      </Button>
    </div>
  );
}
