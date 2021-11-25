import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import cookieCutter from "cookie-cutter";

import Display from "../components/Display";
import ArrowRight from "../components/assets/ArrowRight";
import getItems from "../utils/getItems";
import getTranslation from "../utils/getTranslation";
import { localStorageKeys } from "../constants";
import { isServer } from "../utils/isServer";

export async function getServerSideProps() {
  // console.log("req");
  // const { lang } = context.req.cookies;
  // const langPack = getTranslation(lang);

  return {
    props: {
      items: await getItems({}),
      // langPack,
    },
  };
}

export default function Home({ items, lang }) {
  // console.log(`cookieCutter.get('lang')`, cookieCutter.get("lang"));
  const translator = getTranslation(lang);
  return (
    <>
      <Head>
        <title>{translator("main_title")}</title>
        <meta
          name='description'
          content='Get high quality crystals**'
        />
      </Head>
      <div className='md:flex md:flex-row mt-20'>
        <div className='md:w-2/5 flex flex-col justify-center items-center'>
          <h2 className='font-serif text-5xl text-gray-600 mb-4 text-center md:self-start md:text-left'>
            {translator("main_title")}
          </h2>
          <p className='lowercase text-gray-600 tracking-wide text-center md:self-start md:text-left'>
            {translator("mission_statement")}
          </p>
          <p className='lowercase text-gray-600 tracking-wide text-center md:self-start md:text-left'>
            {translator("shipping_statement")}
          </p>
          <Link href='/catalogue'>
            <a className='bg-gradient-to-r from-red-600 to-pink-500 hover:from-pink-600 hover:to-pink-600 rounded-full py-4 px-8 text-gray-50 lowercase text-xl md:self-start my-5 flex flex-row'>
              {translator("shop_now")} <ArrowRight />
            </a>
          </Link>
        </div>
        <div className='md:w-3/5'>
          <Image
            src='/assets/hero.png'
            alt=''
            width={645}
            height={422}
            className='w-full'
          />
        </div>
      </div>{" "}
      {/* hero section */}
      {items && (
        <Display
          title={translator("necklaces")}
          slug='necklaces'
          items={items}
          lang={lang}
        />
      )}
      {/* necklaces */}
    </>
  );
}
