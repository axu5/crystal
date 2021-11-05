import { isServer } from "./isServer";
import { localStorageKeys } from "../constants";

const userKey = localStorageKeys.user;

export async function getUser() {
  if (isServer()) return;

  try {
    let _user = localStorage.getItem(userKey);

    if (!_user || _user === "null" || _user === "") {
      const res = await fetch(`http://localhost:3000/api/user`);
      const { user } = await res.json();

      _user = JSON.stringify(user);
      // cache user in local storage
      localStorage.setItem(userKey, _user);
    }

    return JSON.parse(_user);
  } catch {
    return null;
  }
}
