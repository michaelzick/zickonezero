import { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

const Sitemap = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace('/sitemap.xml');
  }, [router]);

  return (
    <>
      <Head>
        <meta httpEquiv="refresh" content="0; url=/sitemap.xml" />
        <link rel="canonical" href="/sitemap.xml" />
      </Head>
      <p>Redirecting to the sitemap...</p>
    </>
  );
};

export default Sitemap;
