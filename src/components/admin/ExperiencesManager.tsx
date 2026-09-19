import MonthYearPicker from '@/components/admin/MonthYearPicker';
import { ExperienceType } from '@/types/types';
import { formatMonthYear, isExperienceOngoing } from '@/utils/DateUtils';
import Image from 'next/image';
import React, { useState } from 'react';
import {
  FaArrowDown,
  FaArrowUp,
  FaBriefcase,
  FaCalendarAlt,
  FaChevronDown,
  FaChevronUp,
  FaEye,
  FaEyeSlash,
  FaGraduationCap,
  FaMapMarkerAlt,
  FaPlus,
  FaSave,
  FaTrash,
} from 'react-icons/fa';

interface ExperiencesManagerProps {
  experiences: ExperienceType[];
  onRefresh: () => void;
  showToast: (text: string, type?: 'success' | 'error') => void;
}

interface NewExperienceForm {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  type: 'work' | 'education';
  description: string;
  highlightsText: string;
  skills: string;
  logoUrl: string;
}

const EMPTY_FORM: NewExperienceForm = {
  title: '',
  company: '',
  location: '',
  startDate: 'Jan 2024',
  endDate: 'Present',
  current: true,
  type: 'work',
  description: '',
  highlightsText: '',
  skills: '',
  logoUrl: '',
};

