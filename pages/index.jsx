import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";

import Display from "../components/Display";
import ArrowRight from "../components/assets/ArrowRight";
import getItems from "../utils/getItems";
import { isServer } from "../utils/isServer";
import Modal from "../components/Modal";

export async function getServerSideProps() {
  return {
    props: {
      items: await getItems({}),
    },
  };
}

export default function Home({ items }) {
  const { t } = useTranslation();

  const router = useRouter();
  const { status, session_id } = router.query;

  return (
    <>
      <Head>
        <title>{t("common:main_title")}</title>
        <meta
          name='description'
          content='Get high quality crystals for yourself, loved one or friends. We offer a wide range of crystal jewelry for any need you may have.'
          // TODO: add translations
        />
      </Head>
      {status === "success" ? (
        <Modal
          callback={async () => {
            if (status === "success" && session_id && !isServer()) {
              router.push("/bag", null, { shallow: true });
            }
          }}
        >
          <div className='mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100'>
            <svg
              className='h-6 w-6 text-green-600'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M5 13l4 4L19 7'
              ></path>
            </svg>
          </div>
          <h3 className='text-lg leading-6 font-medium text-gray-900'>
            {"Success"}
          </h3>
          <div className='mt-2 px-7 py-3'>
            <p className='text-sm text-gray-500'>
              {"Payment went through successfully"}
              <br />
              {"Thank you for your purchase!"}
            </p>
          </div>
        </Modal>
      ) : null}
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
      {items && (
        <Display
          title={t("common:rings")}
          slug='ring'
          items={items}
          callback={() => {}}
        />
      )}
    </>
  );
}
