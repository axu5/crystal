import "../styles/globals.scss";

import { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";

import { localStorageKeys } from "../constants";
import { isServer } from "../utils/isServer";
import { makeAuthReq } from "../utils/makeAuthReq";
import BagFilled from "../components/assets/BagFilled";
import BagOutline from "../components/assets/BagOutline";
import SearchOutline from "../components/assets/SearchOutline";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel='icon' href='/favicon.png' />
      </Head>
      <main>
        <HiddenLinkComponent />
        <TopComponent />
        <div className='container mx-auto p-5'>
          <div className='sticky top-0 bg-white py-5 z-50'>
            <Navbar />
          </div>
          <Component {...pageProps} />
          <Footer />
        </div>
      </main>
    </>
  );
}

function HiddenLinkComponent() {
  const { t } = useTranslation();

  return (
    <Link href='#main_content'>
      <a className='hiddenLink'>{t("common:skip_to_main")} &rarr;</a>
    </Link>
  );
}

function TopComponent() {
  const { t } = useTranslation();

  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");

  const router = useRouter();

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
        onSubmit={e => {
          e.preventDefault();

          router.push(
            `/catalogue?search=${encodeURI(
              search.replace(/ +/g, "+")
            )}`,
            null,
            { shallow: true }
          );
        }}
      >
        <input
          onChange={e => {
            setSearch(e.target.value);
          }}
          className='bg-purple-300 placeholder-gray-600 text-black border border-transparent focus:outline-none focus:ring-none focus:border-b-2 focus:border-purple-600 text-right px-3'
          type='text'
          placeholder={t("common:discover")}
          name='search'
        />
        <div className='my-auto text-gray-600'>
          <SearchOutline />
        </div>
      </form>
      <div className='flex flex-row justify-end container mx-auto h-12 align-middle py-3'>
        {user ? (
          <>
            <div>
              <span
                onClick={() => {
                  console.log("clicked");
                }}
                className='hover:text-purple-600 lowercase cursor-pointer p-5'
              >
                {t("common:welcome", { username: user.username })}
              </span>
            </div>

            <div
              className='
              absolute
              px-3 flex flex-col justify-center bg-white rounded shadow-lg right-20 top-12'
            >
              <ul className=''>
                {/* TODO: add translations */}
                <li className='text-gray-700 hover:text-purple-600 pointer'>
                  my account
                </li>
                <li className='text-gray-700 hover:text-purple-600 pointer'>
                  wishlist
                </li>
                <li className='text-gray-700 hover:text-purple-600 pointer'>
                  my orders
                </li>
                <li className='text-gray-700 hover:text-purple-600 pointer'>
                  cart
                </li>
              </ul>
            </div>
            <div>
              <Link href='/logout'>
                <a className='hover:text-purple-600 lowercase cursor-pointer p-5'>
                  {t("common:logout")}
                </a>
              </Link>
            </div>
          </>
        ) : (
          <>
            <div>
              <Link href='/login'>
                <a className='hover:text-purple-600 lowercase cursor-pointer p-5'>
                  {t("common:login")} ▻
                </a>
              </Link>
            </div>
            <div>
              <Link href='/signup'>
                <a className='hover:text-purple-600 lowercase cursor-pointer p-5'>
                  {t("common:signup")} ▻
                </a>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Navbar() {
  const { t } = useTranslation();
  const cartKey = localStorageKeys.cart;

  const [bagNumber, setBagNumber] = useState(
    !isServer() && localStorage.getItem(cartKey)
      ? JSON.parse(localStorage.getItem(cartKey)).length
      : 0
  );

  const ls = isServer() ? undefined : localStorage;

  useEffect(() => {
    setBagNumber(
      !isServer() && localStorage.getItem(cartKey)
        ? JSON.parse(localStorage.getItem(cartKey)).length
        : 0
    );
  }, [cartKey, ls]);

  return (
    <div>
      <div className='md:flex md:flex-row md:justify-between text-center'>
        <Link href='/'>
          <a className='flex flex-row justify-center items-center'>
            {/* <div className='bg-gradient-to-r from-purple-400 to-red-400 w-10 h-10 rounded-lg'></div> */}
            <div className=''>
              <Image
                src='/favicon.png'
                alt={t("common:logo_alt", {
                  main_title: t("common:main_title"),
                })}
                width={40}
                height={40}
              />
            </div>
            <h1 className='flex flex-col text-gray-600 tracking-tight hover:text-purple-600 font-serif'>
              <span className='text-3xl ml-4'>
                {t("common:main_title")},
              </span>
              <span className='text-sm text-purple-600'>
                {t("common:main_title_extension")}
              </span>
            </h1>
          </a>
        </Link>
        <div className='flex flex-col sm:flex-row mt-2 justify-center md:justify-end'>
          <Link href='/'>
            <a className='lowercase text-gray-600 hover:text-purple-600 p-4'>
              {t("common:home")}
            </a>
          </Link>
          <Link href='/catalogue'>
            <a className='lowercase text-gray-600 hover:text-purple-600 p-4'>
              {t("common:catalogue")}
            </a>
          </Link>
          <Link href='/bag'>
            <a
              className='flex flex-row bg-purple-600 text-gray-50 hover:bg-purple-700 py-3 px-5 rounded-full h-min-full'
              title={t("common:move_to_bag")}
            >
              {!isServer() && localStorage.getItem(cartKey) ? (
                <BagFilled />
              ) : (
                <BagOutline />
              )}
              {/* BAG ITEM COUNT */}
              {t("common:bag")} ({bagNumber})
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  const { t } = useTranslation();
  const router = useRouter();

  const langDict = {
    "en-US": "English",
    fi: "Suomi",
    tr: "Türkçe",
    it: "Italiano",
    pl: "Polski",
    kr: "한국어",
  };

  return (
    <footer className='flex flex-col border-t-2 border-gray-300 py-10'>
      <div
        className='
        flex
        flex-col xl:flex-row
        text-center
        justify-between
        container
        mx-auto
        items-center
        text-sm
        md:px-10'
      >
        <div className='mb-4 text-center'>
          <Link href='/about'>
            <a className='mx-2 hover:text-purple-600 hover:underline'>
              {t("common:about")}
            </a>
          </Link>
          <Link href='https://www.instagram.com/crystal.cabins/'>
            <a className='mx-2 hover:text-purple-600 hover:underline'>
              {t("common:instagram")}
            </a>
          </Link>
          <Link href='/privacy-policy'>
            <a className='mx-2 hover:text-purple-600 hover:underline'>
              {t("common:privacy_policy")}
            </a>
          </Link>
          <Link href='/terms-of-service'>
            <a className='mx-2 hover:text-purple-600 hover:underline'>
              {t("common:terms_of_service")}
            </a>
          </Link>
        </div>

        <div>
          <select
            className='
              block
              appearance-none
              bg-white
              border
              border-gray-400
              hover:border-gray-500
              px-4 py-2 pr-8
              rounded
              shadow
              leading-tight
              focus:outline-none
              focus:shadow-outline
              text-center
              sm:text-left
              w-96 xl:w-36'
            onChange={e => {
              const lang = e.target.value;
              // if language is the same as the current locale, don't do anything
              if (router.locale === lang) return;

              router.push(router.asPath, router.asPath, {
                locale: lang,
              });
            }}
            placeholder={t("common:select_language")}
            title={t("common:select_language")}
          >
            {router.locales.map(locale => {
              return (
                <option value={locale} key={locale}>
                  {/* <Link href={router.asPath} locale={locale}>
                  <a>{locale}</a>
                </Link> */}
                  {langDict[locale]}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      <div className='text-center font-serif mt-4'>
        <p className='text-gray-600'>
          &copy;{" "}
          {t("common:copyright", {
            main_title: t("common:main_title"),
          })}{" "}
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
