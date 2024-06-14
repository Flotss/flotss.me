import Layout from '@/components/layout';
import '@/styles/globals.css';
import '@/styles/scrollbar.css';
import { ChakraProvider } from '@chakra-ui/react';
import dotenv from 'dotenv';
import type { AppProps } from 'next/app';
// eslint-disable-next-line @next/next/no-document-import-in-page

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
      <div className="flex min-h-screen flex-col bg-[#000000] text-[#F7FAFC]">
        {/* Render the layout, which includes header and footer */}
        <Layout>
          {/* Render the main content of the application */}
          <Component {...pageProps} />
        </Layout>
      </div>
    </ChakraProvider>
  );
}
