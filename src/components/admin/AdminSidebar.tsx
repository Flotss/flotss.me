import { NavCategory } from '@/types/types';
import Link from 'next/link';
import React from 'react';
import {
  FaCog,
  FaExternalLinkAlt,
  FaLayerGroup,
  FaSignOutAlt,
  FaSortAmountDown,
  FaSync,
  FaUserShield,
} from 'react-icons/fa';

interface AdminSidebarProps {
  userEmail?: string;
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

export default function AdminSidebar({
  userEmail,
  activeCategory,
  setActiveCategory,
  counts,
  syncingGithub,
  onSyncGithub,
  onLogout,
}: AdminSidebarProps) {
  return (
    <aside className="flex hidden w-64 flex-shrink-0 flex-col justify-between border-r border-white/5 bg-zinc-950/80 p-5 backdrop-blur-xl md:flex">
      <div>
        {/* Studio Header & User Profile */}
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-md shadow-emerald-500/10">
            <FaUserShield className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-white">flotss.me Studio</h2>
            <p className="max-w-[140px] truncate text-[11px] text-zinc-400">{userEmail}</p>
          </div>
        </div>

        {/* Navigation Categories */}
        <div className="space-y-6">
          <div>
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Repositories
            </p>
            <div className="space-y-1">
              <button
                onClick={() => setActiveCategory('projects-catalog')}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                  activeCategory === 'projects-catalog'
                    ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 shadow-sm'
                    : 'text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <FaLayerGroup className="h-3.5 w-3.5" />
                  Projects Catalog
                </span>
                <span className="rounded-md bg-zinc-800/80 px-1.5 py-0.5 text-[10px] text-zinc-400">
                  {counts.total}
                </span>
              </button>

              <button
                onClick={() => setActiveCategory('projects-order')}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                  activeCategory === 'projects-order'
                    ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 shadow-sm'
                    : 'text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <FaSortAmountDown className="h-3.5 w-3.5" />
                  Display Order
                </span>
                {counts.customOrdered > 0 && (
                  <span className="rounded-md border border-emerald-500/30 bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-bold text-emerald-300">
                    {counts.customOrdered}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div>
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Configuration
            </p>
            <div className="space-y-1">
              <button
                onClick={() => setActiveCategory('settings')}
                className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                  activeCategory === 'settings'
                    ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 shadow-sm'
                    : 'text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200'
                }`}
              >
                <FaCog className="h-3.5 w-3.5" />
                Site Settings & Links
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Footer Actions */}
      <div className="space-y-2 border-t border-white/5 pt-6">
        <button
          onClick={onSyncGithub}
          disabled={syncingGithub}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-medium text-zinc-300 transition-all hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-300 disabled:opacity-50"
        >
          <FaSync className={`h-3 w-3 ${syncingGithub ? 'animate-spin text-emerald-400' : ''}`} />
          <span>{syncingGithub ? 'Syncing GitHub...' : 'Sync Repositories'}</span>
        </button>

        <Link
          href="/"
          target="_blank"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2 text-xs font-medium text-zinc-400 transition-all hover:bg-white/[0.05] hover:text-zinc-200"
        >
          <FaExternalLinkAlt className="h-3 w-3" />
          <span>View Public Site</span>
        </Link>

        <button
          onClick={onLogout}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-400 transition-all hover:bg-red-500/20 hover:text-red-300"
        >
          <FaSignOutAlt className="h-3 w-3" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
