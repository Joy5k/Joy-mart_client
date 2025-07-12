'use client'

import { useState } from 'react';
import { format } from 'date-fns';
import Image from 'next/image';
import { 
  useDeleteReportedProductByAdminMutation, 
  useGetAllReportedProductByAdminQuery, 
  useReplyReportedProductMutation 
} from '@/src/redux/features/reportProduct/reportProductApi';
import Loader from '@/src/hooks/loader';
import { FaTrash, FaTimes, FaExternalLinkAlt, FaCheck, FaBan } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { ReportedProduct } from '@/src/types';



const AdminReportedProductsPage = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'resolved' | 'pending' | 'rejected'>('all');
  const [expandedDescriptions, setExpandedDescriptions] = useState<Record<string, boolean>>({});
  const [selectedReport, setSelectedReport] = useState<ReportedProduct | null>(null);
  const [adminReply, setAdminReply] = useState('');
  const [actionType, setActionType] = useState<'resolved' | 'rejected'>('resolved');
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Fetch reported products
  const { data, isLoading, isError, refetch } = useGetAllReportedProductByAdminQuery({
    page,
    limit,
    searchTerm,
    status: statusFilter === 'all' ? undefined : statusFilter,
  });

  // Mutations
  const [replyToReport,{isLoading:adminReplyLoading}] = useReplyReportedProductMutation();
  const [deleteReportedProduct] = useDeleteReportedProductByAdminMutation();

  // Toggle description expansion
  const toggleDescription = (reportId: string) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [reportId]: !prev[reportId]
    }));
  };

  // Open modal with report details
  const openReportModal = (report: ReportedProduct, action: 'resolved' | 'rejected' = 'resolved') => {
    setSelectedReport(report);
    setAdminReply(report.adminReply?.message || '');
    setActionType(action);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedReport(null);
    setAdminReply('');
  };

  // Handle admin reply to report
  const handleAdminReply = async () => {
    if (!selectedReport) return;
      const reply={
        message: adminReply,
        status: actionType
      }
    try {
     const res= await replyToReport({
        reportId: selectedReport._id,
        reply
      }).unwrap();
      if(res.success){
              closeModal();
        toast.success(`Reported product ${actionType === 'resolved' ? 'resolved' : 'rejected'} successfully`,{
          position:'top-center',
          autoClose: 1000,
        });
      }
      refetch();
    } catch (error) {
      console.error('Failed to update report:', error);
    }
  };



  // Handle delete reported product
  const handleDeleteReportedProduct = async (reportId: string) => {
    try {
      const res=await deleteReportedProduct({reportId}).unwrap();
      console.log(res,)
      if(res.success){
        toast.success('Reported product deleted successfully');
      }
      refetch();
    } catch (error) {
      console.error('Failed to delete reported product:', error);
    }
  };

  if (isLoading) return <Loader />;
  if (isError) return <div className="text-center py-8 text-red-500">Error loading reported products</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Reported Products Management</h1>
      
      {/* Filters and Search */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="flex gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="all">All Reports</option>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
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
              data?.data?.result.map((report: ReportedProduct) => (
                <tr key={report._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <Image
                          src={report.productId.images[0] || '/placeholder-product.jpg'}
                          alt={report.productId.title || 'Product image'}
                          width={40}
                          height={40}
                          className="rounded-md"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{report.productId.title || 'Unnamed Product'}</div>
                        <div className="text-sm text-gray-500">${report.productId.price}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      <strong>Reason:</strong> {report.reason}
                    </div>
                    <div className="text-sm text-gray-500">
                      <strong>Reported by:</strong> {report.reportedBy.email}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      <strong>Description:</strong> 
                      <span> {expandedDescriptions[report._id] 
                        ? report.description || 'No additional details'
                        : `${report.description?.substring(0, 30) || 'No additional details'}`}
                      </span>
                      {report.description && report.description.length > 30 && (
                        <button 
                          onClick={() => toggleDescription(report._id)}
                          className="text-blue-500 hover:text-blue-700 ml-1 text-xs"
                        >
                          {expandedDescriptions[report._id] ? 'Show less' : 'Read more'}
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          report.status === 'resolved' ? 'bg-green-100 text-green-800' :
                          report.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}
                    >
                      {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(report.createdAt), 'MMM dd, yyyy HH:mm')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      {report.status === 'pending' && (
                        <>
                          <button
                            onClick={() => openReportModal(report, 'resolved')}
                            className="text-green-600 hover:text-green-800 p-1 cursor-pointer"
                            title="Resolve"
                          >
                            <FaCheck />
                          </button>
                          <button
                            onClick={() => openReportModal(report, 'rejected')}
                            className="text-red-600 hover:text-red-800 p-1 cursor-pointer"
                            title="Reject"
                          >
                            <FaBan />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDeleteReportedProduct(report._id)}
                        className="text-red-600 hover:text-red-800 p-1 cursor-pointer"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
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
      
{/* Report Details Modal */}
{isModalOpen && selectedReport && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold">
            {actionType === 'resolved' ? 'Resolve Report' : 'Reject Report'}
          </h2>
          <button 
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes className="text-lg" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Details Section */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-3">Product Information</h3>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <Image
                  src={selectedReport.productId.images[0] || '/placeholder-product.jpg'}
                  alt={selectedReport.productId.title || 'Product image'}
                  width={120}
                  height={120}
                  className="rounded-md object-cover"
                />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{selectedReport.productId.title || 'Unnamed Product'}</h4>
                <p className="text-gray-600">${selectedReport.productId.price}</p>
                <a
                  href={`/productDetails/${selectedReport.productId._id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center mt-2 text-blue-600 hover:text-blue-800 text-sm"
                >
                  View Product Page <FaExternalLinkAlt className="ml-1" />
                </a>
              </div>
            </div>
          </div>
          
          {/* Report Details Section */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-3">Report Information</h3>
            
            {/* Report Images Carousel */}
            {(selectedReport.reportImages && selectedReport.reportImages.length > 0) && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-500 mb-2">Reported Images</p>
                <div className="relative">
                  <div className="carousel rounded-box">
                    {selectedReport.reportImages.map((image, index) => (
                      <div key={index} className="carousel-item relative">
                        <Image
                          src={image || '/placeholder-report.jpg'}
                          alt={`Report image ${index + 1}`}
                          width={300}
                          height={200}
                          className="rounded-md object-contain h-48 w-full"
                        />
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                          {index + 1}/{selectedReport.reportImages?.length ?? 0}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-500">Reported By</p>
                <p className="text-gray-900">{selectedReport.reportedBy.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Reason</p>
                <p className="text-gray-900">{selectedReport.reason}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Description</p>
                <p className="text-gray-900">
                  {selectedReport.description || 'No additional details provided'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Reported On</p>
                <p className="text-gray-900">
                  {format(new Date(selectedReport.createdAt), 'MMM dd, yyyy HH:mm')}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer 
                    ${
                      selectedReport.status === 'resolved' ? 'bg-green-100 text-green-800' :
                      selectedReport.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}
                >
                  {selectedReport.status.charAt(0).toUpperCase() + selectedReport.status.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Admin Reply Section */}
        <div className="mt-6 border-t pt-4">
          <h3 className="font-semibold text-lg mb-3">Admin Response</h3>
          {selectedReport.status !== 'pending' && selectedReport.adminReply?.message ? (
            <div className={`p-3 rounded-md ${
              selectedReport.status === 'resolved' ? 'bg-green-50' : 'bg-red-50'
            }`}>
              <p className="text-sm font-medium text-gray-700 mb-1">
                {selectedReport.status === 'resolved' ? 'Resolution note:' : 'Rejection reason:'}
              </p>
              <p className="text-gray-900">{selectedReport.adminReply.message}</p>
              {selectedReport.adminReply.repliedAt && (
                <p className="text-xs text-gray-500 mt-2">
                  {selectedReport.status === 'resolved' ? 'Resolved' : 'Rejected'} on {format(new Date(selectedReport.adminReply.repliedAt), 'MMM dd, yyyy HH:mm')}
                </p>
              )}
            </div>
          ) : (
            <>
              <textarea
                value={adminReply}
                onChange={(e) => setAdminReply(e.target.value)}
                placeholder={
                  actionType === 'resolved' 
                    ? 'Enter resolution notes...' 
                    : 'Enter rejection reason...'
                }
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
              <div className="flex justify-end mt-3 space-x-3">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdminReply}
                  disabled={!adminReply.trim()}
                  className={`px-4 py-2 rounded-md text-white ${
                    actionType === 'resolved' 
                      ? adminReply.trim() 
                        ? 'bg-green-600 hover:bg-green-700 cursor-pointer ' 
                        : 'bg-gray-400 cursor-not-allowed'
                      : adminReply.trim()
                        ? 'bg-red-600 hover:bg-red-700 cursor-pointer '
                        : 'bg-red-400 cursor-not-allowed'
                  }`}
                >
                  {actionType === 'resolved' ? 'Mark as Resolved' : 'Reject Report'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  </div>
)}
      
      {/* Pagination */}
      {data?.data?.meta?.totalPage > 1 && (
        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 border rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {page} of {data.data.meta.totalPage}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, data.data.meta.totalPage))}
            disabled={page === data.data.meta.totalPage}
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