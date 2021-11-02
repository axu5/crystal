import getDb from "../database";

export default async function products(_req, res) {
  const { products: productsStore } = await getDb();

  const products = await productsStore.find({});

  const arr = await products.toArray();

  res.json(arr);
}
