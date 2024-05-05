import React from 'react';
import Header from './Header';
import Footer from './Footer';

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
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
