// import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

// @ts-ignore
import { localStorageKeys } from "../../constants";
import { isServer } from "../../utils/isServer";
import CategoryHead from "../../components/CategoryHead";
import Heart from "../../components/assets/Heart";
import Eye from "../../components/assets/Eye";
import BagFilled from "../../components/assets/BagFilled";
import BagOutline from "../../components/assets/BagOutline";
import { makeAuthReq } from "../../utils/makeAuthReq";

export async function getStaticPaths() {
  const res = await fetch("http://localhost:3000/api/products");
  const data = await res.json();

  const paths = data.map(product => {
    const { slug } = product;
    return {
      params: {
        slug,
      },
    };
  });

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
    `http://localhost:3000/api/products/${slug}`
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
      cart,
    },
  };
}

export default function ProductPage({ product, cart }) {
  const cartKey = localStorageKeys.cart;
  const cartRef =
    cart && cart.length
      ? cart
      : isServer()
      ? []
      : JSON.parse(localStorage.getItem(cartKey));

  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loader = async () => {
      const { user } = await makeAuthReq("user");
      setUser(JSON.stringify(user));
    };
    loader();
  }, []);

  const [inCart, setInCart] = useState(
    cartRef && cartRef.some(p => p === product.id)
  );

  const getShare = useCallback(() => {
    const currentUri =
      process.env.NEXT_PUBLIC_BASE_URI + router.asPath;

    navigator.clipboard.writeText(currentUri);
  }, [router.asPath]);

  const addToCart = async () => {
    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];

    let add = true;
    for (let i = 0; i < cart.length; ++i) {
      const prod = cart[i];
      if (prod === product.id) {
        cart.splice(i, 1);
        add = false;
        break;
      }
    }
    if (add) cart.push(product.id);

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
      setInCart(cart.some(item => item === product.id));
    }
  };

  return (
    <>
      {/* <CategoryHead title={product.name} image={product.images[0]} /> */}
      <CategoryHead title={product.name} image={product.images[0]} />
      <main className='container flex flex-col'>
        <div className='font-mono'>CART: {JSON.stringify(cart)}</div>
        <div className='flex flex-row p-5'>
          <div className='w-4/5'>
            <h1 className='font-serif text-3xl text-gray-600'>
              {product.name}
            </h1>
            <p>{product.description}</p>
            <p className='flex flex-row justify-between'>
              {product.views + 1} <Eye />
            </p>
            <p className='flex flex-row justify-between'>
              {product.hearts} <Heart />
            </p>
            <div className='flex flex-col'>
              <button onClick={getShare}>Share</button>
              <button
                onClick={addToCart}
                className='rounded border-1 border-purple-600 hover:border-purple-900 hover:text-purple:600'
              >
                {inCart ? "remove from cart" : "add to cart"}{" "}
                {inCart ? <BagFilled /> : <BagOutline />}
              </button>
            </div>
          </div>
          <div className='w-1/5'>
            <Image
              src={product.images[0]}
              alt={`${product.title} product image`}
              width={500}
              height={500}
              layout='responsive'
              className='rounded-lg'
              // style= {{
              //   width: "200px",
              //   height: "200px",
              //   maxHeight: "200px",
              //   maxWidth: "200px",
              // }}
            />
            <p className='text-xl'>{product.price / 100}&euro;</p>
          </div>
          {/* <button>buy now</button> */}
        </div>
      </main>
    </>
  );
}
