import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const logoutAction = async e => {
    e.preventDefault();

    const body = {
      username,
      password,
    };

    const res = await fetch("http://localhost:3000/api/logout", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(body),
      credentials: "same-origin",
    });
    const data = await res.json();

    const { success, error } = data;
    if (!success) {
      setError(
        typeof error === "object" ? JSON.stringify(error) : error
      );
    } else {
      // redirect user
      router.push("/");
    }
  };

  return (
    <div>
      {error !== "" && (
        <>
          <div>{error}</div>
          <div>
            did you meant to sign up? (
            <Link href='/signup' passHref>
              <a>click here!</a>
            </Link>
            )
          </div>
        </>
      )}
      <form onSubmit={logoutAction}>
        <button type='submit'>Log out!</button>
      </form>
    </div>
  );
}
