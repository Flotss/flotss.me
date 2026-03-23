import Document, { Head, Html, Main, NextScript } from 'next/document';

/**
 * _document.tsx — structure HTML statique commune à toutes les pages.
 *
 * Ce fichier contient UNIQUEMENT ce qui est :
 *   - commun à chaque page (favicon, manifest, viewport)
 *   - non dynamique (pas de title, description ou OG tags ici)
 *
 * Les meta tags SEO (title, description, og:*) sont gérés page par page
 * via le composant <SEO> qui utilise next/head.
 */
export default class MyDocument extends Document {
  render() {
    return (
      // lang="en" : indique la langue aux moteurs de recherche et aux lecteurs d'écran (a11y)
      <Html lang="en">
        <Head>
          {/* Favicon et PWA */}
          <link rel="icon" href="/favicon.ico" />
          <link rel="manifest" href="/manifest.json" />

          {/* Viewport : géré ici car il ne change jamais entre les pages */}
          <meta name="viewport" content="width=device-width, initial-scale=1" />

          {/*
           * Preconnect : ouvre la connexion TCP/TLS en avance vers les domaines externes
           * utilisés. Réduit la latence du premier appel réseau (gain ~100-300ms).
           */}
          <link rel="preconnect" href="https://api.github.com" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
