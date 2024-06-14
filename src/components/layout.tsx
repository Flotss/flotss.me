/* eslint-disable @next/next/no-document-import-in-page */
/* eslint-disable @next/next/no-title-in-document-head */
import React from 'react';
import Footer from './Footer';
import Header from './Header';
import { Head } from 'next/document';

/**
 * The Layout component provides a consistent structure for web pages within the application.
 * It includes a header, a main content area, and a footer.
 *
 * @param {Object} props - The component's props.
 * @param {React.ReactNode} props.children - The content to be rendered within the main content area.
 * @returns {React.ReactNode} - The rendered Layout component.
 */
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
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
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
