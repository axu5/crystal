// import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

// @ts-ignore
import styles from "../../styles/ProductPage.module.css";
import { getUser } from "../../utils/getUser";

export default function ProductPage({ product }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [heart, setHeart] = useState(false);
  const [inCart, setInCart] = useState(false);

  useEffect(() => {
    (async () => {
      setUser(await getUser());
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      setInCart(
        !!cart.some((/** @type {string} */ i) => i === product.slug)
          .length
      );
    })();
  }, [product.slug]);

  const getShare = () => {
    const currentUri =
      process.env.NEXT_PUBLIC_BASE_URI + router.asPath;

    navigator.clipboard.writeText(currentUri);
  };

  const makeHeart = async () => {
    const res = await fetch(
      `http://localhost:3000/api/products/heart`,
      {
        headers: {
          Accept: "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          product: product.slug,
        }),
      }
    );
    const data = await res.json();

    setHeart(data.heart);
  };

  const addToCart = async () => {
    const cartKey = "cart";
    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];

    let add = true;
    for (let i = 0; i < cart.length; ++i) {
      const prod = cart[i];
      if (prod === product.slug) {
        cart.splice(i, 1);
        add = false;
        break;
      }
    }
    if (add) cart.push(product.slug);

    localStorage.setItem(cartKey, JSON.stringify(cart));

    if (user) {
      const res = await fetch(`http://localhost:3000/api/cart`, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: JSON.stringify({ cart }),
      });

      const data = await res.json();

      if (data.success) {
        setInCart(!inCart);
        return;
      } else {
        setInCart(inCart);
      }
    } else {
      setInCart(
        !!cart.some((/** @type {string} */ i) => i === product.slug)
      );
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* <Image
        src={product.image}
        alt={`${product.title} product image`}
        width={500}
        height={500}
      /> */}
      <h1 className={styles.title}>{product.name}</h1>
      <p>{product.description}</p>
      <p>{product.price / 100}&euro;</p>
      <p>{product.views} views</p>
      <p>{product.hearts} hearts</p>
      <button onClick={getShare}>Share</button>
      {user && (
        <button
          onClick={makeHeart}
          className={heart ? styles.hearted : styles.notHearted}
        >
          heart
        </button>
      )}
      <button onClick={addToCart}>
        {inCart ? "remove from cart" : "add to cart"}
      </button>
      {/* <button>buy now</button> */}
    </div>
  );
}

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
  const { slug } = context.params;
  const res = await fetch(
    `http://localhost:3000/api/products/${slug}`
  );
  const item = await res.json();

  return {
    props: {
      product: item,
    },
  };
}
