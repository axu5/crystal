import Head from "next/head";
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
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          welcome to <span className={styles.crystal}>Crystal</span>{" "}
          Cabins!
        </h1>

        <div className={styles.grid}>
          <Link href='/faq' passHref>
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
    </div>
  );
}
