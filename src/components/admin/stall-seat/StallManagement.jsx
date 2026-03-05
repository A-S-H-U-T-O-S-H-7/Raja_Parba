// components/admin/seats/StallManagement.jsx
"use client";
import { useState, useEffect, useMemo, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { doc, setDoc, onSnapshot, getDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import useThemeStore from '@/lib/stores/useThemeStore';
import useAdminAuthStore from '@/lib/stores/useAdminAuthStore';
import { 
  Store,
  Check,
  X,
  Loader2
} from 'lucide-react';
import StallHeader from './StallHeader';
import StallControls from './StallControls';
import StallDisplay from './StallDisplay';

// Constants
const DEFAULT_STALLS_COUNT = 70;
const DEFAULT_STALL_PRICE = 5000;
const GRID_COLUMNS = 14;

export const STALL_STATUS = {
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
    const stallRef = doc(db, 'settings', 'stalls');
    const unsubscribe = onSnapshot(
      stallRef,
      async (stallSnap) => {
        try {
          if (stallSnap.exists()) {
            setStallSettings(stallSnap.data());
            return;
          }

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
        } catch (error) {
          console.error('Error fetching stall settings:', error);
          toast.error('Failed to load stall settings');
        }
      },
      (error) => {
        console.error('Error listening to stall settings:', error);
        toast.error('Failed to load stall settings');
      }
    );

    return () => unsubscribe();
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
    const totalStalls = Number(stallSettings?.totalStalls) || DEFAULT_STALLS_COUNT;
    const configuredStallsMap = new Map(
      (stallSettings?.stalls || []).map((stall) => [stall.id, stall])
    );

    return Array.from({ length: totalStalls }, (_, i) => {
      const id = `S${i + 1}`;
      const configured = configuredStallsMap.get(id);
      return {
        id,
        name: configured?.name || `Stall ${id}`,
        number: i + 1,
        size: configured?.size || '10x10 ft',
        price: Number(configured?.price) || Number(stallSettings?.defaultPrice) || DEFAULT_STALL_PRICE,
        isActive: configured?.isActive !== false,
        row: Math.floor(i / GRID_COLUMNS) + 1,
        column: (i % GRID_COLUMNS) + 1
      };
    }).filter((stall) => stall.isActive !== false);
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
      
      setStallAvailability(stalls);
      setSelectedStalls([]);
      
      toast.success(`${eligibleStalls.length} stalls ${action}ed successfully`);
    } catch (error) {
      console.error(`Error ${action}ing stalls:`, error);
      toast.error(`Failed to ${action} stalls. Please try again.`);
    } finally {
      setIsUpdating(false);
    }
  }, [selectedStalls, getStallStatus, admin]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Store className="w-6 h-6 text-indigo-600 animate-pulse" />
          </div>
        </div>
        <p className={`text-lg font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Loading stall map...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <StallHeader 
        allStalls={allStalls}
        statusCounts={statusCounts}
        stallSettings={stallSettings}
      />

      <StallControls
        viewMode={viewMode}
        setViewMode={setViewMode}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedStalls={selectedStalls}
        filteredStalls={filteredStalls}
        allStalls={allStalls}
        statusCounts={statusCounts}
        STALL_STATUS={STALL_STATUS}
        onSelectAll={selectAllFiltered}
        onClearSelection={clearSelection}
        onBulkAction={handleBulkAction}
        isUpdating={isUpdating}
      />

      <StallDisplay
        viewMode={viewMode}
        filteredStalls={filteredStalls}
        selectedStalls={selectedStalls}
        getStallStatus={getStallStatus}
        getStallInfo={getStallInfo}
        onToggleSelection={toggleStallSelection}
        STALL_STATUS={STALL_STATUS}
        GRID_COLUMNS={GRID_COLUMNS}
      />
    </div>
  );
}