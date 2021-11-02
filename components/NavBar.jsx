import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

// @ts-ignore
import styles from "../styles/NavBar.module.css";
import { getUser } from "../utils/getUser";

export default function NavBar() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      const _user = await getUser();
      setUser(_user);
    })();
  }, [router]);

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
          {!user ? (
            <>
              {" "}
              <Link href='/login'>
                <a className={styles.pageLink}>login</a>
              </Link>
              <Link href='/signup'>
                <a className={styles.pageLink}>signup</a>
              </Link>
            </>
          ) : (
            <>
              <Link href='/logout'>
                <a className={styles.pageLink}>logout</a>
              </Link>
              <h1>welcome {user.username}</h1>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
