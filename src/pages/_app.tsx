import React from "react";
import Layout from "@/components/layout";
import "@/styles/globals.css";
import "@/styles/scrollbar.css";
import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import dotenv from "dotenv";

/**
 * The `App` component is the entry point for your Next.js application.
 *
 * @param {AppProps} props - The properties passed to the `App` component.
 * @returns {JSX.Element} - The rendered `App` component.
 */
export default function App({ Component, pageProps }: AppProps) {
  // Load environment variables from a .env file if available
  dotenv.config();

  return (
    <ChakraProvider>
      {/* Define the overall layout of the application */}
      <div className="flex flex-col min-h-screen bg-[#000000] text-[#F7FAFC]">
        {/* Render the layout, which includes header and footer */}
        <Layout>
          {/* Render the main content of the application */}
          <Component {...pageProps} />
        </Layout>
      </div>
    </ChakraProvider>
  );
}
