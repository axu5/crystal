/* external */
import { useEffect, useState } from "react";
import Image from "next/image";
import useTranslation from "next-translate/useTranslation";

/* constants */
import { localStorageKeys } from "../../constants";

/* utilities */
import { isServer } from "../../utils/isServer";
import { properCasing } from "../../utils/properCasing";
import addToCart from "../../utils/addToCart";

/* components */
import CategoryHead from "../../components/CategoryHead";

/* assets */
import BagOutline from "../../components/assets/BagOutline";
import BagFilled from "../../components/assets/BagFilled";
import { rgbDataURL } from "../../utils/blurImage";
import { makeAuthReq } from "../../utils/makeAuthReq";

export async function getStaticPaths({ locales }) {
  const res = await fetch("http://localhost:3000/api/products");
  const data = await res.json();

  const paths = [];

  locales.forEach(
    (/** @type {string} */ locale, /** @type {number} */ _index) => {
      paths.push(
        ...data.map(product => {
          const { slug } = product;
          return {
            params: {
              slug,
              locale,
            },
          };
        })
      );
    }
  );

  // console.log(paths);
  // console.log(
  //   `${locales.length} (locales) x ${data.length} (products) = ${
  //     locales.length * data.length
  //   } pages`
  // );

  return {
    // paths: [{}, {}, { params: { product: '' } }]
    paths,
    fallback: false,
  };
}

export async function getStaticProps(context) {
  let cart = [];

  const { slug } = context.params;
  const res = await fetch(
    `http://localhost:3000/api/products/view/${slug}`
  );
  const item = await res.json();

  const _res = await fetch(`http://localhost:3000/api/user`, {
    headers: {
      Accept: "application/json",
    },
    method: "GET",
    credentials: "same-origin",
  });

  const { user: _user } = await _res.json();
  if (_user) cart = _user.cart;

  return {
    props: {
      product: item,
      cart: cart,
    },
  };
}

export default function ProductPage({ product, cart }) {
  const { t } = useTranslation();

  const cartKey = localStorageKeys.cart;

  const cartRef = isServer()
    ? []
    : cart
    ? cart
    : JSON.parse(localStorage.getItem(cartKey));

  // set states
  const [qty, setQty] = useState(1);
  const [heart, setHeart] = useState(false);
  const [inCart, setInCart] = useState(() => {
    try {
      return (
        cartRef &&
        !!cartRef.length &&
        cartRef.some(p => p === product.id)
      );
    } catch {
      return false;
    }
  });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const load = async () => {
      setLoading(false);

      const user = await makeAuthReq("user");
      console.log("user", user);
      setUser(user);
    };

    if (loading) load();
  }, [loading]);

  return (
    <>
      <CategoryHead title={product.name} image={product.images[0]} />
      <div className='container flex flex-row py-5'>
        {/* IMAGE */}
        <div className='container relative w-3/5 p-r-10'>
          <div className='relative h-full w-full'>
            <Image
              id='featured'
              className='rounded-t-lg'
              src={product.images[0]}
              alt={t("common:product_image_alt")}
              // width={367}
              // height={276}
              layout='fill'
              priority
              placeholder='blur'
              blurDataURL={rgbDataURL(237, 181, 6)}
            />
          </div>
        </div>
        {/* TEXT */}
        <div
          id='main_content'
          className='container flex flex-col w-3/5 justify-center items-center'
        >
          <div className='capitalize font-bold text-3xl'>
            {product.name}
          </div>
          <div className='text-2xl'>{product.price / 100}&euro;</div>
          <div className='text-lg py-3'>
            {properCasing(product.summary)}
          </div>
          <div className='text-lg py-3'>
            {properCasing(product.description)}
          </div>
          <div className='border-t border-b py-3 my-3'>
            <SubTitle title='Size' />
            <div className='flex flex-row justify-between items-center py-5'>
              <button className='text-md bg-purple-200 hover:bg-purple-400 px-4 py-1 mx-5'>
                01
              </button>
              <button className='text-md bg-purple-200 hover:bg-purple-400 px-4 py-1 mx-5'>
                02
              </button>
              <button className='text-md bg-purple-200 hover:bg-purple-400 px-4 py-1 mx-5'>
                03
              </button>
              <button className='text-md bg-purple-200 hover:bg-purple-400 px-4 py-1 mx-5'>
                04
              </button>
              <button className='text-md bg-purple-200 hover:bg-purple-400 px-4 py-1 mx-5'>
                05
              </button>
            </div>
            <br />
            <SubTitle title={t("common:quantity")} />
            <input
              name='quantity'
              type='number'
              placeholder='quantity'
              value={qty}
              onChange={e =>
                setQty(Math.max(Number(e.target.value), 1))
              }
            />
          </div>

          <div className='container flex flex-col justify-center items-center py-5'>
            <button
              onClick={async () =>
                setInCart(await addToCart(product.id, user)())
              }
              className='flex flex-row bg-purple-400 hover:bg-purple-500 px-3 py-1 my-1 justify-between'
            >
              {inCart ? (
                <>
                  <BagFilled />
                  {t("common:remove_from_bag")}
                </>
              ) : (
                <>
                  <BagOutline />
                  {t("common:add_to_bag")}
                </>
              )}
            </button>
            {/* TODO: Add buy now button to product page. */}
            {/* <button className='bg-purple-400 hover:bg-purple-500 px-3 py-1 my-1'>
              {t("common:buy_now")}
            </button> */}
            <button className='bg-purple-400 hover:bg-purple-500 px-3 py-1 my-1'>
              {heart ? t("common:unwishlist") : t("common:wishlist")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function SubTitle({ title }) {
  return <div className='text-xl'>{properCasing(title)}</div>;
}
