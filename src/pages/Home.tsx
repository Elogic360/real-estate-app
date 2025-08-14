import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout/Layout';
import { PlotGrid } from '../components/Plots/PlotGrid';
import { SearchFilters, SearchFilters as SearchFiltersType } from '../components/Plots/SearchFilters';
import { MapView } from '../components/Map/MapView';
import { Plot } from '../types';
import { supabase } from '../lib/supabase';
import { Map, Grid } from 'lucide-react';

export const Home: React.FC = () => {
  const [plots, setPlots] = useState<Plot[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [selectedPlot, setSelectedPlot] = useState<Plot | null>(null);

  useEffect(() => {
    fetchPlots();
  }, []);

  const fetchPlots = async (filters?: SearchFiltersType) => {
    try {
      setLoading(true);
      let query = supabase
        .from('plots')
        .select(`
          *,
          council:councils(
            id,
            name,
            district:districts(
              id,
              name,
              region:regions(
                id,
                name
              )
            )
          )
        `)
        .eq('status', 'available');

      // Apply filters
      if (filters) {
        if (filters.search) {
          query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
        }
        if (filters.minPrice > 0) {
          query = query.gte('price', filters.minPrice);
        }
        if (filters.maxPrice < 10000000) {
          query = query.lte('price', filters.maxPrice);
        }
        if (filters.minArea > 0) {
          query = query.gte('area_sqm', filters.minArea);
        }
        if (filters.maxArea < 10000) {
          query = query.lte('area_sqm', filters.maxArea);
        }
        if (filters.councilId) {
          query = query.eq('council_id', filters.councilId);
        }
        if (filters.usageType) {
          query = query.eq('usage_type', filters.usageType);
        }
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching plots:', error);
        return;
      }

      setPlots(data || []);
    } catch (error) {
      console.error('Error fetching plots:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (filters: SearchFiltersType) => {
    fetchPlots(filters);
  };

  const handleViewDetails = (plot: Plot) => {
    setSelectedPlot(plot);
    // In a real app, this would navigate to a detailed view
    console.log('View details for plot:', plot);
  };

  const handlePlotClick = (plot: Plot) => {
    setSelectedPlot(plot);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Find Your Perfect Plot in Tanzania
          </h1>
          <p className="text-gray-600">
            Discover available land plots across Tanzania with our interactive platform
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <SearchFilters onFiltersChange={handleFiltersChange} />
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* View Toggle */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <span className="text-gray-700">Found {plots.length} plots</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'map'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <Map className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            {viewMode === 'grid' ? (
              <PlotGrid
                plots={plots}
                loading={loading}
                onViewDetails={handleViewDetails}
              />
            ) : (
              <MapView
                plots={plots}
                onPlotClick={handlePlotClick}
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};