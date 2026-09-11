import { AVAILABLE_SOCIAL_ICONS, SocialIcon } from '@/components/icons/SocialIcon';
import { SocialLinkType } from '@/types/types';
import React from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';

interface SocialLinksManagerProps {
  socialLinks: SocialLinkType[];
  onAddSocialLink: () => void;
  onUpdateSocialLink: (index: number, field: keyof SocialLinkType, value: string | boolean) => void;
  onRemoveSocialLink: (index: number) => void;
}

export default function SocialLinksManager({
  socialLinks,
  onAddSocialLink,
  onUpdateSocialLink,
  onRemoveSocialLink,
}: SocialLinksManagerProps) {
  return (
    <div className="space-y-4 rounded-2xl border border-white/5 bg-zinc-900/40 p-6 backdrop-blur-md">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white">Social Networks & Links</h3>
        <button
          type="button"
          onClick={onAddSocialLink}
          className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300 hover:bg-emerald-500/20"
        >
          <FaPlus className="h-3 w-3" />
          <span>Add Link</span>
        </button>
      </div>

      <div className="space-y-3">
        {socialLinks.length === 0 ? (
          <p className="py-4 text-center text-xs text-zinc-500">
            No social links configured yet. Click &quot;Add Link&quot; above.
          </p>
        ) : (
          socialLinks.map((link, idx) => (
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
                  onChange={(e) => onUpdateSocialLink(idx, 'icon', e.target.value)}
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
                  onChange={(e) => onUpdateSocialLink(idx, 'label', e.target.value)}
                  placeholder="Label"
                  className="w-full rounded-lg border border-white/10 bg-zinc-900 px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none"
                />
              </div>

              {/* URL */}
              <div className="min-w-[200px] flex-1">
                <input
                  type="text"
                  value={link.url}
                  onChange={(e) => onUpdateSocialLink(idx, 'url', e.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-lg border border-white/10 bg-zinc-900 px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none"
                />
              </div>

              {/* Delete link */}
              <button
                type="button"
                onClick={() => onRemoveSocialLink(idx)}
                className="rounded-lg border border-red-500/20 bg-red-500/10 p-2 text-red-400 hover:bg-red-500/20"
                title="Remove link"
              >
                <FaTrash className="h-3 w-3" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
