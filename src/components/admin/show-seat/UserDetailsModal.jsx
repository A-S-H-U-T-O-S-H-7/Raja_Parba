// components/admin/show-seats/UserDetailsModal.jsx
"use client";
import { X, User, Mail, Phone, Calendar, Hash, Ticket } from 'lucide-react';
import useThemeStore from '@/lib/stores/useThemeStore';

export default function UserDetailsModal({ isOpen, onClose, userDetails }) {
  const { isDarkMode } = useThemeStore();

  if (!isOpen || !userDetails) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`rounded-xl w-full max-w-md p-4 md:p-6 ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className={`text-lg font-bold flex items-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <Ticket className="w-5 h-5 mr-2" />
            Booking Details
          </h3>
          <button 
            onClick={onClose}
            className={`p-1 rounded-full ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-3">
          <div className={`p-3 rounded-lg ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-1 flex items-center`}>
              <Hash className="w-3 h-3 mr-1" />
              Seat ID
            </p>
            <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {userDetails.id}
            </p>
          </div>
          
          <div className={`p-3 rounded-lg ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-1 flex items-center`}>
              <User className="w-3 h-3 mr-1" />
              Booked By
            </p>
            <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {userDetails.userName}
            </p>
          </div>
          
          <div className={`p-3 rounded-lg ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-1 flex items-center`}>
              <Mail className="w-3 h-3 mr-1" />
              Email
            </p>
            <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {userDetails.userEmail}
            </p>
          </div>
          
          <div className={`p-3 rounded-lg ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-1 flex items-center`}>
              <Phone className="w-3 h-3 mr-1" />
              Phone
            </p>
            <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {userDetails.userPhone}
            </p>
          </div>
          
          <div className={`p-3 rounded-lg ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-1 flex items-center`}>
              <Hash className="w-3 h-3 mr-1" />
              Booking ID
            </p>
            <p className={`text-sm font-mono ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {userDetails.bookingId}
            </p>
          </div>
          
          <div className={`p-3 rounded-lg ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-1 flex items-center`}>
              <Calendar className="w-3 h-3 mr-1" />
              Booked At
            </p>
            <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {userDetails.bookedAt}
            </p>
          </div>
          
          <button
            onClick={onClose}
            className={`w-full py-2 rounded-lg mt-2 ${
              isDarkMode 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } transition-colors`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}