import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

// import { getUser } from "../utils/getUser";
import { makeAuthReq } from "../utils/makeAuthReq";
import getUser from "../utils/getUser";

export default function Profile({ user }) {
  const router = useRouter();
  if (!user) router.push("/");

  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [newPassCheck, setNewPassCheck] = useState("");
  const [error, setError] = useState("");

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

      <main>
        <h1>Profile page</h1>
        <div>
          <h1>
            Username: {user.username} ({user.accountType.title})
          </h1>

          {error && (
            <div className='bg-red-400 px-10'>
              <h3>Error: {error}</h3>
            </div>
          )}
          <form onSubmit={changePassword}>
            <label htmlFor='old-pass'>old password:</label>
            <br />
            <input
              type='password'
              name='old-pass'
              placeholder='old password'
              onChange={e => setOldPass(e.target.value)}
              required
            />
            <br />
            <label htmlFor='old-pass'>new password:</label>
            <br />
            <input
              type='password'
              name='new-pass'
              placeholder='new password'
              onChange={e => setNewPass(e.target.value)}
              required
            />
            <br />
            <input
              type='password'
              placeholder='re-enter new password'
              onChange={e => setNewPassCheck(e.target.value)}
              required
            />
            <br />
            <button type='submit'>Change password</button>
          </form>
        </div>
      </main>
    </>
  );
}

export const getServerSideProps = getUser;
