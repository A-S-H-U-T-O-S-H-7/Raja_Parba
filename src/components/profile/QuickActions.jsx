import Link from 'next/link';
import { Clapperboard, Store, Ticket, Star, Mic, Trophy, Crown, Sparkles, Palette, Heart, RefreshCw } from 'lucide-react';

const actions = [
  { href: '/show',        label: 'Book Show',       icon: Clapperboard, color: 'from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700'         },
  { href: '/stall',       label: 'Reserve Stall',   icon: Store,        color: 'from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'  },
  { href: '/free-pass',   label: 'Book Free Pass',  icon: Ticket,       color: 'from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700'    },
  { href: '/sponsor',     label: 'Apply Sponsor',   icon: Star,         color: 'from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700'        },
  { href: '/performer',   label: 'Apply Performer', icon: Mic,          color: 'from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700'          },
  { href: '/award',       label: 'Apply Award',     icon: Trophy,       color: 'from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700'    },
  { href: '/raja-kumari', label: 'Raja Kumari',     icon: Crown,        color: 'from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700'          },
  { href: '/raja-queen',  label: 'Raja Queen',      icon: Sparkles,     color: 'from-pink-500 to-fuchsia-600 hover:from-pink-600 hover:to-fuchsia-700'    },
  { href: '/poda-pitha',  label: 'Poda Pitha',      icon: Trophy,       color: 'from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700'    },
  { href: '/drawing',     label: 'Drawing Entry',   icon: Palette,      color: 'from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700'    },
  { href: '/donate',      label: 'Make Donation',   icon: Heart,        color: 'from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700'          },
];

const QuickActions = ({ onRefresh }) => {
  return (
    <div className="rounded-xl border border-blue-200 bg-linear-to-br from-gray-200 via-gray-50 to-gray-100 py-4 px-2 shadow-lg">
      <h3 className="mb-4 text-lg font-bold text-gray-800">Quick Actions</h3>
      <div className="space-y-2 grid grid-cols-2 gap-2">
        {actions.map(({ href, label, icon: Icon, color }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 w-full rounded-lg bg-gradient-to-r px-2 py-2.5 text-sm font-medium text-white shadow-md transition-all duration-200 hover:scale-[1.02] hover:shadow-lg ${color}`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        ))}
        <button
          onClick={onRefresh}
          className="flex items-center justify-center gap-2 w-full rounded-lg bg-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-200"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>
    </div>
  );
};

export default QuickActions;
