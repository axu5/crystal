import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import useTranslation from "next-translate/useTranslation";

import Display from "../components/Display";
import ArrowRight from "../components/assets/ArrowRight";
import getItems from "../utils/getItems";

export async function getServerSideProps() {
  return {
    props: {
      items: await getItems({}),
    },
  };
}

export default function Home({ items }) {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>{t("common:main_title")}</title>
        <meta
          name='description'
          // TODO: add translations
          content='Get high quality crystals**'
        />
      </Head>
      <div className='md:flex md:flex-row mt-20'>
        <div className='md:w-2/5 flex flex-col justify-center items-center'>
          <h2 className='font-serif text-5xl text-gray-600 mb-4 text-center md:self-start md:text-left'>
            {t("common:main_title")}
          </h2>
          <p className='lowercase text-gray-600 tracking-wide text-center md:self-start md:text-left'>
            {t("common:mission_statement")}
          </p>
          <p className='lowercase text-gray-600 tracking-wide text-center md:self-start md:text-left'>
            {t("common:shipping_statement", {
              main_title: t("common:main_title"),
            })}
          </p>
          <Link href='/catalogue'>
            <a className='bg-gradient-to-r from-red-600 to-pink-500 hover:from-pink-600 hover:to-pink-600 rounded-full py-4 px-8 text-gray-50 lowercase text-xl md:self-start my-5 flex flex-row'>
              {t("common:shop_now")} <ArrowRight />
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
          title={t("common:necklaces")}
          slug='necklaces'
          items={items.filter(item =>
            item.tags.some(tag => tag.startsWith("neck"))
          )}
        />
      )}
      {items && (
        <Display
          title={t("common:rings")}
          slug='rings'
          items={items.filter(item =>
            item.tags.some(tag => tag.startsWith("ring"))
          )}
        />
      )}
      {/* necklaces */}
    </>
  );
}
