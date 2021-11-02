import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
// @ts-ignore
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Crystal Cabins</title>
        <meta
          name='description'
          content='Get high quality crystals'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          welcome to <span className={styles.crystal}>Crystal</span>{" "}
          Cabins!
        </h1>

        <div className={styles.grid}>
          <Link href='/about' passHref>
            <div className={styles.card}>
              <h2>about us &rarr;</h2>
              <p>about us</p>
            </div>
          </Link>

          <Link href='/blog' passHref>
            <div className={styles.card}>
              <h2>our blog &rarr;</h2>
              <p>find out about the latest jewelry news!</p>
            </div>
          </Link>

          <Link href='/catalogue' passHref>
            <div className={styles.card}>
              <h2>see our catalogue &rarr;</h2>
              <p>
                are you interested and want to buy? Look no further!
              </p>
            </div>
          </Link>

          <Link href='/cart' passHref>
            <div className={styles.card}>
              <h2>your cart &rarr;</h2>
              <p>
                find out what you&lsquo;ve added to your cart so far.
              </p>
            </div>
          </Link>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href='https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app'
          target='_blank'
          rel='noopener noreferrer'
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image
              src='/vercel.svg'
              alt='Vercel Logo'
              width={72}
              height={16}
            />
          </span>
        </a>
      </footer>
    </div>
  );
}
