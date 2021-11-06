import getDb from "../pages/api/database";

export default async function getProductsReduced(searchParams) {
  const { products: store } = await getDb();

  const data = await store.find({});
  const products = await data.toArray();

  return products.map(prod => {
    // delete prod["description"];
    // delete prod["tags"];
    // delete prod["similar"];
    delete prod["sold"];
    delete prod["_id"];
    // const tmp = prod.images[0];
    // delete prod["images"];
    // prod.images = [tmp];
    return prod;
  });
}
