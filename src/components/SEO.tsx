import Head from 'next/head';

// ─── Constantes du site ────────────────────────────────────────────────────────

const SITE_NAME = 'Florian Mangin — Portfolio';
const BASE_URL = 'https://flotss.me';
const TWITTER_HANDLE = '@flotss';

/**
 * Image OG par défaut (1200×630px recommandé par la spec Open Graph).
 * Elle apparaît quand aucune image spécifique n'est fournie par la page.
 */
const DEFAULT_OG_IMAGE = `${BASE_URL}/site-representation.png`;

/**
 * Description générique du site.
 * Utilisée sur les pages qui ne fournissent pas leur propre description.
 */
const DEFAULT_DESCRIPTION =
  'Software engineering student at ISEP Paris and software engineer at Société Générale. ' +
  'Building modern web applications with Next.js, TypeScript, Angular and more.';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface SEOProps {
  /**
   * Titre de la page. Sera formaté en : "<title> — Florian Mangin"
   * Si absent, le titre par défaut "Florian Mangin — Software Engineer" est utilisé.
   */
  title?: string;

  /** Description de la page (≤ 155 caractères recommandé pour les SERPs Google). */
  description?: string;

  /**
   * URL canonique de la page. Peut être relative ("/projects") ou absolue.
   * La balise <link rel="canonical"> indique à Google quelle est l'URL
   * de référence pour éviter le contenu dupliqué (ex: ?page=1 vs page principale).
   */
  url?: string;

  /**
   * URL absolue de l'image Open Graph (idéalement 1200×630px).
   * C'est l'image affichée dans les previews LinkedIn, Discord, Twitter, etc.
   */
  image?: string;

  /**
   * Type de contenu Open Graph.
   * - "website"  → pages génériques (home, contact)
   * - "profile"  → page de profil personnel
   * - "article"  → contenu éditorial (blog posts)
   */
  type?: 'website' | 'profile' | 'article';

  /**
   * Si true, la page ne sera pas indexée par Google.
   * À utiliser pour les pages admin, les erreurs, etc.
   */
  noIndex?: boolean;
}

// ─── Composant SEO ─────────────────────────────────────────────────────────────

/**
 * Composant SEO — à placer dans chaque page.
 *
 * Il injecte dans le <head> HTML (via next/head) toutes les balises
 * nécessaires pour le référencement et les previews sur les réseaux sociaux.
 *
 * Exemple d'utilisation :
 * ```tsx
 * <SEO
 *   title="My Projects"
 *   description="All my open-source projects on GitHub."
 *   url="/projects"
 * />
 * ```
 */
export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  url = BASE_URL,
  image = DEFAULT_OG_IMAGE,
  type = 'website',
  noIndex = false,
}: SEOProps) {
  // Titre formaté : "My Projects — Florian Mangin" ou "Florian Mangin — Software Engineer"
  const fullTitle = title
    ? `${title} — Florian Mangin`
    : 'Florian Mangin — Software Engineer';

  // Garantit que l'URL est toujours absolue (requis par la spec OG et canonical)
  const absoluteUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;
  const absoluteImage = image.startsWith('http') ? image : `${BASE_URL}${image}`;

  return (
    <Head>
      {/* ─── Balises primaires ──────────────────────────────────────────────
       *
       * <title> : affiché dans l'onglet du navigateur ET comme titre
       *   cliquable dans les résultats Google (SERPs).
       *   Longueur idéale : 50-60 caractères.
       *
       * <meta name="description"> : l'extrait de texte sous le titre dans Google.
       *   Ne booste pas directement le classement mais influence le taux de clic.
       *   Longueur idéale : 120-155 caractères.
       *
       * <meta name="author"> : indique l'auteur du contenu.
       *
       * <meta name="robots"> : directives pour les crawlers.
       *   "index, follow" = indexer cette page ET suivre ses liens (défaut souhaité).
       *   "noindex, nofollow" = ne pas indexer (admin, pages d'erreur).
       *
       * <link rel="canonical"> : l'URL officielle de cette page.
       *   Évite la pénalité de "duplicate content" si la même page est accessible
       *   via plusieurs URLs (ex: avec/sans trailing slash, avec query params, etc.).
       ──────────────────────────────────────────────────────────────────────── */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="author" content="Florian Mangin" />
      <meta name="robots" content={noIndex ? 'noindex, nofollow' : 'index, follow'} />
      <link rel="canonical" href={absoluteUrl} />

      {/* ─── Open Graph ─────────────────────────────────────────────────────
       *
       * Protocole créé par Facebook (2010), lu par : LinkedIn, Discord, Slack,
       * WhatsApp, Telegram, Facebook, etc. pour générer les previews de liens.
       *
       * og:site_name  → nom du site (affiché en petit au-dessus du titre sur LinkedIn)
       * og:type       → type de contenu (influe sur le rendu de la card)
       * og:url        → URL canonique (peut différer de l'URL actuelle)
       * og:title      → titre de la preview card
       * og:description → description dans la preview card (peut être tronquée)
       * og:image      → image principale de la card (1200×630 = ratio 1.91:1)
       * og:image:width/height → aide les crawlers à ne pas télécharger l'image
       *   pour en connaître les dimensions
       * og:locale     → langue du contenu (format ISO : langue_PAYS)
       ──────────────────────────────────────────────────────────────────────── */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={absoluteUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={absoluteImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_US" />

      {/* ─── Twitter Card ───────────────────────────────────────────────────
       *
       * Spécifique à X (Twitter), mais aussi lu par d'autres plateformes.
       * "summary_large_image" = grande image en haut, titre et description en dessous.
       * C'est le format le plus impactant visuellement pour un portfolio.
       *
       * twitter:site    → compte Twitter du site/auteur (pour le mention "@")
       * twitter:creator → auteur spécifique du contenu (peut différer du site)
       ──────────────────────────────────────────────────────────────────────── */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={TWITTER_HANDLE} />
      <meta name="twitter:creator" content={TWITTER_HANDLE} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteImage} />

      {/* ─── Theme color ────────────────────────────────────────────────────
       *
       * Colore la barre d'interface du navigateur sur mobile (Chrome Android,
       * Safari iOS en PWA). Utilise deux variantes pour s'adapter au thème OS.
       ──────────────────────────────────────────────────────────────────────── */}
      <meta name="theme-color" content="#050505" media="(prefers-color-scheme: dark)" />
      <meta name="theme-color" content="#f4f4f5" media="(prefers-color-scheme: light)" />
    </Head>
  );
}
