import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import InputField from "../components/InputField";
import getUser from "../utils/getUser";
import { makeAuthReq } from "../utils/makeAuthReq";

export const getServerSideProps = async context => {
  const {
    props: { user },
  } = await getUser(context);

  if (!user) {
    return {
      redirect: {
        permanent: false,
        destination: "/login?redirect=account",
      },
    };
  }

  return {
    props: {
      user,
    },
  };
};

export default function Account({ user }) {
  const router = useRouter();

  const { name, username } = user;

  const [newUsername, setNewUsername] = useState(username);
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordCheck, setNewPasswordCheck] = useState("");
  const [doubleCheck, setDoubleCheck] = useState(false);

  const [button, setButton] = useState(true);

  useEffect(() => {
    const sameUsername = newUsername === username;
    const passwordDontMatch = newPassword === newPasswordCheck;
    setButton(!sameUsername && passwordDontMatch);
  }, [newUsername, newPassword, newPasswordCheck, username]);

  return (
    <>
      <title>{username}&apos;s account</title>
      <main className='flex flex-col'>
        <div className='flex flex-row justify-center font-serif'>
          <h1 className='text-2xl'>
            Welcome {name.first}!{" "}
            <span className='text-md'>({username})</span>
          </h1>
        </div>
        <div className='md:w-96 md:mx-auto my-4'>
          <InputField
            placeholder='change username'
            setValue={setNewUsername}
            type='text'
          />
          <br />
          <InputField
            placeholder='change password'
            setValue={setNewPassword}
            type='password'
          />
          <InputField
            placeholder='enter your password again'
            setValue={setNewPasswordCheck}
            type='password'
          />

          <br />
          <button
            disabled={button}
            className='
              shadow
              appearance-none
              border
              rounded
              w-full
              bg-green-300
              py-2
              px-3
              text-gray-700
              leading-tight
              focus:outline-none
              focus:shadow-outline'
          >
            {button ? "Confirm" : "Check your inputs..."}
          </button>

          <button
            onClick={async () => {
              if (!doubleCheck) return setDoubleCheck(true);

              const data = await makeAuthReq("user/delete");

              if (data.success) {
                router.push("/");
              }
            }}
            className='
              shadow
              appearance-none
              border
              rounded
              w-full
              bg-red-300
              py-2
              px-3
              text-gray-700
              leading-tight
              focus:outline-none
              focus:shadow-outline
              font-bold'
          >
            {doubleCheck
              ? "ARE YOU SURE?"
              : "Delete your account permanently"}
          </button>
        </div>
      </main>
    </>
  );
}
