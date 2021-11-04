import getDb from "../api/database";
import CategoryHead from "../../components/CategoryHead";
import AllProducts from "../../components/AllProducts";

export default function Rings({ necklaces }) {
  console.log(`necklaces :>>`, necklaces);
  return (
    <>
      <CategoryHead
        name='Necklaces! Fashionable and Environmentally aware!'
        image={necklaces[0]?.images[0] ?? ""}
      />
      <div>
        Necklaces Page
        <AllProducts products={necklaces} />
      </div>
    </>
  );
}

export async function getServerSideProps() {
  const { products } = await getDb();

  const _necklaces = await products.find({
    tags: { $in: ["necklace", "necklaces"] },
  });

  const necklaces = await _necklaces.toArray();

  return {
    props: {
      necklaces: necklaces.map(ring => {
        delete ring["_id"];
        return ring;
      }),
    },
  };
}
