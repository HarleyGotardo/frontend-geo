import React, { useState } from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Alert from '../ui/Alert';
import Icon from '../ui/Icon';

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
    
    if (!ipAddress.trim()) {
      newErrors.ip = 'Please enter an IP address';
    } else if (!validateIP(ipAddress.trim())) {
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
    onSearch(trimmedIp);
  };

  const handleInputChange = (value) => {
    // Filter out invalid characters - allow numbers, letters a-f, dots, colons, and common IPv6 letters
    const filteredValue = value.replace(/[^0-9a-fA-F.:]/g, '');
    setIpAddress(filteredValue);
    setErrors(prev => ({ ...prev, ip: '' }));
  };

  const sampleIPs = [
    { ip: '8.8.8.8', label: 'Google DNS' },
    { ip: '1.1.1.1', label: 'Cloudflare DNS' },
    { ip: '208.67.222.222', label: 'OpenDNS' }
  ];

  const searchIcon = (
    <img 
      src="/image-logos/ip-address.png" 
      alt="IP Address" 
      className="h-5 w-5 flex-shrink-0"
    />
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
            disabled={loading || !ipAddress.trim()}
            className="flex-1"
          >
            <Icon name="search" className="-ml-1 mr-2" />
            Search IP
          </Button>
          
          <Button
            type="button"
            variant="secondary"
            onClick={onClear}
            disabled={loading}
          >
            <Icon name="refresh" className="-ml-1 mr-2" />
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
              <Icon name="link" size="xs" className="mr-1.5" />
              {sample.ip}
              <span className="ml-1 text-gray-400">({sample.label})</span>
            </Button>
          ))}
        </div>
      </div>

          </Card>
  );
};

export default IPSearch;
