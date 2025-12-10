import React, { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Alert from '../ui/Alert';
import Card from '../ui/Card';

const IPSearch = ({ onSearch, onClear, loading }) => {
  const [ipAddress, setIpAddress] = useState('');
  const [errors, setErrors] = useState({});

  const validateIP = (ip) => {
    // IPv4 regex pattern
    const ipv4Pattern = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    
    // IPv6 regex pattern (simplified)
    const ipv6Pattern = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    
    return ipv4Pattern.test(ip) || ipv6Pattern.test(ip);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (ipAddress.trim() && !validateIP(ipAddress.trim())) {
      newErrors.ip = 'Please enter a valid IP address (IPv4 or IPv6)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const trimmedIp = ipAddress.trim();
    onSearch(trimmedIp || null); // Pass null for empty input to get current location
  };

  const handleInputChange = (value) => {
    setIpAddress(value);
    setErrors(prev => ({ ...prev, ip: '' }));
  };

  const sampleIPs = [
    { ip: '8.8.8.8', label: 'Google DNS' },
    { ip: '1.1.1.1', label: 'Cloudflare DNS' },
    { ip: '208.67.222.222', label: 'OpenDNS' }
  ];

  const searchIcon = (
    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>
  );

  return (
    <Card>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">IP Geolocation Search</h3>
        <p className="text-sm text-gray-600">
          Enter an IP address to find its geographical location
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="ip-search"
          type="text"
          value={ipAddress}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="Enter IP address (e.g., 8.8.8.8)"
          error={errors.ip}
          icon={searchIcon}
          disabled={loading}
        />

        <div className="flex space-x-3">
          <Button
            type="submit"
            loading={loading}
            disabled={loading}
            className="flex-1"
          >
            <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Search IP
          </Button>
          
          <Button
            type="button"
            variant="secondary"
            onClick={onClear}
            disabled={loading}
          >
            <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Clear
          </Button>
        </div>
      </form>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="mb-3">
          <h4 className="text-sm font-medium text-gray-900">Sample IP Addresses</h4>
          <p className="text-xs text-gray-500">Click to quickly search these examples</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {sampleIPs.map((sample) => (
            <Button
              key={sample.ip}
              variant="secondary"
              size="sm"
              onClick={() => {
                handleInputChange(sample.ip);
                onSearch(sample.ip);
              }}
              disabled={loading}
              className="justify-start"
            >
              <svg className="mr-1.5 h-3 w-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              {sample.ip}
              <span className="ml-1 text-gray-400">({sample.label})</span>
            </Button>
          ))}
        </div>
      </div>

      <Alert variant="info" className="mt-4">
        <strong>Tip:</strong> Leave the input empty and click "Search IP" to get your current location.
      </Alert>
    </Card>
  );
};

export default IPSearch;
