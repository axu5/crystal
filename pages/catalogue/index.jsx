import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import useTranslation from "next-translate/useTranslation";

import CategoryHead from "../../components/CategoryHead";
import DisplayGrid from "../../components/DisplayGrid";
import getItems from "../../utils/getItems";

export async function getStaticProps() {
  return {
    props: {
      items: await getItems({}),
    },
  };
}

export default function Catalogue({ items }) {
  const { t } = useTranslation();

  const router = useRouter();

  const [products, setProducts] = useState(items);

  const fetchAllProducts = useCallback(async () => {
    const res = await fetch(`http://localhost:3000/api/products`);
    const json = await res.json();

    setProducts(json);
  }, []);

  useEffect(() => {
    (async () => {
      const { search } = router.query;
      if (!search) return;

      const res = await fetch(
        `http://localhost:3000/api/products?q=${search}`
      );
      const json = await res.json();

      setProducts(json);
    })();
  }, [router.query]);

  return (
    <>
      <CategoryHead
        title={t("common:crystal_catalogue", {
          main_title: t("common:main_title"),
        })}
        image={items[0].images[0]}
      />
      <main>
        <div className='flex flex-col py-10 text-center xl:text-left'>
          <h1 className='text-3xl font-serif text-gray-600 pb-10 border-b-2 border-gray-50'>
            {t("common:crystal_catalogue", {
              main_title: t("common:main_title"),
            })}
          </h1>
          <div className='pt-10'>
            {products.length > 0 ? (
              <DisplayGrid items={products} />
            ) : (
              <div className='text-black'>
                No matches with your search, return to the{" "}
                <Link href='/catalogue'>
                  <a
                    onClick={fetchAllProducts}
                    className='text-purple-600 hover:text-green-600'
                  >
                    {t("common:crystal_catalogue", {
                      main_title: t("common:main_title"),
                    })}
                  </a>
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
