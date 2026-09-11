import RepoCardEditor from '@/components/admin/RepoCardEditor';
import { AdminRepoRecord, RepoEditFormData, ViewMode } from '@/types/types';
import React from 'react';
import { FaList, FaSearch, FaSync, FaThLarge } from 'react-icons/fa';

interface ProjectsCatalogViewProps {
  counts: {
    total: number;
    visible: number;
    hidden: number;
    wip: number;
  };
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filterStatus: 'all' | 'visible' | 'hidden' | 'wip';
  setFilterStatus: (status: 'all' | 'visible' | 'hidden' | 'wip') => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  loadingRepos: boolean;
  filteredRepos: AdminRepoRecord[];
  editedRepos: Record<number, RepoEditFormData>;
  expandedRepoIds: Record<number, boolean>;
  savingRepoId: number | null;
  savedSuccessRepoId: number | null;
  onToggleVisibility: (repo: AdminRepoRecord) => void;
  onToggleExpand: (repoId: number) => void;
  onFieldChange: (repoId: number, field: keyof RepoEditFormData, value: string | boolean) => void;
  onSaveRepoChanges: (repoId: number) => void;
}

export default function ProjectsCatalogView({
  counts,
  searchQuery,
  setSearchQuery,
  filterStatus,
  setFilterStatus,
  viewMode,
  setViewMode,
  loadingRepos,
  filteredRepos,
  editedRepos,
  expandedRepoIds,
  savingRepoId,
  savedSuccessRepoId,
  onToggleVisibility,
  onToggleExpand,
  onFieldChange,
  onSaveRepoChanges,
}: ProjectsCatalogViewProps) {
  return (
    <div>
      {/* Header & Stats Banner */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-white/5 bg-zinc-900/40 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
            Total Repos
          </p>
          <p className="mt-1 text-2xl font-bold text-white">{counts.total}</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-zinc-900/40 p-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
              Public Visible
            </p>
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
          </div>
          <p className="mt-1 text-2xl font-bold text-emerald-400">{counts.visible}</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-zinc-900/40 p-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
              Hidden
            </p>
            <span className="h-2 w-2 rounded-full bg-zinc-500" />
          </div>
          <p className="mt-1 text-2xl font-bold text-zinc-400">{counts.hidden}</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-zinc-900/40 p-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
              Work In Progress
            </p>
            <span className="h-2 w-2 rounded-full bg-amber-400" />
          </div>
          <p className="mt-1 text-2xl font-bold text-amber-300">{counts.wip}</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/5 bg-zinc-900/30 p-3">
        <div className="relative min-w-[220px] flex-1">
          <FaSearch className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, repository or description..."
            className="w-full rounded-xl border border-white/5 bg-zinc-900/70 py-2 pl-9 pr-4 text-xs text-zinc-200 placeholder-zinc-500 focus:border-emerald-500/40 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="rounded-xl border border-white/5 bg-zinc-900/70 px-3 py-2 text-xs text-zinc-300 focus:border-emerald-500/40 focus:outline-none"
          >
            <option value="all">All Repositories</option>
            <option value="visible">Visible Only</option>
            <option value="hidden">Hidden Only</option>
            <option value="wip">Work in Progress Only</option>
          </select>

          <div className="flex items-center rounded-xl border border-white/5 bg-zinc-900/70 p-1">
            <button
              onClick={() => setViewMode('block')}
              className={`rounded-lg p-1.5 text-xs ${
                viewMode === 'block'
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
              title="Card view"
            >
              <FaThLarge className="h-3 w-3" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`rounded-lg p-1.5 text-xs ${
                viewMode === 'list'
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
              title="List view"
            >
              <FaList className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Projects List / Grid */}
      {loadingRepos ? (
        <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
          <FaSync className="mb-3 h-6 w-6 animate-spin text-emerald-400" />
          <p className="text-xs">Loading repositories...</p>
        </div>
      ) : filteredRepos.length === 0 ? (
        <div className="rounded-2xl border border-white/5 bg-zinc-900/20 py-16 text-center text-zinc-500">
          <p className="text-sm">No repositories found matching your filters.</p>
        </div>
      ) : (
        <div
          className={viewMode === 'block' ? 'grid grid-cols-1 gap-4 md:grid-cols-2' : 'space-y-3'}
        >
          {filteredRepos.map((repo) => {
            const form = editedRepos[repo.repoId] || {
              displayName: repo.displayName || '',
              description: repo.description || '',
              coverImage: repo.coverImage || '',
              demoUrl: repo.demoUrl || '',
              isWip: Boolean(repo.isWip),
            };
            const isExpanded = Boolean(expandedRepoIds[repo.repoId]);
            const isSaving = savingRepoId === repo.repoId;
            const isSaved = savedSuccessRepoId === repo.repoId;

            return (
              <RepoCardEditor
                key={repo.repoId}
                repo={repo}
                form={form}
                isExpanded={isExpanded}
                isSaving={isSaving}
                isSaved={isSaved}
                onToggleExpand={() => onToggleExpand(repo.repoId)}
                onToggleVisibility={() => onToggleVisibility(repo)}
                onFieldChange={(field, val) => onFieldChange(repo.repoId, field, val)}
                onSave={() => onSaveRepoChanges(repo.repoId)}
                onCollapse={() => onToggleExpand(repo.repoId)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
