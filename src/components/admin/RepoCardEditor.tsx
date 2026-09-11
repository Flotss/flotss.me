import { AdminRepoRecord, RepoEditFormData } from '@/types/types';
import React from 'react';
import {
  FaCheck,
  FaChevronDown,
  FaChevronUp,
  FaEye,
  FaEyeSlash,
  FaImage,
  FaSave,
} from 'react-icons/fa';

interface RepoCardEditorProps {
  repo: AdminRepoRecord;
  form: RepoEditFormData;
  isExpanded: boolean;
  isSaving: boolean;
  isSaved: boolean;
  onToggleExpand: () => void;
  onToggleVisibility: () => void;
  onFieldChange: (field: keyof RepoEditFormData, value: string | boolean) => void;
  onSave: () => void;
  onCollapse: () => void;
}

export default function RepoCardEditor({
  repo,
  form,
  isExpanded,
  isSaving,
  isSaved,
  onToggleExpand,
  onToggleVisibility,
  onFieldChange,
  onSave,
  onCollapse,
}: RepoCardEditorProps) {
  return (
    <div className="rounded-2xl border border-white/5 bg-zinc-900/40 p-5 backdrop-blur-md transition-all hover:border-white/10">
      {/* Summary Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-sm font-semibold text-white">
              {form.displayName ? form.displayName : repo.name}
            </h3>
            {form.displayName && (
              <span className="truncate text-[10px] text-zinc-500">({repo.name})</span>
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
            onClick={onToggleVisibility}
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
            onClick={onToggleExpand}
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
              onChange={(e) => onFieldChange('displayName', e.target.value)}
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
                onChange={(e) => onFieldChange('coverImage', e.target.value)}
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
                onChange={(e) => onFieldChange('demoUrl', e.target.value)}
                placeholder="https://demo.flotss.me"
                className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-xs text-zinc-200 placeholder-zinc-600 focus:border-emerald-500/50 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-medium text-zinc-400">Status</label>
              <label className="mt-1.5 flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.isWip}
                  onChange={(e) => onFieldChange('isWip', e.target.checked)}
                  className="rounded border-zinc-700 bg-zinc-900 text-emerald-500 focus:ring-emerald-500"
                />
                <span className="text-xs text-zinc-300">Work In Progress (WIP)</span>
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
              onChange={(e) => onFieldChange('description', e.target.value)}
              placeholder="Describe the purpose, tech stack, and achievements of this project..."
              className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-xs text-zinc-200 placeholder-zinc-600 focus:border-emerald-500/50 focus:outline-none"
            />
          </div>

          {/* Save Actions */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onCollapse}
              className="rounded-xl px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white"
            >
              Collapse
            </button>
            <button
              type="button"
              onClick={onSave}
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
                  <FaSave className={`h-3 w-3 ${isSaving ? 'animate-spin' : ''}`} />
                  <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
