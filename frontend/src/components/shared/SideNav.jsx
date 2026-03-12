import React from 'react';
import { BookOpen } from 'lucide-react'; // Import for Menu Library
import {
  DashboardIcon, TodayIcon, AnalysisIcon, HistoryIcon,
  MenuIcon, CloseIcon, LogoutIcon, FlameIcon,
} from './Icons';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', Icon: DashboardIcon },
  { id: 'today',     label: 'Today',     Icon: TodayIcon     },
  { id: 'analysis',  label: 'Analysis',  Icon: AnalysisIcon  },
  { id: 'history',   label: 'History',   Icon: HistoryIcon   },
  { id: 'library',   label: 'Food Library', Icon: BookOpen   }, // Integrated Library Item
];

const SideNav = ({
  activePage, setActivePage,
  collapsed, setCollapsed,
  username,
}) => {

  const handleNavClick = (id) => {
    setActivePage(id);
    // Auto-close sidebar on mobile after clicking a link
    if (window.innerWidth < 1024) setCollapsed(true);
  };

  return (
    <>
      {/* Mobile backdrop - only shows when menu is open on small screens */}
      {!collapsed && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}

      <aside className={`
        fixed top-0 left-0 h-full z-40 flex flex-col
        bg-white border-r border-slate-200 shadow-xl
        transition-all duration-300 ease-in-out
        ${collapsed
          ? '-translate-x-full lg:translate-x-0 lg:w-20 w-72'
          : 'translate-x-0 w-72 lg:w-64'
        }
      `}>

        {/* Logo Section */}
        <div className={`flex items-center h-16 px-4 border-b border-slate-200 shrink-0
          ${collapsed ? 'lg:justify-center justify-between' : 'justify-between'}`}>

          <div className={`flex items-center gap-2.5 ${collapsed ? 'lg:hidden' : ''}`}>
            <div className="w-8 h-8 rounded-xl bg-slate-700 flex items-center justify-center text-white shrink-0">
              <FlameIcon />
            </div>
            <span className="font-black text-slate-800 tracking-tight text-sm">
              Diet Tracker
            </span>
          </div>

          <button
            onClick={() => setCollapsed(c => !c)}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition shrink-0"
          >
            {collapsed ? <MenuIcon /> : <CloseIcon />}
          </button>
        </div>

        {/* User Profile Info */}
        <div className={`px-4 py-4 border-b border-slate-100 shrink-0 ${collapsed ? 'lg:hidden' : ''}`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-white font-black text-sm shrink-0">
              {username.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="font-black text-slate-800 text-sm truncate">{username}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Personal Diary</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto custom-scrollbar">
          {NAV_ITEMS.map(({ id, label, Icon }) => {
            const isActive = activePage === id;

            return (
              <button
                key={id}
                onClick={() => handleNavClick(id)}
                title={collapsed ? label : undefined}
                className={`
                  w-full flex items-center gap-3 px-3 py-3.5 rounded-2xl font-black text-sm
                  transition-all duration-200 group
                  ${isActive
                    ? 'bg-slate-700 text-white shadow-lg shadow-slate-200'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                  }
                  ${collapsed ? 'lg:justify-center' : ''}
                `}
              >
                {/* Icon wrapper - handles both custom SVG icons and Lucide icons */}
                <span className={`shrink-0 flex items-center justify-center w-5 h-5 ${!isActive ? 'group-hover:scale-110 transition-transform' : ''}`}>
                  {id === 'library' ? <Icon size={20} /> : <Icon />}
                </span>

                <span className={`truncate ${collapsed ? 'lg:hidden' : ''}`}>
                  {label}
                </span>

                {isActive && (
                  <span className={`ml-auto w-1.5 h-1.5 rounded-full bg-white/70 ${collapsed ? 'lg:hidden' : ''}`} />
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout Section */}
        <div className="border-t border-slate-200 p-2 shrink-0">
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = '/login';
            }}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-red-500 hover:bg-red-50 font-black text-xs uppercase tracking-wider transition-all
              ${collapsed ? 'lg:justify-center' : ''}
            `}
          >
            <LogoutIcon />
            <span className={collapsed ? 'lg:hidden' : ''}>
              Logout
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default SideNav;