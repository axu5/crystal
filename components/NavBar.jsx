import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

// @ts-ignore
import styles from "../styles/NavBar.module.css";
import { getUser } from "../utils/getUser";

export default function NavBar() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const _user = await getUser();
      console.log(`_user`, _user);
      setUser(_user);
      setLoading(false);
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
          {user ? (
            <>
              <Link href='/logout'>
                <a className={styles.pageLink}>logout</a>
              </Link>
              <h1 className={styles.user}>
                welcome {user.name.first}
              </h1>
            </>
          ) : loading ? (
            <>Loading...</>
          ) : (
            <>
              {" "}
              <Link href='/login'>
                <a className={styles.pageLink}>login</a>
              </Link>
              <Link href='/signup'>
                <a className={styles.pageLink}>signup</a>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
