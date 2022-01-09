import getDb from "../database";
import sanitizeItems from "../utils/sanitizeItems";

export default async function products(req, res) {
  const { products: productsStore } = await getDb();

  const { q } = req.query;

  if (!q) {
    const products = await productsStore.find({});

    const arr = await products.toArray();

    res.json(arr);
  } else {
    // {name:{$in:[/(?=.*\bquartz\b)(?=.*\brose\b).*/g]}}

    // during the emergency procedure at the beginning of the flight
    // he said that in case of emergency your life jacket is under ....
    // and then he added "for romantic atmosphere the vest is also equipped with a light"
    // he also called the jacket designer
    // so FUNNY
    // and he was like "ugh, by law i have to tell you these things..."

    const query = new RegExp(
      q
        .split(" ")
        .map(keyword => `(?=.*${keyword})`)
        .join("|") + ".*",
      "g"
    );

    console.log("query :>> ", query);

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

    // is it spelt with a "z"? 's' right????
    const products = sanitizeItems(await productsStore.find(tmp));

    const arr = await products.toArray();
    console.log(`products`, arr);

    res.json(arr);
  }
}
