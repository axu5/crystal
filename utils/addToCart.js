import { localStorageKeys } from "../constants";

export default function addToCart(id, user = null) {
  console.log("user", user);
  const cartKey = localStorageKeys.cart;

  return async () => {
    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    const cartTmp = [...cart];

    let add = true;
    for (let i = 0; i < cart.length; ++i) {
      const prod = cart[i];
      if (prod.id === id) {
        console.log("removing", prod.id);
        cart.splice(i, 1);
        add = false;
        break;
      }
    }

    if (add) cart.push({ id, quantity: 1, size: 0 });

    localStorage.setItem(cartKey, JSON.stringify(cart));

    if (user !== null) {
      const res = await fetch(`http://localhost:3000/api/cart`, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: JSON.stringify({ cart }),
      });

      const data = await res.json();
      console.log("data", data);

      // if not successful reset the local cart
      if (!data.success) {
        localStorageKeys.setItem(cartKey, JSON.stringify(cartTmp));
      }
    }

    return !!cart.some((/** @type {any} */ item) => item.id === id);
  };
}
