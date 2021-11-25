export async function makeAuthReq(
  apiPath,
  body = {},
  method = "POST"
) {
  const res = await fetch(
    `http://localhost:3000/api/auth/${apiPath}`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type":
          method === "GET" ? undefined : "application/json",
      },
      method,
      body: method === "GET" ? undefined : JSON.stringify(body),
      credentials: "same-origin",
    }
  );

  return await res.json();
}
