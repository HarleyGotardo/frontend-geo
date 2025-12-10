import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useGeoLocation } from '../hooks/useGeoLocation';
import toast from 'react-hot-toast';
import { sweetAlertService } from '../utils/sweetAlertConfig';
import IPSearch from '../components/geo/IPSearch';
import GeoDisplay from '../components/geo/GeoDisplay';
import HistoryList from '../components/geo/HistoryList';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const HomePage = () => {
  const { user, logout } = useAuth();
  const { geoData, loading, error, fetchCurrentLocation, searchByIP, clearData, setGeoDataDirect } = useGeoLocation();
  const [activeHistoryItemId, setActiveHistoryItemId] = useState(null);

  // Load current user's location on mount
  useEffect(() => {
    fetchCurrentLocation();
  }, [fetchCurrentLocation]);

  const handleSearch = async (ipAddress) => {
    await searchByIP(ipAddress);
  };

  const handleClear = () => {
    clearData();
    fetchCurrentLocation();
  };

  const handleHistoryItemClick = (item) => {
    if (item.geo_data) {
      setActiveHistoryItemId(item.id); // Set active item
      setGeoDataDirect(item.geo_data);
      toast.success(`Showing location for ${item.search_term}`);
      
      // Scroll to Location Information section
      setTimeout(() => {
        const locationSection = document.getElementById('location-information');
        if (locationSection) {
          locationSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100);
    }
  };

  const handleLogout = async () => {
    try {
      // Show confirmation dialog with red button for destructive action
      const result = await sweetAlertService.confirmAction(
        'Logout Confirmation',
        'Are you sure you want to logout?',
        'Logout',
        true // isDestructive = true for red button
      );

      if (result.isConfirmed) {
        // Show loading dialog
        sweetAlertService.showLoading('Logging out...');

        await logout();
        
        // Close loading and show success
        sweetAlertService.close();
        await sweetAlertService.showSuccess(
          'Logged Out!',
          'You have been successfully logged out.'
        );
        
        toast.success('Logged out successfully');
      }
    } catch {
      sweetAlertService.close();
      await sweetAlertService.showError(
        'Logout Error!',
        'Failed to logout. Please try again.'
      );
      toast.error('Failed to logout');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-gray-900 rounded-lg flex items-center justify-center">
                  <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-semibold text-gray-900">GeoLocator</h1>
                <p className="text-sm text-gray-500">IP Geolocation Tool</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-gray-200 rounded-lg flex items-center justify-center">
                  <svg className="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleLogout}
                >
                  <svg className=" h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Search and Results */}
          <div className="lg:col-span-2 space-y-8">
            {/* IP Search Component */}
            <IPSearch
              onSearch={handleSearch}
              onClear={handleClear}
              loading={loading}
            />

            {/* Geo Display Component */}
            <GeoDisplay
              geoData={geoData}
              loading={loading}
              error={error}
            />
          </div>

          {/* Right Column - History */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <HistoryList
                onHistoryItemClick={handleHistoryItemClick}
                refreshTrigger={geoData} // Trigger refresh when geoData changes
                activeItemId={activeHistoryItemId}
              />
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        {geoData && (
          <Card className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-lg font-bold text-slate-900 break-all max-w-full font-mono text-xs">{geoData.ip}</div>
                <div className="text-sm text-slate-600 mt-1">IP Address</div>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-2xl font-bold text-slate-900">{geoData.city || 'Unknown'}</div>
                <div className="text-sm text-slate-600">City</div>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-2xl font-bold text-slate-900">{geoData.country || 'Unknown'}</div>
                <div className="text-sm text-slate-600">Country</div>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-2xl font-bold text-slate-900">{geoData.org?.split(' ')[0] || 'Unknown'}</div>
                <div className="text-sm text-slate-600">ISP</div>
              </div>
            </div>
          </Card>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              © 2025 GeoLocator. Powered by ipinfo.io API.
            </p>
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <span className="text-sm text-gray-500">
                Data provided by
              </span>
              <a
                href="https://ipinfo.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:text-primary/80 font-medium"
              >
                ipinfo.io
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
