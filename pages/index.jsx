import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
// @ts-ignore
import styles from "../styles/Home.module.scss";
import { isServer } from "../utils/isServer";
import { localStorageKeys } from "../constants";

export default function Home() {
  return (
    <>
      <Head>
        <title>Crystal Cabins</title>
        <meta
          name='description'
          content='Get high quality crystals'
        />
      </Head>

      <main className='container mx-auto p-5'>
        <Navbar />
        <div className='md:flex md:flex-row mt-20'>
          <div className='md:w-2/5 flex flex-col justify-center items-center'>
            <h2 className='font-serif text-5xl text-gray-600 mb-4 text-center md:self-start md:text-left'>
              Crystal Cabins
            </h2>
            <p className='uppercase text-gray-600 tracking-wide text-center md:self-start md:text-left'>
              Shop fast, environmentally and fashionably
            </p>
            <p className='uppercase text-gray-600 tracking-wide text-center md:self-start md:text-left'>
              Crystal Cabins provides fast shipping for all
            </p>
            <Link href='/catalogue'>
              <a className='bg-gradient-to-r from-red-600 to-pink-500 rounded-full py-4 px-8 text-gray-50 uppercase text-xl md:self-start my-5'>
                shop now
              </a>
            </Link>
          </div>
          <div className='md:w-3/5'>
            <Image
              src='/../public/assets/hero.png'
              alt=''
              width={645}
              height={422}
              className='w-full'
            />
          </div>
        </div>{" "}
        {/* hero section */}
        <Display
          title='Necklaces'
          slug='necklaces'
          items={[
            {
              title: "selenite gold necklace",
              slug: "selenite-gold-necklace",
              img: "/../public/assets/sample_product.png",
            },
            {
              title: "rose quartz matching necklace gold",
              slug: "rose-quartz-matching-necklace-gold",
              img: "/../public/assets/sample_product.png",
            },
            {
              title: "rose quartz necklace normal",
              slug: "rose-quartz-necklace-normal",
              img: "/../public/assets/sample_product.png",
            },
          ]}
        />
        {/* necklaces */}
      </main>
    </>
  );
}

function Navbar() {
  const cartKey = localStorageKeys.cart;

  return (
    <div className='md:flex md:flex-row md:justify-between text-center'>
      <div className='flex flex-row justify-center items-center'>
        {/* <div className='bg-gradient-to-r from-purple-400 to-red-400 w-10 h-10 rounded-lg'></div> */}
        <Image
          src='/../public/favicon.png'
          alt='crystal cabins logo'
          width={40}
          height={40}
        />
        <h1 className='font-serif text-3xl text-gray-600 ml-4'>
          Crystal Cabins
        </h1>
      </div>
      <div className='mt-2'>
        <Link href='/'>
          <a className='text-gray-600 hover:text-purple-600 p-4'>
            home
          </a>
        </Link>
        <Link href='/catalogue'>
          <a className='text-gray-600 hover:text-purple-600 p-4'>
            shop
          </a>
        </Link>
        <Link href='/about'>
          <a className='text-gray-600 hover:text-purple-600 p-4'>
            about
          </a>
        </Link>
        <Link href='/cart'>
          <a className='bg-purple-600 text-gray-50 hover:bg-purple-700 py-3 px-5 rounded-full '>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5 mr-1 inline-block'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z'
                clipRule='evenodd'
              />
            </svg>
            bag (
            {!isServer() && localStorage.getItem(cartKey)
              ? JSON.parse(localStorage.getItem(cartKey)).length
              : 0}
            )
          </a>
        </Link>
      </div>
    </div>
  );
}

function Display({ title, slug, items }) {
  return (
    <div className='my-20'>
      <div className='flex flex-row justify-between my-5'>
        {/* TITLE */}
        <h2 className='text-3xl'>{title}</h2>
        {/* LINK */}
        <Link href={`/catalogue/${slug}`}>
          <a className='text-xl flex flex-row'>
            View all
            <svg
              className='w-7 h-7 ml-1'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M17 8l4 4m0 0l-4 4m4-4H3'
              />
            </svg>
          </a>
        </Link>
      </div>
      {/* GRID */}
      <Grid items={items} />
    </div>
  );
}

// items
// [
//   {
//     title: "Necklace 1",
//     slug: "1",
//     img: "/../public/assets/sample_product.png",
//   },
//   {
//     title: "Necklace 2",
//     slug: "2",
//     img: "/../public/assets/sample_product.png",
//   },
//   {
//     title: "Necklace 3",
//     slug: "3",
//     img: "/../public/assets/sample_product.png",
//   },
// ];
function Grid({ items }) {
  const formattedItems = items.map((item, i) => (
    <DisplayItem
      key={i}
      title={item.title}
      slug={item.slug}
      imageSrc={item.img}
    />
  ));
  return (
    <div className='grid grid-flow-row grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10'>
      {formattedItems}
    </div>
  );
}

function DisplayItem({ title, slug, imageSrc }) {
  return (
    <div className='shadow-lg rounded-lg'>
      <Link href='#'>
        <a>
          <Image
            className='rounded-t-lg'
            src={imageSrc}
            alt='product image'
            width={367}
            height={276}
          />
        </a>
      </Link>
      <div className='p-5'>
        <h3>
          <Link href={`/catalogue/${slug}`}>
            <a>{title}</a>
          </Link>
        </h3>
        <div className='flex flex-col xl:flex-row justify-between'>
          {/* TODO: make cart work */}
          <Link href='#'>
            <a className='bg-gradient-to-r from-red-600 to-pink-500 rounded-full py-2 px-4 text-gray-50 flex flex-row hover:from-pink-600 hover:to-pink-600 text-sm justify-center my-2'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-4 w-4 mr-1'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path
                  fillRule='evenodd'
                  d='M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z'
                  clipRule='evenodd'
                />
              </svg>
              add to bag
            </a>
          </Link>
          <Link href={`/catalogue/${slug}`}>
            <a className='bg-purple-600 rounded-full py-2 px-4 text-gray-50 flex flex-row hover:bg-purple-700 align-middle text-sm justify-center my-2'>
              view item
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-4 w-4 ml-1'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M14 5l7 7m0 0l-7 7m7-7H3'
                />
              </svg>
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}
