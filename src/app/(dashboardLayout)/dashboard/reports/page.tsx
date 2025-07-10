
'use client'


import { useState } from 'react';

import { format } from 'date-fns';
import Image from 'next/image';
import { useDeleteReportedProductByAdminMutation, useGetAllReportedProductByAdminQuery ,useReplyReportedProductMutation} from '@/src/redux/features/reportProduct/reportProductApi';
import { IReportedProduct } from '@/src/types';
import Loader from '@/src/hooks/loader';
import { FaTrash } from 'react-icons/fa';

const AdminReportedProductsPage = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [resolvedFilter, setResolvedFilter] = useState<'all' | 'resolved' | 'unresolved'>('all');
  
  // Fetch reported products
  const { data, isLoading, isError, refetch } = useGetAllReportedProductByAdminQuery({
    page,
    limit,
    searchTerm,
    status: resolvedFilter === 'all' ? undefined : resolvedFilter,
  });
console.log(data)
  // Mutations
  const [resolveReport] = useReplyReportedProductMutation();
  const [deleteReportedProduct] = useDeleteReportedProductByAdminMutation();

  // Handle resolve report
  const handleResolveReport = async (reportId: string) => {
    try {
      await resolveReport(reportId).unwrap();
      refetch();
    } catch (error) {
      console.error('Failed to resolve report:', error);
    }
  };

  // Handle delete reported product
  const handleDeleteReportedProduct = async (productId: string) => {
    try {
      await deleteReportedProduct(productId).unwrap();
      refetch();
    } catch (error) {
      console.error('Failed to delete reported product:', error);
    }
  };

  if (isLoading) {return <Loader />}
  if (isError) return <div className="text-center py-8 text-red-500">Error loading reported products</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Reported Products Management</h1>
      
      {/* Filters and Search */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="flex gap-3">
          <select
            value={resolvedFilter}
            onChange={(e) => setResolvedFilter(e.target.value as any)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="all">All Reports</option>
            <option value="resolved">Resolved</option>
            <option value="unresolved">Unresolved</option>
          </select>
          
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="px-3 py-2 border rounded-md"
          >
            <option value="10">10 per page</option>
            <option value="20">20 per page</option>
            <option value="50">50 per page</option>
          </select>
        </div>
        
        <input
          type="text"
          placeholder="Search by product name or reporter..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-2 border rounded-md w-full md:w-64"
        />
      </div>
      
      {/* Reports Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Report Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reported On
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data?.data?.meta?.total ? (
              data?.data?.result.map((report: any
              ) => (
                <tr key={report._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <Image
                          src={report.productId.images[0] || '/placeholder-product.jpg'}
                          alt={report.productId.name}
                          width={40}
                          height={40}
                          className="rounded-md"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{report.productId.name}</div>
                        <div className="text-sm text-gray-500">${report.productId.price}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <strong>Reason:</strong> {report.reason}
                    </div>
                    <div className="text-sm text-gray-500">
                      <strong>Reported by:</strong> {report.reportedBy.name || report.reportedBy.email}
                    </div>
                    <div className="text-sm text-gray-500">
                      <strong>Description:</strong> {report.description || 'No additional details'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${report.resolved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                    >
                      {report.resolved ? 'Resolved' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(report.createdAt), 'MMM dd, yyyy HH:mm')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {!report.resolved && (
                      <button
                        onClick={() => handleResolveReport(report._id)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Mark Resolved
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteReportedProduct(report.product._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                     <FaTrash></FaTrash>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No reported products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {data?.totalPages > 1 && (
        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 border rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {page} of {data.totalPages}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, data.totalPages))}
            disabled={page === data.totalPages}
            className="px-4 py-2 border rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminReportedProductsPage;