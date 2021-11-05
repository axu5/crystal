import middleware from "../utils/middleware";
import validator from "email-validator";
import bcrypt from "bcrypt";
import { v4 } from "uuid";
import { verify } from "hcaptcha";

import getDb from "../database";
import { createAccessToken, createRefreshToken } from "../tokenUtils";

const saltRounds = 10;

export default async function signup(req, res) {
  await middleware(req, res);

  try {
    let { username, password, email, firstName, lastName, token } =
      req.body;

    if (!token) {
      throw "please complete the captcha";
    }

    // this process may throw error
    let { success } = await verify(
      process.env.HCAPTCHA_SECRET,
      token
    );
    if (!success) {
      throw "please complete the captcha";
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

    if (!firstName) {
      throw "please enter your first name";
    } else if (firstName.trim().length === 0) {
      throw "please input something for your first name";
    } else if (firstName.match(/ +/)) {
      throw "first name cannot include spaces";
    } else if (firstName.length > 30) {
      throw "first name cannot be over 30 characters";
    } else if (firstName.length === 0) {
      throw "first name cannot be blank";
    }

    if (!lastName) {
      throw "please enter your last name";
    } else if (lastName.trim().length === 0) {
      throw "please input something for your last name";
    } else if (lastName.match(/ +/)) {
      throw "last name cannot include spaces";
    } else if (lastName.length > 30) {
      throw "last name cannot be over 30 characters";
    } else if (lastName.length === 0) {
      throw "last name cannot be blank";
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
