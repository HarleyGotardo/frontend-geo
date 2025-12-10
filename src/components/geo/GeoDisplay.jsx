import React from 'react';
import LoadingSpinner from '../ui/LoadingSpinner';
import Alert from '../ui/Alert';
import Card from '../ui/Card';

const GeoDisplay = ({ geoData, loading, error }) => {
  if (loading) {
    return (
      <Card>
        <div className="flex flex-col items-center justify-center py-12">
          <LoadingSpinner size="lg" className="mb-4" />
          <p className="text-gray-600 font-medium">Fetching location data...</p>
          <p className="text-gray-500 text-sm mt-1">This may take a few seconds</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="error">
        <strong>Error:</strong> {error}
      </Alert>
    );
  }

  if (!geoData) {
    return (
      <Card>
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Location Data</h3>
          <p className="text-gray-500">Search for an IP address to see location information</p>
        </div>
      </Card>
    );
  }

  const formatCoordinates = (lat, lon) => {
    return `${parseFloat(lat).toFixed(6)}, ${parseFloat(lon).toFixed(6)}`;
  };

  const getMapUrl = (lat, lon) => {
    return `https://www.google.com/maps?q=${lat},${lon}`;
  };

  return (
    <Card id="location-information">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Location Information</h3>
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <svg className="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Active
          </span>
          <span className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Basic Information</h4>
            <dl className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start py-2 border-b border-gray-100 gap-1">
                <dt className="text-sm font-medium text-gray-500">IP Address</dt>
                <dd className="text-sm font-mono text-gray-900 bg-gray-50 px-2 py-1 rounded break-all max-w-full">
                  {geoData.ip}
                </dd>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <dt className="text-sm font-medium text-gray-500">City</dt>
                <dd className="text-sm text-gray-900 font-medium">
                  {geoData.city || 'Unknown'}
                </dd>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <dt className="text-sm font-medium text-gray-500">Region</dt>
                <dd className="text-sm text-gray-900">
                  {geoData.region || 'Unknown'}
                </dd>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <dt className="text-sm font-medium text-gray-500">Country</dt>
                <dd className="text-sm text-gray-900 font-medium">
                  {geoData.country || 'Unknown'}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Technical Information */}
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Technical Information</h4>
            <dl className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <dt className="text-sm font-medium text-gray-500">Coordinates</dt>
                <dd className="text-sm font-mono text-gray-900 bg-gray-50 px-2 py-1 rounded">
                  {formatCoordinates(geoData.loc?.split(',')[0], geoData.loc?.split(',')[1])}
                </dd>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <dt className="text-sm font-medium text-gray-500">Postal Code</dt>
                <dd className="text-sm text-gray-900">
                  {geoData.postal || 'Unknown'}
                </dd>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <dt className="text-sm font-medium text-gray-500">Timezone</dt>
                <dd className="text-sm text-gray-900">
                  {geoData.timezone || 'Unknown'}
                </dd>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <dt className="text-sm font-medium text-gray-500">Organization</dt>
                <dd className="text-sm text-gray-900">
                  {geoData.org || 'Unknown'}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <a
            href={getMapUrl(geoData.loc?.split(',')[0], geoData.loc?.split(',')[1])}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            View on Google Maps
          </a>
          
          <button
            onClick={() => {
              const text = `Location: ${geoData.city}, ${geoData.country}\nIP: ${geoData.ip}\nCoordinates: ${formatCoordinates(geoData.loc?.split(',')[0], geoData.loc?.split(',')[1])}`;
              navigator.clipboard.writeText(text);
            }}
            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy Details
          </button>
        </div>
      </div>
    </Card>
  );
};

export default GeoDisplay;
