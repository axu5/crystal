import getDb from "../api/database";
import CategoryHead from "../../components/CategoryHead";
import AllProducts from "../../components/AllProducts";
import { isServer } from "../../utils/isServer";

export default function Rings({ necklaces }) {
  console.log(`necklaces :>>`, necklaces);
  return (
    <>
      <CategoryHead
        title='Necklaces! Crystal Cabins Catalogue!'
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
  if (!isServer()) return;
  const { products } = await getDb();

  const q = { $in: ["necklace", "necklaces"] };
  const _necklaces = await products.find({
    $or: [{ tags: q }, { name: q }],
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
