const CustomHead = () => {
  return (
    <>
      <title>Flotss.me</title>
      <meta name="description" content="Flotss portfolio website" />
      {/* Add any other meta tags or customizations here */}
      <link rel="icon" href="/favicon.ico" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="robots" content="index, follow" />
      <link rel="manifest" href="/manifest.json" />
      <meta property="og:title" content="Flotss.me" />
      <meta property="og:description" content="Flotss portfolio website" />
      <meta property="og:image" content="/site-representation.png" />
      <meta property="og:url" content="https://flotss.me" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="@flotss" />
      <meta name="twitter:title" content="Flotss.me" />
      <meta name="twitter:description" content="Flotss portfolio website" />
      <meta name="twitter:image" content="/site-representation.png" />
    </>
  );
};

export default CustomHead;
