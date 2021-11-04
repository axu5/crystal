import getDb from "../database";

export default async function products(req, res) {
  const { products: productsStore } = await getDb();

  const { q } = req.query;

  if (!q) {
    const products = await productsStore.find({});

    const arr = await products.toArray();

    res.json(arr);
  } else {
    // {name:{$in:[/(?=.*\bquartz\b)(?=.*\brose\b).*/g]}}

    const query = new RegExp(
      q
        .split(" ")
        .map(keyword => `(?=.*${keyword})`)
        .join("|") + ".*",
      "g"
    );

    const inq = {
      $in: [query],
    };
    const tmp = {
      $or: [
        {
          name: inq,
        },
        { tags: inq },
      ],
    };

    const products = await productsStore.find(tmp);

    const arr = await products.toArray();

    res.json(arr);
  }
}
