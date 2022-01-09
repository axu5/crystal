import { useCallback, useEffect, useState } from "react";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";

import { isServer } from "../utils/isServer";
import { makeAuthReq } from "../utils/makeAuthReq";
import HeartFilled from "./assets/HeartFilled";
import Heart from "./assets/Heart";
import BagFilled from "./assets/BagFilled";
import BagOutline from "./assets/BagOutline";
import addToCart from "../utils/addToCart";
import ArrowRight from "./assets/ArrowRight";
import { localStorageKeys } from "../constants";
import { rgbDataURL } from "../utils/blurImage";
import Eye from "./assets/Eye";

export default function DisplayItem({
  name,
  slug,
  imageSrc,
  views,
  hearts,
  id,
  price,
  summary,
  callback,
}) {
  const router = useRouter();
  const { t } = useTranslation();

  const cartKey = localStorageKeys.cart;

  const cartRef = isServer()
    ? []
    : JSON.parse(localStorage.getItem(cartKey));

  const [inCart, setInCart] = useState(() => {
    try {
      return (
        cartRef &&
        !!cartRef.length &&
        cartRef.some(product => product.id === id)
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
      setUser(user);
      if (!user) return;

      const hearted = user.wishlist.includes(id);
      setHeart(hearted);
      setOriginallyHearted(hearted);
    };
    loader();
  }, [id]);

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
      router.push("/login");
    }
  }, [id, router]);

  // if (isServer()) return <></>;
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
        <div className='flex flex-row underline justify-end text-sm text-gray-700 font-serif'>
          {price / 100}&euro;
        </div>
        <div className='flex flex-row justify-between text-md text-gray-900 font-serif'>
          <Link href={`/catalogue/${slug}`}>
            <a className='font-serif lowercase text-2xl text-gray-900 hover:text-purple-600 hover:underline text-center'>
              {name}
            </a>
          </Link>
        </div>
        <div className='flex flex-row justify-start text-sm text-gray-800 font-serif'>
          {summary}
        </div>
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
            onClick={async () => {
              setInCart(await addToCart(id, user)());
              callback(
                JSON.parse(localStorage[localStorageKeys.cart])
              );
            }}
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
