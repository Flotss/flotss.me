import { Html, Head, Main, NextScript } from "next/document";
import { Analytics } from '@vercel/analytics/react';

/**
 * The `Document` component is a custom Next.js component that allows you
 * to customize the HTML structure of your application's pages.
 *
 * @returns {JSX.Element} - The rendered `Document` component.
 */
export default function Document() {
  return (
    <Html lang="en">
      {/* The <Head> component is used to specify metadata and link to external resources */}
      <Head />

      <body>
        {/* The <Main> component is where the main content of your application is rendered */}
        <Main />

        {/* The <Analytics> component is used for analytics tracking (e.g., Vercel Analytics) */}
        <Analytics />

        {/* The <NextScript> component includes Next.js scripts required for the application */}
        <NextScript />
      </body>
    </Html>
  );
}
