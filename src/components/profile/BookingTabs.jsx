const tabs = [
  { key: 'show', label: 'Shows' },
  { key: 'stall', label: 'Stalls' },
  { key: 'entryPass', label: 'Entry Pass' },
  { key: 'donations', label: 'Donations' },
  { key: 'sponsor', label: 'Sponsor' },
  { key: 'performer', label: 'Performer' },
  { key: 'award', label: 'Award' },
  { key: 'rajaKumari', label: 'Raja Kumari' },
  { key: 'rajaQueen', label: 'Raja Queen' },
  { key: 'drawing', label: 'Drawing' },
];

const BookingTabs = ({ activeTab, setActiveTab, counts }) => {
  return (
    <div className="grid grid-cols-2 gap-2 rounded-2xl bg-gradient-to-r from-slate-100 to-slate-50 p-3 shadow-inner sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-10">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setActiveTab(tab.key)}
          className={`rounded-xl px-3 py-2 text-xs font-semibold transition sm:text-sm ${
            activeTab === tab.key
              ? 'bg-white text-slate-900 shadow-md ring-1 ring-slate-200'
              : 'bg-white/60 text-slate-600 hover:bg-white hover:text-slate-800'
          }`}
        >
          {tab.label} ({counts[tab.key] ?? 0})
        </button>
      ))}
    </div>
  );
};

export default BookingTabs;
