import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import { getUser } from "../utils/getUser";
import { makeAuthReq } from "../utils/makeAuthReq";

export default function Profile() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [newPassCheck, setNewPassCheck] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const user = await getUser();
      if (!user) return router.push("/");
      else setUser(user);

      console.log("user :>> ", user);
    })();
  }, [router]);

  const changePassword = async e => {
    e.preventDefault();

    if (newPass !== newPassCheck) {
      setError("passwords do not match");
      return;
    }

    const { success, error: err } = await makeAuthReq(`/changepass`, {
      oldPass,
      newPass,
    });

    if (!success) {
      setError(typeof err === "object" ? JSON.stringify(err) : err);
    } else {
      // router.push("/");
      setError("succeeded?");
    }
  };

  return (
    <>
      <Head>
        <title>{user && user.username + "'s "}profile</title>
      </Head>

      {user ? (
        <div>
          <h1>
            Username: {user.username} ({user.accountType.title})
          </h1>

          <form onSubmit={changePassword}>
            {error !== "" && <p>Error: {error}</p>}
            <label htmlFor='old-pass'>old password:</label>
            <br />
            <input
              type='password'
              name='old-pass'
              placeholder='old password'
              onChange={e => setOldPass(e.target.value)}
            />
            <br />
            <label htmlFor='old-pass'>new password:</label>
            <br />
            <input
              type='password'
              name='new-pass'
              placeholder='new password'
              onChange={e => setNewPass(e.target.value)}
            />
            <br />
            <input
              type='password'
              placeholder='re-enter new password'
              onChange={e => setNewPassCheck(e.target.value)}
            />
            <br />
            <button type='submit'>Change password</button>
          </form>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
}
