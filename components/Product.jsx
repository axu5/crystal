import Link from "next/link";
import Image from "next/image";
// @ts-ignore
import styles from "../styles/Product.module.css";

export default function Product({
  data: { slug, name, price, image },
}) {
  return (
    <div>
      <Link href={`/catalogue/${slug}`}>
        <a className={styles.card}>
          {/* <Image
            src={image}
            alt={name + " product image"}
            width={100}
            height={100}
          /> */}
          {name}
          {price / 100}&euro;
        </a>
      </Link>
    </div>
  );
}
