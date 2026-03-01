"use client";
import { useEffect, useMemo, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Header from '@/components/home/Header';
import SimpleUserProfile from '@/components/profile/SimpleUserProfile';
import BookingTabs from '@/components/profile/BookingTabs';
import EmptyState from '@/components/profile/EmptyState';
import QuickActions from '@/components/profile/QuickActions';
import ContactInfo from '@/components/profile/ContactInfo';
import ShowBookingCard from '@/components/show/ShowBookingCard';
import StallBookingCard from '@/components/stall/StallBookingCard';
import DonationCard from '@/components/donation/DonationCard';
import EntryPassCard from '@/components/profile/EntryPassCard';
import SponsorApplicationCard from '@/components/profile/SponsorApplicationCard';
import PerformerApplicationCard from '@/components/profile/PerformerApplicationCard';
import ContestApplicationCard from '@/components/profile/ContestApplicationCard';
import ImageModal from '@/components/ImageModal';
import useAuthStore from '@/lib/stores/useAuthStore';
import useUserProfileStore from '@/lib/stores/useUserProfileStore';

const ProfilePage = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('show');
  const [showEventLayoutModal, setShowEventLayoutModal] = useState(false);

  const {
    loading,
    showBookings,
    stallBookings,
    entryPassBookings,
    donations,
    sponsors,
    performers,
    awards,
    rajaKumari,
    rajaQueen,
    drawings,
    fetchProfileData,
  } = useUserProfileStore();

  useEffect(() => {
    if (user?.uid) {
      fetchProfileData(user);
    }
  }, [user?.uid, fetchProfileData]);

  const counts = useMemo(
    () => ({
      show: showBookings.length,
      stall: stallBookings.length,
      entryPass: entryPassBookings.length,
      donations: donations.length,
      sponsor: sponsors.length,
      performer: performers.length,
      award: awards.length,
      rajaKumari: rajaKumari.length,
      rajaQueen: rajaQueen.length,
      drawing: drawings.length,
    }),
    [showBookings, stallBookings, entryPassBookings, donations, sponsors, performers, awards, rajaKumari, rajaQueen, drawings]
  );

  const emptyStates = {
    show: { type: 'Show bookings', icon: '🎭', color: 'purple', link: '/show', linkText: 'Book Show' },
    stall: { type: 'Stall bookings', icon: '🏪', color: 'green', link: '/stall', linkText: 'Book Stall' },
    entryPass: { type: 'Entry pass bookings', icon: '🎟️', color: 'yellow', link: '/free-pass', linkText: 'Book Free Pass' },
    donations: { type: 'Donations', icon: '💝', color: 'pink', link: '/donate', linkText: 'Make Donation' },
    sponsor: { type: 'Sponsor applications', icon: '⭐', color: 'orange', link: '/sponsor', linkText: 'Apply Sponsor' },
    performer: { type: 'Performer applications', icon: '🎤', color: 'blue', link: '/performer', linkText: 'Apply Performer' },
    award: { type: 'Award applications', icon: '🏆', color: 'yellow', link: '/award', linkText: 'Apply Award' },
    rajaKumari: { type: 'Raja Kumari applications', icon: '👑', color: 'rose', link: '/raja-kumari', linkText: 'Apply Raja Kumari' },
    rajaQueen: { type: 'Raja Queen applications', icon: '👸', color: 'pink', link: '/raja-queen', linkText: 'Apply Raja Queen' },
    drawing: { type: 'Drawing applications', icon: '🖌️', color: 'green', link: '/drawing', linkText: 'Apply Drawing' },
  };

  const tabData = {
    show: showBookings,
    stall: stallBookings,
    entryPass: entryPassBookings,
    donations,
    sponsor: sponsors,
    performer: performers,
    award: awards,
    rajaKumari,
    rajaQueen,
    drawing: drawings,
  };

  const refreshData = () => {
    if (user?.uid) fetchProfileData(user);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'show':
        return showBookings.map((item) => <ShowBookingCard key={item.id} booking={item} onCancel={refreshData} />);
      case 'stall':
        return stallBookings.map((item) => <StallBookingCard key={item.id} booking={item} onCancel={refreshData} />);
      case 'entryPass':
        return entryPassBookings.map((item) => <EntryPassCard key={item.id} booking={item} />);
      case 'donations':
        return donations.map((item) => <DonationCard key={item.id} donation={item} />);
      case 'sponsor':
        return sponsors.map((item) => <SponsorApplicationCard key={item.id} item={item} />);
      case 'performer':
        return performers.map((item) => <PerformerApplicationCard key={item.id} item={item} />);
      case 'award':
        return awards.map((item) => <ContestApplicationCard key={item.id} item={item} title="Award Application" accent="amber" />);
      case 'rajaKumari':
        return rajaKumari.map((item) => <ContestApplicationCard key={item.id} item={item} title="Raja Kumari Application" accent="rose" />);
      case 'rajaQueen':
        return rajaQueen.map((item) => <ContestApplicationCard key={item.id} item={item} title="Raja Queen Application" accent="pink" />);
      case 'drawing':
        return drawings.map((item) => <ContestApplicationCard key={item.id} item={item} title="Drawing Application" accent="emerald" />);
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-orange-500" />
            <p className="text-gray-600">Loading profile dashboard...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50">
        <Header />
        <div className="mx-auto max-w-[96rem] px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-6 rounded-3xl border border-orange-200 bg-gradient-to-r from-orange-100 via-amber-50 to-yellow-100 p-5 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-black text-slate-900 sm:text-3xl">My Festival Dashboard</h1>
                <p className="text-sm text-slate-600">Track all bookings, passes, and applications in one place.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowEventLayoutModal(true)}
                className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:from-indigo-600 hover:to-violet-700"
              >
                View Event Layout
              </button>
            </div>
          </div>
          <div className="mb-8">
            <SimpleUserProfile user={user} />
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            <div className="lg:col-span-3">
              <div className="rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-lg">
                <div className="mb-6 flex flex-col gap-4">
                  <h3 className="text-xl font-bold text-gray-800">My Bookings & Applications</h3>
                  <BookingTabs activeTab={activeTab} setActiveTab={setActiveTab} counts={counts} />
                </div>

                {tabData[activeTab].length === 0 ? (
                  <EmptyState {...emptyStates[activeTab]} />
                ) : (
                  <div className="space-y-4">{renderActiveTab()}</div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <QuickActions onRefresh={refreshData} />
              <ContactInfo />
            </div>
          </div>
        </div>

        <ImageModal
          show={showEventLayoutModal}
          onClose={() => setShowEventLayoutModal(false)}
          imageSrc="/layout2.png"
          imageAlt="Event Layout"
          title="Event Layout"
        />
      </div>
    </ProtectedRoute>
  );
};

export default ProfilePage;
