import { v4 } from "uuid";
import getDb from "../database";
import auth from "../utils/auth";

export default async function productHandler(req, res) {
  console.log("got request");
  console.log("method " + req.method);

  // check if logged in
  let user;
  try {
    user = await auth(req, res);
  } catch (error) {
    return res.json({ success: false, error: "not logged in" });
  }

  if (user?.accountType?.permissions < 4) {
    return res.json({
      success: false,
      error: "not high enough privileges",
    });
  }

  const { products: _products } = await getDb();
  const products = await _products.find({});
  if (req.method === "GET") {
    return res.json({
      success: true,
      products: (await products.toArray()).map(p => {
        delete p["_id"];
        return p;
      }),
    });
  } else if (req.method === "POST") {
    try {
      const product = req.body;
      product.views = 0;
      product.hearts = 0;
      product.sold = 0;
      product.id = v4();
      const requiredFields = [
        "description",
        "images",
        "name",
        "similar",
        "slug",
        "summary",
        "tags",
        "price",

        "views",
        "hearts",
        "sold",
        "id",
      ];

      for (const [key, val] of Object.entries(product)) {
        if (requiredFields.includes(key)) {
          requiredFields.splice(requiredFields.indexOf(key), 1);
          if (val === undefined) throw "";
        } else {
          delete product[key];
        }
      }

      if (requiredFields.length) throw "";

      const existingProd = await _products.findOne({
        $or: [
          { id: product.id },
          { slug: product.slug },
          { name: product.name },
        ],
      });
      console.log(`existingProd`, existingProd);
      if (existingProd) throw "Nahh";

      product.similar = product.similar.map(async slug => {
        return (await _products.findOne({ slug })).id;
      });

      await _products.insertOne(product);

      return res.json({
        success: true,
        error: null,
      });
    } catch (e) {
      return res.json({
        success: false,
        error: e,
      });
    }
  } else if (req.method === "PUT") {
    try {
      const productData = req.body;
      const productId = productData.id;
      const prod = await _products.findOne({ id: productId });
      if (!prod) throw "incorrect id";

      let images;
      if (
        productData.images.every(img =>
          img.match(
            /^https:\/\/cdn.discordapp.com\/attachments\/[0-9]{18}\/[0-9]{18}\/.*$/
          )
        )
      )
        images = productData.images;
      else throw "IMAGES BRO FIX IMAGES NOW";

      const productNew = {
        name: productData.name.trim(),
        slug: productData.slug.replace(/^-|-$/g, ""),
        description: productData.description.trim(),
        summary: productData.summary.trim(),
        // convert slugs to ids.
        similar: productData.similar
          .filter(slug => slug !== "")
          .map(async slug => {
            const productLink = await _products.findOne({ slug });
            return productLink.id;
          }),
        // make sure all images are valid discord cdn urls
        images,
        tags: productData.tags
          .map(tag => tag.trim())
          .filter(tag => tag !== ""),
        price: productData.price * 100,

        id: prod.id,
        views: prod.views,
        hearts: prod.hearts,
        sold: prod.sold,
      };

      await _products.updateOne(
        { id: prod.id },
        { $set: productNew }
      );

      return res.json({ success: true });
    } catch (e) {
      return res.json({ success: false, error: e });
    }
  } else if (req.method === "DELETE") {
    try {
      const { id: productId } = req.body;
      if (!productId) throw "uhh you forgor something";
      const product = await _products.findOne({ id: productId });
      if (!product) throw "no product with that id";

      await _products.deleteOne({ id: productId });

      return res.json({ success: true, error: null });
    } catch (e) {
      return res.json({ success: false, error: e });
    }
  } else {
    return res.json({ success: false, error: "LOL WTF" });
  }
}
