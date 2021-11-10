import CategoryHead from "../../components/CategoryHead";
import DisplayGrid from "../../components/DisplayGrid";

import getItems from "../../utils/getItems";

export async function getStaticProps() {
  return {
    props: {
      items: await getItems({}),
    },
  };
}

export default function Catalogue({ items }) {
  return (
    <>
      <CategoryHead
        title='crystal cabins catalogue'
        image={items[0].images[0]}
      />
      <main>
        <div className='flex flex-col py-10 text-center xl:text-left'>
          <h1 className='text-3xl font-serif text-gray-600 pb-10 border-b-2 border-gray-50'>
            Crystal Cabins Catalogue
          </h1>
          <div className='pt-10'>
            <DisplayGrid items={items} />
          </div>
        </div>
      </main>
    </>
  );
}
