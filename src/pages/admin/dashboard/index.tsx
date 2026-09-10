import withAuth, { WithAuthProps } from '@/components/auth/withAuth';
import SEO from '@/components/SEO';
import { AVAILABLE_SOCIAL_ICONS, SocialIcon } from '@/components/icons/SocialIcon';
import { ExperienceType, SiteSettingsType, SocialLinkType } from '@/types/types';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FaArrowDown,
  FaArrowUp,
  FaBriefcase,
  FaCheck,
  FaChevronDown,
  FaChevronUp,
  FaCog,
  FaExternalLinkAlt,
  FaEye,
  FaEyeSlash,
  FaGraduationCap,
  FaImage,
  FaLayerGroup,
  FaList,
  FaPlus,
  FaRedo,
  FaSave,
  FaSearch,
  FaSignOutAlt,
  FaSortAmountDown,
  FaStar,
  FaSync,
  FaThLarge,
  FaTrash,
  FaUserShield,
} from 'react-icons/fa';

export interface AdminRepoRecord {
  repoId: number;
  name: string;
  description: string | null;
  url: string | null;
  visible: boolean;
  order: number;
  displayName?: string | null;
  coverImage?: string | null;
  demoUrl?: string | null;
  isWip?: boolean;
  createdAt: string;
  updatedAt: string;
}

type NavCategory = 'projects-catalog' | 'projects-order' | 'experiences' | 'settings';
type ViewMode = 'block' | 'list';

