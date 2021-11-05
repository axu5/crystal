import middleware from "../utils/middleware";
import bcrypt from "bcrypt";
import { v4 } from "uuid";
import fetch from "node-fetch";

import getDb from "../database";
import { createAccessToken, createRefreshToken } from "../tokenUtils";
import {
  validateEmail,
  validateName,
  validatePassword,
  validateUsername,
} from "./validators";
import { saltRounds } from "../constants";

export default async function signup(req, res) {
  await middleware(req, res);

  try {
    let { username, password, email, firstName, lastName, token } =
      req.body;

    if (!token) {
      throw "please complete the captcha";
    }

    const details = {
      response: token,
      secret: process.env.HCAPTCHA_SECRET,
      sitekey: process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY,
    };

    const formBody = [];
    for (const property in details) {
      const encodedKey = encodeURIComponent(property);
      const encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }

    console.log('formBody.join("&") :>>', formBody.join("&"));

    const response = await fetch("https://hcaptcha.com/siteverify", {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
      body: formBody.join("&"),
    });

    const data = await response.json();

    console.log("data :>> ", data);

    // @ts-ignore
    const { success, "error-codes": errorCodes } = data;

    if (!success) {
      console.error("captcha failed", errorCodes);
      throw "captcha failed";
    }

    const { users } = await getDb();
    username = username.trim();
    email = email.trim();
    firstName = firstName.trim();
    lastName = lastName.trim();

    console.log(`username`, username);
    if (!(username || password || email)) {
      throw "make sure you have filled in a username, password, and an email";
    }

    validateUsername(username);
    validateEmail(email);
    validatePassword(password);
    validateName(firstName);
    validateName(lastName);

    const existing = await users.findOne({
      $or: [{ email }, { username }],
    });
    if (existing) {
      throw "user with this email or username already exists";
    }

    const userObject = {
      username,
      email,
      name: { first: firstName, last: lastName },
      address: "", // TODO: change
      password: await bcrypt.hash(password, saltRounds),
      wishlist: [],
      uuid: v4(),
      accountAge: new Date(),
      id: (await users.count()) + 1,
      purchased: false,
      purchases: [],
      discountsMade: [],
      cart: [],
      purchasesMade: 0,
      redeemedCodes: [],
      accountType: {
        // according to specification
        // https://www.evernote.com/client/web#?n=ed25ab3e-c7a0-19fe-2c21-38610c87ab24&
        title: "customer",
        permissions: 1,
      },
    };

    await users.insertOne(userObject);

    // --------- ACCESS TOKEN ---------
    await createAccessToken(res, userObject.uuid);

    // --------- REFRESH TOKEN ---------
    await createRefreshToken(res, userObject.uuid);

    res.status(200).json({ success: true });
  } catch (e) {
    console.error("e :>>", e);
    res.status(400).json({ success: false, error: e });
  }
}
