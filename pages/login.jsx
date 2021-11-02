import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { makeAuthReq } from "../utils/makeAuthReq";

export default function Login() {
  const router = useRouter();
  const { redirect } = router.query;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loginAction = async e => {
    e.preventDefault();

    const body = {
      username,
      password,
    };

    // const res = await fetch("http://localhost:3000/api/login", {
    //   headers: {
    //     Accept: "application/json",
    //     "Content-Type": "application/json",
    //   },
    //   method: "POST",
    //   body: JSON.stringify(body),
    //   credentials: "same-origin",
    // });
    const data = await makeAuthReq("login", body);

    const { success, error } = data;
    if (!success) {
      setError(
        typeof error === "object" ? JSON.stringify(error) : error
      );
    } else {
      // redirect user
      router.push(redirect ? `/${redirect}` : "/");
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
      <form onSubmit={loginAction}>
        <input
          onChange={e => setUsername(e.target.value)}
          type='text'
          name='identity'
          id='input'
          placeholder='username or email'
          required
        />
        <input
          onChange={e => setPassword(e.target.value)}
          type='password'
          name='password'
          id='password'
          placeholder='password'
          required
        />
        <button type='submit'>Login!</button>
      </form>
    </div>
  );
}
