import getDb from "../database";
import auth from "../utils/auth";

export default async function heart(req, res) {
  try {
    const { uuid } = await auth(req, res);
    const { users, products } = await getDb();

    const { product: productId } = JSON.parse(req.body);

    // verify product exists
    const product = await products.findOne({ id: productId });
    if (!product) {
      throw "product doesn't exist";
    }

    const user = await users.findOne({ uuid });
    if (!user) {
      throw "something went wrong";
    }

    const updateUser = async add => {
      const payload = { wishlist: product.id };
      await users.updateOne(
        { uuid: user.uuid },
        add ? { $addToSet: payload } : { $pull: payload }
      );
    };

    const updateProd = async multiple => {
      await products.updateOne(
        { id: productId },
        { $inc: { hearts: multiple } }
      );
    };

    let heart = user.wishlist.includes(productId);
    await updateUser(!heart);
    await updateProd(heart ? -1 : 1);

    res.status(200).json({ success: true, heart: !heart });
  } catch (e) {
    console.error(e);
    res.status(400).json({ success: false });
  }
}
