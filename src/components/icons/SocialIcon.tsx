import React from 'react';
import {
  FaDiscord,
  FaEnvelope,
  FaGithub,
  FaGitlab,
  FaGlobe,
  FaInstagram,
  FaLinkedin,
  FaTwitch,
  FaYoutube,
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

export interface SocialIconOption {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const AVAILABLE_SOCIAL_ICONS: SocialIconOption[] = [
  { key: 'FaGithub', label: 'GitHub', icon: FaGithub },
  { key: 'FaLinkedin', label: 'LinkedIn', icon: FaLinkedin },
  { key: 'FaXTwitter', label: 'X / Twitter', icon: FaXTwitter },
  { key: 'FaDiscord', label: 'Discord', icon: FaDiscord },
  { key: 'FaEnvelope', label: 'Email', icon: FaEnvelope },
  { key: 'FaGlobe', label: 'Website / Portfolio', icon: FaGlobe },
  { key: 'FaYoutube', label: 'YouTube', icon: FaYoutube },
  { key: 'FaTwitch', label: 'Twitch', icon: FaTwitch },
  { key: 'FaInstagram', label: 'Instagram', icon: FaInstagram },
  { key: 'FaGitlab', label: 'GitLab', icon: FaGitlab },
];

export function SocialIcon({
  iconName,
  className = 'h-4 w-4',
}: {
  iconName: string;
  className?: string;
}) {
  const found = AVAILABLE_SOCIAL_ICONS.find(
    (i) =>
      i.key.toLowerCase() === iconName.toLowerCase() ||
      i.label.toLowerCase() === iconName.toLowerCase(),
  );
  const IconComponent = found ? found.icon : FaGlobe;
  return <IconComponent className={className} />;
}
