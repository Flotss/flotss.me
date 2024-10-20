import Layout from '@/components/layout';
import '@/styles/globals.css';
import '@/styles/scrollbar.css';
import '@/styles/markdown.css';
import { ChakraProvider } from '@chakra-ui/react';
import dotenv from 'dotenv';
import React from 'react';

/**
 * The `App` component is the entry point for your Next.js application.
 *
 * @param {AppProps} props - The properties passed to the `App` component.
 * @returns {JSX.Element} - The rendered `App` component.
 */
export default function App({
  Component,
  pageProps,
}: {
  Component: React.ComponentType;
  pageProps: any;
}) {
  // Load environment variables from a .env file if available
  dotenv.config();

  return (
    <ChakraProvider>
      {/* Define the overall layout of the application */}
      <div className="flex min-h-screen flex-col bg-[#000000] text-[#f7fafcd0]">
        {/* Render the layout, which includes header and footer */}
        <Layout>
          {/* Render the main content of the application */}
          <Component {...pageProps} />
        </Layout>
      </div>
    </ChakraProvider>
  );
}
