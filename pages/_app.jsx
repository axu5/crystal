import Head from "next/head";

import "../styles/globals.css";
import NavBar from "../components/NavBar";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel='icon' href='/logo.png' />
      </Head>
      <NavBar />
      <Component {...pageProps} />
    </>
  );
}
