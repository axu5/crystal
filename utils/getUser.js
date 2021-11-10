import getDb from "../pages/api/database";
import auth from "../pages/api/utils/auth";
import { isServer } from "./isServer";

export default async function getUser({ req, res }) {
  if (!isServer()) return;
  const { refreshToken } = req.cookies;
  if (!refreshToken)
    return {
      props: {
        user: null,
      },
    };

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
    "accountAge",
  ];

  privateProperties.forEach(prop => delete user[prop]);

  return {
    props: {
      user,
    },
  };
}
