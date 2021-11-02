import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { getUser } from "../utils/getUser";

export default function Cart() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      const _user = await getUser();
      if (_user === null) router.push("/");
      else setUser(_user);
    })();
  }, []);

  return (
    <div>
      {user && (
        <>
          <h1>{user.username}</h1>
          <h1>{user.email}</h1>
          <h3>{user.id}</h3>
        </>
      )}
    </div>
  );
}