function AdminDashboard({ user }: WithAuthProps) {
  const router = useRouter();

  // Navigation State
  const [activeCategory, setActiveCategory] = useState<NavCategory>('projects-catalog');
  const [viewMode, setViewMode] = useState<ViewMode>('block');

  // Repositories State
  const [repos, setRepos] = useState<AdminRepoRecord[]>([]);
  const [loadingRepos, setLoadingRepos] = useState(true);
  const [syncingGithub, setSyncingGithub] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'visible' | 'hidden' | 'wip'>('all');
  const [expandedRepoIds, setExpandedRepoIds] = useState<Record<number, boolean>>({});
  const [savingRepoId, setSavingRepoId] = useState<number | null>(null);
  const [savedSuccessRepoId, setSavedSuccessRepoId] = useState<number | null>(null);

  // Editable fields map for repos
  const [editedRepos, setEditedRepos] = useState<
    Record<
      number,
      {
        displayName: string;
        description: string;
        coverImage: string;
        demoUrl: string;
        isWip: boolean;
      }
    >
  >({});

  // Ordering Tab Repos
  const [orderedRepos, setOrderedRepos] = useState<AdminRepoRecord[]>([]);
  const [hasOrderChanges, setHasOrderChanges] = useState(false);
  const [savingBatchOrder, setSavingBatchOrder] = useState(false);

  // Experiences State
  const [experiences, setExperiences] = useState<ExperienceType[]>([]);
  const [loadingExperiences, setLoadingExperiences] = useState(false);
  const [isAddingExperience, setIsAddingExperience] = useState(false);
  const [expandedExpIds, setExpandedExpIds] = useState<Record<number, boolean>>({});
  const [confirmDeleteExpId, setConfirmDeleteExpId] = useState<number | null>(null);
  const [savingExpId, setSavingExpId] = useState<number | null>(null);

  // New Experience Form
  const [newExpForm, setNewExpForm] = useState<{
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    type: 'work' | 'education';
    description: string;
    skills: string;
  }>({
    title: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    type: 'work',
    description: '',
    skills: '',
  });

  // Settings State
  const [siteSettings, setSiteSettings] = useState<SiteSettingsType>({
    id: 1,
    availabilityText: 'Available for new opportunities',
    heroHeadline: 'Hello ! My name is Florian Mangin',
    heroSubtitle:
      'Software Engineer passionate about crafting robust software, clean architectures, and modern web applications.',
    resumeUrl: '/cv.pdf',
  });
  const [socialLinks, setSocialLinks] = useState<SocialLinkType[]>([]);
  const [loadingSettings, setLoadingSettings] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: 'success' | 'error';
  } | null>(null);

  const showToast = useCallback((text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      (setToastMessage(null), 4000);
    });
  }, []);

  // 1. Fetch Repositories
  const fetchRepos = useCallback(async () => {
    setLoadingRepos(true);
    try {
      const res = await fetch('/api/admin/repos');
      if (res.ok) {
        const data: AdminRepoRecord[] = await res.json();
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

        // Initialize edited map
        const formMap: Record<
          number,
          {
            displayName: string;
            description: string;
            coverImage: string;
            demoUrl: string;
            isWip: boolean;
          }
        > = {};
        data.forEach((r) => {
          formMap[r.repoId] = {
            displayName: r.displayName || '',
            description: r.description || '',
            coverImage: r.coverImage || '',
            demoUrl: r.demoUrl || '',
            isWip: Boolean(r.isWip),
          };
        });
        setEditedRepos(formMap);
      } else {
        showToast('Failed to load repositories', 'error');
      }
    } catch {
      showToast('Network error while loading repositories', 'error');
    } finally {
      setLoadingRepos(false);
    }
  }, [showToast]);

  // 2. Fetch Experiences
  const fetchExperiences = useCallback(async () => {
    setLoadingExperiences(true);
    try {
      const res = await fetch('/api/admin/experiences');
      if (res.ok) {
        const data: ExperienceType[] = await res.json();
        setExperiences(data);
      } else {
        showToast('Failed to load experiences', 'error');
      }
    } catch {
      showToast('Network error loading experiences', 'error');
    } finally {
      setLoadingExperiences(false);
    }
  }, [showToast]);

  // 3. Fetch Settings
  const fetchSettings = useCallback(async () => {
    setLoadingSettings(true);
    try {
      const res = await fetch('/api/admin/settings');
      if (res.ok) {
        const data = await res.json();
        if (data.settings) setSiteSettings(data.settings);
        if (data.socialLinks) setSocialLinks(data.socialLinks);
      } else {
        showToast('Failed to load site settings', 'error');
      }
    } catch {
      showToast('Network error loading site settings', 'error');
    } finally {
      setLoadingSettings(false);
    }
  }, [showToast]);

  // Initial Data Loading
  useEffect(() => {
    fetchRepos();
    fetchExperiences();
    fetchSettings();
  }, [fetchRepos, fetchExperiences, fetchSettings]);

  // Logout
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin');
    } catch {
      router.push('/admin');
    }
  };

  // Sync GitHub
  const handleSyncGithub = async () => {
    setSyncingGithub(true);
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
      setSyncingGithub(false);
    }
  };

  // Toggle Project Visibility
  const handleToggleVisibility = async (repo: AdminRepoRecord) => {
    const nextVisible = !repo.visible;
    setRepos((prev) =>
      prev.map((r) => (r.repoId === repo.repoId ? { ...r, visible: nextVisible } : r)),
    );

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
        setRepos((prev) =>
          prev.map((r) => (r.repoId === repo.repoId ? { ...r, visible: repo.visible } : r)),
        );
        showToast('Failed to update visibility', 'error');
      } else {
        showToast(`Repository "${repo.name}" is now ${nextVisible ? 'visible' : 'hidden'}.`);
      }
    } catch {
      setRepos((prev) =>
        prev.map((r) => (r.repoId === repo.repoId ? { ...r, visible: repo.visible } : r)),
      );
      showToast('Failed to update visibility', 'error');
    }
  };

  // Save Project Changes
  const handleSaveRepoChanges = async (repoId: number) => {
    const form = editedRepos[repoId];
    if (!form) return;

    setSavingRepoId(repoId);
    try {
      const res = await fetch('/api/admin/repos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repoId,
          displayName: form.displayName || null,
          description: form.description || null,
          coverImage: form.coverImage || null,
          demoUrl: form.demoUrl || null,
          isWip: form.isWip,
        }),
      });

      if (res.ok) {
        setRepos((prev) =>
          prev.map((r) =>
            r.repoId === repoId
              ? {
                  ...r,
                  displayName: form.displayName || null,
                  description: form.description || null,
                  coverImage: form.coverImage || null,
                  demoUrl: form.demoUrl || null,
                  isWip: form.isWip,
                }
              : r,
          ),
        );
        setSavedSuccessRepoId(repoId);
        setTimeout(() => setSavedSuccessRepoId(null), 2500);
        showToast('Repository details saved successfully.');
      } else {
        showToast('Failed to save repository details', 'error');
      }
    } catch {
      showToast('Network error saving repository', 'error');
    } finally {
      setSavingRepoId(null);
    }
  };

  // Reordering helpers for Projects
  const moveOrderItem = (index: number, direction: 'up' | 'down') => {
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

  const moveOrderToExtremity = (index: number, extremity: 'top' | 'bottom') => {
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

  const handleSaveBatchOrder = async () => {
    setSavingBatchOrder(true);
    try {
      const items = orderedRepos.map((r, idx) => ({
        repoId: r.repoId,
        order: idx + 1,
      }));

      const res = await fetch('/api/admin/repos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });

      if (res.ok) {
        showToast('Custom project order saved successfully.');
        setHasOrderChanges(false);
        await fetchRepos();
      } else {
        showToast('Failed to save project order', 'error');
      }
    } catch {
      showToast('Error saving project order', 'error');
    } finally {
      setSavingBatchOrder(false);
    }
  };

  // Experience Handlers
  const handleCreateExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpForm.title.trim() || !newExpForm.company.trim() || !newExpForm.startDate.trim()) {
      showToast('Title, company, and start date are required', 'error');
      return;
    }

    try {
      const res = await fetch('/api/admin/experiences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newExpForm),
      });

      if (res.ok) {
        showToast('Experience added successfully.');
        setIsAddingExperience(false);
        setNewExpForm({
          title: '',
          company: '',
          location: '',
          startDate: '',
          endDate: '',
          current: false,
          type: 'work',
          description: '',
          skills: '',
        });
        await fetchExperiences();
      } else {
        showToast('Failed to add experience', 'error');
      }
    } catch {
      showToast('Network error creating experience', 'error');
    }
  };

  const handleUpdateExperience = async (exp: ExperienceType) => {
    setSavingExpId(exp.id);
    try {
      const res = await fetch('/api/admin/experiences', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(exp),
      });

      if (res.ok) {
        showToast(`Experience "${exp.title}" updated.`);
        setExpandedExpIds((prev) => ({ ...prev, [exp.id]: false }));
        await fetchExperiences();
      } else {
        showToast('Failed to update experience', 'error');
      }
    } catch {
      showToast('Network error updating experience', 'error');
    } finally {
      setSavingExpId(null);
    }
  };

  const handleDeleteExperience = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/experiences?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        showToast('Experience deleted.');
        setConfirmDeleteExpId(null);
        await fetchExperiences();
      } else {
        showToast('Failed to delete experience', 'error');
      }
    } catch {
      showToast('Network error deleting experience', 'error');
    }
  };

  const moveExperience = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= experiences.length) return;

    const list = [...experiences];
    const [moved] = list.splice(index, 1);
    list.splice(targetIndex, 0, moved);

    const reordered = list.map((item, idx) => ({ ...item, order: idx + 1 }));
    setExperiences(reordered);

    try {
      await fetch('/api/admin/experiences', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: reordered.map((r) => ({ id: r.id, order: r.order })),
        }),
      });
      showToast('Experience order updated.');
    } catch {
      showToast('Failed to save experience order', 'error');
    }
  };

  // Settings Handlers
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...siteSettings,
          socialLinks,
        }),
      });

      if (res.ok) {
        showToast('Site settings and social links updated successfully.');
      } else {
        showToast('Failed to save site settings', 'error');
      }
    } catch {
      showToast('Network error saving settings', 'error');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleAddSocialLink = () => {
    const newLink: SocialLinkType = {
      id: -Date.now(), // temporary negative ID
      platform: 'link',
      label: 'New Link',
      url: 'https://',
      icon: 'FaGlobe',
      order: socialLinks.length + 1,
      visible: true,
    };
    setSocialLinks([...socialLinks, newLink]);
  };

  const handleRemoveSocialLink = (index: number) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  };

  // Filtered Repos
  const filteredRepos = useMemo(() => {
    return repos.filter((repo) => {
      const form = editedRepos[repo.repoId] || {};
      const dispName = form.displayName || repo.displayName || repo.name;
      const matchesSearch =
        dispName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (repo.description || '').toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (filterStatus === 'visible') return repo.visible;
      if (filterStatus === 'hidden') return !repo.visible;
      if (filterStatus === 'wip') return Boolean(form.isWip || repo.isWip);
      return true;
    });
  }, [repos, editedRepos, searchQuery, filterStatus]);

  // Counts
  const counts = useMemo(
    () => ({
      total: repos.length,
      visible: repos.filter((r) => r.visible).length,
      hidden: repos.filter((r) => !r.visible).length,
      customOrdered: repos.filter((r) => r.order > 0).length,
      wip: repos.filter((r) => r.isWip).length,
      experiences: experiences.length,
    }),
    [repos, experiences],
  );

  return (
    <>
      <SEO page="dashboard" title="Admin Studio | flotss.me" />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border px-5 py-3.5 shadow-2xl backdrop-blur-xl transition-all duration-300 ${
            toastMessage.type === 'error'
              ? 'border-red-500/40 bg-red-950/90 text-red-200 shadow-red-500/10'
              : 'border-emerald-500/40 bg-zinc-900/95 text-emerald-300 shadow-emerald-500/10'
          }`}
        >
          <span
            className={`flex h-2.5 w-2.5 rounded-full ${
              toastMessage.type === 'error' ? 'bg-red-500' : 'bg-emerald-400'
            }`}
          />
          <p className="text-sm font-medium">{toastMessage.text}</p>
        </div>
      )}

      <div className="flex min-h-screen bg-zinc-950 text-zinc-100">
        {/* =========================================================================
            SIDEBAR NAVIGATION
            ========================================================================= */}
        <aside className="flex hidden w-64 flex-shrink-0 flex-col justify-between border-r border-white/5 bg-zinc-950/80 p-5 backdrop-blur-xl md:flex">
          <div>
            {/* Studio Header & User Profile */}
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-md shadow-emerald-500/10">
                <FaUserShield className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold tracking-tight text-white">flotss.me Studio</h2>
                <p className="max-w-[140px] truncate text-[11px] text-zinc-400">{user?.email}</p>
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
                  Curriculum & Bio
                </p>
                <div className="space-y-1">
                  <button
                    onClick={() => setActiveCategory('experiences')}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                      activeCategory === 'experiences'
                        ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 shadow-sm'
                        : 'text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <FaBriefcase className="h-3.5 w-3.5" />
                      Career & Education
                    </span>
                    <span className="rounded-md bg-zinc-800/80 px-1.5 py-0.5 text-[10px] text-zinc-400">
                      {counts.experiences}
                    </span>
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
              onClick={handleSyncGithub}
              disabled={syncingGithub}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-medium text-zinc-300 transition-all hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-300 disabled:opacity-50"
            >
              <FaSync
                className={`h-3 w-3 ${syncingGithub ? 'animate-spin text-emerald-400' : ''}`}
              />
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
              onClick={handleLogout}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-400 transition-all hover:bg-red-500/20 hover:text-red-300"
            >
              <FaSignOutAlt className="h-3 w-3" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* =========================================================================
            MAIN CONTENT AREA (NO MODALS)
            ========================================================================= */}
        <main className="mx-auto max-w-7xl flex-1 overflow-y-auto p-5 sm:p-8">
          {/* Mobile Top Navigation Tabs */}
          <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4 md:hidden">
            <div className="flex items-center gap-2">
              <FaUserShield className="h-4 w-4 text-emerald-400" />
              <span className="text-sm font-bold text-white">flotss.me Studio</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSyncGithub}
                disabled={syncingGithub}
                className="rounded-lg border border-white/10 bg-white/[0.04] p-2 text-xs text-zinc-300"
              >
                <FaSync className={`h-3 w-3 ${syncingGithub ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={handleLogout}
                className="rounded-lg border border-red-500/20 bg-red-500/10 p-2 text-xs text-red-400"
              >
                <FaSignOutAlt className="h-3 w-3" />
              </button>
            </div>
          </div>

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
              onClick={() => setActiveCategory('experiences')}
              className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium ${
                activeCategory === 'experiences'
                  ? 'border border-emerald-500/40 bg-emerald-500/20 text-emerald-300'
                  : 'bg-zinc-900 text-zinc-400'
              }`}
            >
              Experiences ({counts.experiences})
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

          {/* =========================================================================
              VIEW 1: PROJECTS CATALOG (WITH INLINE EXPANDABLE DETAILS)
              ========================================================================= */}
          {activeCategory === 'projects-catalog' && (
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
                  className={
                    viewMode === 'block' ? 'grid grid-cols-1 gap-4 md:grid-cols-2' : 'space-y-3'
                  }
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
                      <div
                        key={repo.repoId}
                        className="rounded-2xl border border-white/5 bg-zinc-900/40 p-5 backdrop-blur-md transition-all hover:border-white/10"
                      >
                        {/* Summary Header */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="truncate text-sm font-semibold text-white">
                                {form.displayName ? form.displayName : repo.name}
                              </h3>
                              {form.displayName && (
                                <span className="truncate text-[10px] text-zinc-500">
                                  ({repo.name})
                                </span>
                              )}
                              {form.isWip && (
                                <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                                  WIP
                                </span>
                              )}
                              {repo.order > 0 && (
                                <span className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-300">
                                  #{repo.order}
                                </span>
                              )}
                            </div>
                            <p className="line-clamp-2 text-xs text-zinc-400">
                              {form.description || 'No description provided.'}
                            </p>
                          </div>

                          <div className="flex flex-shrink-0 items-center gap-2">
                            {/* Toggle visibility */}
                            <button
                              onClick={() => handleToggleVisibility(repo)}
                              className={`rounded-xl border p-2 text-xs transition-all ${
                                repo.visible
                                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
                                  : 'border-zinc-800 bg-zinc-900 text-zinc-500 hover:text-zinc-300'
                              }`}
                              title={repo.visible ? 'Visible on site' : 'Hidden from site'}
                            >
                              {repo.visible ? (
                                <FaEye className="h-3.5 w-3.5" />
                              ) : (
                                <FaEyeSlash className="h-3.5 w-3.5" />
                              )}
                            </button>

                            {/* Inline Expand Button */}
                            <button
                              onClick={() =>
                                setExpandedRepoIds((prev) => ({
                                  ...prev,
                                  [repo.repoId]: !isExpanded,
                                }))
                              }
                              className={`rounded-xl border p-2 text-xs transition-all ${
                                isExpanded
                                  ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300'
                                  : 'border-white/10 bg-white/[0.04] text-zinc-400 hover:text-white'
                              }`}
                              title={isExpanded ? 'Collapse panel' : 'Edit details inline'}
                            >
                              {isExpanded ? (
                                <FaChevronUp className="h-3.5 w-3.5" />
                              ) : (
                                <FaChevronDown className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* INLINE EXPANDABLE EDIT PANEL (NO MODALS) */}
                        {isExpanded && (
                          <div className="mt-4 space-y-4 border-t border-white/10 pt-4">
                            {/* Custom Display Name */}
                            <div>
                              <label className="mb-1 block text-[11px] font-medium text-zinc-400">
                                Custom Display Title
                              </label>
                              <input
                                type="text"
                                value={form.displayName}
                                onChange={(e) =>
                                  setEditedRepos((prev) => ({
                                    ...prev,
                                    [repo.repoId]: {
                                      ...form,
                                      displayName: e.target.value,
                                    },
                                  }))
                                }
                                placeholder={repo.name}
                                className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-xs text-zinc-200 placeholder-zinc-600 focus:border-emerald-500/50 focus:outline-none"
                              />
                            </div>

                            {/* Cover Image & Preview */}
                            <div>
                              <label className="mb-1 block text-[11px] font-medium text-zinc-400">
                                Cover Image URL
                              </label>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={form.coverImage}
                                  onChange={(e) =>
                                    setEditedRepos((prev) => ({
                                      ...prev,
                                      [repo.repoId]: {
                                        ...form,
                                        coverImage: e.target.value,
                                      },
                                    }))
                                  }
                                  placeholder="https://... or /projects/preview.png"
                                  className="flex-1 rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-xs text-zinc-200 placeholder-zinc-600 focus:border-emerald-500/50 focus:outline-none"
                                />
                                {form.coverImage && (
                                  <a
                                    href={form.coverImage}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="rounded-xl border border-white/10 bg-white/[0.04] p-2 text-zinc-400 hover:text-white"
                                    title="Open image"
                                  >
                                    <FaImage className="h-3.5 w-3.5" />
                                  </a>
                                )}
                              </div>
                              {form.coverImage && (
                                <div className="mt-2 h-24 w-full overflow-hidden rounded-xl border border-white/5 bg-zinc-950">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={form.coverImage}
                                    alt="Cover preview"
                                    className="h-full w-full object-cover"
                                    onError={(e) => {
                                      (e.target as HTMLElement).style.display = 'none';
                                    }}
                                  />
                                </div>
                              )}
                            </div>

                            {/* Live Demo URL & WIP Toggle */}
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                              <div>
                                <label className="mb-1 block text-[11px] font-medium text-zinc-400">
                                  Live Demo URL
                                </label>
                                <input
                                  type="text"
                                  value={form.demoUrl}
                                  onChange={(e) =>
                                    setEditedRepos((prev) => ({
                                      ...prev,
                                      [repo.repoId]: {
                                        ...form,
                                        demoUrl: e.target.value,
                                      },
                                    }))
                                  }
                                  placeholder="https://demo.flotss.me"
                                  className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-xs text-zinc-200 placeholder-zinc-600 focus:border-emerald-500/50 focus:outline-none"
                                />
                              </div>

                              <div>
                                <label className="mb-1 block text-[11px] font-medium text-zinc-400">
                                  Status
                                </label>
                                <label className="mt-1.5 flex cursor-pointer items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={form.isWip}
                                    onChange={(e) =>
                                      setEditedRepos((prev) => ({
                                        ...prev,
                                        [repo.repoId]: {
                                          ...form,
                                          isWip: e.target.checked,
                                        },
                                      }))
                                    }
                                    className="rounded border-zinc-700 bg-zinc-900 text-emerald-500 focus:ring-emerald-500"
                                  />
                                  <span className="text-xs text-zinc-300">
                                    Work In Progress (WIP)
                                  </span>
                                </label>
                              </div>
                            </div>

                            {/* Description */}
                            <div>
                              <label className="mb-1 block text-[11px] font-medium text-zinc-400">
                                Custom Description
                              </label>
                              <textarea
                                rows={3}
                                value={form.description}
                                onChange={(e) =>
                                  setEditedRepos((prev) => ({
                                    ...prev,
                                    [repo.repoId]: {
                                      ...form,
                                      description: e.target.value,
                                    },
                                  }))
                                }
                                placeholder="Describe the purpose, tech stack, and achievements of this project..."
                                className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-xs text-zinc-200 placeholder-zinc-600 focus:border-emerald-500/50 focus:outline-none"
                              />
                            </div>

                            {/* Save Actions */}
                            <div className="flex items-center justify-end gap-2 pt-2">
                              <button
                                type="button"
                                onClick={() =>
                                  setExpandedRepoIds((prev) => ({
                                    ...prev,
                                    [repo.repoId]: false,
                                  }))
                                }
                                className="rounded-xl px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white"
                              >
                                Collapse
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSaveRepoChanges(repo.repoId)}
                                disabled={isSaving}
                                className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-1.5 text-xs font-semibold transition-all ${
                                  isSaved
                                    ? 'bg-emerald-500 text-zinc-950'
                                    : 'border border-emerald-500/40 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                                }`}
                              >
                                {isSaved ? (
                                  <>
                                    <FaCheck className="h-3 w-3" />
                                    <span>Saved !</span>
                                  </>
                                ) : (
                                  <>
                                    <FaSave
                                      className={`h-3 w-3 ${isSaving ? 'animate-spin' : ''}`}
                                    />
                                    <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              VIEW 2: DISPLAY ORDER MANAGEMENT (NO MODALS)
              ========================================================================= */}
          {activeCategory === 'projects-order' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/5 bg-zinc-900/30 p-5">
                <div>
                  <h2 className="text-base font-bold text-white">Project Display Ordering</h2>
                  <p className="mt-0.5 text-xs text-zinc-400">
                    Position #1 appears first on your portfolio. Repositories with custom order take
                    precedence.
                  </p>
                </div>
                <button
                  onClick={handleSaveBatchOrder}
                  disabled={!hasOrderChanges || savingBatchOrder}
                  className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold transition-all ${
                    hasOrderChanges
                      ? 'bg-emerald-500 text-zinc-950 shadow-lg shadow-emerald-500/20 hover:bg-emerald-400'
                      : 'cursor-not-allowed border border-white/10 bg-zinc-900 text-zinc-500'
                  }`}
                >
                  <FaSave className={`h-3.5 w-3.5 ${savingBatchOrder ? 'animate-spin' : ''}`} />
                  <span>{savingBatchOrder ? 'Saving Order...' : 'Save New Order'}</span>
                </button>
              </div>

              <div className="space-y-2">
                {orderedRepos.map((item, index) => (
                  <div
                    key={item.repoId}
                    className="flex items-center justify-between rounded-xl border border-white/5 bg-zinc-900/40 px-4 py-3 transition-all hover:border-white/10"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-xs font-bold text-emerald-400">
                        {index + 1}
                      </span>
                      <div className="truncate">
                        <p className="truncate text-xs font-semibold text-zinc-200">
                          {item.displayName || item.name}
                        </p>
                        {item.displayName && (
                          <p className="text-[10px] text-zinc-500">{item.name}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-shrink-0 items-center gap-1.5">
                      <button
                        onClick={() => moveOrderToExtremity(index, 'top')}
                        disabled={index === 0}
                        className="rounded-lg border border-white/5 bg-zinc-900 p-1.5 text-zinc-400 hover:text-white disabled:opacity-30"
                        title="Jump to Top"
                      >
                        <span className="text-[10px] font-bold">TOP</span>
                      </button>
                      <button
                        onClick={() => moveOrderItem(index, 'up')}
                        disabled={index === 0}
                        className="rounded-lg border border-white/5 bg-zinc-900 p-1.5 text-zinc-400 hover:text-white disabled:opacity-30"
                        title="Move Up"
                      >
                        <FaArrowUp className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => moveOrderItem(index, 'down')}
                        disabled={index === orderedRepos.length - 1}
                        className="rounded-lg border border-white/5 bg-zinc-900 p-1.5 text-zinc-400 hover:text-white disabled:opacity-30"
                        title="Move Down"
                      >
                        <FaArrowDown className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => moveOrderToExtremity(index, 'bottom')}
                        disabled={index === orderedRepos.length - 1}
                        className="rounded-lg border border-white/5 bg-zinc-900 p-1.5 text-zinc-400 hover:text-white disabled:opacity-30"
                        title="Jump to Bottom"
                      >
                        <span className="text-[10px] font-bold">END</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              VIEW 3: CAREER & EDUCATION EXPERIENCES (NO MODALS)
              ========================================================================= */}
          {activeCategory === 'experiences' && (
            <div className="space-y-6">
              {/* Header & Add Button */}
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/5 bg-zinc-900/30 p-5">
                <div>
                  <h2 className="text-base font-bold text-white">Career History & Education</h2>
                  <p className="mt-0.5 text-xs text-zinc-400">
                    Manage positions (Société Générale, Dalkia) and degrees displayed in the
                    homepage timeline.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddingExperience(!isAddingExperience)}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-zinc-950 shadow-md shadow-emerald-500/20 transition-all hover:bg-emerald-400"
                >
                  <FaPlus className="h-3 w-3" />
                  <span>{isAddingExperience ? 'Close Form' : 'Add Experience'}</span>
                </button>
              </div>

              {/* INLINE ADD FORM (NO MODALS) */}
              {isAddingExperience && (
                <form
                  onSubmit={handleCreateExperience}
                  className="space-y-4 rounded-2xl border border-emerald-500/30 bg-zinc-900/60 p-6 backdrop-blur-xl"
                >
                  <h3 className="flex items-center gap-2 text-sm font-bold text-emerald-400">
                    <FaBriefcase className="h-4 w-4" />
                    New Career Entry
                  </h3>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-[11px] font-medium text-zinc-400">
                        Position / Degree Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={newExpForm.title}
                        onChange={(e) => setNewExpForm({ ...newExpForm, title: e.target.value })}
                        placeholder="e.g. Software Engineer"
                        className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-xs text-zinc-200 focus:border-emerald-500/50 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-[11px] font-medium text-zinc-400">
                        Company / Institution *
                      </label>
                      <input
                        type="text"
                        required
                        value={newExpForm.company}
                        onChange={(e) => setNewExpForm({ ...newExpForm, company: e.target.value })}
                        placeholder="e.g. Société Générale"
                        className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-xs text-zinc-200 focus:border-emerald-500/50 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <label className="mb-1 block text-[11px] font-medium text-zinc-400">
                        Location
                      </label>
                      <input
                        type="text"
                        value={newExpForm.location}
                        onChange={(e) => setNewExpForm({ ...newExpForm, location: e.target.value })}
                        placeholder="e.g. Paris La Défense"
                        className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-xs text-zinc-200 focus:border-emerald-500/50 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-[11px] font-medium text-zinc-400">
                        Start Date *
                      </label>
                      <input
                        type="text"
                        required
                        value={newExpForm.startDate}
                        onChange={(e) =>
                          setNewExpForm({ ...newExpForm, startDate: e.target.value })
                        }
                        placeholder="e.g. Sep 2023"
                        className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-xs text-zinc-200 focus:border-emerald-500/50 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-[11px] font-medium text-zinc-400">
                        End Date
                      </label>
                      <input
                        type="text"
                        disabled={newExpForm.current}
                        value={newExpForm.current ? 'Present' : newExpForm.endDate}
                        onChange={(e) => setNewExpForm({ ...newExpForm, endDate: e.target.value })}
                        placeholder="e.g. Present"
                        className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-xs text-zinc-200 focus:border-emerald-500/50 focus:outline-none disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-6 pt-1">
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newExpForm.current}
                        onChange={(e) =>
                          setNewExpForm({
                            ...newExpForm,
                            current: e.target.checked,
                            endDate: e.target.checked ? 'Present' : '',
                          })
                        }
                        className="rounded border-zinc-700 bg-zinc-900 text-emerald-500 focus:ring-emerald-500"
                      />
                      <span className="text-xs text-zinc-300">Currently in this position</span>
                    </label>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-zinc-400">Category:</span>
                      <label className="flex cursor-pointer items-center gap-1.5 text-xs">
                        <input
                          type="radio"
                          name="expType"
                          checked={newExpForm.type === 'work'}
                          onChange={() => setNewExpForm({ ...newExpForm, type: 'work' })}
                          className="text-emerald-500"
                        />
                        <span className="text-zinc-300">Work Experience</span>
                      </label>
                      <label className="flex cursor-pointer items-center gap-1.5 text-xs">
                        <input
                          type="radio"
                          name="expType"
                          checked={newExpForm.type === 'education'}
                          onChange={() => setNewExpForm({ ...newExpForm, type: 'education' })}
                          className="text-emerald-500"
                        />
                        <span className="text-zinc-300">Education</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-[11px] font-medium text-zinc-400">
                      Skills & Technologies (comma separated)
                    </label>
                    <input
                      type="text"
                      value={newExpForm.skills}
                      onChange={(e) => setNewExpForm({ ...newExpForm, skills: e.target.value })}
                      placeholder="e.g. C#, ASP.NET Core, Angular, TypeScript, SQL Server"
                      className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-xs text-zinc-200 focus:border-emerald-500/50 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-[11px] font-medium text-zinc-400">
                      Description & Key Achievements
                    </label>
                    <textarea
                      rows={3}
                      value={newExpForm.description}
                      onChange={(e) =>
                        setNewExpForm({ ...newExpForm, description: e.target.value })
                      }
                      placeholder="Describe your missions, architecture challenges, and team accomplishments..."
                      className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-xs text-zinc-200 focus:border-emerald-500/50 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingExperience(false)}
                      className="rounded-xl px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-xl bg-emerald-500 px-5 py-2 text-xs font-semibold text-zinc-950 transition-all hover:bg-emerald-400"
                    >
                      Create Experience
                    </button>
                  </div>
                </form>
              )}

              {/* Experiences List */}
              {loadingExperiences ? (
                <div className="py-20 text-center text-zinc-500">
                  <FaSync className="mx-auto mb-2 h-6 w-6 animate-spin text-emerald-400" />
                  <p className="text-xs">Loading experiences...</p>
                </div>
              ) : experiences.length === 0 ? (
                <div className="rounded-2xl border border-white/5 bg-zinc-900/20 py-16 text-center text-zinc-500">
                  <p className="text-sm">No experiences defined yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {experiences.map((exp, index) => {
                    const isExpanded = Boolean(expandedExpIds[exp.id]);
                    const isConfirmingDelete = confirmDeleteExpId === exp.id;

                    return (
                      <div
                        key={exp.id}
                        className="rounded-2xl border border-white/5 bg-zinc-900/40 p-5 backdrop-blur-md transition-all hover:border-white/10"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0 space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span
                                className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                                  exp.type === 'education'
                                    ? 'border border-blue-500/30 bg-blue-500/10 text-blue-300'
                                    : 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                                }`}
                              >
                                {exp.type === 'education' ? (
                                  <span className="flex items-center gap-1">
                                    <FaGraduationCap className="h-2.5 w-2.5" /> Education
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1">
                                    <FaBriefcase className="h-2.5 w-2.5" /> Work
                                  </span>
                                )}
                              </span>

                              <h3 className="truncate text-sm font-semibold text-white">
                                {exp.title}
                              </h3>
                              <span className="text-xs font-medium text-zinc-400">
                                @ {exp.company}
                              </span>
                            </div>

                            <p className="text-xs text-zinc-400">
                              {exp.startDate} – {exp.current ? 'Present' : exp.endDate || 'Present'}
                              {exp.location && ` • ${exp.location}`}
                            </p>

                            {exp.skills && (
                              <div className="flex flex-wrap gap-1.5 pt-1">
                                {exp.skills.split(',').map((skill, sIdx) => (
                                  <span
                                    key={sIdx}
                                    className="rounded-md border border-white/5 bg-white/[0.03] px-2 py-0.5 text-[10px] text-zinc-300"
                                  >
                                    {skill.trim()}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="flex flex-shrink-0 items-center gap-1.5">
                            {/* Reorder arrows */}
                            <button
                              onClick={() => moveExperience(index, 'up')}
                              disabled={index === 0}
                              className="rounded-lg border border-white/5 bg-zinc-900 p-1.5 text-zinc-400 hover:text-white disabled:opacity-20"
                              title="Move Up"
                            >
                              <FaArrowUp className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => moveExperience(index, 'down')}
                              disabled={index === experiences.length - 1}
                              className="rounded-lg border border-white/5 bg-zinc-900 p-1.5 text-zinc-400 hover:text-white disabled:opacity-20"
                              title="Move Down"
                            >
                              <FaArrowDown className="h-3 w-3" />
                            </button>

                            {/* Edit toggle */}
                            <button
                              onClick={() =>
                                setExpandedExpIds((prev) => ({
                                  ...prev,
                                  [exp.id]: !isExpanded,
                                }))
                              }
                              className={`rounded-lg border p-1.5 text-xs transition-all ${
                                isExpanded
                                  ? 'border-emerald-500/40 bg-emerald-500/20 text-emerald-300'
                                  : 'border-white/10 bg-white/[0.04] text-zinc-400 hover:text-white'
                              }`}
                              title={isExpanded ? 'Close edit panel' : 'Edit experience'}
                            >
                              {isExpanded ? (
                                <FaChevronUp className="h-3 w-3" />
                              ) : (
                                <FaChevronDown className="h-3 w-3" />
                              )}
                            </button>

                            {/* Delete (No modal: inline 2-step confirm) */}
                            {isConfirmingDelete ? (
                              <div className="flex items-center gap-1 rounded-xl border border-red-500/40 bg-red-950/80 p-1">
                                <button
                                  onClick={() => handleDeleteExperience(exp.id)}
                                  className="rounded-lg bg-red-500 px-2 py-1 text-[10px] font-bold text-zinc-950 hover:bg-red-400"
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => setConfirmDeleteExpId(null)}
                                  className="rounded-lg px-2 py-1 text-[10px] text-zinc-400 hover:text-white"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setConfirmDeleteExpId(exp.id)}
                                className="rounded-lg border border-red-500/20 bg-red-500/10 p-1.5 text-red-400 hover:bg-red-500/20 hover:text-red-300"
                                title="Delete experience"
                              >
                                <FaTrash className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* INLINE EDIT FORM (NO MODALS) */}
                        {isExpanded && (
                          <div className="mt-4 space-y-4 border-t border-white/10 pt-4">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                              <div>
                                <label className="mb-1 block text-[11px] font-medium text-zinc-400">
                                  Position / Degree
                                </label>
                                <input
                                  type="text"
                                  value={exp.title}
                                  onChange={(e) =>
                                    setExperiences((prev) =>
                                      prev.map((i) =>
                                        i.id === exp.id ? { ...i, title: e.target.value } : i,
                                      ),
                                    )
                                  }
                                  className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-xs text-zinc-200 focus:border-emerald-500/50 focus:outline-none"
                                />
                              </div>

                              <div>
                                <label className="mb-1 block text-[11px] font-medium text-zinc-400">
                                  Company / Institution
                                </label>
                                <input
                                  type="text"
                                  value={exp.company}
                                  onChange={(e) =>
                                    setExperiences((prev) =>
                                      prev.map((i) =>
                                        i.id === exp.id ? { ...i, company: e.target.value } : i,
                                      ),
                                    )
                                  }
                                  className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-xs text-zinc-200 focus:border-emerald-500/50 focus:outline-none"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                              <div>
                                <label className="mb-1 block text-[11px] font-medium text-zinc-400">
                                  Location
                                </label>
                                <input
                                  type="text"
                                  value={exp.location || ''}
                                  onChange={(e) =>
                                    setExperiences((prev) =>
                                      prev.map((i) =>
                                        i.id === exp.id ? { ...i, location: e.target.value } : i,
                                      ),
                                    )
                                  }
                                  className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-xs text-zinc-200 focus:border-emerald-500/50 focus:outline-none"
                                />
                              </div>

                              <div>
                                <label className="mb-1 block text-[11px] font-medium text-zinc-400">
                                  Start Date
                                </label>
                                <input
                                  type="text"
                                  value={exp.startDate}
                                  onChange={(e) =>
                                    setExperiences((prev) =>
                                      prev.map((i) =>
                                        i.id === exp.id ? { ...i, startDate: e.target.value } : i,
                                      ),
                                    )
                                  }
                                  className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-xs text-zinc-200 focus:border-emerald-500/50 focus:outline-none"
                                />
                              </div>

                              <div>
                                <label className="mb-1 block text-[11px] font-medium text-zinc-400">
                                  End Date
                                </label>
                                <input
                                  type="text"
                                  disabled={exp.current}
                                  value={exp.current ? 'Present' : exp.endDate || ''}
                                  onChange={(e) =>
                                    setExperiences((prev) =>
                                      prev.map((i) =>
                                        i.id === exp.id ? { ...i, endDate: e.target.value } : i,
                                      ),
                                    )
                                  }
                                  className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-xs text-zinc-200 focus:border-emerald-500/50 focus:outline-none disabled:opacity-50"
                                />
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-6">
                              <label className="flex cursor-pointer items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={exp.current}
                                  onChange={(e) =>
                                    setExperiences((prev) =>
                                      prev.map((i) =>
                                        i.id === exp.id
                                          ? {
                                              ...i,
                                              current: e.target.checked,
                                              endDate: e.target.checked ? 'Present' : '',
                                            }
                                          : i,
                                      ),
                                    )
                                  }
                                  className="rounded border-zinc-700 bg-zinc-900 text-emerald-500 focus:ring-emerald-500"
                                />
                                <span className="text-xs text-zinc-300">
                                  Currently in this position
                                </span>
                              </label>

                              <div className="flex items-center gap-3">
                                <span className="text-xs text-zinc-400">Category:</span>
                                <label className="flex cursor-pointer items-center gap-1.5 text-xs">
                                  <input
                                    type="radio"
                                    name={`type-${exp.id}`}
                                    checked={exp.type === 'work'}
                                    onChange={() =>
                                      setExperiences((prev) =>
                                        prev.map((i) =>
                                          i.id === exp.id ? { ...i, type: 'work' } : i,
                                        ),
                                      )
                                    }
                                    className="text-emerald-500"
                                  />
                                  <span className="text-zinc-300">Work</span>
                                </label>
                                <label className="flex cursor-pointer items-center gap-1.5 text-xs">
                                  <input
                                    type="radio"
                                    name={`type-${exp.id}`}
                                    checked={exp.type === 'education'}
                                    onChange={() =>
                                      setExperiences((prev) =>
                                        prev.map((i) =>
                                          i.id === exp.id ? { ...i, type: 'education' } : i,
                                        ),
                                      )
                                    }
                                    className="text-emerald-500"
                                  />
                                  <span className="text-zinc-300">Education</span>
                                </label>
                              </div>
                            </div>

                            <div>
                              <label className="mb-1 block text-[11px] font-medium text-zinc-400">
                                Skills / Tech Stack
                              </label>
                              <input
                                type="text"
                                value={exp.skills || ''}
                                onChange={(e) =>
                                  setExperiences((prev) =>
                                    prev.map((i) =>
                                      i.id === exp.id ? { ...i, skills: e.target.value } : i,
                                    ),
                                  )
                                }
                                className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-xs text-zinc-200 focus:border-emerald-500/50 focus:outline-none"
                              />
                            </div>

                            <div>
                              <label className="mb-1 block text-[11px] font-medium text-zinc-400">
                                Description
                              </label>
                              <textarea
                                rows={3}
                                value={exp.description || ''}
                                onChange={(e) =>
                                  setExperiences((prev) =>
                                    prev.map((i) =>
                                      i.id === exp.id ? { ...i, description: e.target.value } : i,
                                    ),
                                  )
                                }
                                className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-xs text-zinc-200 focus:border-emerald-500/50 focus:outline-none"
                              />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2">
                              <button
                                type="button"
                                onClick={() =>
                                  setExpandedExpIds((prev) => ({
                                    ...prev,
                                    [exp.id]: false,
                                  }))
                                }
                                className="rounded-xl px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={() => handleUpdateExperience(exp)}
                                disabled={savingExpId === exp.id}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/20 px-4 py-1.5 text-xs font-semibold text-emerald-300 transition-all hover:bg-emerald-500/30"
                              >
                                <FaSave
                                  className={`h-3 w-3 ${savingExpId === exp.id ? 'animate-spin' : ''}`}
                                />
                                <span>{savingExpId === exp.id ? 'Saving...' : 'Save Changes'}</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              VIEW 4: SITE SETTINGS & SOCIAL LINKS (NO MODALS)
              ========================================================================= */}
          {activeCategory === 'settings' && (
            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/5 bg-zinc-900/30 p-5">
                <div>
                  <h2 className="text-base font-bold text-white">Site Settings & Bio</h2>
                  <p className="mt-0.5 text-xs text-zinc-400">
                    Customize the homepage Hero text, availability indicator, resume link, and
                    social networks.
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-semibold text-zinc-950 shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-400 disabled:opacity-50"
                >
                  <FaSave className={`h-3.5 w-3.5 ${savingSettings ? 'animate-spin' : ''}`} />
                  <span>{savingSettings ? 'Saving Settings...' : 'Save Settings'}</span>
                </button>
              </div>

              {/* Card 1: Hero Availability & Preview */}
              <div className="space-y-4 rounded-2xl border border-white/5 bg-zinc-900/40 p-6 backdrop-blur-md">
                <h3 className="flex items-center gap-2 text-sm font-bold text-white">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                  </span>
                  Availability Status Badge
                </h3>

                <div>
                  <label className="mb-1 block text-[11px] font-medium text-zinc-400">
                    Badge Text
                  </label>
                  <input
                    type="text"
                    value={siteSettings.availabilityText}
                    onChange={(e) =>
                      setSiteSettings({ ...siteSettings, availabilityText: e.target.value })
                    }
                    placeholder="Available for new opportunities"
                    className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-xs text-zinc-200 focus:border-emerald-500/50 focus:outline-none"
                  />
                </div>

                {/* Live Badge Preview */}
                <div className="rounded-xl border border-white/5 bg-zinc-950/60 p-4">
                  <p className="mb-2 text-[10px] font-semibold uppercase text-zinc-500">
                    Live Preview on Hero:
                  </p>
                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1 text-xs font-medium text-emerald-400">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                    </span>
                    {siteSettings.availabilityText || 'Available for new opportunities'}
                  </div>
                </div>
              </div>

              {/* Card 2: Headline & Subtitle */}
              <div className="space-y-4 rounded-2xl border border-white/5 bg-zinc-900/40 p-6 backdrop-blur-md">
                <h3 className="text-sm font-bold text-white">Hero Intro & Bio</h3>

                <div>
                  <label className="mb-1 block text-[11px] font-medium text-zinc-400">
                    Main Headline
                  </label>
                  <input
                    type="text"
                    value={siteSettings.heroHeadline}
                    onChange={(e) =>
                      setSiteSettings({ ...siteSettings, heroHeadline: e.target.value })
                    }
                    placeholder="Hello ! My name is Florian Mangin"
                    className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-xs text-zinc-200 focus:border-emerald-500/50 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-medium text-zinc-400">
                    Subtitle / Bio
                  </label>
                  <textarea
                    rows={3}
                    value={siteSettings.heroSubtitle}
                    onChange={(e) =>
                      setSiteSettings({ ...siteSettings, heroSubtitle: e.target.value })
                    }
                    placeholder="Software Engineer passionate about crafting robust software..."
                    className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-xs text-zinc-200 focus:border-emerald-500/50 focus:outline-none"
                  />
                </div>
              </div>

              {/* Card 3: Curriculum Vitae (CV) */}
              <div className="space-y-4 rounded-2xl border border-white/5 bg-zinc-900/40 p-6 backdrop-blur-md">
                <h3 className="text-sm font-bold text-white">Curriculum Vitae (CV) Document</h3>

                <div>
                  <label className="mb-1 block text-[11px] font-medium text-zinc-400">
                    Resume Document URL (local path or external link)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={siteSettings.resumeUrl || ''}
                      onChange={(e) =>
                        setSiteSettings({ ...siteSettings, resumeUrl: e.target.value })
                      }
                      placeholder="/cv.pdf"
                      className="flex-1 rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-xs text-zinc-200 focus:border-emerald-500/50 focus:outline-none"
                    />
                    {siteSettings.resumeUrl && (
                      <a
                        href={siteSettings.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-medium text-zinc-300 hover:text-white"
                      >
                        <FaExternalLinkAlt className="h-3 w-3" />
                        Preview
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Card 4: Social Links Management */}
              <div className="space-y-4 rounded-2xl border border-white/5 bg-zinc-900/40 p-6 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">Social Networks & Links</h3>
                  <button
                    type="button"
                    onClick={handleAddSocialLink}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300 hover:bg-emerald-500/20"
                  >
                    <FaPlus className="h-3 w-3" />
                    <span>Add Link</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {socialLinks.map((link, idx) => (
                    <div
                      key={link.id || idx}
                      className="flex flex-wrap items-center gap-3 rounded-xl border border-white/5 bg-zinc-950/60 p-3"
                    >
                      {/* Icon Preview & Selector */}
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                          <SocialIcon iconName={link.icon} className="h-4 w-4" />
                        </div>
                        <select
                          value={link.icon}
                          onChange={(e) =>
                            setSocialLinks(
                              socialLinks.map((l, i) =>
                                i === idx ? { ...l, icon: e.target.value } : l,
                              ),
                            )
                          }
                          className="rounded-lg border border-white/10 bg-zinc-900 px-2 py-1.5 text-xs text-zinc-200 focus:outline-none"
                        >
                          {AVAILABLE_SOCIAL_ICONS.map((opt) => (
                            <option key={opt.key} value={opt.key}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Label */}
                      <div className="w-28">
                        <input
                          type="text"
                          value={link.label}
                          onChange={(e) =>
                            setSocialLinks(
                              socialLinks.map((l, i) =>
                                i === idx ? { ...l, label: e.target.value } : l,
                              ),
                            )
                          }
                          placeholder="Label"
                          className="w-full rounded-lg border border-white/10 bg-zinc-900 px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none"
                        />
                      </div>

                      {/* URL */}
                      <div className="min-w-[200px] flex-1">
                        <input
                          type="text"
                          value={link.url}
                          onChange={(e) =>
                            setSocialLinks(
                              socialLinks.map((l, i) =>
                                i === idx ? { ...l, url: e.target.value } : l,
                              ),
                            )
                          }
                          placeholder="https://..."
                          className="w-full rounded-lg border border-white/10 bg-zinc-900 px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none"
                        />
                      </div>

                      {/* Delete link */}
                      <button
                        type="button"
                        onClick={() => handleRemoveSocialLink(idx)}
                        className="rounded-lg border border-red-500/20 bg-red-500/10 p-2 text-red-400 hover:bg-red-500/20"
                        title="Remove link"
                      >
                        <FaTrash className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </form>
          )}
        </main>
      </div>
    </>
  );
}

export default withAuth(AdminDashboard);
