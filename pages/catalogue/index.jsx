import Product from "../../components/Product";

export default function Catalogue({ products }) {
  return (
    <div>
      {products.map((data, i) => {
        return <Product data={data} key={i} />;
      })}
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
