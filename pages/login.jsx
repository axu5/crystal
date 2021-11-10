import { useState } from "react";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";

import { makeAuthReq } from "../utils/makeAuthReq";
import getUser from "../utils/getUser";
import { isServer } from "../utils/isServer";

export const getServerSideProps = getUser;

export default function Login({ user }) {
  const router = useRouter();
  const { redirect } = router.query;
  const redirectPath = redirect ? `/${redirect}` : "/";

  if (!isServer() && user !== null) router.push(redirectPath);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loginAction = async e => {
    e.preventDefault();

    const body = {
      username,
      password,
    };

    // const res = await fetch("http://localhost:3000/api/login", {
    //   headers: {
    //     Accept: "application/json",
    //     "Content-Type": "application/json",
    //   },
    //   method: "POST",
    //   body: JSON.stringify(body),
    //   credentials: "same-origin",
    // });
    const data = await makeAuthReq("login", body);

    const { success, error } = data;
    if (!success) {
      setError(
        typeof error === "object" ? JSON.stringify(error) : error
      );
    } else {
      // redirect user
      await router.push(redirect ? `/${redirect}` : "/");
      await router.reload();
    }
  };

  return (
    <>
      <Head>
        <title>Login to Crystal Cabins</title>
      </Head>
      <div>
        {error !== "" && (
          <>
            <div>{error}</div>
            <div>
              did you mean to sign up? (
              <Link href='/signup' passHref>
                <a>click here!</a>
              </Link>
              )
            </div>
          </>
        )}
        <form onSubmit={loginAction}>
          <input
            onChange={e => setUsername(e.target.value)}
            type='text'
            name='identity'
            id='input'
            placeholder='username or email'
            required
          />
          <input
            onChange={e => setPassword(e.target.value)}
            type='password'
            name='password'
            id='password'
            placeholder='password'
            required
          />
          <button type='submit'>Login!</button>
        </form>
      </div>
    </>
  );
}
