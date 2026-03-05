// stores/admin/useDonationStore.js
import { create } from 'zustand';
import { db } from '@/lib/firebase/config';
import { 
  collection, 
  query, 
  orderBy, 
  getDocs, 
  doc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { format, isWithinInterval, subDays, startOfDay } from 'date-fns';

const useDonationStore = create((set, get) => ({
  // State
  donations: [],
  filteredDonations: [],
  loading: true,
  searchTerm: '',
  statusFilter: 'all',
  dateFilter: 'all',
  currentPage: 1,
  itemsPerPage: 10,
  selectedDonation: null,
  modals: {
    details: false,
    document: false
  },

  // Load donations from Firebase
  loadDonations: async () => {
    set({ loading: true });
    try {
      const donationsRef = collection(db, 'donations');
      const donationsQuery = query(donationsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(donationsQuery);
      
      const donationsData = snapshot.docs.map(doc => {
        const data = doc.data();
        let createdAt = data.createdAt;
        
        // Convert Firestore Timestamp to Date if needed
        if (createdAt && typeof createdAt.toDate === 'function') {
          createdAt = createdAt.toDate();
        } else if (typeof createdAt === 'string') {
          createdAt = new Date(createdAt);
        }
        
        return {
          id: doc.id,
          ...data,
          createdAt: createdAt || new Date()
        };
      });

      set({ donations: donationsData });
      get().applyFilters();
    } catch (error) {
      console.error('Error loading donations:', error);
      toast.error('Failed to load donations');
    } finally {
      set({ loading: false });
    }
  },

  // Apply filters
  applyFilters: () => {
    const { donations, searchTerm, statusFilter, dateFilter } = get();
    
    const filtered = donations.filter(donation => {
      // Search filter
      const matchesSearch = !searchTerm || 
        donation.donorDetails?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donation.donorDetails?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donation.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donation.donationId?.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter
      const matchesStatus = statusFilter === 'all' || donation.status === statusFilter;

      // Date filter
      const matchesDate = dateFilter === 'all' || (() => {
        const donationDate = donation.createdAt;
        if (!donationDate) return false;
        
        const now = new Date();
        const today = startOfDay(now);
        
        switch (dateFilter) {
          case 'today':
            return format(donationDate, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd');
          case 'week':
            return isWithinInterval(donationDate, {
              start: subDays(today, 7),
              end: now
            });
          case 'month':
            return isWithinInterval(donationDate, {
              start: subDays(today, 30),
              end: now
            });
          default:
            return true;
        }
      })();

      return matchesSearch && matchesStatus && matchesDate;
    });

    set({ 
      filteredDonations: filtered,
      currentPage: 1 // Reset to first page when filters change
    });
  },

  // Set search term
  setSearchTerm: (term) => {
    set({ searchTerm: term });
    get().applyFilters();
  },

  // Set status filter
  setStatusFilter: (filter) => {
    set({ statusFilter: filter });
    get().applyFilters();
  },

  // Set date filter
  setDateFilter: (filter) => {
    set({ dateFilter: filter });
    get().applyFilters();
  },

  // Set current page
  setCurrentPage: (page) => set({ currentPage: page }),

  // Get paginated items
  getPaginatedItems: () => {
    const { filteredDonations, currentPage, itemsPerPage } = get();
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredDonations.slice(start, end);
  },

  // Get total pages
  getTotalPages: () => {
    const { filteredDonations, itemsPerPage } = get();
    return Math.ceil(filteredDonations.length / itemsPerPage);
  },

  // Update donation status
  updateDonationStatus: async (donationId, newStatus) => {
    set({ updating: true });
    
    try {
      const donationRef = doc(db, 'donations', donationId);
      await updateDoc(donationRef, {
        status: newStatus,
        updatedAt: serverTimestamp(),
        ...(newStatus === 'confirmed' && { confirmedAt: serverTimestamp() })
      });

      // Update local state
      set(state => ({
        donations: state.donations.map(d => 
          d.id === donationId ? { ...d, status: newStatus } : d
        )
      }));
      
      get().applyFilters();
      toast.success(`Donation status updated to ${newStatus}`);
      
      return { success: true };
    } catch (error) {
      console.error('Error updating donation status:', error);
      toast.error('Failed to update donation status');
      return { success: false };
    } finally {
      set({ updating: false });
    }
  },

  // Export to CSV
  exportToCSV: () => {
    const { filteredDonations } = get();
    
    const headers = [
      'Donation ID',
      'Donor Name',
      'Email',
      'Mobile',
      'Amount (₹)',
      'Status',
      'Donor Type',
      'City',
      'State',
      'Country',
      'Payment Gateway',
      'Tax Exemption',
      'Created Date',
      'Tracking ID'
    ];

    const csvData = filteredDonations.map(donation => [
      donation.donationId || donation.id || '',
      donation.donorDetails?.name || '',
      donation.donorDetails?.email || '',
      donation.donorDetails?.mobile || '',
      donation.amount || 0,
      donation.status || '',
      donation.donorType || '',
      donation.donorDetails?.city || '',
      donation.donorDetails?.state || '',
      donation.donorDetails?.country || '',
      donation.paymentGateway || '',
      donation.taxExemption?.eligible ? 'Yes' : 'No',
      donation.createdAt ? format(donation.createdAt, 'yyyy-MM-dd HH:mm:ss') : '',
      donation.paymentDetails?.tracking_id || donation.paymentDetails?.bank_ref_no || ''
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `donations_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast.success('Donations exported to CSV successfully!');
  },

  // Modal controls
  openModal: (modalName, donation = null) => {
    set({ 
      selectedDonation: donation,
      modals: { ...get().modals, [modalName]: true }
    });
  },

  closeModal: (modalName) => {
    set({ 
      modals: { ...get().modals, [modalName]: false },
      selectedDonation: modalName === 'details' ? null : get().selectedDonation
    });
  },

  // Get status badge config
  getStatusConfig: (status) => {
    const config = {
      'confirmed': { 
        color: 'bg-green-100 text-green-800 border-green-200', 
        icon: 'CheckCircle', 
        label: 'Confirmed' 
      },
      'completed': { 
        color: 'bg-green-100 text-green-800 border-green-200', 
        icon: 'CheckCircle', 
        label: 'Completed' 
      },
      'pending_payment': { 
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
        icon: 'Clock', 
        label: 'Pending' 
      },
      'failed': { 
        color: 'bg-red-100 text-red-800 border-red-200', 
        icon: 'XCircle', 
        label: 'Failed' 
      },
      'cancelled': { 
        color: 'bg-gray-100 text-gray-800 border-gray-200', 
        icon: 'XCircle', 
        label: 'Cancelled' 
      }
    };
    return config[status] || config['pending_payment'];
  },

  // Reset
  reset: () => set({
    donations: [],
    filteredDonations: [],
    loading: true,
    searchTerm: '',
    statusFilter: 'all',
    dateFilter: 'all',
    currentPage: 1,
    itemsPerPage: 10,
    selectedDonation: null,
    modals: {
      details: false,
      document: false
    }
  })
}));

export default useDonationStore;
