import Link from "next/link";
import useTranslation from "next-translate/useTranslation";

import DisplayGrid from "./DisplayGrid";
import ArrowRight from "./assets/ArrowRight";

export default function Display({ title, slug, items, callback }) {
  if (!callback) callback = () => {};
  const { t } = useTranslation();

  slug = encodeURI(slug);
  return (
    <div className='my-20'>
      {!title || !slug ? (
        <></>
      ) : (
        <div className='flex flex-row justify-between m-5'>
          {/* TITLE */}
          <Link href={`/catalogue?search=${slug}`}>
            <a className='hover:underline hover:cursor-pointers'>
              <h2 className='text-3xl'>{title}</h2>
            </a>
          </Link>
          {/* LINK */}
          <Link href={`/catalogue?search=${slug}`}>
            <a className='text-xl flex flex-row'>
              {t("common:view_all")}
              <ArrowRight />
            </a>
          </Link>
        </div>
      )}
      {/* GRID */}
      <DisplayGrid items={items} callback={callback} />
    </div>
  );
}
