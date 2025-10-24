import { useState } from 'react';
import { Trash2, Edit } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function DataTable({ 
  columns = [], 
  data = [], 
  actions = [],
  pagination = true,
  onEdit,
  onDelete,
  customRender = {},
  headerClassName = "text-white"
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // Paginated data
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = pagination 
    ? data.slice(startIndex, startIndex + itemsPerPage)
    : data;

  // Default cell renderer
  const renderCell = (item, column) => {
    // Check if there's a custom render function for this column
    if (customRender[column.key]) {
      return customRender[column.key](item[column.key], item);
    }
    
    // Default render
    return item[column.key];
  };

  // Action buttons renderer
  const renderActions = (item, index) => {
    return (
      <div className="flex items-center justify-center gap-2">
        {actions.includes('delete') && (
          <button
            onClick={() => onDelete && onDelete(item, index)}
            className="text-white p-2 transition shadow-sm hover:opacity-90"
            style={{ 
              backgroundColor: '#BE0414',
              borderRadius: '12px',
              fontFamily: 'Urbanist, sans-serif'
            }}
            aria-label="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
        {actions.includes('edit') && (
          <button
            onClick={() => onEdit && onEdit(item, index)}
            className="text-white p-2 transition shadow-sm hover:opacity-90"
            style={{ 
              backgroundColor: '#16874B',
              borderRadius: '12px',
              fontFamily: 'Urbanist, sans-serif'
            }}
            aria-label="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page, current page neighbors, and last page
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('ellipsis');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('ellipsis');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('ellipsis');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="bg-white shadow-xl overflow-hidden" style={{ borderRadius: '12px', fontFamily: 'Urbanist, sans-serif' }}>
      <table className="w-full">
        <thead className={headerClassName} style={{ backgroundColor: '#DABC4E' }}>
          <tr className="hover:bg-transparent">
            {/* Number column */}
            <th className="text-center font-semibold w-16 p-4" style={{ 
              color: '#015023',
              fontFamily: 'Urbanist, sans-serif'
            }}>
              No
            </th>
            
            {/* Dynamic columns */}
            {columns.map((column) => (
              <th 
                key={column.key} 
                className={`font-semibold p-4 text-left ${column.className || ''}`}
                style={{ 
                  width: column.width,
                  color: '#015023',
                  fontFamily: 'Urbanist, sans-serif'
                }}
              >
                {column.label}
              </th>
            ))}
            
            {/* Actions column */}
            {actions.length > 0 && (
              <th className="text-center font-semibold p-4" style={{ 
                color: '#015023',
                fontFamily: 'Urbanist, sans-serif'
              }}>
                Actions
              </th>
            )}
          </tr>
        </thead>

        <tbody>
          {paginatedData.map((item, index) => (
            <tr key={item.id || index} className="border-b border-gray-100 hover:bg-gray-50 transition">
              {/* Number cell */}
              <td className="text-center font-medium text-gray-600 p-4" style={{ fontFamily: 'Urbanist, sans-serif' }}>
                {startIndex + index + 1}
              </td>
              
              {/* Dynamic cells */}
              {columns.map((column) => (
                <td 
                  key={column.key}
                  className={`p-4 ${column.cellClassName || 'text-gray-700'}`}
                  style={{ fontFamily: 'Urbanist, sans-serif' }}
                >
                  {renderCell(item, column)}
                </td>
              ))}
              
              {/* Actions cell */}
              {actions.length > 0 && (
                <td className="p-4">
                  {renderActions(item, startIndex + index)}
                </td>
              )}
            </tr>
          ))}
          
          {/* Empty state */}
          {paginatedData.length === 0 && (
            <tr>
              <td 
                colSpan={columns.length + (actions.length > 0 ? 2 : 1)} 
                className="text-center py-8 text-gray-500"
                style={{ fontFamily: 'Urbanist, sans-serif' }}
              >
                Tidak ada data
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination using custom component */}
      {pagination && data.length > 0 && (
        <div className="border-t border-gray-200 p-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(prev => Math.max(1, prev - 1));
                  }}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              
              {getPageNumbers().map((page, index) => (
                <PaginationItem key={`page-${index}`}>
                  {page === 'ellipsis' ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      href="#"
                      isActive={currentPage === page}
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(page);
                      }}
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(prev => Math.min(totalPages, prev + 1));
                  }}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}