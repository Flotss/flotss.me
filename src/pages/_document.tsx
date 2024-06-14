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
      {/* The <Head> component is used to specify metadata and link to external resources */}
      <Head>
        {/* The <title> element specifies the title of the document */}
        <title>Flotss.me</title>

        {/* The <meta> element provides metadata about the HTML document */}
        <meta name="description" content="Flotss personal website" />
        <meta name="author" content="Flotss" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* The <link> element defines the relationship between a document and an external resource */}
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <body>
        {/* The <Main> component is where the main content of your application is rendered */}
        <Main />

        {/* The <NextScript> component includes Next.js scripts required for the application */}
        <NextScript />
      </body>
    </Html>
  );
}
