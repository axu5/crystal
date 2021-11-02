import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function SignUp() {
  const router = useRouter();
  const { redirect } = router.query;

  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");

  const signupAction = async e => {
    e.preventDefault();

    if (password !== passwordCheck) {
      setError("passwords are not equal");
      return;
    }

    const body = {
      username,
      email,
      password,
    };

    const res = await fetch("http://localhost:3000/api/signup", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      credentials: "same-origin",
      body: JSON.stringify(body),
    });

    const data = await res.json();
    const { success, error } = data;
    console.log(`error`, error);
    if (success) {
      // redirect user
      router.push(redirect ? `/${redirect}` : "/");
    } else {
      setError(
        typeof error === "object" ? JSON.stringify(error) : error
      );
    }
  };

  return (
    <div>
      {error !== "" && (
        <>
          <div>{error}</div>
          <div>
            did you meant to login? (
            <Link href='/login' passHref>
              <a>click here!</a>
            </Link>
            )
          </div>
        </>
      )}
      <form onSubmit={signupAction}>
        <input
          onChange={e => setUsername(e.target.value)}
          type='text'
          name='username'
          id='username'
          placeholder='username'
          required
        />
        <input
          onChange={e => setEmail(e.target.value)}
          type='email'
          name='email'
          id='email'
          placeholder='email'
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
        <input
          onChange={e => setPasswordCheck(e.target.value)}
          type='password'
          name='passwordcheck'
          id='passwordcheck'
          placeholder='repeat your password'
          required
        />

        <button type='submit'>Sign up!</button>
      </form>
    </div>
  );
}
