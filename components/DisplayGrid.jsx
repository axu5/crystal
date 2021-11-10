import Link from "next/link";
import Image from "next/image";

import ArrowRight from "./assets/ArrowRight";
import Eye from "./assets/Eye";
import Heart from "./assets/Heart";

export default function DisplayGrid({ items }) {
  const formattedItems = items.map((item, i) => (
    <DisplayItem
      key={i}
      name={item.name}
      slug={item.slug}
      views={item.views}
      hearts={item.hearts}
      imageSrc={item.images[0]}
    />
  ));
  return (
    <div className='grid grid-flow-row grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10'>
      {formattedItems}
    </div>
  );
}

function DisplayItem({ name, slug, imageSrc, views, hearts }) {
  return (
    <div className='shadow-lg rounded-lg'>
      <Link href={`/catalogue/${slug}`}>
        <a>
          <Image
            className='rounded-t-lg'
            src={imageSrc}
            alt='product image'
            width={367}
            height={276}
            layout='responsive'
          />
        </a>
      </Link>
      <div className='pt-3 px-5 flex flex-col content-between'>
        <Link href={`/catalogue/${slug}`}>
          <a className='font-serif lowercase text-md hover:text-purple-600 hover:underline text-center pt-3'>
            {name}
          </a>
        </Link>
        <div className='flex flex-row justify-between text-sm'>
          <Count cn='pt-3 px-2' count={views} asset={<Eye />} />
          <Count
            cn='cursor-pointer hover:text-purple-600 pt-3 px-2'
            count={hearts}
            asset={<Heart />}
          />
        </div>
        <div className='flex flex-col xl:flex-row justify-between align-bottom mt-5 h-auto xl:pb-5'>
          {/* TODO: make cart work */}
          <Link href='#'>
            <a className='shadow-md hover:shadow-lg hover:cursor-pointer rounded-full py-2 px-4 text-gray-600 flex flex-row text-sm justify-center my-2 text-center items-center'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-4 w-4 mr-2'
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
              <ArrowRight />
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}

function Count({ count, asset, cn }) {
  return (
    <div className={`flex flex-row ${cn}`}>
      <span className='font-serif mr-3 text-sm'>{count}</span>
      {asset}
    </div>
  );
}
