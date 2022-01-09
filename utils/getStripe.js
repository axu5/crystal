// import { /*Stripe,*/ loadStripe } from "@stripe/stripe-js";
// @ts-ignore
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default function getStripe() {
  return stripe;
}
