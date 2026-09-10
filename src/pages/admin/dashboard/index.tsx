import withAuth, { WithAuthProps } from '@/components/auth/withAuth';
import SEO from '@/components/SEO';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FaArrowDown,
  FaArrowUp,
  FaCheck,
  FaExchangeAlt,
  FaExternalLinkAlt,
  FaEye,
  FaEyeSlash,
  FaGithub,
  FaLayerGroup,
  FaList,
  FaRedo,
  FaSave,
  FaSearch,
  FaSignOutAlt,
  FaStar,
  FaSync,
  FaThLarge,
  FaUserShield,
} from 'react-icons/fa';

interface RepoRecord {
  repoId: number;
  name: string;
  description: string | null;
  url: string | null;
  visible: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

type ActiveTab = 'repositories' | 'order';
type ViewMode = 'block' | 'list';

function AdminDashboard({ user }: WithAuthProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ActiveTab>('repositories');
  const [viewMode, setViewMode] = useState<ViewMode>('block');
  const [repos, setRepos] = useState<RepoRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [savingBatchOrder, setSavingBatchOrder] = useState(false);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'visible' | 'hidden'>('all');
  const [editingDescriptions, setEditingDescriptions] = useState<Record<number, string>>({});
  const [savingId, setSavingId] = useState<number | null>(null);
  const [savedSuccessId, setSavedSuccessId] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: 'success' | 'error';
  } | null>(null);

  // Editable ordered list for the Order tab
  const [orderedRepos, setOrderedRepos] = useState<RepoRecord[]>([]);
  const [hasOrderChanges, setHasOrderChanges] = useState(false);

  const showToast = useCallback((text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  }, []);

