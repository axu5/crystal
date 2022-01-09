import { useState } from "react";
import Head from "next/head";

// import { isServer } from "../utils/isServer";
import getUser from "../utils/getUser";
import { makeAuthReq } from "../utils/makeAuthReq";
import Error from "../components/Error";

export const getServerSideProps = async context => {
  const user = (await getUser(context)).props.user;

  if (!user) {
    return {
      redirect: {
        permanent: false,
        destination: "/login?redirect=wishlist",
      },
    };
  }

  const { success, error, data } = await makeAuthReq(
    `wishlist`,
    {},
    "GET"
  );

  console.log(`data :>>`, data);

  return {
    props: {
      user,
      wishlist: success ? data : null,
      error: error ? error : null,
    },
  };
};

export default function Cart({ user, wishlist, error: _error }) {
  const [error, setError] = useState(_error);

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
