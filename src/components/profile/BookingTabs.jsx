const tabs = [
  { key: 'show',       label: 'Shows',       bg: 'bg-purple-100',  activeBg: 'bg-purple-300',  border: 'border-purple-200',  activeBorder: 'border-purple-400',  text: 'text-purple-600',  activeText: 'text-purple-900',  countBg: 'bg-purple-200',  activeCountBg: 'bg-purple-500'  },
  { key: 'stall',      label: 'Stalls',      bg: 'bg-emerald-100', activeBg: 'bg-emerald-300', border: 'border-emerald-200', activeBorder: 'border-emerald-400', text: 'text-emerald-600', activeText: 'text-emerald-900', countBg: 'bg-emerald-200', activeCountBg: 'bg-emerald-500' },
  { key: 'entryPass',  label: 'Entry Pass',  bg: 'bg-orange-100',  activeBg: 'bg-orange-300',  border: 'border-orange-200',  activeBorder: 'border-orange-400',  text: 'text-orange-600',  activeText: 'text-orange-900',  countBg: 'bg-orange-200',  activeCountBg: 'bg-orange-500'  },
  { key: 'donations',  label: 'Donations',   bg: 'bg-pink-100',    activeBg: 'bg-pink-300',    border: 'border-pink-200',    activeBorder: 'border-pink-400',    text: 'text-pink-600',    activeText: 'text-pink-900',    countBg: 'bg-pink-200',    activeCountBg: 'bg-pink-500'    },
  { key: 'sponsor',    label: 'Sponsor',     bg: 'bg-amber-100',   activeBg: 'bg-amber-300',   border: 'border-amber-200',   activeBorder: 'border-amber-400',   text: 'text-amber-600',   activeText: 'text-amber-900',   countBg: 'bg-amber-200',   activeCountBg: 'bg-amber-500'   },
  { key: 'performer',  label: 'Performer',   bg: 'bg-cyan-100',    activeBg: 'bg-cyan-300',    border: 'border-cyan-200',    activeBorder: 'border-cyan-400',    text: 'text-cyan-600',    activeText: 'text-cyan-900',    countBg: 'bg-cyan-200',    activeCountBg: 'bg-cyan-500'    },
  { key: 'award',      label: 'Award',       bg: 'bg-blue-100',    activeBg: 'bg-blue-300',    border: 'border-blue-200',    activeBorder: 'border-blue-400',    text: 'text-blue-600',    activeText: 'text-blue-900',    countBg: 'bg-blue-200',    activeCountBg: 'bg-blue-500'    },
  { key: 'rajaKumari', label: 'Raja Kumari', bg: 'bg-rose-100',    activeBg: 'bg-rose-300',    border: 'border-rose-200',    activeBorder: 'border-rose-400',    text: 'text-rose-600',    activeText: 'text-rose-900',    countBg: 'bg-rose-200',    activeCountBg: 'bg-rose-500'    },
  { key: 'rajaQueen',  label: 'Raja Queen',  bg: 'bg-fuchsia-100', activeBg: 'bg-fuchsia-300', border: 'border-fuchsia-200', activeBorder: 'border-fuchsia-400', text: 'text-fuchsia-600', activeText: 'text-fuchsia-900', countBg: 'bg-fuchsia-200', activeCountBg: 'bg-fuchsia-500' },
  { key: 'podaPitha',  label: 'Poda Pitha',  bg: 'bg-amber-100',   activeBg: 'bg-amber-300',   border: 'border-amber-200',   activeBorder: 'border-amber-400',   text: 'text-amber-700',   activeText: 'text-amber-900',   countBg: 'bg-amber-200',   activeCountBg: 'bg-amber-500'   },
  { key: 'drawing',    label: 'Drawing',     bg: 'bg-green-100',   activeBg: 'bg-green-300',   border: 'border-green-200',   activeBorder: 'border-green-400',   text: 'text-green-600',   activeText: 'text-green-900',   countBg: 'bg-green-200',   activeCountBg: 'bg-green-500'   },
];

const BookingTabs = ({ activeTab, setActiveTab, counts }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-100/80 p-2.5 shadow-inner">
      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-11">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          const count = counts[tab.key] ?? 0;

          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex flex-col items-center gap-1.5 rounded-xl border px-2 py-2.5 text-center transition-all duration-200
                ${isActive
                  ? `${tab.activeBg} ${tab.activeBorder} shadow-md`
                  : `${tab.bg} ${tab.border} hover:brightness-95`
                }`}
            >
              <span className={`text-xs font-semibold leading-tight ${isActive ? tab.activeText : tab.text}`}>
                {tab.label}
              </span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold text-white ${isActive ? tab.activeCountBg : tab.countBg}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BookingTabs;
