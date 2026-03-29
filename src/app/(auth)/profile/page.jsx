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
import useAuthStore from '@/lib/stores/useAuthStore';
import useUserProfileStore from '@/lib/stores/useUserProfileStore';

const PROFILE_TABS = [
  'show',
  'stall',
  'entryPass',
  'donations',
  'sponsor',
  'performer',
  'award',
  'rajaKumari',
  'rajaQueen',
  'podaPitha',
  'drawing',
];

const VALID_SHOW_COUNT_STATUSES = new Set([
  'confirmed',
  'pending',
  'requested',
  'cancellation-requested',
]);
const VALID_DONATION_COUNT_STATUSES = new Set(['confirmed', 'completed']);

const EXCLUDED_COUNT_STATUSES = new Set(['failed', 'cancelled', 'rejected']);

const getActiveCount = (items = [], allowedStatuses = null) =>
  items.filter((item) => {
    const status = String(item?.status || '').toLowerCase();
    if (!status) return true;
    if (allowedStatuses) return allowedStatuses.has(status);
    return !EXCLUDED_COUNT_STATUSES.has(status);
  }).length;

const ProfilePage = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('show');

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
    podaPitha,
    drawings,
    fetchProfileData,
  } = useUserProfileStore();

  useEffect(() => {
    if (user?.uid) {
      fetchProfileData(user);
    }
  }, [user?.uid, fetchProfileData]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const requestedTab = new URLSearchParams(window.location.search).get('tab');
    if (requestedTab && PROFILE_TABS.includes(requestedTab)) {
      setActiveTab(requestedTab);
    }
  }, []);

  const showCount = useMemo(
    () => getActiveCount(showBookings, VALID_SHOW_COUNT_STATUSES),
    [showBookings]
  );

  const stallCount = useMemo(() => getActiveCount(stallBookings), [stallBookings]);
  const donationCount = useMemo(
    () => getActiveCount(donations, VALID_DONATION_COUNT_STATUSES),
    [donations]
  );
  const performerCount = useMemo(() => getActiveCount(performers), [performers]);

  const counts = useMemo(
    () => ({
      show: showCount,
      stall: stallCount,
      entryPass: entryPassBookings.length,
      donations: donationCount,
      sponsor: sponsors.length,
      performer: performerCount,
      award: awards.length,
      rajaKumari: rajaKumari.length,
      rajaQueen: rajaQueen.length,
      podaPitha: podaPitha.length,
      drawing: drawings.length,
    }),
    [showCount, stallCount, entryPassBookings, donationCount, sponsors, performerCount, awards, rajaKumari, rajaQueen, podaPitha, drawings]
  );

  const emptyStates = {
    show: { type: 'Show bookings', icon: 'S', color: 'purple', link: '/show', linkText: 'Book Show' },
    stall: { type: 'Stall bookings', icon: 'T', color: 'green', link: '/stall', linkText: 'Book Stall' },
    entryPass: { type: 'Entry pass bookings', icon: 'P', color: 'yellow', link: '/free-pass', linkText: 'Book Free Pass' },
    donations: { type: 'Donations', icon: 'D', color: 'pink', link: '/donate', linkText: 'Make Donation' },
    sponsor: { type: 'Sponsor applications', icon: 'SP', color: 'orange', link: '/sponsor', linkText: 'Apply Sponsor' },
    performer: { type: 'Performer applications', icon: 'PF', color: 'blue', link: '/performer', linkText: 'Apply Performer' },
    award: { type: 'Award applications', icon: 'A', color: 'yellow', link: '/award', linkText: 'Apply Award' },
    rajaKumari: { type: 'Raja Kumari applications', icon: 'RK', color: 'rose', link: '/raja-kumari', linkText: 'Apply Raja Kumari' },
    rajaQueen: { type: 'Raja Queen applications', icon: 'RQ', color: 'pink', link: '/raja-queen', linkText: 'Apply Raja Queen' },
    podaPitha: { type: 'Poda Pitha applications', icon: 'PP', color: 'orange', link: '/poda-pitha', linkText: 'Apply Poda Pitha' },
    drawing: { type: 'Drawing applications', icon: 'DR', color: 'green', link: '/drawing', linkText: 'Apply Drawing' },
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
    podaPitha,
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
        return awards.map((item) => <ContestApplicationCard key={item.id} item={item} title="Award Application" accent="blueIndigo" />);
      case 'rajaKumari':
        return rajaKumari.map((item) => (
          <ContestApplicationCard
            key={item.id}
            item={item}
            title="Raja Kumari Application"
            accent="emeraldTeal"
            assessmentType="rajaKumari"
          />
        ));
      case 'rajaQueen':
        return rajaQueen.map((item) => (
          <ContestApplicationCard
            key={item.id}
            item={item}
            title="Raja Queen Application"
            accent="redPink"
            assessmentType="rajaQueen"
          />
        ));
      case 'podaPitha':
        return podaPitha.map((item) => (
          <ContestApplicationCard
            key={item.id}
            item={item}
            title="Poda Pitha Application"
            accent="blueIndigo"
          />
        ));
      case 'drawing':
        return drawings.map((item) => (
          <ContestApplicationCard
            key={item.id}
            item={item}
            title="Drawing Application"
            accent="green"
            assessmentType={(String(item?.category || "").toLowerCase() === "senior" ? "drawingSenior" : "drawingJunior")}
          />
        ));
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
      </div>
    </ProtectedRoute>
  );
};

export default ProfilePage;
