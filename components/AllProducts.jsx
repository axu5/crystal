import Link from "next/link";
import Image from "next/image";

export default function AllProducts({ products }) {
  return (
    <>
      {products.map((data, i) => {
        return (
          <div key={i}>
            <Link href={`/catalogue/${data.slug}`} passHref>
              <a>
                <Image
                  src={data.images[0]}
                  alt={data.title + " image"}
                  width={300}
                  height={300}
                />
                <h1>{data.name}</h1>
                <p>{data.summary}</p>
                <p>{data.price / 100}&euro;</p>
                <p>{data.views} views</p>
                <p>{data.hearts} hearts</p>
              </a>
            </Link>
          </div>
        );
      })}
    </>
  );
}
