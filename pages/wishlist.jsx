import { useEffect, useState } from "react";
import Head from "next/head";

import { isServer } from "../utils/isServer";
import getUser from "../utils/getUser";
import { makeAuthReq } from "../utils/makeAuthReq";
import Error from "../components/Error";

export const getServerSideProps = async context => {
  const user = (await getUser(context)).props.user;

  if (!user) {
    return {
      redirect: {
        permanent: false,
        destination: "/login?redirect=admin",
      },
    };
  }

  return {
    props: {
      user,
    },
  };
};

export default function Cart({ user }) {
  const [wishlist, setWishlist] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      if (isServer()) return;
      const { success, error, data } = await makeAuthReq(
        `wishlist`,
        {},
        "GET"
      );

      if (!success) {
        setError(error);
        return;
      }

      console.log(`data`, data);

      setWishlist(data);
    })();
  }, []);

  return (
    <>
      <Head>
        <title>
          {user ? `${user.username}'s wishlist` : "your wishlist"}
        </title>
      </Head>
      <Error error={error} />
      <div>
        <h1>you&apos;re {user ? "" : "not "}logged in</h1>
        <p>
          {wishlist.length
            ? wishlist.map(
                (item, i) => (
                  <div key={item.name}>
                    {i + 1}) {item.name}
                  </div>
                ),
                ""
              )
            : "You have no items in your wishlist"}
        </p>
      </div>
    </>
  );
}
