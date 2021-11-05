import { useState, useEffect } from "react";
import Head from "next/head";
// import { useRouter } from "next/router";

import { getUser } from "../utils/getUser";
import { isServer } from "../utils/isServer";
import { localStorageKeys } from "../constants";

const cartKey = localStorageKeys.cart;

export default function Cart() {
  // const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(
    () => {
      (async () => {
        const _user = await getUser();
        // if (_user === null) router.push("/");
        setUser(_user);
      })();
    },
    [
      /* router */
    ]
  );

  return (
    <>
      <Head>
        <title>
          {user
            ? `${user.username}'s crystal cart`
            : "your crystal cart"}
        </title>
      </Head>
      <div>
        {user ? (
          <>
            <h1>{user.username}</h1>
            <h1>
              {user.name.first} {user.name.last}
            </h1>
            <p>
              {user.cart
                ? user.cart.map(
                    (item, i) => (
                      <div key={i}>
                        {i + 1}) {item}
                      </div>
                    ),
                    ""
                  )
                : "You have no items in your crystal cart"}
            </p>
          </>
        ) : (
          <>
            <h1>you&apos;re not logged in</h1>
            <p>
              {!isServer() && localStorage.getItem(cartKey)
                ? JSON.parse(localStorage.getItem(cartKey)).map(
                    (item, i) => (
                      <div key={i}>
                        {i + 1}) {item}
                      </div>
                    ),
                    ""
                  )
                : "You have no items in your crystal cart"}
            </p>
          </>
        )}
      </div>
    </>
  );
}
