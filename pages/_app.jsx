import { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import "../styles/globals.scss";
import { localStorageKeys } from "../constants";
import { isServer } from "../utils/isServer";
import { makeAuthReq } from "../utils/makeAuthReq";
import Bag from "../components/assets/BagFilled";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel='icon' href='/favicon.png' />
      </Head>
      <main>
        <LoginComponent />
        <div className='container mx-auto p-5'>
          <Navbar />
          <Component {...pageProps} />
          <Footer />
        </div>
      </main>
    </>
  );
}

function LoginComponent() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    (async () => {
      const { user } = await makeAuthReq(`user`);
      setUser(user);
    })();
  }, []);

  return (
    <div className='bg-purple-300 px-10'>
      <div className='flex flex-row justify-end container mx-auto h-12 align-middle py-3'>
        {user ? (
          <>
            <div>welcome {user.username}</div>
            <div>
              <Link href='/logout'>
                <a className='hover:text-purple-600 cursor-pointer p-5'>
                  logout
                </a>
              </Link>
            </div>
          </>
        ) : (
          <>
            <div>
              <Link href='/login'>
                <a className='hover:text-purple-600 cursor-pointer p-5'>
                  login
                </a>
              </Link>
            </div>
            <div>
              <Link href='/signup'>
                <a className='hover:text-purple-600 cursor-pointer p-5'>
                  sign up
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
  const cartKey = localStorageKeys.cart;

  return (
    <div>
      <div className='md:flex md:flex-row md:justify-between text-center'>
        <Link href='/'>
          <a className='flex flex-row justify-center items-center'>
            {/* <div className='bg-gradient-to-r from-purple-400 to-red-400 w-10 h-10 rounded-lg'></div> */}
            <Image
              src='/favicon.png'
              alt='crystal cabins logo'
              width={40}
              height={40}
            />
            <h1 className='font-serif text-3xl text-gray-600 ml-4'>
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
              <Bag />
              bag (
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

function Footer() {
  return (
    <footer className='border-t-2 border-gray-300 py-10'>
      <div className='flex flex-col text-center xl:flex-row md:justify-between container mx-auto items-center text-sm md:px-10'>
        <div className='mb-4 text-center'>
          <Link href='/faq'>
            <a className='mx-2 hover:text-purple-600 hover:underline'>
              about
            </a>
          </Link>
          <Link href='https://www.instagram.com/crystal.cabins/'>
            <a className='mx-2 hover:text-purple-600 hover:underline'>
              instagram
            </a>
          </Link>
          <Link href='/privacy-policy'>
            <a className='mx-2 hover:text-purple-600 hover:underline'>
              privacy policy
            </a>
          </Link>
          <Link href='/terms-of-service'>
            <a className='mx-2 hover:text-purple-600 hover:underline'>
              terms of service
            </a>
          </Link>
        </div>
        <p className='text-gray-600'>
          &copy; Copyright Reserved by{" "}
          <Link href='/'>
            <a className='underline text-black hover:text-purple-600'>
              Crystal Cabins
            </a>
          </Link>{" "}
          2021
        </p>
      </div>
    </footer>
  );
}