  // Fetch repositories from API
  const fetchRepos = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/repos');
      if (res.ok) {
        const data: RepoRecord[] = await res.json();
        setRepos(data);

        // Sort for the ordering tab: custom order > 0 first, then alphabetical
        const visibleSorted = data
          .filter((r) => r.visible)
          .sort((a, b) => {
            const oA = a.order > 0 ? a.order : Infinity;
            const oB = b.order > 0 ? b.order : Infinity;
            if (oA !== oB) return oA - oB;
            return (a.name || '').localeCompare(b.name || '');
          });

        setOrderedRepos(visibleSorted);
        setHasOrderChanges(false);

        // Initialize descriptions map
        const descMap: Record<number, string> = {};
        data.forEach((r) => {
          descMap[r.repoId] = r.description || '';
        });
        setEditingDescriptions(descMap);
      } else {
        showToast('Failed to load repositories', 'error');
      }
    } catch {
      showToast('Network error while fetching repositories', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchRepos();
  }, [fetchRepos]);

  // Handle Logout
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin');
    } catch {
      router.push('/admin');
    }
  };

  // Toggle Visibility
  const handleToggleVisibility = async (repo: RepoRecord) => {
    const nextVisible = !repo.visible;

    // Optimistic update
    setRepos((prev) =>
      prev.map((r) => (r.repoId === repo.repoId ? { ...r, visible: nextVisible } : r)),
    );

    // Update orderedRepos list accordingly
    setOrderedRepos((prev) => {
      if (!nextVisible) {
        return prev.filter((r) => r.repoId !== repo.repoId);
      }
      return [...prev, { ...repo, visible: true }];
    });

    try {
      const res = await fetch('/api/admin/repos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repoId: repo.repoId,
          visible: nextVisible,
        }),
      });

      if (!res.ok) {
        // Revert on error
        setRepos((prev) =>
          prev.map((r) => (r.repoId === repo.repoId ? { ...r, visible: repo.visible } : r)),
        );
        showToast('Failed to update visibility', 'error');
      } else {
        showToast(`Repository ${repo.name} is now ${nextVisible ? 'visible' : 'hidden'}.`);
      }
    } catch {
      setRepos((prev) =>
        prev.map((r) => (r.repoId === repo.repoId ? { ...r, visible: repo.visible } : r)),
      );
      showToast('Failed to update visibility', 'error');
    }
  };

  // Save Description
  const handleSaveDescription = async (repoId: number) => {
    const newDesc = editingDescriptions[repoId] ?? '';
    setSavingId(repoId);

    try {
      const res = await fetch('/api/admin/repos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repoId,
          description: newDesc,
        }),
      });

      if (res.ok) {
        setRepos((prev) =>
          prev.map((r) => (r.repoId === repoId ? { ...r, description: newDesc } : r)),
        );
        setSavedSuccessId(repoId);
        setTimeout(() => setSavedSuccessId(null), 2500);
        showToast('Description updated successfully.');
      } else {
        showToast('Failed to update description', 'error');
      }
    } catch {
      showToast('Failed to update description', 'error');
    } finally {
      setSavingId(null);
    }
  };

  // Sync with GitHub
  const handleSyncGithub = async () => {
    setSyncing(true);
    try {
      const res = await fetch('/api/admin/sync', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        showToast(data.message || 'Repositories synced successfully from GitHub.');
        await fetchRepos();
      } else {
        showToast(data.message || 'Sync failed', 'error');
      }
    } catch {
      showToast('Sync request failed', 'error');
    } finally {
      setSyncing(false);
    }
  };

  // Reordering helpers for the Order tab
  const moveItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= orderedRepos.length) return;

    const newItems = [...orderedRepos];
    const [moved] = newItems.splice(index, 1);
    newItems.splice(targetIndex, 0, moved);

    const indexed = newItems.map((item, idx) => ({
      ...item,
      order: idx + 1,
    }));

    setOrderedRepos(indexed);
    setHasOrderChanges(true);
  };

  const moveItemToExtremity = (index: number, extremity: 'top' | 'bottom') => {
    const newItems = [...orderedRepos];
    const [moved] = newItems.splice(index, 1);
    if (extremity === 'top') {
      newItems.unshift(moved);
    } else {
      newItems.push(moved);
    }

    const indexed = newItems.map((item, idx) => ({
      ...item,
      order: idx + 1,
    }));

    setOrderedRepos(indexed);
    setHasOrderChanges(true);
  };

  const autoIndexAll = () => {
    const indexed = orderedRepos.map((item, idx) => ({
      ...item,
      order: idx + 1,
    }));
    setOrderedRepos(indexed);
    setHasOrderChanges(true);
    showToast('Re-indexed visible repositories from 1 to ' + indexed.length);
  };

  const resetAllOrders = async () => {
    const cleared = orderedRepos.map((item) => ({
      ...item,
      order: 0,
    }));
    setOrderedRepos(cleared);
    setHasOrderChanges(true);
    showToast('Orders cleared to 0 (default sorting will apply). Click "Save Order" to commit.');
  };

  // Save Batch Order
  const handleSaveBatchOrder = async () => {
    setSavingBatchOrder(true);
    try {
      const items = orderedRepos.map((r, idx) => ({
        repoId: r.repoId,
        order: r.order > 0 ? r.order : idx + 1,
      }));

      const res = await fetch('/api/admin/repos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });

      if (res.ok) {
        showToast('Portfolio display order successfully saved!');
        setHasOrderChanges(false);
        await fetchRepos();
      } else {
        showToast('Failed to save display order', 'error');
      }
    } catch {
      showToast('Network error while saving order', 'error');
    } finally {
      setSavingBatchOrder(false);
    }
  };

  // Filtered repos for the All Repositories tab
  const filteredRepos = useMemo(() => {
    return repos.filter((repo) => {
      const matchesSearch =
        repo.name.toLowerCase().includes(search.toLowerCase()) ||
        (repo.description && repo.description.toLowerCase().includes(search.toLowerCase()));

      if (!matchesSearch) return false;

      if (filterStatus === 'visible') return repo.visible;
      if (filterStatus === 'hidden') return !repo.visible;
      return true;
    });
  }, [repos, search, filterStatus]);

  // Counts
  const counts = useMemo(() => {
    const total = repos.length;
    const visible = repos.filter((r) => r.visible).length;
    const hidden = total - visible;
    const customOrdered = repos.filter((r) => r.order && r.order > 0).length;
    return { total, visible, hidden, customOrdered };
  }, [repos]);

  return (
    <>
      <SEO page="dashboard" />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div
            className={`rounded-xl border px-4 py-3 text-sm font-medium shadow-2xl backdrop-blur-xl ${
              toastMessage.type === 'error'
                ? 'border-red-500/30 bg-red-950/90 text-red-200'
                : 'border-emerald-500/30 bg-zinc-900/90 text-emerald-300'
            }`}
          >
            {toastMessage.text}
          </div>
        </div>
      )}

      {/* FULL WIDTH CONTAINER */}
      <div className="w-full px-4 py-6 sm:px-8 lg:px-12 xl:px-16">
        {/* Top Header Bar */}
        <div className="mb-6 flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-zinc-950/70 p-6 backdrop-blur-xl sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-md shadow-emerald-500/10">
                <FaUserShield className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                  Back Office Dashboard
                </h1>
                <p className="text-xs text-zinc-400">
                  Logged in as <span className="font-medium text-zinc-200">{user?.email}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400">
              ADMINISTRATOR
            </span>
            <Link
              href="/projects"
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-medium text-zinc-300 transition-all hover:border-white/20 hover:text-white"
            >
              <FaExternalLinkAlt className="h-3 w-3" />
              Live Portfolio
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/10 px-3.5 py-2 text-xs font-medium text-red-400 transition-all hover:bg-red-500/20 hover:text-red-300"
            >
              <FaSignOutAlt className="h-3 w-3" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Global Stats Grid */}
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-5 backdrop-blur-md">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
              Total Managed
            </p>
            <p className="mt-1 text-2xl font-bold text-white sm:text-3xl">{counts.total}</p>
            <p className="mt-0.5 text-xs text-zinc-500">Repositories in DB</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                Public Visible
              </p>
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
            </div>
            <p className="mt-1 text-2xl font-bold text-emerald-400 sm:text-3xl">{counts.visible}</p>
            <p className="mt-0.5 text-xs text-zinc-500">Displayed on website</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                Hidden Repos
              </p>
              <span className="flex h-2 w-2 rounded-full bg-zinc-500" />
            </div>
            <p className="mt-1 text-2xl font-bold text-zinc-400 sm:text-3xl">{counts.hidden}</p>
            <p className="mt-0.5 text-xs text-zinc-500">Filtered out from site</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                Custom Ordered
              </p>
              <FaStar className="h-3 w-3 text-emerald-400" />
            </div>
            <p className="mt-1 text-2xl font-bold text-emerald-300 sm:text-3xl">
              {counts.customOrdered}
            </p>
            <p className="mt-0.5 text-xs text-zinc-500">Priority order set</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
          <button
            onClick={() => setActiveTab('repositories')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'repositories'
                ? 'border border-emerald-500/40 bg-emerald-500/15 text-emerald-300 shadow-md shadow-emerald-500/10'
                : 'border border-transparent bg-zinc-900/50 text-zinc-400 hover:border-white/10 hover:text-zinc-200'
            }`}
          >
            <FaLayerGroup className="h-3.5 w-3.5" />
            All Repositories ({counts.total})
          </button>

          <button
            onClick={() => setActiveTab('order')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'order'
                ? 'border border-emerald-500/40 bg-emerald-500/15 text-emerald-300 shadow-md shadow-emerald-500/10'
                : 'border border-transparent bg-zinc-900/50 text-zinc-400 hover:border-white/10 hover:text-zinc-200'
            }`}
          >
            <FaExchangeAlt className="h-3.5 w-3.5 text-emerald-400" />
            Portfolio Display Order ({counts.visible} visible)
            {hasOrderChanges && (
              <span className="ml-1.5 h-2 w-2 animate-pulse rounded-full bg-amber-400" />
            )}
          </button>
        </div>

        {/* TAB 1: ALL REPOSITORIES */}
        {activeTab === 'repositories' && (
          <div className="rounded-2xl border border-white/10 bg-zinc-950/70 p-6 backdrop-blur-xl">
            {/* Controls Bar */}
            <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              {/* Search */}
              <div className="relative max-w-md flex-1">
                <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-zinc-500" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search repository by name or description..."
                  className="w-full rounded-xl border border-white/10 bg-zinc-900/80 py-2 pl-9 pr-4 text-xs text-zinc-100 placeholder-zinc-500 transition-all focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* View layout toggle, Status Filter pills, and GitHub Sync */}
              <div className="flex flex-wrap items-center gap-3">
                {/* View Switcher (Block vs List) */}
                <div className="flex rounded-xl border border-white/10 bg-zinc-900/60 p-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setViewMode('block')}
                    title="Vue en blocs"
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-all ${
                      viewMode === 'block'
                        ? 'bg-emerald-500/20 text-emerald-300 shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <FaThLarge className="h-3 w-3" />
                    Blocs
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    title="Vue en liste"
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-all ${
                      viewMode === 'list'
                        ? 'bg-zinc-800 text-white shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <FaList className="h-3 w-3" />
                    Liste
                  </button>
                </div>

                {/* Status Pills */}
                <div className="flex rounded-lg border border-white/5 bg-zinc-900/60 p-1 text-xs">
                  <button
                    onClick={() => setFilterStatus('all')}
                    className={`rounded-md px-3 py-1 font-medium transition-all ${
                      filterStatus === 'all'
                        ? 'bg-zinc-800 text-white shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    All ({counts.total})
                  </button>
                  <button
                    onClick={() => setFilterStatus('visible')}
                    className={`rounded-md px-3 py-1 font-medium transition-all ${
                      filterStatus === 'visible'
                        ? 'bg-emerald-500/20 text-emerald-300 shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Visible ({counts.visible})
                  </button>
                  <button
                    onClick={() => setFilterStatus('hidden')}
                    className={`rounded-md px-3 py-1 font-medium transition-all ${
                      filterStatus === 'hidden'
                        ? 'bg-zinc-800 text-zinc-300 shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Hidden ({counts.hidden})
                  </button>
                </div>

                <button
                  onClick={handleSyncGithub}
                  disabled={syncing}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-400 shadow-sm transition-all hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FaSync className={`h-3 w-3 ${syncing ? 'animate-spin' : ''}`} />
                  {syncing ? 'Syncing...' : 'Sync GitHub'}
                </button>
              </div>
            </div>

            {/* Repositories Rendering */}
            {loading ? (
              <div className="flex min-h-[300px] flex-col items-center justify-center space-y-3">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
                <p className="text-xs text-zinc-400">Loading repositories...</p>
              </div>
            ) : filteredRepos.length === 0 ? (
              <div className="flex min-h-[200px] flex-col items-center justify-center rounded-xl border border-dashed border-white/10 p-8 text-center">
                <p className="text-sm font-medium text-zinc-300">No repositories found</p>
                <p className="mt-1 text-xs text-zinc-500">
                  Try adjusting your search criteria or sync fresh repos from GitHub.
                </p>
              </div>
            ) : viewMode === 'block' ? (
              /* VUE EN BLOCS (GRID CARDS) */
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
                {filteredRepos.map((repo) => {
                  const currentEdit = editingDescriptions[repo.repoId] ?? '';
                  const hasModifiedDesc = currentEdit !== (repo.description || '');
                  const isSaving = savingId === repo.repoId;
                  const isSaved = savedSuccessId === repo.repoId;

                  return (
                    <div
                      key={repo.repoId}
                      className={`flex flex-col justify-between rounded-2xl border p-5 transition-all ${
                        repo.visible
                          ? 'border-white/10 bg-zinc-900/50 hover:border-emerald-500/30 hover:bg-zinc-900/80 hover:shadow-lg hover:shadow-emerald-500/5'
                          : 'border-white/5 bg-zinc-950/40 opacity-75 hover:opacity-100'
                      }`}
                    >
                      {/* Top row */}
                      <div>
                        <div className="mb-3 flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${
                                repo.visible
                                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                                  : 'border-zinc-700 bg-zinc-800/60 text-zinc-500'
                              }`}
                            >
                              <FaGithub className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="line-clamp-1 text-sm font-bold text-white">
                                  {repo.name}
                                </span>
                                {repo.url && (
                                  <a
                                    href={repo.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-zinc-500 transition-colors hover:text-zinc-300"
                                    title="Open on GitHub"
                                  >
                                    <FaExternalLinkAlt className="h-2.5 w-2.5" />
                                  </a>
                                )}
                              </div>
                              <span className="text-[11px] text-zinc-500">ID: {repo.repoId}</span>
                            </div>
                          </div>

                          {repo.order && repo.order > 0 ? (
                            <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-bold text-emerald-400">
                              #{repo.order}
                            </span>
                          ) : null}
                        </div>

                        {/* Visibility Toggle Button (in block) */}
                        <div className="mb-3">
                          <button
                            type="button"
                            onClick={() => handleToggleVisibility(repo)}
                            className={`flex w-full items-center justify-center gap-1.5 rounded-xl border py-1.5 text-xs font-semibold transition-all ${
                              repo.visible
                                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                                : 'border-white/10 bg-white/[0.04] text-zinc-400 hover:border-white/20 hover:text-zinc-200'
                            }`}
                          >
                            {repo.visible ? (
                              <>
                                <FaEye className="h-3 w-3 text-emerald-400" />
                                Visible on site
                              </>
                            ) : (
                              <>
                                <FaEyeSlash className="h-3 w-3 text-zinc-500" />
                                Hidden
                              </>
                            )}
                          </button>
                        </div>

                        {/* Description Textarea in block */}
                        <div className="mb-4">
                          <label className="mb-1 block text-[11px] font-medium text-zinc-400">
                            Custom Description
                          </label>
                          <textarea
                            rows={3}
                            value={currentEdit}
                            onChange={(e) => {
                              const val = e.target.value;
                              setEditingDescriptions((prev) => ({
                                ...prev,
                                [repo.repoId]: val,
                              }));
                            }}
                            placeholder="Add custom description for the portfolio..."
                            className="w-full resize-none rounded-xl border border-white/10 bg-zinc-950/70 p-2.5 text-xs text-zinc-200 placeholder-zinc-600 transition-all focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20"
                          />
                        </div>
                      </div>

                      {/* Bottom row: Save button */}
                      <div className="flex items-center justify-between border-t border-white/5 pt-3">
                        <span className="text-[11px] text-zinc-500">
                          {repo.order > 0 ? `Rank: #${repo.order}` : 'Default order'}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleSaveDescription(repo.repoId)}
                          disabled={!hasModifiedDesc || isSaving}
                          className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                            isSaved
                              ? 'border border-emerald-500/30 bg-emerald-500/20 text-emerald-300'
                              : hasModifiedDesc
                                ? 'bg-emerald-500 text-zinc-950 shadow-sm hover:bg-emerald-400'
                                : 'cursor-not-allowed border border-white/5 bg-white/[0.02] text-zinc-600'
                          }`}
                        >
                          {isSaving ? (
                            <div className="h-3 w-3 animate-spin rounded-full border-2 border-zinc-950 border-t-transparent" />
                          ) : isSaved ? (
                            <>
                              <FaCheck className="h-3 w-3 text-emerald-400" />
                              Saved
                            </>
                          ) : (
                            <>
                              <FaSave className="h-3 w-3" />
                              Save
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* VUE EN LISTE (COMPACT ROWS) */
              <div className="divide-y divide-white/5 overflow-hidden rounded-xl border border-white/5">
                {filteredRepos.map((repo) => {
                  const currentEdit = editingDescriptions[repo.repoId] ?? '';
                  const hasModifiedDesc = currentEdit !== (repo.description || '');
                  const isSaving = savingId === repo.repoId;
                  const isSaved = savedSuccessId === repo.repoId;

                  return (
                    <div
                      key={repo.repoId}
                      className="flex flex-col gap-4 p-4 transition-colors hover:bg-white/[0.02] sm:p-5"
                    >
                      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${
                              repo.visible
                                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                                : 'border-zinc-700 bg-zinc-800/60 text-zinc-500'
                            }`}
                          >
                            <FaGithub className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-white">{repo.name}</span>
                              {repo.url && (
                                <a
                                  href={repo.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-zinc-500 transition-colors hover:text-zinc-300"
                                  title="Open on GitHub"
                                >
                                  <FaExternalLinkAlt className="h-2.5 w-2.5" />
                                </a>
                              )}
                              {repo.order && repo.order > 0 ? (
                                <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-400">
                                  #{repo.order}
                                </span>
                              ) : null}
                            </div>
                            <span className="text-[11px] text-zinc-500">ID: {repo.repoId}</span>
                          </div>
                        </div>

                        {/* Visibility Toggle Button */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleVisibility(repo)}
                            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                              repo.visible
                                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                                : 'border-white/10 bg-white/[0.04] text-zinc-400 hover:border-white/20 hover:text-zinc-200'
                            }`}
                          >
                            {repo.visible ? (
                              <>
                                <FaEye className="h-3 w-3 text-emerald-400" />
                                Visible on site
                              </>
                            ) : (
                              <>
                                <FaEyeSlash className="h-3 w-3 text-zinc-500" />
                                Hidden
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Custom Description Edit Field */}
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            value={currentEdit}
                            onChange={(e) => {
                              const val = e.target.value;
                              setEditingDescriptions((prev) => ({
                                ...prev,
                                [repo.repoId]: val,
                              }));
                            }}
                            placeholder="Add custom description for the portfolio..."
                            className="w-full rounded-lg border border-white/10 bg-zinc-900/70 px-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-600 transition-all focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => handleSaveDescription(repo.repoId)}
                          disabled={!hasModifiedDesc || isSaving}
                          className={`inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                            isSaved
                              ? 'border border-emerald-500/30 bg-emerald-500/20 text-emerald-300'
                              : hasModifiedDesc
                                ? 'bg-emerald-500 text-zinc-950 shadow-sm hover:bg-emerald-400'
                                : 'cursor-not-allowed border border-white/5 bg-white/[0.02] text-zinc-600'
                          }`}
                        >
                          {isSaving ? (
                            <div className="h-3 w-3 animate-spin rounded-full border-2 border-zinc-950 border-t-transparent" />
                          ) : isSaved ? (
                            <>
                              <FaCheck className="h-3 w-3 text-emerald-400" />
                              Saved
                            </>
                          ) : (
                            <>
                              <FaSave className="h-3 w-3" />
                              Save
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PORTFOLIO DISPLAY ORDER */}
        {activeTab === 'order' && (
          <div className="rounded-2xl border border-white/10 bg-zinc-950/70 p-6 backdrop-blur-xl">
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-lg font-bold text-white sm:text-xl">
                  Portfolio Showcase Order
                </h2>
                <p className="mt-1 text-xs text-zinc-400">
                  Control the exact rank and sequence of visible projects displayed on your
                  portfolio. The top 5 projects will be featured prominently on the homepage!
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={autoIndexAll}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-medium text-zinc-300 transition-all hover:bg-white/[0.08]"
                >
                  <FaRedo className="h-3 w-3" />
                  Auto-Index 1..{orderedRepos.length}
                </button>
                <button
                  type="button"
                  onClick={resetAllOrders}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900/60 px-3.5 py-2 text-xs font-medium text-zinc-400 transition-all hover:text-zinc-200"
                >
                  Clear Custom Orders
                </button>
                <button
                  type="button"
                  onClick={handleSaveBatchOrder}
                  disabled={savingBatchOrder || !hasOrderChanges}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                    hasOrderChanges
                      ? 'bg-emerald-500 text-zinc-950 shadow-lg shadow-emerald-500/20 hover:bg-emerald-400'
                      : 'cursor-not-allowed border border-white/5 bg-white/[0.03] text-zinc-600'
                  }`}
                >
                  {savingBatchOrder ? (
                    <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-zinc-950 border-t-transparent" />
                  ) : (
                    <FaSave className="h-3.5 w-3.5" />
                  )}
                  Save New Order
                </button>
              </div>
            </div>

            {hasOrderChanges && (
              <div className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-300">
                You have unsaved order adjustments. Remember to click{' '}
                <span className="font-bold">Save New Order</span> when satisfied!
              </div>
            )}

            {/* List of Ordered Repos */}
            {orderedRepos.length === 0 ? (
              <div className="flex min-h-[200px] flex-col items-center justify-center rounded-xl border border-dashed border-white/10 p-8 text-center">
                <p className="text-sm font-medium text-zinc-300">
                  No visible repositories to order
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  Switch to the &quot;All Repositories&quot; tab and set some repositories as
                  visible first.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {orderedRepos.map((repo, index) => {
                  const isFirst = index === 0;
                  const isLast = index === orderedRepos.length - 1;
                  const isFeaturedTop5 = index < 5;

                  return (
                    <div
                      key={repo.repoId}
                      className={`flex flex-col justify-between gap-3 rounded-xl border p-3.5 transition-all sm:flex-row sm:items-center ${
                        isFeaturedTop5
                          ? 'border-emerald-500/25 bg-emerald-500/[0.03] hover:bg-emerald-500/[0.06]'
                          : 'border-white/5 bg-zinc-900/40 hover:bg-zinc-900/60'
                      }`}
                    >
                      {/* Rank badge and info */}
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                            isFeaturedTop5
                              ? 'border border-emerald-500/40 bg-emerald-500/20 text-emerald-300 shadow-sm shadow-emerald-500/20'
                              : 'border border-white/10 bg-zinc-800 text-zinc-400'
                          }`}
                        >
                          #{index + 1}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white">{repo.name}</span>
                            {isFeaturedTop5 && (
                              <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                                <FaStar className="h-2.5 w-2.5" />
                                Homepage Top 5
                              </span>
                            )}
                          </div>
                          <p className="line-clamp-1 text-xs text-zinc-400">
                            {repo.description || 'No description specified.'}
                          </p>
                        </div>
                      </div>

                      {/* Reorder Buttons */}
                      <div className="flex items-center gap-1.5 self-end sm:self-auto">
                        <button
                          type="button"
                          onClick={() => moveItemToExtremity(index, 'top')}
                          disabled={isFirst}
                          title="Move to top (#1)"
                          className="rounded-lg border border-white/10 bg-white/[0.04] p-2 text-xs text-zinc-300 transition-all hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          ⤒
                        </button>
                        <button
                          type="button"
                          onClick={() => moveItem(index, 'up')}
                          disabled={isFirst}
                          title="Move up"
                          className="rounded-lg border border-white/10 bg-white/[0.04] p-2 text-xs text-zinc-300 transition-all hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <FaArrowUp className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveItem(index, 'down')}
                          disabled={isLast}
                          title="Move down"
                          className="rounded-lg border border-white/10 bg-white/[0.04] p-2 text-xs text-zinc-300 transition-all hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <FaArrowDown className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveItemToExtremity(index, 'bottom')}
                          disabled={isLast}
                          title="Move to bottom"
                          className="rounded-lg border border-white/10 bg-white/[0.04] p-2 text-xs text-zinc-300 transition-all hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          ⤓
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default withAuth(AdminDashboard);
