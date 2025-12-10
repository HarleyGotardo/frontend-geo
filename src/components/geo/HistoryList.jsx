import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { geoService } from '../../services/geoService';
import Button from '../ui/Button';
import Card from '../ui/Card';
import LoadingSpinner from '../ui/LoadingSpinner';

const HistoryList = ({ onHistoryItemClick, refreshTrigger }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const result = await geoService.getHistory();
      if (result.success) {
        setHistory(result.data);
      } else {
        toast.error(result.message || 'Failed to fetch history');
      }
    } catch {
      toast.error('Failed to fetch search history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [refreshTrigger]);

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedItems(new Set(history.map(item => item.id)));
    } else {
      setSelectedItems(new Set());
    }
  };

  const handleSelectItem = (id, checked) => {
    const newSelected = new Set(selectedItems);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedItems(newSelected);
  };

  const handleBulkDelete = async () => {
    if (selectedItems.size === 0) {
      toast.error('No items selected for deletion');
      return;
    }

    try {
      setDeleteLoading(true);
      const idsToDelete = Array.from(selectedItems);
      const result = await geoService.deleteHistory(idsToDelete);
      
      if (result.success) {
        toast.success(`Deleted ${idsToDelete.length} history item(s)`);
        setSelectedItems(new Set());
        await fetchHistory();
      } else {
        toast.error(result.message || 'Failed to delete history items');
      }
    } catch {
      toast.error('Failed to delete history items');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleItemClick = (item) => {
    if (onHistoryItemClick) {
      onHistoryItemClick(item);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text, maxLength) => {
    if (!text) return 'Unknown';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <Card>
      <div className="mb-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Search History</h3>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {history.length} {history.length === 1 ? 'item' : 'items'}
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Your recent IP geolocation searches
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-8">
          <LoadingSpinner size="md" className="mb-3" />
          <p className="text-sm text-gray-500">Loading history...</p>
        </div>
      ) : history.length === 0 ? (
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-gray-500">No search history</p>
          <p className="text-xs text-gray-400 mt-1">Your IP searches will appear here</p>
        </div>
      ) : (
        <>
          {/* Bulk Actions */}
          {history.length > 0 && (
            <div className="mb-4 p-3 bg-gray-50 rounded-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="select-all"
                    checked={selectedItems.size === history.length && history.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="select-all" className="text-sm font-medium text-gray-700">
                    Select All ({selectedItems.size} selected)
                  </label>
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleBulkDelete}
                  loading={deleteLoading}
                  disabled={selectedItems.size === 0 || deleteLoading}
                >
                  <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete Selected
                </Button>
              </div>
            </div>
          )}

          {/* History Items */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {history.map((item) => (
              <div
                key={item.id}
                className="group relative flex items-start space-x-3 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer"
                onClick={() => handleItemClick(item)}
              >
                <input
                  type="checkbox"
                  checked={selectedItems.has(item.id)}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleSelectItem(item.id, e.target.checked);
                  }}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.search_term}
                    </p>
                    <span className="text-xs text-gray-500">
                      {formatDate(item.created_at)}
                    </span>
                  </div>
                  
                  {item.geo_data && (
                    <div className="mt-1 text-xs text-gray-600">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0">
                        <span className="flex items-center">
                          <svg className="h-3 w-3 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {truncateText(item.geo_data.city, 15)}, {truncateText(item.geo_data.country, 15)}
                        </span>
                        <span className="flex items-center">
                          <svg className="h-3 w-3 mr-1 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                          </svg>
                          <span className="font-mono break-all max-w-[200px]">{item.geo_data.ip}</span>
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </Card>
  );
};

export default HistoryList;
