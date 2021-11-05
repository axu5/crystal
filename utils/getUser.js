import { isServer } from "./isServer";
import { localStorageKeys } from "../constants";

export async function getUser() {
  if (isServer()) return;

  try {
    const userKey = localStorageKeys.user;
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
