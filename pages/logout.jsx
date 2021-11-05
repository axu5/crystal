import { useRouter } from "next/router";
import { makeAuthReq } from "../utils/makeAuthReq";
import { localStorageKeys } from "../constants";

const [userKey, cartKey] = [
  localStorageKeys.user,
  localStorageKeys.cart,
];

export default function Login() {
  const router = useRouter();

  // const logoutAction = async e => {
  //   e.preventDefault();

  //   await makeAuthReq("logout");

  //   router.push("/");
  // };

  // const logoutAllAction = async e => {
  //   e.preventDefault();

  //   await makeAuthReq("logout-all");

  //   router.push("/");
  // };

  const logout = type => {
    return async e => {
      e.preventDefault();
      await makeAuthReq(`logout${type}`);
      localStorage.removeItem(cartKey);
      localStorage.removeItem(userKey);
      router.push("/");
    };
  };

  return (
    <div>
      <button onClick={logout("")}>Log out!</button>
      <button onClick={logout("-all")}>Log out all!</button>
    </div>
  );
}
