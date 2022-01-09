import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";

import { makeAuthReq } from "../utils/makeAuthReq";
import getUser from "../utils/getUser";
import { isServer } from "../utils/isServer";
import InputField from "../components/InputField";
import Button from "../components/Button";
import Error from "../components/Error";

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
      localStorage.clear();
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
      <main className='mb-10'>
        <form id='main_content' onSubmit={loginAction}>
          <div className='flex justify-center align-middle px-4'>
            <div className='flex flex-col w-full md:w-96'>
              <Error error={error} />
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
              <Button
                actionTitle={t("common:login")}
                callback={loginAction}
              />
            </div>
          </div>
        </form>
      </main>
    </>
  );
}
