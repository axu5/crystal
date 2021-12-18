import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

import ArrowRight from "./assets/ArrowRight";
import Eye from "./assets/Eye";
import Heart from "./assets/Heart";
import HeartFilled from "./assets/HeartFilled";
import BagOutline from "./assets/BagOutline";
import BagFilled from "./assets/BagFilled";
import { isServer } from "../utils/isServer";
import { localStorageKeys } from "../constants";
import { makeAuthReq } from "../utils/makeAuthReq";
import useTranslation from "next-translate/useTranslation";

export default function DisplayGrid({ items }) {
  const formattedItems = items.map((item, i) => (
    <DisplayItem
      key={i}
      name={item.name}
      slug={item.slug}
      views={item.views}
      hearts={item.hearts}
      imageSrc={item.images[0]}
      id={item.id}
    />
  ));
  return (
    <div className='grid grid-flow-row grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10'>
      {formattedItems}
    </div>
  );
}

const keyStr =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

const triplet = (
  /** @type {number} */ e1,
  /** @type {number} */ e2,
  /** @type {number} */ e3
) =>
  keyStr.charAt(e1 >> 2) +
  keyStr.charAt(((e1 & 3) << 4) | (e2 >> 4)) +
  keyStr.charAt(((e2 & 15) << 2) | (e3 >> 6)) +
  keyStr.charAt(e3 & 63);

const rgbDataURL = (
  /** @type {number} */ r,
  /** @type {number} */ g,
  /** @type {number} */ b
) =>
  `data:image/gif;base64,R0lGODlhAQABAPAA${
    triplet(0, r, g) + triplet(b, 255, 255)
  }/yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==`;

function DisplayItem({ name, slug, imageSrc, views, hearts, id }) {
  const router = useRouter();

  const cartKey = localStorageKeys.cart;

  const cartRef = isServer()
    ? []
    : JSON.parse(localStorage.getItem(cartKey));

  const [inCart, setInCart] = useState(() => {
    try {
      return (
        cartRef && !!cartRef.length && cartRef.some(p => p === id)
      );
    } catch {
      return false;
    }
  });
  const [user, setUser] = useState(null);
  const [heart, setHeart] = useState(false);
  const [originallyHearted, setOriginallyHearted] = useState(false);

  useEffect(() => {
    const loader = async () => {
      const { user } = await makeAuthReq("user");
      setUser(JSON.stringify(user));
      if (!user) return;

      const hearted = user.wishlist.includes(id);
      setHeart(hearted);
      setOriginallyHearted(hearted);
    };
    loader();
  }, [id]);

  const addToCart = async () => {
    // if (isServer()) return;
    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];

    let add = true;
    for (let i = 0; i < cart.length; ++i) {
      const prod = cart[i];
      if (prod === id) {
        cart.splice(i, 1);
        add = false;
        break;
      }
    }
    if (add) cart.push(id);

    localStorage.setItem(cartKey, JSON.stringify(cart));

    if (user) {
      const res = await fetch(`http://localhost:3000/api/cart`, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: JSON.stringify({ cart: cartRef }),
      });

      const data = await res.json();

      if (data.success) setInCart(!inCart);
    } else {
      setInCart(cart.some(itemId => itemId === id));
    }
  };

  const addHeart = useCallback(async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/products/heart`,
        {
          headers: {
            Accept: "application/json",
          },
          credentials: "same-origin",
          method: "POST",
          body: JSON.stringify({
            product: id,
          }),
        }
      );
      const data = await res.json();

      if (!data.success) throw "";

      setHeart(data.heart);
    } catch (e) {
      // console.log(e);
      router.push("/login");
      // alert(`you're not logged in`);
    }
  }, [id, router]);

  const { t } = useTranslation();

  if (isServer()) return <></>;
  return (
    <div className='shadow-lg rounded-lg'>
      <Link href={`/catalogue/${slug}`}>
        <a>
          <Image
            className='rounded-t-lg'
            src={imageSrc}
            alt={t("common:product_image_alt")}
            width={367}
            height={276}
            layout='responsive'
            priority
            placeholder='blur'
            blurDataURL={rgbDataURL(237, 181, 6)}
          />
        </a>
      </Link>
      <div className='pt-3 px-5 flex flex-col content-between'>
        <Link href={`/catalogue/${slug}`}>
          <a className='font-serif lowercase text-md hover:text-purple-600 hover:underline text-center pt-3'>
            {name}
          </a>
        </Link>
        <div className='flex flex-row justify-between text-sm'>
          <Count cn='pt-3 px-2' count={views} asset={<Eye />} />
          <button onClick={addHeart}>
            <Count
              cn='cursor-pointer hover:text-purple-600 pt-3 px-2'
              count={
                originallyHearted
                  ? heart
                    ? hearts
                    : hearts - 1
                  : heart
                  ? hearts + 1
                  : hearts
              }
              asset={heart ? <HeartFilled /> : <Heart />}
            />
          </button>
        </div>
        <div className='flex flex-col xl:flex-row justify-between align-bottom mt-5 h-auto xl:pb-5'>
          <button
            onClick={addToCart}
            className='shadow-md hover:shadow-lg hover:cursor-pointer rounded-full py-2 px-4 text-gray-600 flex flex-row text-sm justify-center my-2 text-center items-center'
          >
            {inCart ? <BagFilled /> : <BagOutline />}
            {inCart
              ? t("common:remove_from_bag")
              : t("common:add_to_bag")}
          </button>
          <Link href={`/catalogue/${slug}`}>
            <a className='bg-purple-600 rounded-full py-2 px-4 text-gray-50 flex flex-row hover:bg-purple-700 align-middle text-sm justify-center my-2'>
              <ArrowRight />
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}

function Count({ count, asset, cn }) {
  return (
    <div className={`flex flex-row ${cn}`}>
      <span className='font-serif mr-3 text-sm'>{count}</span>
      {asset}
    </div>
  );
}
