import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";
// import HCaptcha from "@hcaptcha/react-hcaptcha";

import { makeAuthReq } from "../utils/makeAuthReq";
import getUser from "../utils/getUser";
import { isServer } from "../utils/isServer";
import InputField from "../components/InputField";
import { localStorageKeys } from "../constants";
import Button from "../components/Button";
import Error from "../components/Error";

export const getServerSideProps = getUser;

export default function SignUp({ user }) {
  const router = useRouter();

  const cartKey = localStorageKeys.cart;
  const { un, em, fn, ln, redirect } = router.query;
  const redirectPath = redirect ? `/${redirect}` : "/";
  if (!isServer() && user !== null) router.push(redirectPath);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  // const [token, setToken] = useState("");
  // const captcha = useRef();

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

  const signupAction = async e => {
    e.preventDefault();

    // if (!token || token === "") {
    //   setError("you must verify the captcha");
    // }

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
      // token,
    };

    const data = await makeAuthReq("signup", body);

    const { success, error } = data;

    if (success) {
      // redirect user
      // router.push(redirectPath);
      // setSuccess(
      //   `success, check your email ()`
      // );
      const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
      const res = await fetch(`http://localhost:3000/api/cart`, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: JSON.stringify({ cart }),
      });
    } else {
      setError(
        typeof error === "object" ? JSON.stringify(error) : error
      );
    }
    // @ts-ignore
    // captcha.current.resetCaptcha();
    // setToken("");
  };

  return (
    <>
      <Head>
        <title>Sign up to Crystal Cabins!</title>
      </Head>
      <div>
        {success && (
          <div className='bg-green-300'>
            {success}{" "}
            <Link
              href={`https://mail.google.com/mail/u/?authuser=${email}`}
            >
              <a>gmail</a>
            </Link>
          </div>
        )}
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
          {/* InputField({ placeholder, setValue, type }) */}
          <InputField
            placeholder='username'
            setValue={setUsername}
            type='text'
          />
          <InputField
            placeholder='email'
            setValue={setEmail}
            type='email'
          />
          <InputField
            placeholder='first name'
            setValue={setFirstName}
            type='text'
          />
          <InputField
            placeholder='last name'
            setValue={setLastName}
            type='text'
          />
          <InputField
            placeholder='password'
            setValue={setPassword}
            type='password'
          />
          <InputField
            placeholder='password check'
            setValue={setPasswordCheck}
            type='password'
          />

          {/* @ts-ignore */}
          {/* <HCaptcha
            ref={captcha}
            sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY}
            onVerify={(token, _ekey) => setToken(token)}
            onExpire={e => setToken("")}
          /> */}

          <button type='submit'>Sign up!</button>
        </form>
      </div>
      <form id='main_content' onSubmit={signupAction}>
        <div className='flex justify-center align-middle px-4'>
          <div className='flex flex-col md:w-96'>
            <Error error={error} />
            <InputField
              placeholder='username'
              setValue={setUsername}
              type='text'
            />
            <InputField
              placeholder='email'
              setValue={setEmail}
              type='email'
            />
            <InputField
              placeholder='first name'
              setValue={setFirstName}
              type='text'
            />
            <InputField
              placeholder='last name'
              setValue={setLastName}
              type='text'
            />
            <InputField
              placeholder='password'
              setValue={setPassword}
              type='password'
            />
            <InputField
              placeholder='password check'
              setValue={setPasswordCheck}
              type='password'
            />
            <Button actionTitle='sign up' callback={signupAction} />
          </div>
        </div>
      </form>
    </>
  );
}
