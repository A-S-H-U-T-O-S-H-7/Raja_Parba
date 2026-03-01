import Link from 'next/link';

const QuickActions = ({ onRefresh }) => {
  const actions = [
    {
      href: '/show',
      label: 'Book Show',
      color: 'from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700',
    },
    {
      href: '/stall',
      label: 'Reserve Stall',
      color: 'from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700',
    },
    {
      href: '/free-pass',
      label: 'Book Free Pass',
      color: 'from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700',
    },
    {
      href: '/sponsor',
      label: 'Apply Sponsor',
      color: 'from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700',
    },
    {
      href: '/performer',
      label: 'Apply Performer',
      color: 'from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700',
    },
    {
      href: '/award',
      label: 'Apply Award',
      color: 'from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700',
    },
    {
      href: '/raja-kumari',
      label: 'Raja Kumari',
      color: 'from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700',
    },
    {
      href: '/raja-queen',
      label: 'Raja Queen',
      color: 'from-pink-500 to-fuchsia-600 hover:from-pink-600 hover:to-fuchsia-700',
    },
    {
      href: '/drawing',
      label: 'Drawing Entry',
      color: 'from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700',
    },
    {
      href: '/donate',
      label: 'Make Donation',
      color: 'from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700',
    },
  ];

  return (
    <div className="rounded-xl bg-white p-6 shadow-lg">
      <h3 className="mb-4 text-lg font-bold text-gray-800">Quick Actions</h3>
      <div className="space-y-2">
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className={`block w-full rounded-lg bg-gradient-to-r px-4 py-2 text-center text-sm font-medium text-white shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg ${action.color}`}
          >
            {action.label}
          </Link>
        ))}
        <button
          onClick={onRefresh}
          className="w-full rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-200"
        >
          Refresh
        </button>
      </div>
    </div>
  );
};

export default QuickActions;
