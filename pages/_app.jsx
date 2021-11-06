import Head from "next/head";

import "../styles/globals.scss";
import NavBar from "../components/NavBar";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel='icon' href='/favicon.png' />
      </Head>
      <NavBar />
      <Component {...pageProps} />
    </>
  );
}
