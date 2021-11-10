import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { makeAuthReq } from "../utils/makeAuthReq";

export default function Verify() {
  const router = useRouter();
  const { uuid, token } = router.query;

  const [error, setError] = useState("");

  useEffect(() => {
    if (!uuid || !token) {
      return;
    }
    (async () => {
      const { success, error } = await makeAuthReq(
        `/validate-email`,
        { uuid, token }
      );
      if (success) router.push("/");
      else setError(error);
    })();
  }, [uuid, token, router]);

  return <>{error && <h1>error: {error}</h1>}</>;
}
