import getDb from "../database";

export default async function productSpecific(req, res) {
  const { products } = await getDb();
  let { slug } = req.query;
  const product = await products.findOne({ slug });

  await products.updateOne({ slug }, { $inc: { views: 1 } });

  delete product["_id"];
  delete product["id"];

  res.json(product);
}
