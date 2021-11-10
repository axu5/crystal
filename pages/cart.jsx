import Head from "next/head";
import { Elements, PaymentElement } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// import { getUser } from "../utils/getUser";
import { isServer } from "../utils/isServer";
import { localStorageKeys } from "../constants";
import getUser from "../utils/getUser";

const stripePromise = loadStripe(process.env.STRIPE_PRIVATE_KEY);

export const getServerSideProps = getUser;

export default function Cart({ user }) {
  const cartKey = localStorageKeys.cart;

  const cart =
    (user && user.cart) ||
    (!isServer()
      ? JSON.parse(localStorage.getItem(cartKey)) || []
      : []);

  console.log(`cart`, cart);

  return (
    <>
      <Head>
        <title>
          {user
            ? `${user.username}'s crystal cart`
            : "your crystal cart"}
        </title>
      </Head>
      <div>
        <h1>you&apos;re {user ? "" : "not "}logged in</h1>
        <p>
          {cart && cart.length
            ? cart.map(
                (item, i) => (
                  <div key={i}>
                    {i + 1}) {item}
                  </div>
                ),
                ""
              )
            : "You have no items in your crystal cart"}
        </p>
        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      </div>
    </>
  );
}

function CheckoutForm() {
  return (
    <form>
      <PaymentElement />
      <button>Submit</button>
    </form>
  );
}
