import Head from 'next/head';

type CustomHeadProps = {
  title: string;
  description: string;
};

const CustomHead: React.FC = () => {
  return (
    <Head>
      <title>Flotss.me</title>
      <meta name="description" content="Flotss portefolio website" />
      {/* Add any other meta tags or customizations here */}
      <link rel="icon" href="/favicon.ico" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="robots" content="index, follow" />
      <link rel="manifest" href="/manifest.json" />
    </Head>
  );
};

export default CustomHead;
