import Layout from "@/components/layout";
import "@/styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <div className="flex flex-col min-h-screen bg-[#1A202C] text-[#F7FAFC]">
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </div>
    </ChakraProvider>
  );
}
