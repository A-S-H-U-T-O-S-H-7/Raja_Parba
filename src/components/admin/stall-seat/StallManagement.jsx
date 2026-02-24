// components/admin/seats/StallManagement.jsx
"use client";
import { useState, useEffect, useMemo, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import useThemeStore from '@/lib/stores/useThemeStore';
import useAdminAuthStore from '@/lib/stores/useAdminAuthStore';
import { 
  Store,
  Lock,
  LockOpen,
  Eye,
  Filter,
  Grid3x3,
  List,
  Check,
  X,
  AlertCircle,
  Loader2,
  Map,
  Users,
  Calendar,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Info,
  Settings,
  PenTool,
  Shield,
  Clock,
  DollarSign,
  Square,
  CheckSquare
} from 'lucide-react';

// Constants
const DEFAULT_STALLS_COUNT = 70;
const DEFAULT_STALL_PRICE = 5000;
const GRID_COLUMNS = 14;

const STALL_STATUS = {
  AVAILABLE: 'available',
  BOOKED: 'booked',
  BLOCKED: 'blocked'
};

export default function StallManagement() {
  const { admin, hasPermission } = useAdminAuthStore();
  const { isDarkMode } = useThemeStore();
  
  // State management
  const [stallAvailability, setStallAvailability] = useState({});
  const [stallSettings, setStallSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedStalls, setSelectedStalls] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch stall settings
  useEffect(() => {
    const fetchStallSettings = async () => {
      try {
        const stallRef = doc(db, 'settings', 'stalls');
        const stallSnap = await getDoc(stallRef);
        
        if (stallSnap.exists()) {
          setStallSettings(stallSnap.data());
        } else {
          // Create default stalls
          const defaultStalls = Array.from({ length: DEFAULT_STALLS_COUNT }, (_, i) => ({
            id: `S${i + 1}`,
            name: `Stall S${i + 1}`,
            number: i + 1,
            size: '10x10 ft',
            price: DEFAULT_STALL_PRICE,
            isActive: true,
            row: Math.floor(i / GRID_COLUMNS) + 1,
            column: (i % GRID_COLUMNS) + 1
          }));

          const defaultSettings = {
            totalStalls: DEFAULT_STALLS_COUNT,
            defaultPrice: DEFAULT_STALL_PRICE,
            stalls: defaultStalls,
            eventDates: {
              startDate: '2025-11-15',
              endDate: '2025-11-20',
              isActive: true
            }
          };
          
          setStallSettings(defaultSettings);
          await setDoc(stallRef, defaultSettings);
        }
      } catch (error) {
        console.error('Error fetching stall settings:', error);
        toast.error('Failed to load stall settings');
      }
    };

    fetchStallSettings();
  }, []);

  // Real-time stall availability listener
  useEffect(() => {
    setLoading(true);
    
    const availabilityRef = doc(db, 'stallAvailability', 'current');
    
    const unsubscribe = onSnapshot(availabilityRef, (docSnap) => {
      try {
        if (docSnap.exists()) {
          setStallAvailability(docSnap.data().stalls || {});
        } else {
          setStallAvailability({});
        }
      } catch (error) {
        console.error('Error fetching stall availability:', error);
        toast.error('Failed to load stall availability');
      } finally {
        setLoading(false);
      }
    }, (error) => {
      console.error('Error listening to stall availability:', error);
      toast.error('Failed to load stall availability');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Generate all stalls from settings
  const allStalls = useMemo(() => {
    if (stallSettings?.stalls?.length > 0) {
      return stallSettings.stalls.map((stall, index) => ({
        ...stall,
        row: Math.floor(index / GRID_COLUMNS) + 1,
        column: (index % GRID_COLUMNS) + 1
      }));
    }
    
    return Array.from({ length: DEFAULT_STALLS_COUNT }, (_, i) => ({
      id: `S${i + 1}`,
      name: `Stall S${i + 1}`,
      number: i + 1,
      size: '10x10 ft',
      price: stallSettings?.defaultPrice || DEFAULT_STALL_PRICE,
      isActive: true,
      row: Math.floor(i / GRID_COLUMNS) + 1,
      column: (i % GRID_COLUMNS) + 1
    }));
  }, [stallSettings]);

  // Get stall status with details
  const getStallStatus = useCallback((stallId) => {
    const availability = stallAvailability[stallId];
    if (!availability) return STALL_STATUS.AVAILABLE;
    if (availability.blocked) return STALL_STATUS.BLOCKED;
    if (availability.booked) return STALL_STATUS.BOOKED;
    return STALL_STATUS.AVAILABLE;
  }, [stallAvailability]);

  // Get stall info with customer details
  const getStallInfo = useCallback((stallId) => {
    const availability = stallAvailability[stallId];
    if (!availability) return null;
    
    return {
      status: getStallStatus(stallId),
      bookedBy: availability.userId,
      customerName: availability.customerName || availability.vendorName,
      customerEmail: availability.customerEmail,
      customerPhone: availability.customerPhone,
      bookingId: availability.bookingId,
      bookedAt: availability.bookedAt?.toDate?.() || availability.bookedAt,
      bookedByAdmin: availability.bookedByAdmin,
      adminUserId: availability.adminUserId
    };
  }, [stallAvailability, getStallStatus]);

  // Filter stalls based on status and search
  const filteredStalls = useMemo(() => {
    return allStalls.filter(stall => {
      const status = getStallStatus(stall.id);
      const matchesStatus = filterStatus === 'all' || status === filterStatus;
      const matchesSearch = searchTerm === '' || 
        stall.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stall.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stall.number.toString().includes(searchTerm);
      
      return matchesStatus && matchesSearch;
    });
  }, [allStalls, getStallStatus, filterStatus, searchTerm]);

  // Get status counts
  const statusCounts = useMemo(() => {
    const counts = {
      [STALL_STATUS.AVAILABLE]: 0,
      [STALL_STATUS.BOOKED]: 0,
      [STALL_STATUS.BLOCKED]: 0
    };
    
    allStalls.forEach(stall => {
      counts[getStallStatus(stall.id)]++;
    });
    
    return counts;
  }, [allStalls, getStallStatus]);

  // Toggle stall selection
  const toggleStallSelection = useCallback((stallId) => {
    setSelectedStalls(prev => 
      prev.includes(stallId) 
        ? prev.filter(id => id !== stallId)
        : [...prev, stallId]
    );
  }, []);

  // Select all filtered stalls
  const selectAllFiltered = useCallback(() => {
    const eligibleStalls = filteredStalls
      .filter(stall => getStallStatus(stall.id) !== STALL_STATUS.BOOKED)
      .map(stall => stall.id);
    
    setSelectedStalls(eligibleStalls);
  }, [filteredStalls, getStallStatus]);

  // Clear all selections
  const clearSelection = useCallback(() => {
    setSelectedStalls([]);
  }, []);

  // Bulk action handler
  const handleBulkAction = useCallback(async (action) => {
    if (selectedStalls.length === 0) {
      toast.error('Please select stalls first');
      return;
    }

    // Filter eligible stalls
    const eligibleStalls = selectedStalls.filter(stallId => {
      const status = getStallStatus(stallId);
      if (status === STALL_STATUS.BOOKED) return false;
      if (action === 'block' && status === STALL_STATUS.BLOCKED) return false;
      if (action === 'unblock' && status !== STALL_STATUS.BLOCKED) return false;
      return true;
    });

    if (eligibleStalls.length === 0) {
      toast.error(`No eligible stalls to ${action}`);
      return;
    }

    setIsUpdating(true);
    try {
      const availabilityRef = doc(db, 'stallAvailability', 'current');
      const docSnap = await getDoc(availabilityRef);
      
      const currentData = docSnap.exists() ? docSnap.data() : {};
      const stalls = currentData.stalls || {};
      
      // Update each stall
      eligibleStalls.forEach(stallId => {
        if (action === 'block') {
          stalls[stallId] = {
            ...(stalls[stallId] || {}),
            blocked: true,
            blockedReason: 'Blocked by admin',
            blockedAt: new Date(),
            blockedBy: admin?.id,
            booked: false,
            userId: null,
            customerName: null,
            bookingId: null
          };
        } else if (action === 'unblock') {
          stalls[stallId] = {
            ...(stalls[stallId] || {}),
            blocked: false,
            blockedReason: null,
            blockedAt: null,
            booked: false,
            userId: null,
            customerName: null,
            bookingId: null
          };
        }
      });

      await setDoc(availabilityRef, {
        stalls,
        lastUpdated: new Date(),
        lastUpdatedBy: admin?.id
      }, { merge: true });
      
      // Update local state
      setStallAvailability(stalls);
      setSelectedStalls([]);
      
      toast.success(
        <div>
          <strong>{eligibleStalls.length} stalls {action}ed successfully</strong>
          <p className="text-xs mt-1">Action performed by {admin?.name || 'Admin'}</p>
        </div>
      );
    } catch (error) {
      console.error(`Error ${action}ing stalls:`, error);
      toast.error(`Failed to ${action} stalls. Please try again.`);
    } finally {
      setIsUpdating(false);
    }
  }, [selectedStalls, getStallStatus, admin, stallAvailability]);

  // Get stall card color based on status and selection
  const getStallColor = useCallback((stallId) => {
    const status = getStallStatus(stallId);
    const isSelected = selectedStalls.includes(stallId);
    
    if (isSelected) {
      return isDarkMode
        ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white ring-2 ring-blue-400 ring-offset-2 ring-offset-gray-900 shadow-xl scale-105 z-10'
        : 'bg-gradient-to-br from-blue-500 to-blue-600 text-white ring-2 ring-blue-300 ring-offset-2 ring-offset-white shadow-xl scale-105 z-10';
    }
    
    switch(status) {
      case STALL_STATUS.BOOKED:
        return isDarkMode
          ? 'bg-gradient-to-br from-gray-700 to-gray-800 text-gray-300 border border-gray-600 opacity-80 cursor-not-allowed'
          : 'bg-gradient-to-br from-gray-400 to-gray-500 text-white border border-gray-300 opacity-80 cursor-not-allowed';
      
      case STALL_STATUS.BLOCKED:
        return isDarkMode
          ? 'bg-gradient-to-br from-red-900/80 to-red-800/80 text-red-200 border border-red-700 cursor-not-allowed'
          : 'bg-gradient-to-br from-red-500 to-red-600 text-white border border-red-400 cursor-not-allowed';
      
      default:
        return isDarkMode
          ? 'bg-gradient-to-br from-emerald-700 to-emerald-600 text-emerald-100 hover:from-emerald-600 hover:to-emerald-500 border border-emerald-600 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200'
          : 'bg-gradient-to-br from-emerald-500 to-green-500 text-white hover:from-emerald-600 hover:to-green-600 border border-emerald-400 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200';
    }
  }, [getStallStatus, selectedStalls, isDarkMode]);

  // Render grid view
  const renderGridView = () => (
    <div className={`rounded-2xl shadow-xl border p-6 ${
      isDarkMode ? 'bg-gray-800/90 border-gray-700 backdrop-blur-sm' : 'bg-white/90 border-gray-200 backdrop-blur-sm'
    }`}>
      {/* Row labels */}
      <div className="flex mb-4">
        <div className="w-16 flex-shrink-0"></div>
        <div className="flex-1 grid grid-cols-14 gap-2">
          {Array.from({ length: GRID_COLUMNS }, (_, i) => (
            <div key={i} className={`text-center text-xs font-semibold ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Col {i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Stalls grid */}
      <div className="space-y-3">
        {Array.from({ length: Math.ceil(filteredStalls.length / GRID_COLUMNS) }, (_, rowIndex) => {
          const rowStalls = filteredStalls.slice(rowIndex * GRID_COLUMNS, (rowIndex + 1) * GRID_COLUMNS);
          
          return (
            <div key={rowIndex} className="flex items-center gap-4">
              <div className={`w-16 text-sm font-semibold ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Row {rowIndex + 1}
              </div>
              <div className="flex-1 grid grid-cols-14 gap-2">
                {rowStalls.map(stall => {
                  const status = getStallStatus(stall.id);
                  const info = getStallInfo(stall.id);
                  
                  return (
                    <button
                      key={stall.id}
                      onClick={() => toggleStallSelection(stall.id)}
                      disabled={status === STALL_STATUS.BOOKED}
                      className={`
                        relative group w-full aspect-square rounded-xl font-bold text-xs
                        flex flex-col items-center justify-center
                        ${getStallColor(stall.id)}
                        focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
                        ${isDarkMode ? 'focus:ring-offset-gray-900' : 'focus:ring-offset-white'}
                      `}
                      title={`${stall.id} - ${status}${info?.customerName ? `\nBooked by: ${info.customerName}` : ''}`}
                    >
                      <Store className="w-4 h-4 mb-0.5" />
                      <span>{stall.number}</span>
                      
                      {/* Status indicator */}
                      {status === STALL_STATUS.BLOCKED && (
                        <div className="absolute -top-1 -right-1">
                          <Lock className="w-3 h-3 text-red-300" />
                        </div>
                      )}
                      
                      {selectedStalls.includes(stall.id) && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs shadow-lg">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                      
                      {/* Hover tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                        {stall.id} - {status}
                        {info?.customerName && ` (${info.customerName})`}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // Render list view
  const renderListView = () => (
    <div className={`rounded-2xl shadow-xl border overflow-hidden ${
      isDarkMode ? 'bg-gray-800/90 border-gray-700 backdrop-blur-sm' : 'bg-white/90 border-gray-200 backdrop-blur-sm'
    }`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className={isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}>
            <tr>
              <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedStalls.length === filteredStalls.length && filteredStalls.length > 0}
                    onChange={(e) => e.target.checked ? selectAllFiltered() : clearSelection()}
                    className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                  />
                  <span>Select</span>
                </div>
              </th>
              <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Stall ID
              </th>
              <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Position
              </th>
              <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Status
              </th>
              <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Customer Info
              </th>
              <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Booking Details
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
            {filteredStalls.map(stall => {
              const status = getStallStatus(stall.id);
              const info = getStallInfo(stall.id);
              const isSelected = selectedStalls.includes(stall.id);
              
              return (
                <tr 
                  key={stall.id} 
                  className={`transition-all duration-200 ${
                    isSelected 
                      ? isDarkMode ? 'bg-purple-900/30' : 'bg-purple-50'
                      : isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleStallSelection(stall.id)}
                      disabled={status === STALL_STATUS.BOOKED}
                      className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500 disabled:opacity-50"
                    />
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    <div className="flex items-center gap-2">
                      <Store className="w-4 h-4 text-purple-500" />
                      {stall.id}
                    </div>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Row {stall.row}, Pos {stall.column}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      status === STALL_STATUS.AVAILABLE
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : status === STALL_STATUS.BOOKED
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {info?.customerName ? (
                      <div>
                        <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {info.customerName}
                        </div>
                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {info.customerEmail}
                        </div>
                        {info.customerPhone && (
                          <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            📞 {info.customerPhone}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className={isDarkMode ? 'text-gray-500' : 'text-gray-400'}>-</span>
                    )}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {info?.bookingId ? (
                      <div>
                        <div className="font-mono text-xs">{info.bookingId}</div>
                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {info.bookedAt ? new Date(info.bookedAt).toLocaleDateString() : ''}
                        </div>
                        {info.bookedByAdmin && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 mt-1">
                            Admin Booking
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className={isDarkMode ? 'text-gray-500' : 'text-gray-400'}>-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Store className="w-6 h-6 text-purple-600 animate-pulse" />
          </div>
        </div>
        <p className={`text-lg font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Loading stall map...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 p-8 shadow-2xl">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
              <Store className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Stall Management</h1>
              <p className="text-purple-100 text-lg mt-1">Manage stall availability, blocking, and view bookings</p>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Total Stalls</p>
                  <p className="text-2xl font-bold text-white">{allStalls.length}</p>
                </div>
                <Store className="w-8 h-8 text-white/50" />
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Available</p>
                  <p className="text-2xl font-bold text-green-300">{statusCounts[STALL_STATUS.AVAILABLE]}</p>
                </div>
                <Check className="w-8 h-8 text-green-300/50" />
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Booked</p>
                  <p className="text-2xl font-bold text-blue-300">{statusCounts[STALL_STATUS.BOOKED]}</p>
                </div>
                <Users className="w-8 h-8 text-blue-300/50" />
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Blocked</p>
                  <p className="text-2xl font-bold text-red-300">{statusCounts[STALL_STATUS.BLOCKED]}</p>
                </div>
                <Lock className="w-8 h-8 text-red-300/50" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Panel */}
      <div className={`rounded-2xl shadow-xl border p-6 ${
        isDarkMode ? 'bg-gray-800/90 border-gray-700 backdrop-blur-sm' : 'bg-white/90 border-gray-200 backdrop-blur-sm'
      }`}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Search */}
          <div className="lg:col-span-1">
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Search Stalls
              </div>
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ID, name or number..."
              className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>

          {/* View Mode */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                View Mode
              </div>
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all ${
                  viewMode === 'grid'
                    ? 'bg-purple-600 text-white border-purple-600 shadow-lg'
                    : isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Grid3x3 className="w-4 h-4" />
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all ${
                  viewMode === 'list'
                    ? 'bg-purple-600 text-white border-purple-600 shadow-lg'
                    : isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <List className="w-4 h-4" />
                List
              </button>
            </div>
          </div>

          {/* Filter Status */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filter Status
              </div>
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="all">All Stalls ({allStalls.length})</option>
              <option value={STALL_STATUS.AVAILABLE}>Available ({statusCounts[STALL_STATUS.AVAILABLE]})</option>
              <option value={STALL_STATUS.BOOKED}>Booked ({statusCounts[STALL_STATUS.BOOKED]})</option>
              <option value={STALL_STATUS.BLOCKED}>Blocked ({statusCounts[STALL_STATUS.BLOCKED]})</option>
            </select>
          </div>

          {/* Quick Actions */}
          <div className="flex items-end gap-2">
            <button
              onClick={selectAllFiltered}
              disabled={filteredStalls.length === 0}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border font-medium transition-all ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600' 
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              } ${filteredStalls.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <CheckSquare className="w-4 h-4" />
              Select All
            </button>
            <button
              onClick={clearSelection}
              disabled={selectedStalls.length === 0}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border font-medium transition-all ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600' 
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              } ${selectedStalls.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <X className="w-4 h-4" />
              Clear
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedStalls.length > 0 && (
          <div className={`mt-6 p-4 rounded-xl border-2 ${
            isDarkMode 
              ? 'bg-purple-900/20 border-purple-700/50' 
              : 'bg-purple-50 border-purple-200'
          }`}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  isDarkMode ? 'bg-purple-800/50' : 'bg-purple-100'
                }`}>
                  <CheckSquare className={`w-5 h-5 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                </div>
                <div>
                  <span className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {selectedStalls.length} stalls selected
                  </span>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {filteredStalls.length} stalls match current filter
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => handleBulkAction('block')}
                  disabled={isUpdating}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                >
                  {isUpdating ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Lock className="w-5 h-5" />
                  )}
                  Block Stalls
                </button>
                <button
                  onClick={() => handleBulkAction('unblock')}
                  disabled={isUpdating}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                >
                  {isUpdating ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <LockOpen className="w-5 h-5" />
                  )}
                  Unblock Stalls
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stall Display */}
      {viewMode === 'grid' ? renderGridView() : renderListView()}

      {/* Event Info Footer */}
      <div className={`rounded-xl border p-4 ${
        isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Calendar className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Event Dates: {stallSettings?.eventDates?.startDate || 'Nov 15'} - {stallSettings?.eventDates?.endDate || 'Nov 20, 2025'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Default Price: ₹{stallSettings?.defaultPrice?.toLocaleString() || DEFAULT_STALL_PRICE.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Last Updated: {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}