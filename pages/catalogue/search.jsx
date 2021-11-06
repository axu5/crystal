import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import AllProducts from "../../components/AllProducts";
import { isServer } from "../../utils/isServer";
import getProductsReduced from "../../utils/getProductsReduced";

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
        // console.error(err);
        setLoading(false);
        setError("an error has occurred");
      });
  }, [q]);

  return (
    <>
      <Head>
        <title>
          {q ? `searching: ${q}` : "search the crystal cabins"}
        </title>
      </Head>
      <div>
        {!loading ? (
          error ? (
            <h1>Error: {error}</h1>
          ) : (
            <AllProducts products={found} />
          )
        ) : (
          <h1>Loading...</h1>
        )}
      </div>
    </>
  );
}

export async function getServerSideProps() {
  const prods = await getProductsReduced();

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
