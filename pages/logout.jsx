import { useRouter } from "next/router";
import Head from "next/head";
import useTranslation from "next-translate/useTranslation";

import { makeAuthReq } from "../utils/makeAuthReq";
import Button from "../components/Button";

// TODO: DELETE ACCOUNT
export default function Login() {
  const { t } = useTranslation();

  const router = useRouter();

  const logout = type => {
    return async (/** @type {any} */ e) => {
      e.preventDefault();
      localStorage.clear();
      await makeAuthReq(`logout${type}`);
      await router.push("/");
      await router.reload();
    };
  };

  return (
    <>
      <Head>
        <title>{t("common:logout")}</title>
      </Head>

      <div className='flex justify-center'>
        {/* <button onClick={logout("")}>Log out!</button>
        <button onClick={logout("-all")}>Log out all!</button> */}
        <div className='flex flex-col w-96'>
          <div className='lowercase text-2xl bold font-serif'>
            {t("common:logout_check")}
          </div>
          <Button
            actionTitle={t("common:logout")}
            callback={logout("")}
          />
          <Button
            actionTitle={t("common:logout_all")}
            callback={logout("-all")}
          />
        </div>
      </div>
    </>
  );
}