export default function ExperiencesManager({
  experiences,
  onRefresh,
  showToast,
}: ExperiencesManagerProps) {
  const [newForm, setNewForm] = useState<NewExperienceForm>(EMPTY_FORM);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<NewExperienceForm | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Helper to parse highlights
  const parseHighlightsFromForm = (text: string): string | null => {
    const lines = text
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0)
      .map((l) => l.replace(/^[•\-*]\s*/, ''));
    return lines.length > 0 ? JSON.stringify(lines) : null;
  };

  const parseHighlightsToForm = (raw: string | null | undefined): string => {
    if (!raw) return '';
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.join('\n');
      }
    } catch {
      // Not JSON, return raw
    }
    return raw;
  };

  // Create new experience
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newForm.title || !newForm.company || !newForm.startDate) {
      showToast('Title, company, and start date are required.', 'error');
      return;
    }

    setIsCreating(true);
    try {
      const now = new Date();
      const defaultDate = formatMonthYear(now.getMonth() + 1, now.getFullYear());
      const hasValidEnd = Boolean(
        newForm.endDate && newForm.endDate.trim().toLowerCase() !== 'present',
      );
      const finalEndDate = newForm.current
        ? 'Present'
        : hasValidEnd
          ? newForm.endDate.trim()
          : defaultDate;

      const res = await fetch('/api/admin/experiences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newForm,
          current: newForm.current,
          endDate: finalEndDate,
          highlights: parseHighlightsFromForm(newForm.highlightsText),
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to create experience');
      }

      showToast('Experience created successfully!', 'success');
      setNewForm(EMPTY_FORM);
      setIsFormOpen(false);
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Error creating experience', 'error');
    } finally {
      setIsCreating(false);
    }
  };

  // Toggle Edit Inline
  const handleStartEdit = (exp: ExperienceType) => {
    if (editingId === exp.id) {
      setEditingId(null);
      setEditFormData(null);
    } else {
      const isOngoing = isExperienceOngoing(exp);
      const now = new Date();
      const defaultDate = formatMonthYear(now.getMonth() + 1, now.getFullYear());
      const hasValidEnd = Boolean(exp.endDate && exp.endDate.trim().toLowerCase() !== 'present');
      const initialEndDate = isOngoing
        ? 'Present'
        : hasValidEnd
          ? exp.endDate!.trim()
          : defaultDate;

      setEditingId(exp.id);
      setEditFormData({
        title: exp.title,
        company: exp.company,
        location: exp.location || '',
        startDate: exp.startDate,
        endDate: initialEndDate,
        current: isOngoing,
        type: exp.type,
        description: exp.description || '',
        highlightsText: parseHighlightsToForm(exp.highlights),
        skills: exp.skills || '',
        logoUrl: exp.logoUrl || '',
      });
    }
  };

  // Save Edit Inline
  const handleSaveEdit = async (id: number) => {
    if (!editFormData) return;
    if (
      !editFormData.title?.trim() ||
      !editFormData.company?.trim() ||
      !editFormData.startDate?.trim()
    ) {
      showToast('Title, company, and start date are required.', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const now = new Date();
      const defaultDate = formatMonthYear(now.getMonth() + 1, now.getFullYear());
      const hasValidEnd = Boolean(
        editFormData.endDate && editFormData.endDate.trim().toLowerCase() !== 'present',
      );
      const finalEndDate = editFormData.current
        ? 'Present'
        : hasValidEnd
          ? editFormData.endDate.trim()
          : defaultDate;

      const res = await fetch('/api/admin/experiences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          ...editFormData,
          current: editFormData.current,
          endDate: finalEndDate,
          highlights: parseHighlightsFromForm(editFormData.highlightsText),
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to update experience');
      }

      showToast('Experience updated successfully!', 'success');
      setEditingId(null);
      setEditFormData(null);
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Error updating experience', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle Visibility
  const handleToggleVisible = async (exp: ExperienceType) => {
    try {
      const res = await fetch('/api/admin/experiences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: exp.id,
          visible: !exp.visible,
        }),
      });

      if (!res.ok) throw new Error('Failed to toggle visibility');
      showToast(`Experience ${!exp.visible ? 'visible' : 'hidden'}`, 'success');
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Error toggling visibility', 'error');
    }
  };

  // Reorder Item
  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= experiences.length) return;

    const newExps = [...experiences];
    const [moved] = newExps.splice(index, 1);
    newExps.splice(targetIndex, 0, moved);

    // Update order values
    const items = newExps.map((e, idx) => ({ id: e.id, order: idx + 1 }));

    try {
      const res = await fetch('/api/admin/experiences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });

      if (!res.ok) throw new Error('Failed to reorder');
      showToast('Order updated', 'success');
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Error reordering', 'error');
    }
  };

  // Delete Item
  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this experience entry?')) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/experiences?id=${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete experience');
      showToast('Experience deleted', 'success');
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Error deleting experience', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Add Button */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/5 bg-zinc-900/30 p-5">
        <div>
          <h2 className="text-base font-bold text-white">Career & Education Management</h2>
          <p className="mt-0.5 text-xs text-zinc-400">
            Manage your professional positions, academic credentials, key achievements, and timeline
            display order without modal dialogs.
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-semibold text-zinc-950 shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-400"
        >
          {isFormOpen ? <FaChevronUp className="h-3 w-3" /> : <FaPlus className="h-3 w-3" />}
          <span>{isFormOpen ? 'Close Form' : 'Add Experience'}</span>
        </button>
      </div>

      {/* Inline Create Form (Collapsible) */}
      {isFormOpen && (
        <form
          onSubmit={handleCreate}
          className="space-y-4 rounded-2xl border border-emerald-500/30 bg-zinc-900/60 p-6 backdrop-blur-md"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-sm font-bold text-emerald-400">Create New Entry</h3>
            <span className="text-[11px] text-zinc-400">* Required fields</span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-[11px] font-medium text-zinc-400">
                Type <span className="text-emerald-400">*</span>
              </label>
              <select
                value={newForm.type}
                onChange={(e) =>
                  setNewForm({ ...newForm, type: e.target.value as 'work' | 'education' })
                }
                className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-xs text-zinc-200 focus:border-emerald-500/50 focus:outline-none"
              >
                <option value="work">💼 Work Experience</option>
                <option value="education">🎓 Education & Degree</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-medium text-zinc-400">
                Job Title / Degree <span className="text-emerald-400">*</span>
              </label>
              <input
                type="text"
                required
                value={newForm.title}
                onChange={(e) => setNewForm({ ...newForm, title: e.target.value })}
                placeholder="e.g. Software Engineer Apprentice"
                className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-xs text-zinc-200 focus:border-emerald-500/50 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-medium text-zinc-400">
                Company / Institution <span className="text-emerald-400">*</span>
              </label>
              <input
                type="text"
                required
                value={newForm.company}
                onChange={(e) => setNewForm({ ...newForm, company: e.target.value })}
                placeholder="e.g. Société Générale"
                className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-xs text-zinc-200 focus:border-emerald-500/50 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-medium text-zinc-400">Location</label>
              <input
                type="text"
                value={newForm.location}
                onChange={(e) => setNewForm({ ...newForm, location: e.target.value })}
                placeholder="e.g. Puteaux (92), France — Hybrid"
                className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-xs text-zinc-200 focus:border-emerald-500/50 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-medium text-zinc-400">
                Start Date <span className="text-emerald-400">*</span>
              </label>
              <MonthYearPicker
                value={newForm.startDate}
                onChange={(val) => setNewForm({ ...newForm, startDate: val })}
              />
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="block text-[11px] font-medium text-zinc-400">End Date</label>
                <label className="flex cursor-pointer items-center gap-1.5 text-[11px] text-zinc-400">
                  <input
                    type="checkbox"
                    checked={newForm.current}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      const now = new Date();
                      const currentFormatted = formatMonthYear(
                        now.getMonth() + 1,
                        now.getFullYear(),
                      );
                      const isNotPresent = newForm.endDate?.trim().toLowerCase() !== 'present';
                      const hasEnd = Boolean(newForm.endDate && isNotPresent);
                      const existingEnd = hasEnd ? newForm.endDate : currentFormatted;
                      setNewForm({
                        ...newForm,
                        current: checked,
                        endDate: checked ? 'Present' : existingEnd,
                      });
                    }}
                    className="rounded border-white/20 bg-zinc-950 text-emerald-500 focus:ring-0"
                  />
                  <span>Currently Active</span>
                </label>
              </div>
              <MonthYearPicker
                value={newForm.current ? 'Present' : newForm.endDate}
                onChange={(val) => setNewForm({ ...newForm, endDate: val })}
                disabled={newForm.current}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-[11px] font-medium text-zinc-400">
                Logo URL / Path
              </label>
              <input
                type="text"
                value={newForm.logoUrl}
                onChange={(e) => setNewForm({ ...newForm, logoUrl: e.target.value })}
                placeholder="/images/societe-general.png, /images/isep.svg, /images/dalkia.svg"
                className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-xs text-zinc-200 focus:border-emerald-500/50 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-[11px] font-medium text-zinc-400">
                Summary Description
              </label>
              <textarea
                rows={2}
                value={newForm.description}
                onChange={(e) => setNewForm({ ...newForm, description: e.target.value })}
                placeholder="General narrative of the mission, squad structure, or academic curriculum..."
                className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-xs text-zinc-200 focus:border-emerald-500/50 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-[11px] font-medium text-zinc-400">
                Key Achievements & Highlights (one bullet point per line)
              </label>
              <textarea
                rows={4}
                value={newForm.highlightsText}
                onChange={(e) => setNewForm({ ...newForm, highlightsText: e.target.value })}
                placeholder="Release Automation: Slashing release overhead by 90%...&#10;Architecture Migration: Full migration of legacy desktop app to .NET 8..."
                className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 font-mono text-xs text-zinc-200 focus:border-emerald-500/50 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-[11px] font-medium text-zinc-400">
                Skills / Tech Stack (comma-separated)
              </label>
              <input
                type="text"
                value={newForm.skills}
                onChange={(e) => setNewForm({ ...newForm, skills: e.target.value })}
                placeholder="C#, ASP.NET Core, Angular, TypeScript, SQL Server"
                className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-xs text-zinc-200 focus:border-emerald-500/50 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-5 py-2 text-xs font-semibold text-zinc-950 shadow-md shadow-emerald-500/10 hover:bg-emerald-400 disabled:opacity-50"
            >
              <FaSave className={`h-3 w-3 ${isCreating ? 'animate-spin' : ''}`} />
              <span>{isCreating ? 'Creating...' : 'Create Entry'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Experiences List */}
      <div className="space-y-4">
        {experiences.length === 0 ? (
          <div className="rounded-2xl border border-white/5 bg-zinc-900/20 p-8 text-center text-sm text-zinc-400">
            No experiences found. Add your first entry using the button above.
          </div>
        ) : (
          experiences.map((exp, index) => {
            const isEditing = editingId === exp.id;
            const isEducation = exp.type === 'education';

            return (
              <div
                key={exp.id}
                className={`overflow-hidden rounded-2xl border transition-all duration-200 ${
                  isEditing
                    ? 'border-emerald-500/40 bg-zinc-900/60'
                    : 'border-white/5 bg-zinc-900/30 hover:border-white/10'
                } ${!exp.visible ? 'opacity-60' : ''}`}
              >
                {/* Header Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5">
                  <div className="flex items-center gap-3.5">
                    {/* Logo / Type Icon */}
                    <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-zinc-950 p-1.5">
                      {exp.logoUrl ? (
                        <Image
                          src={exp.logoUrl}
                          alt={exp.company}
                          width={32}
                          height={32}
                          className="object-contain"
                        />
                      ) : isEducation ? (
                        <FaGraduationCap className="h-4 w-4 text-blue-400" />
                      ) : (
                        <FaBriefcase className="h-4 w-4 text-emerald-400" />
                      )}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-bold text-white">{exp.title}</h3>
                        <span className="text-xs font-semibold text-emerald-400">
                          @ {exp.company}
                        </span>
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${
                            isEducation
                              ? 'border border-blue-500/20 bg-blue-500/10 text-blue-300'
                              : 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-300'
                          }`}
                        >
                          {exp.type}
                        </span>
                        {exp.current && (
                          <span className="rounded border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400">
                            Active
                          </span>
                        )}
                      </div>

                      <div className="mt-0.5 flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                        <span className="inline-flex items-center gap-1">
                          <FaCalendarAlt className="h-3 w-3 text-zinc-500" />
                          {exp.current
                            ? `${exp.startDate} — Present`
                            : exp.endDate && exp.endDate.trim().toLowerCase() !== 'present'
                              ? `${exp.startDate} — ${exp.endDate}`
                              : exp.startDate}
                        </span>
                        {exp.location && (
                          <span className="inline-flex items-center gap-1">
                            <FaMapMarkerAlt className="h-3 w-3 text-zinc-500" />
                            {exp.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions (Reorder, Visibility, Edit, Delete) */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleMove(index, 'up')}
                      disabled={index === 0}
                      title="Move up"
                      className="rounded-lg p-2 text-zinc-400 hover:bg-white/5 hover:text-white disabled:opacity-20"
                    >
                      <FaArrowUp className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => handleMove(index, 'down')}
                      disabled={index === experiences.length - 1}
                      title="Move down"
                      className="rounded-lg p-2 text-zinc-400 hover:bg-white/5 hover:text-white disabled:opacity-20"
                    >
                      <FaArrowDown className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => handleToggleVisible(exp)}
                      title={exp.visible ? 'Hide from public view' : 'Make visible'}
                      className={`rounded-lg p-2 transition-colors ${
                        exp.visible
                          ? 'text-emerald-400 hover:bg-emerald-500/10'
                          : 'text-zinc-500 hover:bg-white/5'
                      }`}
                    >
                      {exp.visible ? (
                        <FaEye className="h-3.5 w-3.5" />
                      ) : (
                        <FaEyeSlash className="h-3.5 w-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleStartEdit(exp)}
                      title="Edit inline"
                      className={`inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                        isEditing
                          ? 'border border-emerald-500/30 bg-emerald-500/20 text-emerald-300'
                          : 'border border-white/10 bg-white/[0.04] text-zinc-300 hover:text-white'
                      }`}
                    >
                      <span>{isEditing ? 'Cancel' : 'Edit'}</span>
                      {isEditing ? (
                        <FaChevronUp className="h-2.5 w-2.5" />
                      ) : (
                        <FaChevronDown className="h-2.5 w-2.5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(exp.id)}
                      title="Delete entry"
                      className="rounded-lg p-2 text-zinc-500 hover:bg-red-500/10 hover:text-red-400"
                    >
                      <FaTrash className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {/* Inline Edit Form Panel */}
                {isEditing && editFormData && (
                  <div className="border-t border-white/5 bg-zinc-950/60 p-5">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-[11px] font-medium text-zinc-400">
                          Type
                        </label>
                        <select
                          value={editFormData.type}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              type: e.target.value as 'work' | 'education',
                            })
                          }
                          className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 focus:border-emerald-500/50 focus:outline-none"
                        >
                          <option value="work">💼 Work Experience</option>
                          <option value="education">🎓 Education & Degree</option>
                        </select>
                      </div>

                      <div>
                        <label className="mb-1 block text-[11px] font-medium text-zinc-400">
                          Job Title / Degree
                        </label>
                        <input
                          type="text"
                          value={editFormData.title}
                          onChange={(e) =>
                            setEditFormData({ ...editFormData, title: e.target.value })
                          }
                          className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 focus:border-emerald-500/50 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-[11px] font-medium text-zinc-400">
                          Company / Institution
                        </label>
                        <input
                          type="text"
                          value={editFormData.company}
                          onChange={(e) =>
                            setEditFormData({ ...editFormData, company: e.target.value })
                          }
                          className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 focus:border-emerald-500/50 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-[11px] font-medium text-zinc-400">
                          Location
                        </label>
                        <input
                          type="text"
                          value={editFormData.location}
                          onChange={(e) =>
                            setEditFormData({ ...editFormData, location: e.target.value })
                          }
                          className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 focus:border-emerald-500/50 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-[11px] font-medium text-zinc-400">
                          Start Date
                        </label>
                        <MonthYearPicker
                          value={editFormData.startDate}
                          onChange={(val) => setEditFormData({ ...editFormData, startDate: val })}
                        />
                      </div>

                      <div>
                        <div className="mb-1 flex items-center justify-between">
                          <label className="block text-[11px] font-medium text-zinc-400">
                            End Date
                          </label>
                          <label className="flex cursor-pointer items-center gap-1.5 text-[11px] text-zinc-400">
                            <input
                              type="checkbox"
                              checked={editFormData.current}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                const now = new Date();
                                const currentFormatted = formatMonthYear(
                                  now.getMonth() + 1,
                                  now.getFullYear(),
                                );
                                const isNotPresent =
                                  editFormData.endDate?.trim().toLowerCase() !== 'present';
                                const hasEnd = Boolean(editFormData.endDate && isNotPresent);
                                const existingEnd = hasEnd
                                  ? editFormData.endDate
                                  : currentFormatted;
                                setEditFormData({
                                  ...editFormData,
                                  current: checked,
                                  endDate: checked ? 'Present' : existingEnd,
                                });
                              }}
                              className="rounded border-white/20 bg-zinc-950 text-emerald-500 focus:ring-0"
                            />
                            <span>Currently Active</span>
                          </label>
                        </div>
                        <MonthYearPicker
                          value={editFormData.current ? 'Present' : editFormData.endDate}
                          onChange={(val) => setEditFormData({ ...editFormData, endDate: val })}
                          disabled={editFormData.current}
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="mb-1 block text-[11px] font-medium text-zinc-400">
                          Logo URL / Path
                        </label>
                        <input
                          type="text"
                          value={editFormData.logoUrl}
                          onChange={(e) =>
                            setEditFormData({ ...editFormData, logoUrl: e.target.value })
                          }
                          className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 focus:border-emerald-500/50 focus:outline-none"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="mb-1 block text-[11px] font-medium text-zinc-400">
                          Summary Description
                        </label>
                        <textarea
                          rows={2}
                          value={editFormData.description}
                          onChange={(e) =>
                            setEditFormData({ ...editFormData, description: e.target.value })
                          }
                          className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 focus:border-emerald-500/50 focus:outline-none"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="mb-1 block text-[11px] font-medium text-zinc-400">
                          Key Achievements & Highlights (one per line)
                        </label>
                        <textarea
                          rows={4}
                          value={editFormData.highlightsText}
                          onChange={(e) =>
                            setEditFormData({ ...editFormData, highlightsText: e.target.value })
                          }
                          className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 font-mono text-xs text-zinc-200 focus:border-emerald-500/50 focus:outline-none"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="mb-1 block text-[11px] font-medium text-zinc-400">
                          Skills / Tech Stack (comma-separated)
                        </label>
                        <input
                          type="text"
                          value={editFormData.skills}
                          onChange={(e) =>
                            setEditFormData({ ...editFormData, skills: e.target.value })
                          }
                          className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 focus:border-emerald-500/50 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(null);
                          setEditFormData(null);
                        }}
                        className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(exp.id)}
                        disabled={isSaving}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-5 py-2 text-xs font-semibold text-zinc-950 shadow-md shadow-emerald-500/10 hover:bg-emerald-400 disabled:opacity-50"
                      >
                        <FaSave className={`h-3 w-3 ${isSaving ? 'animate-spin' : ''}`} />
                        <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
