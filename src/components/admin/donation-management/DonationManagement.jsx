// components/admin/donation-management/DonationManagement.jsx
"use client";

import { useEffect } from 'react';
import {
  ArrowLeft,
  Heart,
  Search,
  Filter,
  Download,
  Eye,
  Calendar,
  Landmark,
  MapPin,
  User,
  CheckCircle,
  XCircle,
  Clock,
  IndianRupee,
  RefreshCw,
  FileText,
  Mail,
  Phone,
  Users
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import useThemeStore from '@/lib/stores/useThemeStore';
import useDonationStore from '@/lib/stores/useDonationStore';
import DonationDetailsModal from './DonationDetailsModal';
import DocumentViewerModal from '../DocumentViewerModal';
import Pagination from '../shared/Pagination';
import { format } from 'date-fns';

export default function DonationManagement() {
  const router = useRouter();
  const { isDarkMode } = useThemeStore();
  const isDark = isDarkMode;

  const {
    donations,
    filteredDonations,
    loading,
    searchTerm,
    statusFilter,
    dateFilter,
    currentPage,
    itemsPerPage,
    selectedDonation,
    modals,
    setSearchTerm,
    setStatusFilter,
    setDateFilter,
    setCurrentPage,
    getPaginatedItems,
    getTotalPages,
    loadDonations,
    exportToCSV,
    openModal,
    closeModal,
    getStatusConfig
  } = useDonationStore();

  useEffect(() => {
    loadDonations();
  }, []);

  const currentItems = getPaginatedItems();
  const totalPages = getTotalPages();
  const totalAmount = donations.reduce((sum, donation) => sum + (donation.amount || 0), 0);
  const confirmedCount = donations.filter((donation) => ['confirmed', 'completed'].includes(donation.status)).length;
  const pendingCount = donations.filter((donation) => donation.status === 'pending_payment').length;
  const totalDonors = new Set(donations.map((donation) => donation.donorDetails?.email).filter(Boolean)).size;

  const getStatusColors = (status) => {
    if (isDark) {
      switch(status) {
        case 'confirmed':
        case 'completed': return 'bg-green-900/60 text-green-200 border border-green-700';
        case 'pending_payment': return 'bg-yellow-900/60 text-yellow-200 border border-yellow-700';
        case 'failed': return 'bg-red-900/60 text-red-200 border border-red-700';
        case 'cancelled': return 'bg-gray-700 text-gray-200 border border-gray-600';
        default: return 'bg-gray-700 text-gray-200 border border-gray-600';
      }
    }
    switch(status) {
      case 'confirmed':
      case 'completed': return 'bg-green-100 text-green-700 border border-green-300';
      case 'pending_payment': return 'bg-yellow-100 text-yellow-700 border border-yellow-300';
      case 'failed': return 'bg-red-100 text-red-700 border border-red-300';
      case 'cancelled': return 'bg-gray-100 text-gray-700 border border-gray-300';
      default: return 'bg-gray-100 text-gray-700 border border-gray-300';
    }
  };

  // Table headers configuration
  const tableHeaders = [
    { label: "S.No", width: "70px" },
    { label: "Donation Details", width: "150px" },
    { label: "Donor Information", width: "200px" },
    { label: "Amount & Status", width: "150px" },
    { label: "Location", width: "150px" },
    { label: "Date", width: "120px" },
    { label: "Actions", width: "100px" }
  ];

  const headerStyle = `px-4 py-3 text-center text-sm font-bold border-r ${
    isDark 
      ? "text-blue-100 border-indigo-700/50 bg-gray-900" 
      : "text-indigo-900 border-indigo-200/70 bg-gray-50"
  }`;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className={`animate-spin rounded-full h-12 w-12 border-b-2 mx-auto ${isDark ? 'border-indigo-400' : 'border-indigo-600'}`}></div>
          <p className={`mt-4 text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Loading donations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen transition-colors duration-300 p-0 md:p-4">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => router.back()}
              className={`p-2.5 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-200 hover:scale-105 flex-shrink-0 ${
                isDark
                  ? 'bg-gray-800 hover:bg-gray-700 border border-gray-700'
                  : 'bg-indigo-50 hover:bg-indigo-100 border border-indigo-200'
              }`}
            >
              <ArrowLeft className={`w-4 h-4 sm:w-5 sm:h-5 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
            </button>
            <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-indigo-900/30 border-indigo-700/60' : 'bg-indigo-50 border-indigo-200'}`}>
              <Heart className={`h-5 w-5 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
            </div>
            <div>
              <h1 className={`text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r truncate ${
                isDark ? 'from-indigo-400 to-blue-400' : 'from-indigo-600 to-blue-600'
              } bg-clip-text text-transparent`}>
                Donation Management
              </h1>
              <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Manage and track all donations • Total: {filteredDonations.length}
              </p>
            </div>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={loadDonations}
              disabled={loading}
              className={`px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 flex-1 sm:flex-initial ${
                isDark
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="text-xs sm:text-sm">Refresh</span>
            </button>
            <button
              onClick={exportToCSV}
              className={`px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 flex-1 sm:flex-initial ${
                isDark
                  ? 'bg-indigo-700 hover:bg-indigo-600 text-white border border-indigo-500/50'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white border border-indigo-700/40'
              }`}
            >
              <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm">Export CSV</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={Landmark}
            label="Total Donations"
            value={`₹${totalAmount.toLocaleString('en-IN')}`}
            color="green"
            isDark={isDark}
          />
          <StatCard
            icon={CheckCircle}
            label="Confirmed"
            value={confirmedCount.toString()}
            color="green"
            isDark={isDark}
          />
          <StatCard
            icon={Clock}
            label="Pending"
            value={pendingCount.toString()}
            color="yellow"
            isDark={isDark}
          />
          <StatCard
            icon={Users}
            label="Total Donors"
            value={totalDonors.toString()}
            color="blue"
            isDark={isDark}
          />
        </div>

        {/* Filters */}
        <div className={`p-5 rounded-xl border ${
          isDark ? 'bg-gray-800/90 border-gray-700' : 'bg-white/90 border-gray-200'
        }`}>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or donation ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className={`h-4 w-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`px-3 py-2.5 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="pending_payment">Pending</option>
                <option value="failed">Failed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className={`h-4 w-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className={`px-3 py-2.5 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className={`relative rounded-2xl shadow-2xl border-2 overflow-hidden ${
        isDark
          ? "bg-gray-800 border-indigo-600/50 shadow-indigo-900/20"
          : "bg-white border-indigo-300 shadow-indigo-500/10"
      }`}>
        {currentItems.length === 0 ? (
          <div className="text-center py-16">
            <Heart className={`h-16 w-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
            <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              No donations found
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {searchTerm || statusFilter !== 'all' || dateFilter !== 'all'
                ? 'Try adjusting your filters or search query'
                : 'No donations have been made yet'}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-max" style={{ minWidth: '800px' }}>
                <thead className={`border-b-2 ${
                  isDark
                    ? "bg-gradient-to-r from-indigo-950 via-indigo-900 to-blue-900 border-indigo-600/50"
                    : "bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-100 border-indigo-300"
                }`}>
                  <tr>
                    {tableHeaders.map((header, index) => (
                      <th 
                        key={index}
                        className={headerStyle}
                        style={{ minWidth: header.width }}
                      >
                        {header.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className={isDark ? "bg-gray-800" : "bg-white"}>
                  {currentItems.map((donation, index) => {
                    const serialNo = (currentPage - 1) * itemsPerPage + index + 1;
                    const rowBgColor = isDark 
                      ? index % 2 === 0 
                        ? 'bg-gray-800' 
                        : 'bg-gray-700/30'
                      : index % 2 === 0 
                        ? 'bg-white' 
                        : 'bg-gray-50';

                    return (
                      <tr 
                        key={donation.id} 
                        className={`border-b transition-all duration-200 hover:shadow-lg ${
                          isDark
                            ? "border-gray-700 hover:bg-gray-700/50"
                            : "border-gray-200 hover:bg-indigo-50/50"
                        } ${rowBgColor}`}
                      >
                        {/* S.No */}
                        <td className={`px-4 py-4 text-center border-r ${
                          isDark ? "border-gray-700" : "border-gray-300"
                        }`}>
                          <span className={`font-medium ${isDark ? "text-gray-100" : "text-gray-900"}`}>
                            {serialNo.toString().padStart(2, '0')}
                          </span>
                        </td>

                        {/* Donation Details */}
                        <td className={`px-4 py-4 border-r ${
                          isDark ? "border-gray-700" : "border-gray-300"
                        }`}>
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <Heart className={`h-4 w-4 mr-2 ${isDark ? "text-indigo-400" : "text-indigo-600"}`} />
                              <span className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                                {donation.donationId || donation.id?.slice(-8) || 'N/A'}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                                isDark 
                                  ? donation.donorType === 'foreign'
                                    ? 'bg-blue-900/50 text-blue-300 border border-blue-700'
                                    : 'bg-emerald-900/50 text-emerald-300 border border-emerald-700'
                                  : donation.donorType === 'foreign'
                                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              }`}>
                                {donation.donorType === 'foreign' ? 'NRI/Foreign' : 'Indian'}
                              </span>
                              {donation.taxExemption?.eligible && (
                                <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                                  isDark
                                    ? 'bg-indigo-900/50 text-indigo-300 border border-indigo-700'
                                    : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                }`}>
                                  80G
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Donor Information */}
                        <td className={`px-4 py-4 border-r ${
                          isDark ? "border-gray-700" : "border-gray-300"
                        }`}>
                          <div className="flex flex-col space-y-2">
                            <span className={`text-sm font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                              {donation.donorDetails?.name || 'Anonymous'}
                            </span>
                            <div className="flex items-center text-xs">
                              <Mail className={`w-3 h-3 mr-1 flex-shrink-0 ${
                                isDark ? "text-indigo-400" : "text-indigo-600"
                              }`} />
                              <span className={`truncate max-w-[150px] ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                                {donation.donorDetails?.email || 'N/A'}
                              </span>
                            </div>
                            <div className="flex items-center text-xs">
                              <Phone className={`w-3 h-3 mr-1 flex-shrink-0 ${
                                isDark ? "text-indigo-400" : "text-indigo-600"
                              }`} />
                              <span className={isDark ? "text-gray-300" : "text-gray-600"}>
                                {donation.donorDetails?.mobile || 'N/A'}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Amount & Status */}
                        <td className={`px-4 py-4 border-r ${
                          isDark ? "border-gray-700" : "border-gray-300"
                        }`}>
                          <div className="flex flex-col space-y-2">
                            <div className="flex items-center">
                              <IndianRupee className={`h-4 w-4 mr-1 ${isDark ? "text-green-400" : "text-green-600"}`} />
                              <span className={`text-lg font-bold ${isDark ? "text-green-400" : "text-green-600"}`}>
                                {(donation.amount || 0).toLocaleString('en-IN')}
                              </span>
                            </div>
                            <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-md ${getStatusColors(donation.status)}`}>
                              {donation.status === 'pending_payment' ? 'Pending' : 
                               donation.status?.charAt(0).toUpperCase() + donation.status?.slice(1) || 'Pending'}
                            </span>
                          </div>
                        </td>

                        {/* Location */}
                        <td className={`px-4 py-4 border-r ${
                          isDark ? "border-gray-700" : "border-gray-300"
                        }`}>
                          <div className="flex items-start">
                            <MapPin className={`w-4 h-4 mr-2 mt-0.5 flex-shrink-0 ${isDark ? "text-indigo-400" : "text-indigo-600"}`} />
                            <div>
                              <span className={`text-sm block ${isDark ? "text-white" : "text-gray-900"}`}>
                                {donation.donorDetails?.city || 'N/A'}
                              </span>
                              {donation.donorDetails?.state && (
                                <span className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                                  {donation.donorDetails.state}
                                  {donation.donorDetails?.country && `, ${donation.donorDetails.country}`}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Date */}
                        <td className={`px-4 py-4 border-r ${
                          isDark ? "border-gray-700" : "border-gray-300"
                        }`}>
                          <div className="flex flex-col">
                            <span className={`text-sm font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                              {donation.createdAt ? format(donation.createdAt, 'dd/MM/yyyy') : 'N/A'}
                            </span>
                            <span className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                              {donation.createdAt ? format(donation.createdAt, 'hh:mm:ss a') : ''}
                            </span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className={`px-4 py-4 ${
                          isDark ? "border-gray-700" : "border-gray-300"
                        }`}>
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => openModal('details', donation)}
                              className={`p-2 rounded-lg transition-all hover:scale-105 ${
                                isDark 
                                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 border border-gray-600' 
                                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300'
                              }`}
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {donation.status !== 'cancelled' && (
                              <button
                                onClick={() => openModal('document', donation)}
                                className={`p-2 rounded-lg transition-all hover:scale-105 ${
                                  isDark 
                                    ? 'bg-indigo-900/60 hover:bg-indigo-800/60 text-indigo-300 border border-indigo-700' 
                                    : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700 border border-indigo-300'
                                }`}
                                title="View Documents"
                              >
                                <FileText className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredDonations.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </div>

      {/* Modals */}
      {modals.details && selectedDonation && (
        <DonationDetailsModal
          donation={selectedDonation}
          isOpen={modals.details}
          onClose={() => closeModal('details')}
          onRefresh={loadDonations}
        />
      )}

      {modals.document && selectedDonation && (
        <DocumentViewerModal
          isOpen={modals.document}
          onClose={() => closeModal('document')}
          booking={selectedDonation}
          isDarkMode={isDark}
        />
      )}
    </div>
  );
}

// Helper StatCard component
function StatCard({ icon: Icon, label, value, color, isDark }) {
  const colorClasses = {
    green: isDark ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-600',
    yellow: isDark ? 'bg-yellow-900/30 text-yellow-300' : 'bg-yellow-100 text-yellow-600',
    blue: isDark ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-600',
  };

  return (
    <div className={`p-4 rounded-xl border ${
      isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center">
        <div className={`p-2 rounded-lg mr-3 ${colorClasses[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{label}</p>
          <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{value}</p>
        </div>
      </div>
    </div>
  );
}