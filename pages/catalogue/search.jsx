import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import getDb from "../api/database";
import AllProducts from "../../components/AllProducts";
import { isServer } from "../../utils/isServer";

const makeGetReq = async uri => {
  if (isServer()) return;
  const res = await fetch(uri, {
    headers: {
      Accept: "application/json",
    },
  });
  const data = await res.json();
  return data;
};

export default function Search({ products }) {
  const router = useRouter();
  const [found, setFound] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { q } = router.query;

  useEffect(() => {
    // const loadProds = async () => {
    //   console.log("gay");
    //   if (!q) {
    //     const data = await makeGetReq(
    //       `http://localhost:3000/products`
    //     );
    //     setFound(data);
    //     setLoading(false);
    //     return;
    //   }

    //   const data = await makeGetReq(
    //     `http://localhost:3000/products?q=${q}`
    //   );

    //   console.log("data :>> ", data);
    //   setFound(data);
    //   setLoading(false);
    // };
    // loadProds();

    fetch(`http://localhost:3000/api/products${q ? `?q=${q}` : ""}`)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then(data => {
        setFound(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
        setError("an error has occurred");
      });
  }, [q]);

  return (
    <>
      {!loading ? (
        error ? (
          <h1>Error {error}</h1>
        ) : (
          <AllProducts products={found} />
        )
      ) : (
        <h1>Loading...</h1>
      )}
    </>
  );
}

export async function getServerSideProps() {
  const { products } = await getDb();

  const productsStore = await products.find({});

  const prods = await productsStore.toArray();

  return {
    props: {
      products: prods.map(prod => {
        return {
          name: prod.name,
          tags: prod.tags,
        };
      }),
    },
  };
}
