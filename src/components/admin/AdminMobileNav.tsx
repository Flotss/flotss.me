import { NavCategory } from '@/types/types';
import React from 'react';
import { FaSignOutAlt, FaSync, FaUserShield } from 'react-icons/fa';

interface AdminMobileNavProps {
  activeCategory: NavCategory;
  setActiveCategory: (cat: NavCategory) => void;
  counts: {
    total: number;
    customOrdered: number;
  };
  syncingGithub: boolean;
  onSyncGithub: () => void;
  onLogout: () => void;
}

export default function AdminMobileNav({
  activeCategory,
  setActiveCategory,
  counts,
  syncingGithub,
  onSyncGithub,
  onLogout,
}: AdminMobileNavProps) {
  return (
    <>
      {/* Mobile Top Header */}
      <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4 md:hidden">
        <div className="flex items-center gap-2">
          <FaUserShield className="h-4 w-4 text-emerald-400" />
          <span className="text-sm font-bold text-white">flotss.me Studio</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onSyncGithub}
            disabled={syncingGithub}
            className="rounded-lg border border-white/10 bg-white/[0.04] p-2 text-xs text-zinc-300"
            title="Sync GitHub Repositories"
          >
            <FaSync className={`h-3 w-3 ${syncingGithub ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={onLogout}
            className="rounded-lg border border-red-500/20 bg-red-500/10 p-2 text-xs text-red-400"
            title="Sign Out"
          >
            <FaSignOutAlt className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Mobile Category Tabs */}
      <div className="mb-4 flex gap-2 overflow-x-auto border-b border-white/5 pb-4 md:hidden">
        <button
          onClick={() => setActiveCategory('projects-catalog')}
          className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium ${
            activeCategory === 'projects-catalog'
              ? 'border border-emerald-500/40 bg-emerald-500/20 text-emerald-300'
              : 'bg-zinc-900 text-zinc-400'
          }`}
        >
          Projects ({counts.total})
        </button>
        <button
          onClick={() => setActiveCategory('projects-order')}
          className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium ${
            activeCategory === 'projects-order'
              ? 'border border-emerald-500/40 bg-emerald-500/20 text-emerald-300'
              : 'bg-zinc-900 text-zinc-400'
          }`}
        >
          Order ({counts.customOrdered})
        </button>
        <button
          onClick={() => setActiveCategory('settings')}
          className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium ${
            activeCategory === 'settings'
              ? 'border border-emerald-500/40 bg-emerald-500/20 text-emerald-300'
              : 'bg-zinc-900 text-zinc-400'
          }`}
        >
          Settings
        </button>
      </div>
    </>
  );
}
