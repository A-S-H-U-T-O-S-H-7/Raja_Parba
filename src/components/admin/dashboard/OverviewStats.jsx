// components/admin/dashboard/OverviewStats.jsx
"use client";
import { useState, useEffect, useCallback, useMemo } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, orderBy, limit, Timestamp } from 'firebase/firestore';
import { format, startOfDay, endOfDay, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import Link from 'next/link';
import useThemeStore from '@/lib/stores/useThemeStore';
import { 
  IndianRupee,
  Users,
  Calendar,
  Store,
  Eye,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Loader2
} from 'lucide-react';

// Constants
const BOOKING_COLLECTIONS = [
  { name: 'stallBookings', type: 'stall' },
  { name: 'showBookings', type: 'show' }
];

const STATUS_COLORS = {
  confirmed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  refunded: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
};

// Utility functions
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount || 0);
};

const extractAmount = (booking) => {
  // Try multiple possible amount field paths
  const amount = booking.payment?.amount || 
                booking.totalAmount || 
                booking.amount || 
                booking.total ||
                booking.paymentDetails?.amount ||
                0;
  return parseFloat(amount) || 0;
};

const extractCustomerName = (booking) => {
  return booking.customerDetails?.name || 
         booking.customerName || 
         booking.name || 
         'N/A';
};

const extractItemCount = (booking, type) => {
  switch(type) {
    case 'stall':
      return booking.stalls?.length || 
             booking.stallNumbers?.length || 
             0;
    case 'show':
      return booking.seatNumbers?.length || 
             booking.tickets?.length || 
             booking.ticketCount || 
             0;
    default:
      return booking.quantity || 0;
  }
};

