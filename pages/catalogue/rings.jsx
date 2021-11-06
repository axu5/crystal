import getDb from "../api/database";
import CategoryHead from "../../components/CategoryHead";
import AllProducts from "../../components/AllProducts";

export default function Rings({ rings }) {
  console.log(`rings :>>`, rings);
  return (
    <>
      <CategoryHead
        title='Rings! Crystal Cabins Catalogue!'
        image={rings[0]?.images[0] ?? ""}
      />
      <div>
        Rings Page
        <AllProducts products={rings} />
      </div>
    </>
  );
}

export async function getServerSideProps() {
  const { products } = await getDb();

  const _rings = await products.find({
    tags: { $in: ["ring", "rings"] },
  });

  const rings = await _rings.toArray();

  return {
    props: {
      rings: rings.map(ring => {
        delete ring["_id"];
        return ring;
      }),
    },
  };
}
