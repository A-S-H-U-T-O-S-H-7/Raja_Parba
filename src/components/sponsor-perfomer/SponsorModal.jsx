// SponsorModal.jsx
import React from 'react';
import { X, Heart, User, Mail, Phone, Building2, MapPin } from 'lucide-react';
import PortalModal from '../home/PortalModal';

const SponsorModal = ({ 
  showSponsorModal, 
  setShowSponsorModal, 
  sponsorForm, 
  setSponsorForm, 
  handleSponsorSubmit 
}) => {
  return (
    <PortalModal
      isOpen={showSponsorModal}
      onClose={() => setShowSponsorModal(false)}
      className="!bg-transparent !border-0 !shadow-none !max-w-none !w-auto !max-h-[90vh] !overflow-visible"
    >
<div className="relative bg-gradient-to-br from-red-50 via-white to-amber-50 rounded-3xl max-w-md w-full p-4 shadow-2xl border border-amber-200 transform animate-slideUp overflow-hidden">
  
        
        {/* Top Golden Border */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 rounded-t-3xl"></div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6 mt-2">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-red-600 rounded-xl flex items-center justify-center mr-3 shadow-md">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-red-800">
              Sponsor Raja Parba
            </h3>
          </div>

          <button
            onClick={() => setShowSponsorModal(false)}
            className="text-gray-400 hover:text-red-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-6 italic">
          Become a patron of tradition and celebrate the spirit of Raja Parba 2026.
        </p>

        <div className="space-y-4">
          
          {/* Full Name */}
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-500" />
            <input
              type="text"
              placeholder="Full Name"
              value={sponsorForm?.name || ''}
              onChange={(e) => setSponsorForm({...sponsorForm, name: e.target.value})}
              className="w-full text-gray-800 pl-11 pr-4 py-3 border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all bg-white/80"
              required
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-500" />
            <input
              type="email"
              placeholder="Email Address"
              value={sponsorForm?.email || ''}
              onChange={(e) => setSponsorForm({...sponsorForm, email: e.target.value})}
              className="w-full text-gray-800 pl-11 pr-4 py-3 border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all bg-white/80"
              required
            />
          </div>

          {/* Phone */}
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-500" />
            <input
              type="tel"
              placeholder="Phone Number"
              value={sponsorForm?.phone || ''}
              onChange={(e) => setSponsorForm({...sponsorForm, phone: e.target.value})}
              className="w-full text-gray-800 pl-11 pr-4 py-3 border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all bg-white/80"
              required
            />
          </div>

          {/* Organization */}
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-500" />
            <input
              type="text"
              placeholder="Organization Name"
              value={sponsorForm?.organization || ''}
              onChange={(e) => setSponsorForm({...sponsorForm, organization: e.target.value})}
              className="w-full text-gray-800 pl-11 pr-4 py-3 border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all bg-white/80"
              required
            />
          </div>

          {/* Address */}
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-500" />
            <input
              type="text"
              placeholder="Address"
              value={sponsorForm?.address || ''}
              onChange={(e) => setSponsorForm({...sponsorForm, address: e.target.value})}
              className="w-full text-gray-800 pl-11 pr-4 py-3 border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all bg-white/80"
              required
            />
          </div>

          {/* City */}
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-500" />
            <input
              type="text"
              placeholder="City"
              value={sponsorForm?.city || ''}
              onChange={(e) => setSponsorForm({...sponsorForm, city: e.target.value})}
              className="w-full text-gray-800 pl-11 pr-4 py-3 border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all bg-white/80"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSponsorSubmit}
            className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 text-white font-semibold py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 mt-4"
          >
            Submit Sponsorship Request
          </button>

          <p className='text-xs text-gray-600 text-center mt-2'>
            Our partnership team will contact you within 24 hours.
          </p>
        </div>
      </div>
    </PortalModal>
  );
};

export default SponsorModal;
