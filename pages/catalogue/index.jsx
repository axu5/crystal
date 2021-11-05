import AllProducts from "../../components/AllProducts";
import CategoryHead from "../../components/CategoryHead";

export default function Catalogue({ products }) {
  return (
    <>
      <CategoryHead title='catalogue' image={products[0].images[0]} />
      <div>
        <AllProducts products={products} />
      </div>
    </>
  );
}

// This function gets called at build time
export async function getStaticProps() {
  const res = await fetch("http://localhost:3000/api/products");
  const products = await res.json();

  return {
    props: {
      products,
    },
  };
}
