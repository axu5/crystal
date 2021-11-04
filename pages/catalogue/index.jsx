import AllProducts from "../../components/AllProducts";

export default function Catalogue({ products }) {
  return (
    <div>
      <AllProducts products={products} />
    </div>
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
