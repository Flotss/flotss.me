import { defaultSEO, pagesSEO } from '@/config/seo.config';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

export interface SEOProps {
  page?: keyof typeof pagesSEO;
  title?: string;
  description?: string;
  canonical?: string;
  noindex?: boolean;
  image?: string;
}

export default function SEO({ page, title, description, canonical, noindex, image }: SEOProps) {
  const router = useRouter();

  const pageConfig = page ? pagesSEO[page] : undefined;

  const metaTitle = title || pageConfig?.title || defaultSEO.defaultTitle;
  const metaDescription = description || pageConfig?.description || defaultSEO.defaultDescription;

  // By default, obey the pageConfig noindex rule or the prop override
  const isNoIndex =
    typeof noindex === 'boolean'
      ? noindex
      : pageConfig?.noindex !== undefined
        ? pageConfig.noindex
        : false;

  const currentUrl = `${defaultSEO.domain}${router?.asPath ? router.asPath.split('?')[0] : ''}`;
  const canonicalUrl = canonical || pageConfig?.canonical || currentUrl;
  const metaImage = image || defaultSEO.defaultImage;

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title key="title">{metaTitle}</title>
      <meta name="description" content={metaDescription} key="description" />
      <meta name="author" content={defaultSEO.author} key="author" />
      <meta
        name="robots"
        content={isNoIndex ? 'noindex, nofollow' : 'index, follow'}
        key="robots"
      />
      <link rel="canonical" href={canonicalUrl} key="canonical" />

      {/* Open Graph / Facebook */}
      <meta property="og:site_name" content={defaultSEO.siteName} key="og:site_name" />
      <meta property="og:type" content="website" key="og:type" />
      <meta property="og:title" content={metaTitle} key="og:title" />
      <meta property="og:description" content={metaDescription} key="og:description" />
      <meta property="og:url" content={canonicalUrl} key="og:url" />
      <meta property="og:image" content={metaImage} key="og:image" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" key="twitter:card" />
      <meta name="twitter:site" content={defaultSEO.twitterHandle} key="twitter:site" />
      <meta name="twitter:title" content={metaTitle} key="twitter:title" />
      <meta name="twitter:description" content={metaDescription} key="twitter:description" />
      <meta name="twitter:image" content={metaImage} key="twitter:image" />
    </Head>
  );
}
