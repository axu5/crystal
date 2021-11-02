import Link from "next/link";
import cookieCutter from "cookie-cutter";

// @ts-ignore
import styles from "../styles/NavBar.module.css";

export default function NavBar() {
  return (
    <div className={styles.nav}>
      <div>
        <Link href='/'>
          <a className={styles.title}>
            <span className={styles.highlight}>Crystal</span> Cabins
          </a>
        </Link>

        <div className={styles.linkContainer}>
          <Link href='/catalogue'>
            <a className={styles.pageLink}>catalogue</a>
          </Link>
          <Link href='/login'>
            <a className={styles.pageLink}>login</a>
          </Link>
          <Link href='/signup'>
            <a className={styles.pageLink}>signup</a>
          </Link>
          <Link href='/logout'>
            <a className={styles.pageLink}>logout</a>
          </Link>
        </div>
      </div>
    </div>
  );
}

// export async function getInitialProps() {
//   const accessToken = await cookieCutter.get("accessToken");
//   const refreshToken = await cookieCutter.get("refreshToken");

//   return {
//     props: {
//       cookies: {
//         accessToken,
//         refreshToken,
//       },
//     },
//   };
// }
