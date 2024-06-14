import { Head, Html, Main, NextScript } from 'next/document';

/**
 * The `Document` component is a custom Next.js component that allows you
 * to customize the HTML structure of your application's pages.
 *
 * @returns {JSX.Element} - The rendered `Document` component.
 */
export default function Document() {
  return (
    <Html lang="en">
      <body>
        {/* The <Main> component is where the main content of your application is rendered */}
        <Main />

        {/* The <NextScript> component includes Next.js scripts required for the application */}
        <NextScript />
      </body>
    </Html>
  );
}
