import SocialLinksManager from '@/components/admin/SocialLinksManager';
import { SiteSettingsType, SocialLinkType } from '@/types/types';
import React from 'react';
import { FaExternalLinkAlt, FaSave } from 'react-icons/fa';

interface SiteSettingsViewProps {
  siteSettings: SiteSettingsType;
  onUpdateSettings: (field: keyof SiteSettingsType, value: string | null) => void;
  socialLinks: SocialLinkType[];
  onAddSocialLink: () => void;
  onUpdateSocialLink: (index: number, field: keyof SocialLinkType, value: string | boolean) => void;
  onRemoveSocialLink: (index: number) => void;
  savingSettings: boolean;
  onSaveSettings: (e: React.FormEvent) => void;
}

export default function SiteSettingsView({
  siteSettings,
  onUpdateSettings,
  socialLinks,
  onAddSocialLink,
  onUpdateSocialLink,
  onRemoveSocialLink,
  savingSettings,
  onSaveSettings,
}: SiteSettingsViewProps) {
  return (
    <form onSubmit={onSaveSettings} className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/5 bg-zinc-900/30 p-5">
        <div>
          <h2 className="text-base font-bold text-white">Site Settings & Bio</h2>
          <p className="mt-0.5 text-xs text-zinc-400">
            Customize the homepage Hero text, availability indicator, resume link, and social
            networks.
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
          <label className="mb-1 block text-[11px] font-medium text-zinc-400">Badge Text</label>
          <input
            type="text"
            value={siteSettings.availabilityText}
            onChange={(e) => onUpdateSettings('availabilityText', e.target.value)}
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
          <label className="mb-1 block text-[11px] font-medium text-zinc-400">Main Headline</label>
          <input
            type="text"
            value={siteSettings.heroHeadline}
            onChange={(e) => onUpdateSettings('heroHeadline', e.target.value)}
            placeholder="Hello ! My name is Florian Mangin"
            className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-xs text-zinc-200 focus:border-emerald-500/50 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-medium text-zinc-400">Subtitle / Bio</label>
          <textarea
            rows={3}
            value={siteSettings.heroSubtitle}
            onChange={(e) => onUpdateSettings('heroSubtitle', e.target.value)}
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
              onChange={(e) => onUpdateSettings('resumeUrl', e.target.value)}
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
      <SocialLinksManager
        socialLinks={socialLinks}
        onAddSocialLink={onAddSocialLink}
        onUpdateSocialLink={onUpdateSocialLink}
        onRemoveSocialLink={onRemoveSocialLink}
      />
    </form>
  );
}
