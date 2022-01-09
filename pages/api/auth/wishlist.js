import getDb from "../database";
import auth from "../utils/auth";

export default async function wishlist(req, res) {
  let uuid;
  try {
    const user = await auth(req, res);
    uuid = user.uuid;
  } catch {
    return res.json({
      success: false,
      error: "you're not logged in",
    });
  }

  const { users, products } = await getDb();
  const user = await users.findOne({ uuid });

  if (!user) {
    return res.json({
      success: false,
      error: "something went wrong",
    });
  }

  return res.json({
    success: true,
    data: await Promise.all(
      user.wishlist.map(async productId => {
        const product = await products.findOne({ id: productId });
        delete product["_id"];
        return product;
      })
    ),
  });
}
