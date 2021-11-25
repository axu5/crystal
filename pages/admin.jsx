import { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import Error from "../components/Error";
import getUser from "../utils/getUser";
import { makeAuthReq } from "../utils/makeAuthReq";
import CheckOutline from "../components/assets/CheckOutline";
import XOutline from "../components/assets/XOutline";
import RefreshOutline from "../components/assets/RefreshOutline";

export const getServerSideProps = async context => {
  const {
    props: { user },
  } = await getUser(context);

  const admin = user ? user.accountType.permissions > 1 : false;

  if (!user) {
    return {
      redirect: {
        permanent: false,
        destination: "/login?redirect=admin",
      },
    };
  } else if (!admin) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }

  return {
    props: {
      user,
    },
  };
};

export default function Admin({ user }) {
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { products: _prods } = await makeAuthReq(
          "/products",
          {},
          "GET"
        );
        setProducts(_prods);
      } catch (e) {
        setError(JSON.stringify(e));
      }
    })();
  }, []);

  const addNewProduct = async () => {
    // name
    const name = prompt("product name");
    if (name === null) return;
    // description
    const description = prompt("product description");
    if (description === null) return;
    // summary
    const summary = prompt("product summary");
    if (summary === null) return;
    // similar []
    let verified = false;
    let similar;
    do {
      similar = prompt(
        "enter the slugs of similar products, separate with a ','"
      )
        .replace(/ +/g, "")
        .split(/,/g);
      if (similar === null) return;
      const isProduct = similar.every(
        sim => products.some(prod => prod.slug === sim) || sim === ""
      );

      if (!isProduct) {
        alert("some slugs may be incorrect");
      } else {
        verified = true;
      }
    } while (!verified);
    // images []
    verified = false;
    let images;
    do {
      images = prompt(
        "enter the url of the product images, separate with ','"
      )
        .replace(/ +/g, "")
        .split(/,/g);
      if (images === null) return;
      const validImages = images.every(img =>
        img.match(/^https?:\/\//)
      );

      if (!validImages) {
        alert("some images aren't valid");
      } else {
        verified = true;
      }
    } while (!verified);
    // tags []
    const tags = prompt(
      "enter the tags of the product, separate with ','"
    ).split(/,+ ?/g);
    if (tags === null) return;
    // price (euro -> cents)
    const price = Number(prompt("what is the price? (euro)")) * 100;
    if (price === null) return;

    const product = {
      name,
      slug: name.trim().replace(/ +/g, "-"),
      description,
      summary,
      similar,
      images,
      tags,
      price,
    };

    const { success, error } = await makeAuthReq(
      "/products",
      product,
      "POST"
    );
    if (!success) {
      setError(
        typeof error === "object" ? JSON.stringify(error) : error
      );
    } else {
      alert("done!");
      setError("");
      router.reload();
    }
  };

  return (
    <>
      <Head>
        <title>CC | Admin panel</title>
      </Head>
      <main>
        <Error error={error} />
        <div className='py-10 flex flex-col justify-center'>
          <h1 className='flex flex-row text-center justify-center'>
            You&apos;re an admin {user.username} ({user.name.first}{" "}
            {user.name.last})
          </h1>
          <button
            onClick={addNewProduct}
            className='bg-gray-400 border-1 border-gray-500 px-5 rounded-sm'
          >
            Add new Product
          </button>
          {products.length ? (
            <ProductList products={products} err={setError} />
          ) : (
            "loading..."
          )}
        </div>
      </main>
    </>
  );
}

function ProductList({ products, err }) {
  return (
    <>
      {products.map(product => {
        return (
          <SingleProduct
            key={product.slug}
            product={product}
            err={err}
          />
        );
      })}
    </>
  );
}

