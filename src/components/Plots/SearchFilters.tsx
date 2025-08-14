import React, { useState, useEffect } from 'react';
import { Search, MapPin, DollarSign, Square } from 'lucide-react';
import { apiService } from '../../services/api';
import { Region, District, Council } from '../../types';

interface SearchFiltersProps {
  onFiltersChange: (filters: SearchFilters) => void;
}

export interface SearchFilters {
  search: string;
  minPrice: number;
  maxPrice: number;
  minArea: number;
  maxArea: number;
  regionId?: number;
  districtId?: number;
  councilId?: number;
  usageType?: string;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({ onFiltersChange }) => {
  const [filters, setFilters] = useState<SearchFilters>({
    search: '',
    minPrice: 0,
    maxPrice: 10000000,
    minArea: 0,
    maxArea: 10000,
  });

  const [regions, setRegions] = useState<Region[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [councils, setCouncils] = useState<Council[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRegions();
  }, []);

  useEffect(() => {
    if (filters.regionId) {
      fetchDistricts(filters.regionId);
    } else {
      setDistricts([]);
      setCouncils([]);
    }
  }, [filters.regionId]);

  useEffect(() => {
    if (filters.districtId) {
      fetchCouncils(filters.districtId);
    } else {
      setCouncils([]);
    }
  }, [filters.districtId]);

  const fetchRegions = async () => {
    try {
      const data = await apiService.getRegions();
      setRegions(data);
    } catch (error) {
      console.error('Error fetching regions:', error);
    }
  };

  const fetchDistricts = async (regionId: number) => {
    try {
      const data = await apiService.getDistricts(regionId);
      setDistricts(data);
    } catch (error) {
      console.error('Error fetching districts:', error);
    }
  };

  const fetchCouncils = async (districtId: number) => {
    try {
      const data = await apiService.getCouncils(districtId);
      setCouncils(data);
    } catch (error) {
      console.error('Error fetching councils:', error);
    }
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    
    // Reset dependent filters
    if (key === 'regionId') {
      newFilters.districtId = undefined;
      newFilters.councilId = undefined;
    } else if (key === 'districtId') {
      newFilters.councilId = undefined;
    }
    
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onFiltersChange(filters);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Search & Filter</h3>
      
      <form onSubmit={handleSearch} className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search plots by title or description..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Location Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
            <select
              value={filters.regionId || ''}
              onChange={(e) => handleFilterChange('regionId', e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Regions</option>
              {regions.map((region) => (
                <option key={region.id} value={region.id}>
                  {region.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
            <select
              value={filters.districtId || ''}
              onChange={(e) => handleFilterChange('districtId', e.target.value ? parseInt(e.target.value) : undefined)}
              disabled={!filters.regionId}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            >
              <option value="">All Districts</option>
              {districts.map((district) => (
                <option key={district.id} value={district.id}>
                  {district.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Council</label>
            <select
              value={filters.councilId || ''}
              onChange={(e) => handleFilterChange('councilId', e.target.value ? parseInt(e.target.value) : undefined)}
              disabled={!filters.districtId}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            >
              <option value="">All Councils</option>
              {councils.map((council) => (
                <option key={council.id} value={council.id}>
                  {council.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Price Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Min Price (TSH)</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', parseInt(e.target.value) || 0)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Price (TSH)</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', parseInt(e.target.value) || 10000000)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Area Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Min Area (sqm)</label>
            <div className="relative">
              <Square className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                value={filters.minArea}
                onChange={(e) => handleFilterChange('minArea', parseInt(e.target.value) || 0)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Area (sqm)</label>
            <div className="relative">
              <Square className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                value={filters.maxArea}
                onChange={(e) => handleFilterChange('maxArea', parseInt(e.target.value) || 10000)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Usage Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Usage Type</label>
          <select
            value={filters.usageType || ''}
            onChange={(e) => handleFilterChange('usageType', e.target.value || undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Types</option>
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
            <option value="Industrial">Industrial</option>
            <option value="Agricultural">Agricultural</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Apply Filters
        </button>
      </form>
    </div>
  );
};