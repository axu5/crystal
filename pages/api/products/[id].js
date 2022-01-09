import getDb from "../database";

export default async function productSpecific(req, res) {
  let { id } = req.query;
  const product = await getProduct(id);

  if (!product) return res.end();

  delete product["_id"];

  return res.json(product);
}

async function getProduct(id) {
  const { products } = await getDb();
  const product = await products.findOne({
    $or: [{ id }, { slug: id }],
  });
  return product;
}
