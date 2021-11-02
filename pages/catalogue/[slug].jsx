// import Image from "next/image";
import { useRouter } from "next/router";

// @ts-ignore
import styles from "../../styles/ProductPage.module.css";

export default function ProductPage({ product }) {
  const router = useRouter();

  const getShare = () => {
    const currentUri =
      process.env.NEXT_PUBLIC_BASE_URI + router.asPath;
    navigator.clipboard.writeText(currentUri);
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
      <p>Views: {product.views}</p>
      <button onClick={getShare}>Share</button>
      <button>heart</button>
      <button>add to cart</button>
      <button>buy now</button>
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
