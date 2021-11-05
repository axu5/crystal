import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";
import HCaptcha from "@hcaptcha/react-hcaptcha";

import { makeAuthReq } from "../utils/makeAuthReq";
import { getUser } from "../utils/getUser";

export default function SignUp() {
  const router = useRouter();

  const { un, em, fn, ln, redirect } = router.query;
  const redirectPath = redirect ? `/${redirect}` : "/";

  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [token, setToken] = useState("");
  const captcha = useRef();

  useEffect(() => {
    // @ts-ignore
    if (un) setUsername(un);
    // @ts-ignore
    if (em) setEmail(em);
    // @ts-ignore
    if (fn) setFirstName(fn);
    // @ts-ignore
    if (ln) setLastName(ln);
  }, [un, em, fn, ln]);

  useEffect(() => {
    (async () => {
      const user = await getUser();
      if (user !== null) router.push(redirectPath);
    })();
  }, [router, redirectPath]);

  const signupAction = async e => {
    e.preventDefault();

    if (!token || token === "") {
      setError("you must verify the captcha");
    }

    if (password !== passwordCheck) {
      setError("passwords are not equal");
      return;
    }

    const body = {
      firstName,
      lastName,
      username,
      email,
      password,
      token,
    };

    const data = await makeAuthReq("signup", body);

    const { success, error } = data;

    if (success) {
      // redirect user
      router.push(redirectPath);
    } else {
      setError(
        typeof error === "object" ? JSON.stringify(error) : error
      );
    }
    // @ts-ignore
    captcha.current.resetCaptcha();
    setToken("");
  };

  return (
    <>
      <Head>
        <title>Sign up to Crystal Cabins!</title>
      </Head>
      <div>
        {error !== "" && (
          <>
            <div>{error}</div>
            <div>
              did you mean to login? (
              <Link href='/login' passHref>
                <a>click here!</a>
              </Link>
              )
            </div>
          </>
        )}
        <form onSubmit={signupAction}>
          <input
            onChange={e => setUsername(e.target.value)}
            type='text'
            name='username'
            id='username'
            placeholder='username'
            value={username}
            required
          />
          <input
            onChange={e => setEmail(e.target.value)}
            type='email'
            name='email'
            id='email'
            placeholder='email'
            value={email}
            required
          />
          <input
            onChange={e => setFirstName(e.target.value)}
            type='text'
            name='first name'
            id='firstname'
            placeholder='first name'
            value={firstName}
            required
          />
          <input
            onChange={e => setLastName(e.target.value)}
            type='text'
            name='last name'
            id='lastname'
            placeholder='last name'
            value={lastName}
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
          <input
            onChange={e => setPasswordCheck(e.target.value)}
            type='password'
            name='passwordcheck'
            id='passwordcheck'
            placeholder='repeat your password'
            required
          />

          {/* @ts-ignore */}
          <HCaptcha
            ref={captcha}
            sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY}
            onVerify={(token, _ekey) => setToken(token)}
            onExpire={e => setToken("")}
          />

          <button type='submit'>Sign up!</button>
        </form>
      </div>
    </>
  );
}
