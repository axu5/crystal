import middleware from "./utils/middleware";
import validator from "email-validator";
import bcrypt from "bcrypt";
import { v4 } from "uuid";
import jwt from "jsonwebtoken";
import setCookie from "./utils/setCookie";
import {
  Tokens,
  TokenExpiration,
  defaultCookieOptions,
} from "./constants";
import getDb from "./database";
import { createAccessToken, createRefreshToken } from "./tokenUtils";

const saltRounds = 10;
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

export default async function signup(req, res) {
  await middleware(req, res);
  const { users, sessions } = await getDb();

  try {
    const { username, password, email } = req.body;
    if (!(username || password || email)) {
      throw "make sure you have filled in a username, password, and an email";
    }

    if (username.length < 3) {
      throw "username has to be 3 or more characters";
    } else if (username.length >= 20) {
      throw "username must be less than 20 characters";
    }

    if (!validator.validate(email)) {
      throw "enter a valid email";
    }

    if (password.length < 8) {
      throw "password must be 8 or more characters";
    } else if (password.length > 30) {
      throw "password must be 30 or less characters";
    } else if (!password.match(/[0-9]/)) {
      throw "password must include a number";
    } else if (!password.match(/[a-z]/)) {
      throw "password must include a lower case character";
    } else if (!password.match(/[A-Z]/)) {
      throw "password must include an upper case character";
    }

    const existing = await users.findOne({
      $or: [{ email }, { username }],
    });
    if (existing) {
      throw "user with this email or username already exists";
    }

    const userObject = {
      username,
      email,
      address: "", // change
      password: await bcrypt.hash(password, saltRounds),
      wishlist: [],
      uuid: v4(),
      accountAge: new Date(),
      id: users.toArray().length,
      purchased: false,
      purchases: [],
      discountsMade: [],
      cart: [],
      purchasesMade: 0,
      redeemedCodes: [],
    };

    await users.insertOne(userObject);

    // --------- ACCESS TOKEN ---------
    await createAccessToken(res, userObject.uuid);

    // --------- REFRESH TOKEN ---------
    await createRefreshToken(res, userObject.uuid);

    res.status(200).json({ success: true });
  } catch (e) {
    res.status(418).json({ success: false, error: e });
  }
}