export default function OverviewStats() {
  const { isDarkMode } = useThemeStore();
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    todayBookings: 0,
    totalUsers: new Set(), 
    occupancyRate: 0,
    pendingCancellations: 0,
    bookingTypes: {
      stall: { total: 0, confirmed: 0, revenue: 0, today: 0 },
      show: { total: 0, confirmed: 0, revenue: 0, today: 0 }
    },
    growth: { revenue: 0, bookings: 0 }
  });
  
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('today');

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const now = new Date();
      const todayStart = startOfDay(now);
      const todayEnd = endOfDay(now);
      const lastMonthStart = startOfMonth(subMonths(now, 1));
      const lastMonthEnd = endOfMonth(subMonths(now, 1));

      // Initialize stats object
      const newStats = {
        totalRevenue: 0,
        totalBookings: 0,
        todayBookings: 0,
        totalUsers: new Set(),
        pendingCancellations: 0,
        bookingTypes: {
          stall: { total: 0, confirmed: 0, revenue: 0, today: 0 },
          show: { total: 0, confirmed: 0, revenue: 0, today: 0 }
        },
        previousMonth: { revenue: 0, bookings: 0 }
      };

      const recentBookingsList = [];

      // Fetch data from all booking collections in parallel
      await Promise.all(BOOKING_COLLECTIONS.map(async ({ name, type }) => {
        try {
          const collectionRef = collection(db, name);
          const snapshot = await getDocs(collectionRef);
          
          snapshot.forEach(doc => {
            const booking = doc.data();
            const typeStats = newStats.bookingTypes[type];
            
            // Count total
            typeStats.total++;
            newStats.totalBookings++;

            // Track unique users by email
            if (booking.customerDetails?.email) {
              newStats.totalUsers.add(booking.customerDetails.email);
            }

            // Check if confirmed/completed
            if (booking.status === 'confirmed' || booking.status === 'completed') {
              typeStats.confirmed++;
              const amount = extractAmount(booking);
              typeStats.revenue += amount;
              newStats.totalRevenue += amount;
            }

            // Check if today's booking
            if (booking.createdAt) {
              const createdDate = booking.createdAt.toDate?.() || new Date(booking.createdAt);
              if (createdDate >= todayStart && createdDate <= todayEnd) {
                typeStats.today++;
                newStats.todayBookings++;
              }

              // Check if previous month (for growth calculation)
              if (createdDate >= lastMonthStart && createdDate <= lastMonthEnd) {
                if (booking.status === 'confirmed' || booking.status === 'completed') {
                  newStats.previousMonth.bookings++;
                  newStats.previousMonth.revenue += extractAmount(booking);
                }
              }
            }

            // Check for pending cancellations
            if (booking.cancellationStatus === 'pending' || 
                booking.status === 'cancellation_requested') {
              newStats.pendingCancellations++;
            }

            // Add to recent bookings list
            if (recentBookingsList.length < 10) {
              recentBookingsList.push({
                id: doc.id,
                type,
                ...booking,
                createdAt: booking.createdAt?.toDate?.() || new Date(booking.createdAt)
              });
            }
          });
        } catch (err) {
          console.warn(`Error fetching ${name}:`, err);
        }
      }));

      // Calculate occupancy rate (example calculation)
      const totalSeats = 500; // You should calculate this dynamically
      const bookedSeats = newStats.bookingTypes.show.confirmed;
      newStats.occupancyRate = Math.round((bookedSeats / totalSeats) * 100) || 0;

      // Calculate growth
      const currentMonthRevenue = newStats.totalRevenue;
      const currentMonthBookings = newStats.totalBookings;
      
      newStats.growth = {
        revenue: newStats.previousMonth.revenue > 0 
          ? ((currentMonthRevenue - newStats.previousMonth.revenue) / newStats.previousMonth.revenue * 100).toFixed(1)
          : 0,
        bookings: newStats.previousMonth.bookings > 0
          ? ((currentMonthBookings - newStats.previousMonth.bookings) / newStats.previousMonth.bookings * 100).toFixed(1)
          : 0
      };

      // Sort recent bookings by date
      recentBookingsList.sort((a, b) => b.createdAt - a.createdAt);
      
      setStats(newStats);
      setRecentBookings(recentBookingsList.slice(0, 5));
      
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData, timeRange]);

  // Memoized summary cards
  const summaryCards = useMemo(() => [
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      change: stats.growth.revenue,
      icon: IndianRupee,
      color: 'green',
      bgColor: isDarkMode ? 'bg-green-900/20' : 'bg-green-100',
      textColor: isDarkMode ? 'text-green-400' : 'text-green-600'
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings.toString(),
      change: stats.growth.bookings,
      icon: Calendar,
      color: 'blue',
      bgColor: isDarkMode ? 'bg-blue-900/20' : 'bg-blue-100',
      textColor: isDarkMode ? 'text-blue-400' : 'text-blue-600'
    },
    {
      title: 'Today\'s Bookings',
      value: stats.todayBookings.toString(),
      change: `Active`,
      icon: Clock,
      color: 'purple',
      bgColor: isDarkMode ? 'bg-purple-900/20' : 'bg-purple-100',
      textColor: isDarkMode ? 'text-purple-400' : 'text-purple-600'
    },
    {
      title: 'Total Users',
value: (stats.totalUsers?.size?.toString()) || '0',
      change: 'Registered',
      icon: Users,
      color: 'indigo',
      bgColor: isDarkMode ? 'bg-indigo-900/20' : 'bg-indigo-100',
      textColor: isDarkMode ? 'text-indigo-400' : 'text-indigo-600'
    }
  ], [stats, isDarkMode]);

  // Booking type cards
  const bookingTypeCards = useMemo(() => [
    {
      type: 'stall',
      title: 'Stall Bookings',
      icon: Store,
      color: 'amber',
      stats: stats.bookingTypes.stall
    },
    {
      type: 'show',
      title: 'Show Bookings',
      icon: Eye,
      color: 'pink',
      stats: stats.bookingTypes.show
    }
  ], [stats]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className={`w-8 h-8 animate-spin ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <div className={`rounded-xl border p-4 ${
          isDarkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center">
            <AlertCircle className={`w-5 h-5 mr-2 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`} />
            <p className={`text-sm font-medium ${isDarkMode ? 'text-red-200' : 'text-red-700'}`}>
              {error}
            </p>
          </div>
        </div>
      )}

      {/* Header with Time Range */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Dashboard Overview
          </h1>
          <p className={`mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Monitor your booking system performance
          </p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className={`mt-4 sm:mt-0 block w-40 pl-3 pr-10 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
            isDarkMode 
              ? 'bg-gray-800 border-gray-700 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        >
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card, index) => {
          const Icon = card.icon;
          const isPositive = parseFloat(card.change) > 0;
          
          return (
            <div
              key={index}
              className={`rounded-xl shadow-sm border p-6 transition-all hover:shadow-md ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-lg ${card.bgColor}`}>
                  <Icon className={`w-6 h-6 ${card.textColor}`} />
                </div>
                <div className="flex items-center space-x-1">
                  {card.change !== 'Active' && card.change !== 'Registered' && (
                    <>
                      {isPositive ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      )}
                      <span className={`text-sm font-medium ${
                        isPositive ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {Math.abs(card.change)}%
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="mt-4">
                <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {card.title}
                </p>
                <p className={`text-2xl font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {card.value}
                </p>
                {card.change !== 'Active' && card.change !== 'Registered' && (
                  <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    vs last month
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Booking Type Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bookingTypeCards.map(({ type, title, icon: Icon, color, stats }) => (
          <div
            key={type}
            className={`rounded-xl shadow-sm border p-6 ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg ${
                isDarkMode ? `bg-${color}-900/20` : `bg-${color}-100`
              }`}>
                <Icon className={`w-5 h-5 ${
                  isDarkMode ? `text-${color}-400` : `text-${color}-600`
                }`} />
              </div>
              <span className={`text-sm font-medium ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {stats.today} today
              </span>
            </div>
            <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {title}
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Total:
                </span>
                <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stats.total}
                </span>
              </div>
              <div className="flex justify-between">
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Confirmed:
                </span>
                <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stats.confirmed}
                </span>
              </div>
              <div className="flex justify-between">
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Revenue:
                </span>
                <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {formatCurrency(stats.revenue)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Alerts and Recent Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alerts */}
        <div className={`rounded-xl shadow-sm border p-6 ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            System Alerts
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${
                  stats.pendingCancellations > 0 
                    ? (isDarkMode ? 'bg-red-900/20' : 'bg-red-100')
                    : (isDarkMode ? 'bg-green-900/20' : 'bg-green-100')
                }`}>
                  {stats.pendingCancellations > 0 ? (
                    <AlertCircle className={`w-5 h-5 ${
                      isDarkMode ? 'text-red-400' : 'text-red-600'
                    }`} />
                  ) : (
                    <CheckCircle className={`w-5 h-5 ${
                      isDarkMode ? 'text-green-400' : 'text-green-600'
                    }`} />
                  )}
                </div>
                <span className={`ml-3 text-sm font-medium ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Pending Cancellations
                </span>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                stats.pendingCancellations > 0
                  ? (isDarkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-800')
                  : (isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800')
              }`}>
                {stats.pendingCancellations}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${
                  stats.occupancyRate > 75 
                    ? (isDarkMode ? 'bg-yellow-900/20' : 'bg-yellow-100')
                    : (isDarkMode ? 'bg-blue-900/20' : 'bg-blue-100')
                }`}>
                  <Calendar className={`w-5 h-5 ${
                    isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
                  }`} />
                </div>
                <span className={`ml-3 text-sm font-medium ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Occupancy Rate
                </span>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'
              }`}>
                {stats.occupancyRate}%
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className={`lg:col-span-2 rounded-xl shadow-sm border p-6 ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/admin/bookings/stalls"
              className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center">
                <Store className={`w-5 h-5 mr-3 ${
                  isDarkMode ? 'text-amber-400' : 'text-amber-600'
                }`} />
                <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Stall Bookings
                </span>
              </div>
              <ChevronRight className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </Link>

            <Link
              href="/admin/bookings/shows"
              className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center">
                <Eye className={`w-5 h-5 mr-3 ${
                  isDarkMode ? 'text-pink-400' : 'text-pink-600'
                }`} />
                <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Show Bookings
                </span>
              </div>
              <ChevronRight className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </Link>

            <Link
              href="/admin/cancellations"
              className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center">
                <AlertCircle className={`w-5 h-5 mr-3 ${
                  isDarkMode ? 'text-red-400' : 'text-red-600'
                }`} />
                <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Cancellations
                </span>
              </div>
              <ChevronRight className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className={`rounded-xl shadow-sm border p-6 ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Recent Bookings
        </h3>
        {recentBookings.length > 0 ? (
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div
                key={booking.id}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isDarkMode ? 'bg-purple-900/30' : 'bg-purple-100'
                  }`}>
                    <Users className={`w-4 h-4 ${
                      isDarkMode ? 'text-purple-400' : 'text-purple-600'
                    }`} />
                  </div>
                  <div className="ml-3 flex-1">
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {extractCustomerName(booking)}
                    </p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {extractItemCount(booking, booking.type)} {booking.type} • {format(booking.createdAt, 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {formatCurrency(extractAmount(booking))}
                  </p>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    STATUS_COLORS[booking.status] || STATUS_COLORS.pending
                  }`}>
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Clock className={`w-12 h-12 mx-auto mb-3 ${
              isDarkMode ? 'text-gray-600' : 'text-gray-400'
            }`} />
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
              No recent bookings
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
