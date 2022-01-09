import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";

// import { getUser } from "../utils/getUser";
import { localStorageKeys } from "../constants";
import getUser from "../utils/getUser";
import getDb from "./api/database";
import useTranslation from "next-translate/useTranslation";
import { isServer } from "../utils/isServer";
import DisplayItem from "../components/DisplayItem";
import { useRouter } from "next/router";
import Modal from "../components/Modal";

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = loadStripe(publishableKey);

// TODO: add quantity to cart & size (WORKING)

export const getServerSideProps = async context => {
  const {
    props: { user },
  } = await getUser(context);

  const { products } = await getDb();

  let cart = null;
  if (user) {
    cart = await Promise.all(
      user.cart.map(async item => {
        const product = await products.findOne({ id: item.id });
        delete product["_id"];
        delete product["tags"];
        delete product["sold"];
        product.quantity = item.quantity;
        product.size = item.size;

        return product;
      })
    );
  }

  return {
    props: {
      user,
      cart,
    },
  };
};

export default function Bag({ user, cart: parsedCart }) {
  console.log("parsedCart", parsedCart);
  const { t } = useTranslation();
  const router = useRouter();

  const { status, session_id } = router.query;

  if (session_id) {
    const url = `http://localhost:3000/api/checkout-sessions/${session_id}`;
    axios.get(url).then(res => {
      console.log(res.data);
    });
  }

  const cartKey = localStorageKeys.cart;

  const [cart, setCart] = useState(
    !parsedCart && isServer()
      ? []
      : parsedCart.length
      ? parsedCart
      : JSON.parse(localStorage.getItem(cartKey))
  );
  const [loading, setLoading] = useState(true);
  const [sum, setSum] = useState(0);
  // create a copy so original cart (when loaded) can be displayed fully even if items are removed
  const [cartCopy, setCartCopy] = useState([]);

  useEffect(() => {
    const load = async () => {
      // set loading to false instantly to prevent user from seeing loading
      setLoading(false);

      if (parsedCart) {
        const _sum = parsedCart.reduce((acc, item) => {
          return acc + item.price * item.quantity;
        }, 0);
        setSum(_sum);
        setCart(parsedCart);
        setCartCopy(parsedCart);
        return;
      }

      let _sum = 0;
      const promises = cart.map(async item => {
        const res = await fetch(
          `http://localhost:3000/api/products/${item.id}`
        );
        const json = await res.json();
        json.quantity = item.quantity;
        json.size = item.size;

        _sum += json.price * item.quantity;
        return json;
      });

      const tmp = await Promise.all(promises);

      setCart(tmp);
      setCartCopy(tmp);
      setSum(
        // tmp.reduce(
        //   (acc, item) =>
        //     acc +
        //     item.price *
        //       cart.find(cartItem => cartItem.id === item.id).quantity,
        //   0
        // )
        _sum
      );
    };

    if (loading) load();
  }, [cart, loading]);

  const createCheckOutSession = async cart => {
    setLoading(true);
    const stripe = await stripePromise;
    const checkoutSession = await axios.post(
      "/api/checkout-sessions",
      {
        cart: cart.map(({ id, quantity, size }) => ({
          id,
          quantity,
          size,
        })),
      }
    );

    const result = await stripe.redirectToCheckout({
      sessionId: checkoutSession.data.id,
    });

    if (result.error) {
      alert(result.error.message);
    }
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>
          {/* TODO: make international */}
          {user
            ? t("common:cart_username", { username: user.username })
            : t("common:cart_not_logged_in")}
        </title>
      </Head>
      <main>
        {status === "success" ? (
          <Modal>
            <div className='mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100'>
              <svg
                className='h-6 w-6 text-green-600'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M5 13l4 4L19 7'
                ></path>
              </svg>
            </div>
            <h3 className='text-lg leading-6 font-medium text-gray-900'>
              {"Success"}
            </h3>
            <div className='mt-2 px-7 py-3'>
              <p className='text-sm text-gray-500'>
                {"Payment went through successfully"}
                {"Thank you for your purchase!"}
              </p>
            </div>
          </Modal>
        ) : null}
        <div className='flex flex-col justify-center font-serif'>
          <div className='align-center self-center'>
            {loading ? (
              <div>{t("common:loading")}</div>
            ) : (
              <div className='text-3xl'>
                {cart.length > 0
                  ? `Your total is: ${sum / 100}€`
                  : "Your cart is empty"}
                <button
                  disabled={cart.length === 0 || loading || sum === 0}
                  onClick={_ => createCheckOutSession(cart)}
                  id='main-content'
                  className='bg-blue-500 hover:bg-blue-600 text-white block w-full py-2 rounded mt-2 disabled:cursor-not-allowed disabled:bg-blue-100'
                >
                  {loading
                    ? t("common:processing")
                    : t("common:checkout")}
                </button>
              </div>
            )}
          </div>
          <div className=''>
            {!loading && cart.length > 0 ? (
              <div className='grid grid-flow-row grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-10 my-5'>
                {cartCopy.map(item => {
                  return (
                    <DisplayCartItem
                      key={item.name}
                      item={item}
                      itemSetter={setCart}
                      itemGetter={cart}
                      sumGetter={sum}
                      sumSetter={setSum}
                    />
                  );
                })}
              </div>
            ) : (
              <div className='flex flex-col justify-center'>
                <p>{t("common:empty")}</p>
                <Link href='/catalogue'>
                  <a className='text-purple-400 hover:underline hover:text-purple-600'>
                    {t("common:empty_return")}
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

// function DisplayCart({
//   cartOriginal,
//   itemSetter,
//   itemGetter,
//   sumGetter,
//   sumSetter,
// }) {
//   return (

//   );
// }

function DisplayCartItem({
  item,
  itemSetter,
  itemGetter,
  sumGetter,
  sumSetter,
}) {
  const [quantity, setQuantity] = useState(item.quantity);

  const setLocalCart = cart => {
    if (isServer()) return;
    localStorage.setItem(localStorageKeys.cart, JSON.stringify(cart));
  };

  return (
    <div className='flex flex-col justify-center'>
      <div className='flex flex-col justify-center'>
        <div className='flex flex-col bg-gray-100 rounded shadow-xl'>
          <DisplayItem
            name={item.name}
            slug={item.slug}
            imageSrc={item.images[0]}
            views={item.views}
            hearts={item.hearts}
            id={item.id}
            price={item.price}
            summary={item.summary}
            callback={async _cart => {
              let _sum = 0;
              const tmp = await Promise.all(
                _cart.map(async item => {
                  const res = await fetch(
                    `http://localhost:3000/api/products/${item.id}`
                  );
                  const json = await res.json();
                  json.quantity = item.quantity;
                  json.size = item.size;

                  _sum += json.price * item.quantity;
                  return json;
                })
              );

              // console.log("itemGetter", itemGetter);
              // console.log("tmp", tmp);

              const old = itemGetter;
              const new_ = tmp;

              // removed one
              if (old.length > new_.length) {
                setQuantity(1);
              }

              itemSetter(tmp);
              sumSetter(_sum);
            }}
          />
          <div
            className='
            flex
            flex-row
            justify-between
            mx-5 my-3 p-2'
          >
            <Button
              label='-'
              callback={() => {
                if (quantity !== 1) sumSetter(sumGetter - item.price);

                const newQty = Math.max(quantity - 1, 1);
                setQuantity(newQty);

                item.quantity = newQty;
                const index = itemGetter.findIndex(
                  ({ id }) => id === item.id
                );
                const tmp = [
                  ...itemGetter.slice(0, index),
                  item,
                  ...itemGetter.slice(index + 1),
                ];
                setLocalCart(tmp);
              }}
            />
            <div className='text-center self-center'>{quantity}</div>
            <Button
              label='+'
              callback={() => {
                const newQty = quantity + 1;
                setQuantity(newQty);

                item.quantity = newQty;
                const index = itemGetter.findIndex(
                  ({ id }) => id === item.id
                );
                const tmp = [
                  ...itemGetter.slice(0, index),
                  item,
                  ...itemGetter.slice(index + 1),
                ];
                setLocalCart(tmp);
                itemSetter(tmp);

                sumSetter(sumGetter + item.price);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Button({ label, callback }) {
  return (
    <div className='flex flex-col justify-center align-center'>
      <button
        onClick={callback}
        className='p-4 bg-purple-400 hover:bg-purple-500 rounded-lg mx-2'
      >
        {label}
      </button>
    </div>
  );
}
