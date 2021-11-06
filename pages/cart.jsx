import { useState, useEffect } from "react";
import Head from "next/head";

import { getUser } from "../utils/getUser";
import { isServer } from "../utils/isServer";
import { localStorageKeys } from "../constants";

export default function Cart() {
  const cartKey = localStorageKeys.cart;
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      const _user = await getUser();
      setUser(_user);
    })();
  }, []);

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
