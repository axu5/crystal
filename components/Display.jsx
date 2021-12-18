import Link from "next/link";
import useTranslation from "next-translate/useTranslation";

import DisplayGrid from "./DisplayGrid";
import ArrowRight from "./assets/ArrowRight";

export default function Display({ title, slug, items, lang }) {
  const { t } = useTranslation();
  return (
    <div className='my-20'>
      <div className='flex flex-row justify-between my-5'>
        {/* TITLE */}
        <Link href={`/catalogue/${slug}`}>
          <a className='hover:underline hover:cursor-pointers'>
            <h2 className='text-3xl'>{title}</h2>
          </a>
        </Link>
        {/* LINK */}
        <Link href={`/catalogue/${slug}`}>
          <a className='text-xl flex flex-row'>
            {t("common:view_all")}
            <ArrowRight />
          </a>
        </Link>
      </div>
      {/* GRID */}
      <DisplayGrid items={items} />
    </div>
  );
}
