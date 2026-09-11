import AdminMobileNav from '@/components/admin/AdminMobileNav';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminToast, { ToastState } from '@/components/admin/AdminToast';
import ProjectsCatalogView from '@/components/admin/ProjectsCatalogView';
import ProjectsOrderView from '@/components/admin/ProjectsOrderView';
import SiteSettingsView from '@/components/admin/SiteSettingsView';
import withAuth, { WithAuthProps } from '@/components/auth/withAuth';
import SEO from '@/components/SEO';
import {
  AdminRepoRecord,
  NavCategory,
  RepoEditFormData,
  SiteSettingsType,
  SocialLinkType,
  ViewMode,
} from '@/types/types';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

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
  const [editedRepos, setEditedRepos] = useState<Record<number, RepoEditFormData>>({});

  // Ordering Tab Repos
  const [orderedRepos, setOrderedRepos] = useState<AdminRepoRecord[]>([]);
  const [hasOrderChanges, setHasOrderChanges] = useState(false);
  const [savingBatchOrder, setSavingBatchOrder] = useState(false);

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
  const [toastMessage, setToastMessage] = useState<ToastState | null>(null);

  const showToast = useCallback((text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
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
        const formMap: Record<number, RepoEditFormData> = {};
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

  // 2. Fetch Settings
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
    fetchSettings();
  }, [fetchRepos, fetchSettings]);

  // Logout
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin');
    } catch {
      router.push('/admin');
    }
  };

  // Sync Repositories with GitHub
  const handleSyncGithub = async () => {
    setSyncingGithub(true);
    try {
      const res = await fetch('/api/admin/sync', { method: 'POST' });
      if (res.ok) {
        showToast('Repositories synchronized with GitHub successfully.');
        await fetchRepos();
      } else {
        showToast('Failed to sync repositories', 'error');
      }
    } catch {
      showToast('Network error during GitHub sync', 'error');
    } finally {
      setSyncingGithub(false);
    }
  };

  // Toggle Visibility
  const handleToggleVisibility = async (repo: AdminRepoRecord) => {
    const nextState = !repo.visible;
    setRepos((prev) =>
      prev.map((r) => (r.repoId === repo.repoId ? { ...r, visible: nextState } : r)),
    );

    try {
      const res = await fetch('/api/admin/repos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repoId: repo.repoId,
          visible: nextState,
        }),
      });

      if (!res.ok) {
        // Rollback
        setRepos((prev) =>
          prev.map((r) => (r.repoId === repo.repoId ? { ...r, visible: !nextState } : r)),
        );
        showToast('Failed to update visibility', 'error');
      } else {
        showToast(`Repository "${repo.name}" is now ${nextState ? 'visible' : 'hidden'}.`);
      }
    } catch {
      setRepos((prev) =>
        prev.map((r) => (r.repoId === repo.repoId ? { ...r, visible: !nextState } : r)),
      );
      showToast('Network error updating visibility', 'error');
    }
  };

  // Save Repo Details (Inline, no modals)
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
          displayName: form.displayName,
          description: form.description,
          coverImage: form.coverImage,
          demoUrl: form.demoUrl,
          isWip: form.isWip,
        }),
      });

      if (res.ok) {
        setSavedSuccessRepoId(repoId);
        showToast('Project updated successfully.');
        setTimeout(() => setSavedSuccessRepoId(null), 2500);
        // Refresh local repo representation
        setRepos((prev) =>
          prev.map((r) =>
            r.repoId === repoId
              ? {
                  ...r,
                  displayName: form.displayName,
                  description: form.description,
                  coverImage: form.coverImage,
                  demoUrl: form.demoUrl,
                  isWip: form.isWip,
                }
              : r,
          ),
        );
      } else {
        showToast('Failed to save project updates', 'error');
      }
    } catch {
      showToast('Network error while saving project', 'error');
    } finally {
      setSavingRepoId(null);
    }
  };

  // Reordering Helpers
  const moveOrderItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= orderedRepos.length) return;

    const list = [...orderedRepos];
    const [moved] = list.splice(index, 1);
    list.splice(targetIndex, 0, moved);

    setOrderedRepos(list);
    setHasOrderChanges(true);
  };

  const moveOrderToExtremity = (index: number, to: 'top' | 'bottom') => {
    if (to === 'top' && index === 0) return;
    if (to === 'bottom' && index === orderedRepos.length - 1) return;

    const list = [...orderedRepos];
    const [moved] = list.splice(index, 1);
    if (to === 'top') {
      list.unshift(moved);
    } else {
      list.push(moved);
    }

    setOrderedRepos(list);
    setHasOrderChanges(true);
  };

  const handleSaveBatchOrder = async () => {
    setSavingBatchOrder(true);
    try {
      const items = orderedRepos.map((r, index) => ({
        repoId: r.repoId,
        order: index + 1,
      }));

      const res = await fetch('/api/admin/repos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });

      if (res.ok) {
        showToast('New project display order saved.');
        setHasOrderChanges(false);
        await fetchRepos();
      } else {
        showToast('Failed to update project order', 'error');
      }
    } catch {
      showToast('Error saving project order', 'error');
    } finally {
      setSavingBatchOrder(false);
    }
  };

  // Settings Handlers
  const handleUpdateSiteSettings = (field: keyof SiteSettingsType, value: string | null) => {
    setSiteSettings((prev) => ({ ...prev, [field]: value }));
  };

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
        showToast('Site settings and social links saved.');
      } else {
        showToast('Failed to save settings', 'error');
      }
    } catch {
      showToast('Network error saving settings', 'error');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleAddSocialLink = () => {
    const nextOrder = socialLinks.length + 1;
    setSocialLinks([
      ...socialLinks,
      {
        id: 0,
        platform: 'custom',
        label: 'New Link',
        url: 'https://',
        icon: 'FaGlobe',
        order: nextOrder,
        visible: true,
      },
    ]);
  };

  const handleRemoveSocialLink = (index: number) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  };

  const handleUpdateSocialLink = (
    index: number,
    field: keyof SocialLinkType,
    value: string | boolean,
  ) => {
    setSocialLinks(socialLinks.map((l, i) => (i === index ? { ...l, [field]: value } : l)));
  };

  // Filtered & Searched Repositories
  const filteredRepos = useMemo(() => {
    return repos.filter((repo) => {
      const form = editedRepos[repo.repoId];
      const matchSearch =
        (form?.displayName || repo.displayName || repo.name)
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (form?.description || repo.description || '')
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      if (!matchSearch) return false;

      if (filterStatus === 'visible') return repo.visible;
      if (filterStatus === 'hidden') return !repo.visible;
      if (filterStatus === 'wip') return form ? form.isWip : repo.isWip;
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
    }),
    [repos],
  );

  return (
    <>
      <SEO page="dashboard" title="Admin Studio | flotss.me" />

      {/* Floating Toast Notification */}
      <AdminToast toastMessage={toastMessage} />

      <div className="flex min-h-screen bg-zinc-950 text-zinc-100">
        {/* =========================================================================
            SIDEBAR NAVIGATION
            ========================================================================= */}
        <AdminSidebar
          userEmail={user?.email}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          counts={counts}
          syncingGithub={syncingGithub}
          onSyncGithub={handleSyncGithub}
          onLogout={handleLogout}
        />

        {/* =========================================================================
            MAIN CONTENT AREA (NO MODALS)
            ========================================================================= */}
        <main className="mx-auto max-w-7xl flex-1 overflow-y-auto p-5 sm:p-8">
          {/* Mobile Top Navigation Tabs */}
          <AdminMobileNav
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            counts={counts}
            syncingGithub={syncingGithub}
            onSyncGithub={handleSyncGithub}
            onLogout={handleLogout}
          />

          {/* =========================================================================
              VIEW 1: PROJECTS CATALOG (WITH INLINE EXPANDABLE DETAILS)
              ========================================================================= */}
          {activeCategory === 'projects-catalog' && (
            <ProjectsCatalogView
              counts={counts}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              viewMode={viewMode}
              setViewMode={setViewMode}
              loadingRepos={loadingRepos}
              filteredRepos={filteredRepos}
              editedRepos={editedRepos}
              expandedRepoIds={expandedRepoIds}
              savingRepoId={savingRepoId}
              savedSuccessRepoId={savedSuccessRepoId}
              onToggleVisibility={handleToggleVisibility}
              onToggleExpand={(repoId) =>
                setExpandedRepoIds((prev) => ({
                  ...prev,
                  [repoId]: !prev[repoId],
                }))
              }
              onFieldChange={(repoId, field, val) =>
                setEditedRepos((prev) => ({
                  ...prev,
                  [repoId]: {
                    ...prev[repoId],
                    [field]: val,
                  },
                }))
              }
              onSaveRepoChanges={handleSaveRepoChanges}
            />
          )}

          {/* =========================================================================
              VIEW 2: DISPLAY ORDER MANAGEMENT (NO MODALS)
              ========================================================================= */}
          {activeCategory === 'projects-order' && (
            <ProjectsOrderView
              orderedRepos={orderedRepos}
              hasOrderChanges={hasOrderChanges}
              savingBatchOrder={savingBatchOrder}
              onMoveOrderItem={moveOrderItem}
              onMoveOrderToExtremity={moveOrderToExtremity}
              onSaveBatchOrder={handleSaveBatchOrder}
            />
          )}

          {/* =========================================================================
              VIEW 3: SITE SETTINGS & SOCIAL LINKS (NO MODALS)
              ========================================================================= */}
          {activeCategory === 'settings' && (
            <SiteSettingsView
              siteSettings={siteSettings}
              onUpdateSettings={handleUpdateSiteSettings}
              socialLinks={socialLinks}
              onAddSocialLink={handleAddSocialLink}
              onUpdateSocialLink={handleUpdateSocialLink}
              onRemoveSocialLink={handleRemoveSocialLink}
              savingSettings={savingSettings}
              onSaveSettings={handleSaveSettings}
            />
          )}
        </main>
      </div>
    </>
  );
}

export default withAuth(AdminDashboard);
