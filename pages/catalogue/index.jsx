import AllProducts from "../../components/AllProducts";
import CategoryHead from "../../components/CategoryHead";
import getProductsReduced from "../../utils/getProductsReduced";

export default function Catalogue({ products }) {
  return (
    <>
      <CategoryHead
        title='crystal cabins catalogue'
        image={products[0].images[0]}
      />
      <div>
        <AllProducts products={products} />
      </div>
    </>
  );
}

// This function gets called at build time
export async function getStaticProps() {
  const products = await getProductsReduced();

  return {
    props: {
      products,
    },
  };
}
