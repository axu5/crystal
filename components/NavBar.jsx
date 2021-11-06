import "../styles/NavBar.module.scss";

import { useState, useEffect } from "react";
import Link from "next/link";

import { getUser } from "../utils/getUser";
import { localStorageKeys } from "../constants";
import { isServer } from "../utils/isServer";

export default function NavBar() {
  const cartKey = localStorageKeys.cart;

  // const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const _user = await getUser();
      if (_user)
        localStorage.setItem(cartKey, JSON.stringify(_user.cart));
      setUser(_user);
      setLoading(false);
    })();
  }, [cartKey]);

  return (
    <></>
    // <div className='flex flex-row justify-between'>
    //   <div className='flex flex-row'>
    //     <div className='bg-gradient-to-r from-purple-400 to-red-400 w-10 h-10 rounded-lg'></div>
    //     <h1 className='text-3xl text-gray-600 ml-2'>Logo</h1>
    //   </div>
    //   <div className='mt-2'>
    //     <Link href='/'>
    //       <a className='text-gray-600 hover:text-purple-600 p-4'>
    //         home
    //       </a>
    //     </Link>
    //     <Link href='/catalogue'>
    //       <a className='text-gray-600 hover:text-purple-600 p-4'>
    //         shop
    //       </a>
    //     </Link>
    //     <Link href='/about'>
    //       <a className='text-gray-600 hover:text-purple-600 p-4'>
    //         about
    //       </a>
    //     </Link>
    //     <Link href='/cart'>
    //       <a className='bg-purple-600 text-gray-50 hover:bg-purple-700 py-3 px-5 rounded-full '>
    //         <svg
    //           xmlns='http://www.w3.org/2000/svg'
    //           className='h-5 w-5 mr-1 inline-block'
    //           viewBox='0 0 20 20'
    //           fill='currentColor'
    //         >
    //           <path
    //             fillRule='evenodd'
    //             d='M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z'
    //             clipRule='evenodd'
    //           />
    //         </svg>
    //         cart (
    //         {!isServer() && localStorage.getItem(cartKey)
    //           ? JSON.parse(localStorage.getItem(cartKey)).length
    //           : 0}
    //         )
    //       </a>
    //     </Link>
    //   </div>
    // </div>
  );
}
