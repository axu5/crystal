import getDb from "./database";
import auth from "./utils/auth";

export default async function authGetUser(req, res) {
  try {
    const { uuid } = await auth(req, res);
    const { users } = await getDb();

    const user = await users.findOne({ uuid });

    const privateProperties = [
      "password",
      "address",
      "email",
      "uuid",
      "id",
      "_id",
      "redeemedCodes",
      "purchasesMade",
      "discountsMade",
      "purchases",
      "purchased",
      "phoneNumber",
    ];

    privateProperties.forEach(prop => delete user[prop]);

    // console.log("user :>> ", user);
    // {
    //   username: 'aleksanteri',
    //   name: { first: 'aleksanteri', last: 'aho' },
    //   wishlist: [],
    //   accountAge: 2021-11-03T01:00:50.202Z,
    //   cart: [
    //     'rose-quartz-gold-ring',
    //     'rose-quartz-matching-heart-necklace-gold'
    //   ]
    // }

    res.status(200).json({ user });
  } catch (e) {
    res.status(401).json({ user: null });
  }
}
