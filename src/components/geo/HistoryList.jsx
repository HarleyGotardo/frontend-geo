import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { geoService } from '../../services/geoService';
import { sweetAlertService } from '../../utils/sweetAlertConfig';
import { usePagination } from '../../hooks/usePagination';
import Button from '../ui/Button';
import Card from '../ui/Card';
import LoadingSpinner from '../ui/LoadingSpinner';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationFirst,
  PaginationPrevious,
  PaginationNext,
  PaginationLast,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import Icon from '../ui/Icon';

const HistoryList = ({ onHistoryItemClick, refreshTrigger, activeItemId }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Use pagination hook with 4 items per page
  const pagination = usePagination(history, 4);

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
      // Show SweetAlert confirmation dialog
      const result = await sweetAlertService.confirmDelete(selectedItems.size, 'history item');

      if (result.isConfirmed) {
        setDeleteLoading(true);
        
        // Show loading dialog
        sweetAlertService.showLoading('Deleting Items...');

        const idsToDelete = Array.from(selectedItems);
        const deleteResult = await geoService.deleteHistory(idsToDelete);
        
        if (deleteResult.success) {
          setSelectedItems(new Set());
          await fetchHistory();
          
          // Close loading and show success
          sweetAlertService.close();
          await sweetAlertService.showSuccess(
            'Deleted!',
            `Successfully deleted ${idsToDelete.length} history item${idsToDelete.length !== 1 ? 's' : ''}.`
          );
          
          toast.success(`Deleted ${idsToDelete.length} history item${idsToDelete.length !== 1 ? 's' : ''}`);
        } else {
          throw new Error(deleteResult.message || 'Failed to delete history items');
        }
      }
    } catch (error) {
      sweetAlertService.close();
      await sweetAlertService.showError(
        'Error!',
        error.message || 'Failed to delete history items'
      );
      toast.error(error.message || 'Failed to delete history items');
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
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium bg-primary/10 text-primary">
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
      ) : pagination.totalItems === 0 ? (
        <div className="text-center py-8">
          <Icon name="clock" size="xl" className="mx-auto mb-3" />
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
                    className="h-4 w-4 text-primary focus:ring-ring border-gray-300 rounded"
                  />
                  <label htmlFor="select-all" className="text-sm font-medium text-gray-700">
                    Select All ({selectedItems.size} selected)
                  </label>
                </div>
                <div className="bg-gray-200  rounded-lg">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={handleBulkDelete}
                    loading={deleteLoading}
                    disabled={selectedItems.size === 0 || deleteLoading}
                  >
                    <Icon name="trash" className="-ml-1" />
                    Selected
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* History Items - Using paginated data */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {pagination.currentData.map((item) => (
              <div
                key={item.id}
                className={`group relative flex items-start space-x-3 p-3 rounded-lg border transition-colors ${
                  activeItemId === item.id
                    ? 'bg-primary/5 border-primary/20 shadow-sm'
                    : 'border-gray-200 hover:border-primary/20 hover:bg-primary/5'
                } cursor-pointer`}
              >
                <input
                  type="checkbox"
                  checked={selectedItems.has(item.id)}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleSelectItem(item.id, e.target.checked);
                  }}
                  className="mt-1 h-4 w-4 text-primary focus:ring-ring border-gray-300 rounded"
                />
                
                <div 
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => handleItemClick(item)}
                >
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
                          <Icon name="location-pin" size="xs" className="mr-1" />
                          {truncateText(item.geo_data.city, 15)}, {truncateText(item.geo_data.country, 15)}
                        </span>
                        <span className="flex items-center">
                          <img 
                            src="/image-logos/ip-address.png" 
                            alt="IP Address" 
                            className="h-3 w-3 mr-1 flex-shrink-0"
                          />
                          <span className="font-mono break-all max-w-[200px]">{item.geo_data.ip}</span>
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Component - Outside overflow */}
          {pagination.totalPages > 1 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0 gap-4">
                {/* Items info */}
                <span className="text-xs text-gray-500 leading-none whitespace-nowrap bg-gray-100 px-3 py-1 rounded-lg">
                  {pagination.startIndex + 1} - {pagination.endIndex} of {pagination.totalItems}
                </span>
                
                {/* Shadcn Pagination */}
                <Pagination>
                  <PaginationContent className="gap-1">
                    {/* First page button */}
                    <PaginationItem>
                      <PaginationFirst
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          pagination.goToPage(1);
                        }}
                        className={!pagination.hasPreviousPage ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    
                    {/* Previous button */}
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          pagination.goToPage(pagination.currentPage - 1);
                        }}
                        className={!pagination.hasPreviousPage ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    
                    {/* Page numbers */}
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      let pageNum;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (pagination.currentPage >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = pagination.currentPage - 2 + i;
                      }
                      
                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            href="#"
                            isActive={pageNum === pagination.currentPage}
                            onClick={(e) => {
                              e.preventDefault();
                              pagination.goToPage(pageNum);
                            }}
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    
                    {/* Ellipsis for many pages */}
                    {pagination.totalPages > 5 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                    
                    {/* Next button */}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          pagination.goToPage(pagination.currentPage + 1);
                        }}
                        className={!pagination.hasNextPage ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    
                    {/* Last page button */}
                    <PaginationItem>
                      <PaginationLast
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          pagination.goToPage(pagination.totalPages);
                        }}
                        className={!pagination.hasNextPage ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          )}
        </>
      )}
    </Card>
  );
};

export default HistoryList;
