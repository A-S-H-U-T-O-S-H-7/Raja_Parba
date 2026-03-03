"use client";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import useThemeStore from '@/lib/stores/useThemeStore';

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  onPageSizeChange,
  totalItems,
  itemsPerPage,
  pageSizeOptions = [10, 20, 50, 100],
  className = "",
  showPageSize = true,
  showInfo = true,
  showFirstLast = true
}) => {
  const { isDarkMode } = useThemeStore();

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getVisiblePages = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= 3) {
      for (let i = 1; i <= 4; i++) pages.push(i);
      pages.push('...');
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1);
      pages.push('...');
      for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push('...');
      for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
      pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value, 10);
    onPageSizeChange(newSize);
  };

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t rounded-b-xl ${
      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
    } ${className}`}>
      <div className="flex items-center gap-4">
        {showPageSize && (
          <div className="flex items-center gap-2">
            <label
              htmlFor="pageSize"
              className={`text-sm whitespace-nowrap ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
            >
              Show:
            </label>
            <select
              id="pageSize"
              value={itemsPerPage}
              onChange={handlePageSizeChange}
              className={`px-2 py-1.5 rounded-lg text-sm border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                isDarkMode
                  ? 'bg-gray-700 text-gray-200 border-gray-600'
                  : 'bg-white text-gray-700 border-gray-300'
              }`}
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}

        {showInfo && (
          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {totalItems > 0 ? (
              <>
                Showing <span className="font-medium">{startItem}-{endItem}</span> of{' '}
                <span className="font-medium">{totalItems}</span> results
              </>
            ) : (
              <span className="font-medium">No results</span>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center space-x-1">
        {showFirstLast && (
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1 || totalItems === 0}
            className={`px-2 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentPage === 1 || totalItems === 0
                ? 'cursor-not-allowed opacity-50'
                : isDarkMode
                  ? 'hover:bg-gray-700 text-gray-300'
                  : 'hover:bg-gray-200 text-gray-700'
            }`}
            title="First Page"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || totalItems === 0}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${
            currentPage === 1 || totalItems === 0
              ? 'cursor-not-allowed opacity-50'
              : isDarkMode
                ? 'hover:bg-gray-700 text-gray-300'
                : 'hover:bg-gray-200 text-gray-700'
          } ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {totalItems > 0 ? (
          getVisiblePages().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === 'number' && onPageChange(page)}
              disabled={page === '...'}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                page === currentPage
                  ? 'bg-emerald-600 text-white'
                  : page === '...'
                    ? 'cursor-default'
                    : isDarkMode
                      ? 'text-gray-300 hover:bg-gray-700'
                      : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          ))
        ) : (
          <span className={`px-3 py-2 text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>-</span>
        )}

        <button
          onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalItems === 0}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${
            currentPage === totalPages || totalItems === 0
              ? 'cursor-not-allowed opacity-50'
              : isDarkMode
                ? 'hover:bg-gray-700 text-gray-300'
                : 'hover:bg-gray-200 text-gray-700'
          } ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {showFirstLast && (
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages || totalItems === 0}
            className={`px-2 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentPage === totalPages || totalItems === 0
                ? 'cursor-not-allowed opacity-50'
                : isDarkMode
                  ? 'hover:bg-gray-700 text-gray-300'
                  : 'hover:bg-gray-200 text-gray-700'
            }`}
            title="Last Page"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Pagination;
