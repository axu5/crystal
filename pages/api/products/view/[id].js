import getDb from "../../database";

export default async function productSpecific(req, res) {
  const { products } = await getDb();
  let { id } = req.query;
  const product = await products.findOne({
    $or: [{ id }, { slug: id }],
  });

  if (!product) return res.end();

  await products.updateOne(
    { $or: [{ id }, { slug: id }] },
    { $inc: { views: 1 } }
  );

  delete product["_id"];

  return res.json(product);
}