function SingleProduct({ product, err }) {
  const router = useRouter();

  const [name, setName] = useState(product.name);
  const [slug, setSlug] = useState(product.slug);
  const [description, setDescription] = useState(product.description);
  const [summary, setSummary] = useState(product.summary);
  const [similar, setSimilar] = useState(product.similar);
  const [images, setImages] = useState(product.images);
  const [tags, setTags] = useState(product.tags);
  const [price, setPrice] = useState(
    (product.price / 100).toString()
  );
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);

  const slugChange = newName => {
    setSlug(encodeURI(newName.replace(/ +/g, "-").toLowerCase()));
  };

  const nameChange = e => {
    const newName = e.target.value.trimStart();
    setName(newName);
    slugChange(newName);
  };

  const descriptionChange = e => {
    const newDescription = e.target.value.trimStart();
    setDescription(newDescription);
  };

  const summaryChange = e => {
    const newSummary = e.target.value.trimStart();
    setSummary(newSummary);
  };

  const priceChange = e => {
    const newPrice = e.target.value.trim();
    setPrice(newPrice);
  };

  const editProduct = async () => {
    setUpdating(true);
    const { success, error } = await makeAuthReq(
      `products`,
      {
        id: product.id,
        name,
        slug,
        description,
        summary,
        similar,
        images,
        tags,
        price,
      },
      "PUT"
    );

    if (!success) {
      err(typeof error === "object" ? JSON.stringify(error) : error);
    } else {
      alert("success");
      router.reload();
    }
    setUpdating(false);
  };

  const deleteProduct = async () => {
    setDeleting(true);
    const { success, error } = await makeAuthReq(
      "products",
      {
        id: product.id,
      },
      "DELETE"
    );

    if (!success) {
      err(typeof error === "object" ? JSON.stringify(error) : error);
    } else {
      alert("success");
      router.reload();
    }
    setDeleting(false);
  };

  return (
    <div className='flex flex-row justify-between py-3 border-2 border-black rounded-sm p-5 my-3'>
      <div className='w-4/5'>
        <div>
          <span className='font-bold'>Name</span>
          <br />
          <input onChange={nameChange} value={name} /> (
          <span className='font-bold'>slug:</span> {slug})
        </div>
        <div>
          <span className='font-bold'>Description</span>
          <br />
          <textarea
            onChange={descriptionChange}
            value={description}
            rows={2}
            cols={70}
          />
        </div>
        <div>
          <span className='font-bold'>Summary</span>
          <br />
          <textarea
            onChange={summaryChange}
            value={summary}
            rows={1}
            cols={70}
          />
        </div>
        <div>
          <MultiVars
            title='Similar'
            getter={similar}
            setter={setSimilar}
            valueCb={v => v.replace(/ +/g, "-")}
          />
        </div>
        <div>
          <MultiVars
            title='Images'
            getter={images}
            setter={setImages}
            valueCb={v => v.replace(/ +/g, "-")}
          />
        </div>
        <div>
          <MultiVars
            title='Tags'
            getter={tags}
            setter={setTags}
            valueCb={v => v}
          />
        </div>
        <div>
          <span className='font-bold'>Price</span>
          <br />
          <input onChange={priceChange} value={price} />
          &euro;
        </div>
      </div>
      <div className='w-1/5'>
        <Link href={`/catalogue/${product.slug}`}>
          <a target='_blank'>
            <div className='flex justify-center align-center'>
              <Image
                src={product.images[0]}
                alt={product.name + " image"}
                width={500}
                height={500}
              />
            </div>
          </a>
        </Link>
        <div className='flex flex-col'>
          <div>
            <span className='font-bold'>Sold</span> {product.sold}
          </div>
          <div>
            <span className='font-bold'>Hearts</span> {product.hearts}
          </div>
          <div>
            <span className='font-bold'>Views</span> {product.views}
          </div>
        </div>
        {!updating && (
          <div className='flex flex-row'>
            <button
              onClick={editProduct}
              className='flex flex-row bg-green-300 px-3 py-2 rounded-sm'
            >
              Edit <CheckOutline />
            </button>
            <button
              onClick={() => {
                router.reload();
              }}
              className='flex flex-row bg-yellow-300 px-3 py-2 rounded-sm'
            >
              Reject <RefreshOutline />
            </button>
          </div>
        )}
        <div>
          <span className='font-bold'>ID:</span>{" "}
          <span className='font-mono'>{product.id}</span>
        </div>
        {!deleting && (
          <button
            onClick={deleteProduct}
            className='flex flex-row bg-red-300 px-3 py-2 rounded-sm'
          >
            DELETE <XOutline />
          </button>
        )}
      </div>
    </div>
  );
}

function MultiVars({ title, getter, setter, valueCb }) {
  const [tmp, setTmp] = useState("");

  const similarChange = (e, i) => {
    const copy = [...getter];

    const value = e.target.value.trimStart();

    if (value === "") {
      copy.splice(i, 1);
    } else copy[i] = valueCb(value); //.replace(/ +/g, "-");

    setter(copy);
  };

  return (
    <div>
      <span className='font-bold'>{title}</span>{" "}
      <div className='flex flex-col'>
        {getter.map((sim, i) => {
          return (
            <div key={i}>
              &rarr;{" "}
              <input
                value={sim}
                onChange={e => similarChange(e, i)}
              />
            </div>
          );
        })}
      </div>
      <input
        value={tmp}
        placeholder={`add new ${title.toLowerCase()}`}
        onChange={e => {
          if (e.target.value.endsWith(",")) {
            setter([...getter, tmp]);
            setTmp("");
          } else {
            const newValue = e.target.value.trimStart();
            setTmp(valueCb(newValue));
          }
        }}
      />
      &larr; (pro tip: use ,)
    </div>
  );
}
