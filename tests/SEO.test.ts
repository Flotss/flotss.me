import { defaultSEO, pagesSEO } from '@/config/seo.config';
import { describe, expect, it } from '@jest/globals';
import fs from 'fs';
import path from 'path';

describe('SEO Configuration and Rules', () => {
  it('should allow indexing only on home and contact, and block projects and admin', () => {
    expect(pagesSEO.home.noindex).toBe(false);
    expect(pagesSEO.contact.noindex).toBe(false);

    // Projects must strictly be blocked from indexing per user requirement
    expect(pagesSEO.projects.noindex).toBe(true);
    expect(pagesSEO.projectDetail.noindex).toBe(true);

    // Admin pages must strictly be blocked from indexing
    expect(pagesSEO.admin.noindex).toBe(true);
    expect(pagesSEO.dashboard.noindex).toBe(true);
  });

  it('should define valid canonical and domain metadata', () => {
    expect(defaultSEO.domain).toBe('https://flotss.me');
    expect(pagesSEO.home.canonical).toBe('https://flotss.me');
    expect(pagesSEO.contact.canonical).toBe('https://flotss.me/contact');
  });

  it('should verify robots.txt exists and enforces project disallow rules', () => {
    const robotsPath = path.resolve(process.cwd(), 'public/robots.txt');
    expect(fs.existsSync(robotsPath)).toBe(true);

    const robotsContent = fs.readFileSync(robotsPath, 'utf8');
    expect(robotsContent).toContain('Allow: /$');
    expect(robotsContent).toContain('Allow: /contact');
    expect(robotsContent).toContain('Disallow: /projects');
    expect(robotsContent).toContain('Disallow: /admin');
    expect(robotsContent).toContain('Sitemap: https://flotss.me/sitemap.xml');
  });

  it('should verify sitemap.xml exists, contains home and contact, and omits projects', () => {
    const sitemapPath = path.resolve(process.cwd(), 'public/sitemap.xml');
    expect(fs.existsSync(sitemapPath)).toBe(true);

    const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
    expect(sitemapContent).toContain('https://flotss.me/</loc>');
    expect(sitemapContent).toContain('https://flotss.me/contact</loc>');
    expect(sitemapContent).not.toContain('/projects');
    expect(sitemapContent).not.toContain('/admin');
  });
});
