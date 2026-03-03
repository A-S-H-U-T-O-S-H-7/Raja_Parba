// components/admin/shared/ParticipationModal.jsx
"use client";
import { useState, useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, User, Mail, Calendar, Store, Loader2 } from 'lucide-react';
import useAdminAuthStore from '@/lib/stores/useAdminAuthStore';
import useThemeStore from '@/lib/stores/useThemeStore';
import { toast } from 'react-hot-toast';
import { markAsParticipated, undoParticipation, canUndoParticipation } from '@/services/participationService';
import adminLogger from '@/lib/adminLogger';

export default function ParticipationModal({
  isOpen,
  onClose,
  booking,
  bookingType,
  onSuccess
}) {
  const { isDarkMode } = useThemeStore();
  const { admin } = useAdminAuthStore();
  const adminUid = admin?.uid || admin?.id;
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSeatAttendance, setShowSeatAttendance] = useState(false);
  const [seatAttendanceData, setSeatAttendanceData] = useState({});
  const [loadingSeatData, setLoadingSeatData] = useState(false);
  const [loadingSeats, setLoadingSeats] = useState({});

  const isSuperAdmin = admin?.role === 'super_admin';

  // Helper function to format dates
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return null;
    
    try {
      let dateObj;
      
      if (timestamp.toDate && typeof timestamp.toDate === 'function') {
        dateObj = timestamp.toDate();
      } else if (timestamp.seconds) {
        dateObj = new Date(timestamp.seconds * 1000);
      } else if (timestamp instanceof Date) {
        dateObj = timestamp;
      } else if (typeof timestamp === 'string' || typeof timestamp === 'number') {
        dateObj = new Date(timestamp);
      } else {
        return null;
      }
      
      if (dateObj && !isNaN(dateObj.getTime())) {
        return dateObj.toLocaleString();
      }
      
      return null;
    } catch (error) {
      console.warn('Error formatting timestamp:', error);
      return null;
    }
  };

  // Check if booking type supports seat-level attendance
  const supportsSeatsAttendance = () => {
    return ['havan', 'show', 'stall'].includes(bookingType);
  };

  // Get the units array for this booking
  const getUnitsArray = () => {
    if (!booking) return [];
    
    try {
      switch (bookingType) {
        case 'havan':
          return booking?.seats || booking?.selectedSeats || [];
        case 'show':
          return booking?.showDetails?.selectedSeats || [];
        case 'stall':
          return booking?.stallIds || [];
        default:
          return [];
      }
    } catch (error) {
      console.error('Error getting units array:', error);
      return [];
    }
  };

  const unitsArray = getUnitsArray();
  const hasMultipleUnits = unitsArray.length > 1;

  // Load seat attendance data
  useEffect(() => {
    if (showSeatAttendance && supportsSeatsAttendance() && unitsArray.length > 0) {
      loadSeatAttendanceData();
    }
  }, [showSeatAttendance, booking?.id]);

  useEffect(() => {
    if (isOpen && supportsSeatsAttendance() && unitsArray.length > 0) {
      loadSeatAttendanceData();
    }
  }, [isOpen, booking?.id]);

  const loadSeatAttendanceData = async () => {
    if (!booking?.id || !supportsSeatsAttendance()) return;
    
    setLoadingSeatData(true);
    try {
      const { ensureSeatSubcollectionExists } = await import('@/services/participationService');
      const result = await ensureSeatSubcollectionExists(booking.id, bookingType, unitsArray);
      
      if (result.success && result.data) {
        const attendanceData = {};
        Object.keys(result.data.seats).forEach(unitId => {
          const seatData = result.data.seats[unitId];
          attendanceData[unitId] = {
            status: seatData.status || 'pending',
            updatedAt: seatData.updatedAt || seatData.checkedInAt,
            updatedBy: seatData.updatedBy || seatData.checkedInBy,
            notes: seatData.notes || ''
          };
        });
        setSeatAttendanceData(attendanceData);
      } else {
        const defaultData = {};
        unitsArray.forEach(unitId => {
          defaultData[unitId] = {
            status: 'pending',
            updatedAt: null,
            updatedBy: null,
            notes: ''
          };
        });
        setSeatAttendanceData(defaultData);
      }
    } catch (error) {
      console.error('Error loading seat attendance data:', error);
      toast.error('Failed to load seat attendance data');
      
      const defaultData = {};
      unitsArray.forEach(unitId => {
        defaultData[unitId] = {
          status: 'pending',
          updatedAt: null,
          updatedBy: null,
          notes: ''
        };
      });
      setSeatAttendanceData(defaultData);
    } finally {
      setLoadingSeatData(false);
    }
  };

  const handleSeatAttendanceChange = async (unitId, status) => {
    if (!adminUid) {
      toast.error('Admin not authenticated');
      return;
    }

    setLoadingSeats(prev => ({ ...prev, [unitId]: true }));
    
    try {
      const { markSeatAttendance } = await import('@/services/participationService');
      const result = await markSeatAttendance(booking.id, bookingType, unitId, status, adminUid);
      
      if (result.success) {
        try {
          await adminLogger.logSeatActivity(
            admin,
            'update',
            `${booking.id}-${unitId}`,
            `Updated ${bookingType === 'stall' ? 'stall' : 'seat'} ${unitId} attendance to '${status}'`
          );
        } catch (logError) {
          console.error('Failed to log seat attendance activity:', logError);
        }
        
        setSeatAttendanceData(prev => ({
          ...prev,
          [unitId]: {
            ...prev[unitId],
            status,
            updatedAt: new Date(),
            updatedBy: adminUid
          }
        }));
        
        const updatedData = { ...seatAttendanceData };
        updatedData[unitId] = { ...updatedData[unitId], status };
        
        const allPresent = Object.values(updatedData).every(data => data.status === 'present');
        
        if (allPresent && !booking.participated) {
          toast.success('All seats present - marking booking as participated!');
          setTimeout(() => handleMarkParticipated(), 1000);
        } else {
          toast.success(`${bookingType === 'stall' ? 'Stall' : 'Seat'} ${unitId} marked as ${status}`);
        }
      } else {
        toast.error(result.message || 'Failed to update attendance');
      }
    } catch (error) {
      console.error('Error updating seat attendance:', error);
      toast.error('Failed to update attendance');
    } finally {
      setLoadingSeats(prev => ({ ...prev, [unitId]: false }));
    }
  };

  const handleBulkAttendance = async (status) => {
    if (!adminUid) {
      toast.error('Admin not authenticated');
      return;
    }

    if (status === 'pending' && !isSuperAdmin) {
      toast.error('Only super admin can reset seat attendance');
      return;
    }
    
    try {
      const { markMultipleSeatsAttendance } = await import('@/services/participationService');
      const unitUpdates = unitsArray.map(unitId => ({
        unitId,
        status,
        notes: ''
      }));
      
      const result = await markMultipleSeatsAttendance(
        booking.id, 
        bookingType, 
        unitUpdates, 
        adminUid
      );
      
      if (result.success) {
        try {
          await adminLogger.logSeatActivity(
            admin,
            'update',
            `${booking.id}-bulk`,
            `Bulk updated all ${bookingType === 'stall' ? 'stalls' : 'seats'} attendance to '${status}'`
          );
        } catch (logError) {
          console.error('Failed to log bulk attendance activity:', logError);
        }
        
        const updatedData = {};
        unitsArray.forEach(unitId => {
          updatedData[unitId] = {
            status,
            updatedAt: new Date(),
            updatedBy: adminUid
          };
        });
        setSeatAttendanceData(updatedData);
        
        if (status === 'present' && !booking.participated) {
          toast.success('All seats marked as present - marking booking as participated!');
          setTimeout(() => handleMarkParticipated(), 1000);
        } else {
          toast.success(`All ${bookingType === 'stall' ? 'stalls' : 'seats'} marked as ${status}`);
        }
      } else {
        toast.error(result.message || 'Failed to bulk update attendance');
      }
    } catch (error) {
      console.error('Error bulk updating attendance:', error);
      toast.error('Failed to bulk update attendance');
    }
  };

  const handleMarkParticipated = async () => {
    if (!adminUid) {
      toast.error('Admin not authenticated');
      return;
    }

    setIsProcessing(true);
    try {
      if (supportsSeatsAttendance() && unitsArray.length > 0) {
        try {
          const { markMultipleSeatsAttendance } = await import('@/services/participationService');
          const unitUpdates = unitsArray.map(unitId => ({
            unitId,
            status: 'present',
            notes: ''
          }));
          
          await markMultipleSeatsAttendance(
            booking.id, 
            bookingType, 
            unitUpdates, 
            adminUid
          );
          
          const updatedData = {};
          unitsArray.forEach(unitId => {
            updatedData[unitId] = {
              status: 'present',
              updatedAt: new Date(),
              updatedBy: adminUid
            };
          });
          setSeatAttendanceData(updatedData);
        } catch (seatError) {
          console.warn('Failed to mark seats as present:', seatError);
        }
      }
      
      const result = await markAsParticipated(booking.id, bookingType, adminUid);
      
      if (result.success) {
        try {
          await adminLogger.logBookingActivity(
            admin,
            'update',
            booking.id,
            `Marked ${bookingType} booking as participated`
          );
        } catch (logError) {
          console.error('Failed to log participation activity:', logError);
        }
        
        toast.success('✅ Marked as participated successfully!');
        onSuccess(booking.id);
        onClose();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error marking participation:', error);
      toast.error('Failed to mark participation');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUndoParticipation = async () => {
    if (!isSuperAdmin) {
      toast.error('Only super admin can undo participation');
      return;
    }

    if (!adminUid) {
      toast.error('Admin not authenticated');
      return;
    }

    setIsProcessing(true);
    try {
      if (supportsSeatsAttendance() && unitsArray.length > 0) {
        try {
          const { markMultipleSeatsAttendance } = await import('@/services/participationService');
          const unitUpdates = unitsArray.map(unitId => ({
            unitId,
            status: 'pending',
            notes: ''
          }));
          
          await markMultipleSeatsAttendance(
            booking.id, 
            bookingType, 
            unitUpdates, 
            adminUid
          );
          
          const updatedData = {};
          unitsArray.forEach(unitId => {
            updatedData[unitId] = {
              status: 'pending',
              updatedAt: new Date(),
              updatedBy: adminUid
            };
          });
          setSeatAttendanceData(updatedData);
        } catch (seatError) {
          console.warn('Failed to reset seat attendance:', seatError);
        }
      }
      
      const result = await undoParticipation(booking.id, bookingType, adminUid);
      
      if (result.success) {
        try {
          await adminLogger.logBookingActivity(
            admin,
            'update',
            booking.id,
            `Undid participation for ${bookingType} booking`
          );
        } catch (logError) {
          console.error('Failed to log undo participation activity:', logError);
        }
        
        toast.success('✅ Participation undone successfully!');
        
        if (supportsSeatsAttendance() && unitsArray.length > 0) {
          await loadSeatAttendanceData();
        }
        
        onSuccess(booking.id);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error undoing participation:', error);
      toast.error('Failed to undo participation');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderBookingDetails = () => {
    const getDetailsConfig = () => {
      switch (bookingType) {
        case 'stall':
          return {
            name: booking.vendorDetails?.name || 'N/A',
            email: booking.vendorDetails?.email || 'N/A',
            extra: booking.vendorDetails?.businessType || 'N/A',
            extraLabel: 'Business Type',
            units: booking.stallIds?.join(', ') || 'N/A',
            unitsLabel: 'Stalls',
            extraClass: 'bg-purple-50 text-purple-700'
          };
        
        case 'show':
          return {
            name: booking.userDetails?.name || 'N/A',
            email: booking.userDetails?.email || 'N/A',
            date: (() => {
              try {
                if (booking.showDetails?.date) {
                  const showDate = booking.showDetails.date;
                  let dateObj;
                  
                  if (showDate.toDate && typeof showDate.toDate === 'function') {
                    dateObj = showDate.toDate();
                  } else if (showDate.seconds) {
                    dateObj = new Date(showDate.seconds * 1000);
                  } else if (typeof showDate === 'string') {
                    dateObj = new Date(showDate);
                  } else {
                    return 'N/A';
                  }
                  
                  if (dateObj && !isNaN(dateObj.getTime())) {
                    return dateObj.toLocaleDateString();
                  }
                }
                return 'N/A';
              } catch {
                return 'N/A';
              }
            })(),
            units: booking.showDetails?.selectedSeats?.join(', ') || 'N/A',
            unitsLabel: 'Seats'
          };
        
        case 'havan':
          return {
            name: booking.customerDetails?.name || 'N/A',
            email: booking.customerDetails?.email || 'N/A',
            date: booking.eventDate ? new Date(booking.eventDate.seconds * 1000).toLocaleDateString() : 'N/A',
            extra: booking.shift || 'N/A',
            extraLabel: 'Shift',
            units: booking.seats?.join(', ') || 'N/A',
            unitsLabel: 'Seats',
            extraClass: 'bg-blue-50 text-blue-700'
          };

        case 'delegate':
          return {
            name: booking.delegateDetails?.name || 'N/A',
            email: booking.delegateDetails?.email || 'N/A',
            extra: booking.eventDetails?.delegateType || booking.category || 'Entry Pass',
            extraLabel: 'Category',
            units: '',
            unitsLabel: ''
          };
        
        default:
          return null;
      }
    };

    const config = getDetailsConfig();
    if (!config) return <div>Booking details not available</div>;

    return (
      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Name</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white truncate">{config.name}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Email</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white truncate flex items-center">
              <Mail className="w-3 h-3 mr-1" />
              {config.email}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {config.date && (
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Event Date</span>
              <div className="bg-blue-100 px-3 py-2 rounded-lg border-l-4 border-blue-500">
                <span className="text-sm font-bold text-blue-900 flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {config.date}
                </span>
              </div>
            </div>
          )}
          {config.extra && (
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{config.extraLabel}</span>
              <span className={`text-sm font-medium px-2 py-1 rounded-md inline-block w-fit ${config.extraClass || 'bg-gray-100 text-gray-700'}`}>
                {config.extra}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Booking ID</span>
          <div className="bg-yellow-100 px-3 py-2 rounded-lg border-l-4 border-yellow-500">
            <span className="text-sm font-bold font-mono text-yellow-900">🏷️ {booking.id}</span>
          </div>
        </div>

        {config.units && config.unitsLabel && (
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{config.unitsLabel}</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {config.units.split(', ').filter(u => u && u !== 'N/A').map((unit, index) => (
                <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
                  <Store className="w-3 h-3 mr-1" />
                  {unit}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`rounded-xl shadow-2xl w-full max-w-xl max-h-[95vh] overflow-y-auto border ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
      }`}>
        <div className="p-4 sm:p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <h3 className={`text-lg sm:text-xl font-bold leading-tight ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {booking.participated ? '📊 Participation Status' : '✅ Mark Participation'}
              </h3>
              <p className={`text-xs sm:text-sm mt-1 font-medium truncate ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {bookingType.charAt(0).toUpperCase() + bookingType.slice(1)} Booking
              </p>
            </div>
            <button
              onClick={onClose}
              className={`p-1 rounded-full transition-colors ${
                isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Participation Status */}
          {booking.participated && (
            <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-400 rounded-lg dark:bg-green-900/20 dark:border-green-600">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div className="ml-2 flex-1 min-w-0">
                  <p className="text-sm font-semibold text-green-800 dark:text-green-400">
                    ✅ Already Participated
                  </p>
                  {booking.participatedAt && (
                    <div className="bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-md mt-2">
                      <p className="text-xs text-green-800 dark:text-green-400 font-bold">
                        📅 Participated on: {formatTimestamp(booking.participatedAt)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Booking Details */}
          <div className="mb-4">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
              Booking Details
            </h4>
            <div className={`p-3 rounded-lg border ${
              isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
            }`}>
              {renderBookingDetails()}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mb-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all border border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
              disabled={isProcessing}
            >
              Cancel
            </button>
            
            {!booking.participated ? (
              <button
                onClick={handleMarkParticipated}
                disabled={isProcessing}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark Participated
                  </>
                )}
              </button>
            ) : (
              isSuperAdmin && (
                <button
                  onClick={handleUndoParticipation}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Undo Participation
                    </>
                  )}
                </button>
              )
            )}
          </div>

          {/* Seat Attendance Tracking */}
          {supportsSeatsAttendance() && hasMultipleUnits && (
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <button
                onClick={() => setShowSeatAttendance(!showSeatAttendance)}
                className="w-full px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 hover:from-gray-100 hover:to-gray-150 dark:hover:from-gray-700 dark:hover:to-gray-600 text-left flex items-center justify-between transition-all"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 dark:text-white flex items-center">
                    <span className="mr-2">
                      {bookingType === 'stall' ? '🏪' : '🪑'}
                    </span>
                    Per-{bookingType === 'stall' ? 'Stall' : 'Seat'} Attendance
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-medium mt-1">
                    {unitsArray.length} {bookingType === 'stall' ? 'stalls' : 'seats'}
                  </p>
                </div>
                <div className={`ml-2 transform transition-transform ${showSeatAttendance ? 'rotate-180' : ''}`}>
                  <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </button>
              
              {showSeatAttendance && (
                <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                  {loadingSeatData ? (
                    <div className="flex justify-center items-center py-4">
                      <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                      <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Loading...</span>
                    </div>
                  ) : (
                    <>
                      <div className="mb-4 flex flex-wrap gap-2">
                        <button
                          onClick={() => handleBulkAttendance('present')}
                          className="px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-800 rounded-md text-xs font-semibold border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700"
                        >
                          ✅ All Present
                        </button>
                        {isSuperAdmin && (
                          <button
                            onClick={() => handleBulkAttendance('pending')}
                            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md text-xs font-semibold border border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                          >
                            🔄 Reset All
                          </button>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        {unitsArray.map(unitId => {
                          const attendanceData = seatAttendanceData[unitId] || { status: 'pending' };
                          const statusColors = {
                            present: 'bg-green-50 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700',
                            absent: 'bg-red-50 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700',
                            pending: 'bg-gray-50 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600'
                          };
                          
                          return (
                            <div key={unitId} className={`p-3 rounded-lg border ${
                              isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                            }`}>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-bold text-gray-900 dark:text-white">
                                  {bookingType === 'stall' ? '🏪' : '🪑'} {unitId}
                                </span>
                                <button
                                  onClick={() => handleSeatAttendanceChange(unitId, 'present')}
                                  disabled={loadingSeats[unitId]}
                                  className={`px-3 py-1.5 text-xs rounded-md font-semibold flex items-center ${
                                    attendanceData.status === 'present'
                                      ? 'bg-green-600 text-white'
                                      : 'bg-white hover:bg-green-50 text-gray-700 border border-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500 dark:hover:bg-gray-500'
                                  } ${loadingSeats[unitId] ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                  {loadingSeats[unitId] ? (
                                    <>
                                      <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                      Loading
                                    </>
                                  ) : (
                                    attendanceData.status === 'present' ? '✅ Present' : '✅ Mark Present'
                                  )}
                                </button>
                              </div>
                              
                              <div className="flex items-center justify-between text-xs">
                                <span className={`px-2 py-1 rounded-full border capitalize font-medium ${statusColors[attendanceData.status]}`}>
                                  {attendanceData.status === 'present' && '✅ '}
                                  {attendanceData.status === 'absent' && '❌ '}
                                  {attendanceData.status === 'pending' && '⏳ '}
                                  {attendanceData.status}
                                </span>
                                {attendanceData.updatedAt && (
                                  <span className="text-green-600 dark:text-green-400 font-medium">
                                    {formatTimestamp(attendanceData.updatedAt)}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
