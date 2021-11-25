import { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import cookieCutter from "cookie-cutter";

import "../styles/globals.scss";
import { localStorageKeys } from "../constants";
import { isServer } from "../utils/isServer";
import { makeAuthReq } from "../utils/makeAuthReq";
import BagFilled from "../components/assets/BagFilled";
import BagOutline from "../components/assets/BagOutline";
import getTranslation from "../utils/getTranslation";
import SearchOutline from "../components/assets/SearchOutline";

export default function App({ Component, pageProps }) {
  pageProps.lang = isServer() ? "en" : cookieCutter.get("lang");

  const { lang } = pageProps;
  const translator = getTranslation(lang);

  return (
    <>
      <Head>
        <link rel='icon' href='/favicon.png' />
      </Head>
      <main>
        <TopComponent translator={translator} />
        <div className='container mx-auto p-5'>
          <div className='sticky top-0 bg-white py-5 z-50'>
            <Navbar translator={translator} />
          </div>
          <Component {...pageProps} />
          <Footer translator={translator} />
        </div>
      </main>
    </>
  );
}

function TopComponent({ translator }) {
  const [user, setUser] = useState(null);
  const router = useRouter();
  // const [login, logout, welcome] = translatorManager(translator);

  useEffect(() => {
    (async () => {
      const { user } = await makeAuthReq(`user`);
      setUser(user);
    })();
  }, []);

  return (
    <div className='flex flex-row justify-between bg-purple-300 px-10'>
      <form
        action='/catalogue'
        method='GET'
        className='flex flex-row'
        autoComplete='off'
      >
        <input
          onChange={e => {
            router.push(
              `/catalogue?search=${encodeURI(
                e.target.value.replace(/ +/g, "+")
              )}`
            );
          }}
          className='bg-purple-300 placeholder-gray-600 text-black border border-transparent focus:outline-none focus:ring-none focus:border-b-2 focus:border-purple-600 text-right px-3'
          type='text'
          placeholder='discover our catalogue'
          name='search'
        />
        <div className='my-auto text-gray-600'>
          <SearchOutline />
        </div>
      </form>
      <div className='flex flex-row justify-end container mx-auto h-12 align-middle py-3'>
        {user ? (
          <>
            <div>{translator("welcome", user.username)}</div>
            <div>
              <Link href='/logout'>
                <a className='hover:text-purple-600 lowercase cursor-pointer p-5'>
                  {translator("logout")}
                </a>
              </Link>
            </div>
          </>
        ) : (
          <>
            <div>
              <Link href='/login'>
                <a className='hover:text-purple-600 lowercase cursor-pointer p-5'>
                  {translator("login")}
                </a>
              </Link>
            </div>
            <div>
              <Link href='/signup'>
                <a className='hover:text-purple-600 lowercase cursor-pointer p-5'>
                  {translator("signup")}
                </a>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Navbar({ translator }) {
  const cartKey = localStorageKeys.cart;

  return (
    <div>
      <div className='md:flex md:flex-row md:justify-between text-center'>
        <Link href='/'>
          <a className='flex flex-row justify-center items-center'>
            {/* <div className='bg-gradient-to-r from-purple-400 to-red-400 w-10 h-10 rounded-lg'></div> */}
            <div className='logo-animation'>
              <Image
                src='/favicon.png'
                alt={translator("logo_alt")}
                width={40}
                height={40}
              />
            </div>
            <h1 className='font-serif text-3xl text-gray-600 ml-4 hover:text-purple-600'>
              Crystal Cabins
            </h1>
          </a>
        </Link>
        <div className='mt-2'>
          <Link href='/'>
            <a className='text-gray-600 hover:text-purple-600 p-4'>
              home
            </a>
          </Link>
          <Link href='/catalogue'>
            <a className='text-gray-600 hover:text-purple-600 p-4'>
              catalogue
            </a>
          </Link>
          <Link href='/about'>
            <a className='text-gray-600 hover:text-purple-600 p-4'>
              about
            </a>
          </Link>
          <Link href='/checkout'>
            <a className='bg-purple-600 text-gray-50 hover:bg-purple-700 py-3 px-5 rounded-full '>
              {!isServer() && localStorage.getItem(cartKey) ? (
                <BagFilled />
              ) : (
                <BagOutline />
              )}
              {/* BAG ITEM COUNT */}
              {translator("bag")} (
              {!isServer() && localStorage.getItem(cartKey)
                ? JSON.parse(localStorage.getItem(cartKey)).length
                : 0}
              )
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}

function Footer({ translator }) {
  return (
    <footer className='border-t-2 border-gray-300 py-10'>
      <div className='flex flex-col text-center xl:flex-row md:justify-between container mx-auto items-center text-sm md:px-10'>
        <div className='mb-4 text-center'>
          <Link href='/about'>
            <a className='mx-2 hover:text-purple-600 hover:underline'>
              {translator("about")}
            </a>
          </Link>
          <Link href='https://www.instagram.com/crystal.cabins/'>
            <a className='mx-2 hover:text-purple-600 hover:underline'>
              {translator("instagram")}
            </a>
          </Link>
          <Link href='/privacy-policy'>
            <a className='mx-2 hover:text-purple-600 hover:underline'>
              {translator("privacy_policy")}
            </a>
          </Link>
          <Link href='/terms-of-service'>
            <a className='mx-2 hover:text-purple-600 hover:underline'>
              {translator("terms_of_service")}
            </a>
          </Link>
        </div>
        <p className='text-gray-600'>
          &copy;{" "}
          {translator(
            "copyright",
            <Link href='/'>
              <a className='underline text-black hover:text-purple-600'>
                {translator("main_title")}
              </a>
            </Link>
          )}{" "}
          2021
        </p>
      </div>
    </footer>
  );
}
// function translatorManager(unregisteredWords, translator) {
//   const placeHolder = new Array(unregisteredWords.length)
//     .fill()
//     .map(x => useState(""));

//   this.load = () => {
//     for (const wordState of placeHolder) {
//       const [word, setWord] = wordState;
//       setWord(translator(word));
//     }
//   };

//   return placeHolder.map(x => x.shift());
// }
