import { useState } from "react";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";

import { makeAuthReq } from "../utils/makeAuthReq";
import getUser from "../utils/getUser";
import { isServer } from "../utils/isServer";

export const getServerSideProps = getUser;

export default function Login({ user }) {
  const { t } = useTranslation();

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
        <title>{t("common:login_title")}</title>
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
        <form
          onSubmit={loginAction}
          className='flex flex-col justify-items-center align-middle px-4'
        >
          <InputField
            placeholder={t("common:username_required")}
            setValue={setUsername}
            type='text'
          />
          <InputField
            placeholder={t("common:password_required")}
            setValue={setPassword}
            type='password'
          />
          <button
            className='bg-white hover:bg-purple-400 w-52 rounded-md pt-5'
            type='submit'
          >
            Login!
          </button>
        </form>
      </div>
    </>
  );
}

function InputField({ placeholder, setValue, type }) {
  const id = placeholder.toLowerCase().replace(/ +/g, "_");
  return (
    <>
      <label className='pt-5' htmlFor={id}>
        {placeholder}
      </label>
      <input
        className='border-b-2 border-gray-600 p-2 w-full'
        onChange={e => setValue(e.target.value)}
        type={type}
        name={id}
        id={id}
        placeholder={placeholder}
        required
        autoComplete='off'
      />
    </>
  );
}
