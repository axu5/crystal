import { useRouter } from "next/router";
import Head from "next/head";

import { makeAuthReq } from "../utils/makeAuthReq";
import { localStorageKeys } from "../constants";

export default function Login() {
  const router = useRouter();

  const logout = type => {
    const cartKey = localStorageKeys.cart;
    return async e => {
      e.preventDefault();
      localStorage.removeItem(cartKey);
      await makeAuthReq(`logout${type}`);
      await router.push("/");
      await router.reload();
    };
  };

  return (
    <>
      <Head>
        <title>Logout</title>
      </Head>

      <div>
        <button onClick={logout("")}>Log out!</button>
        <button onClick={logout("-all")}>Log out all!</button>
      </div>
    </>
  );
}
