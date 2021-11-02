export async function makeAuthReq(apiPath, body = {}) {
  const res = await fetch(`http://localhost:3000/api/${apiPath}`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(body),
    credentials: "same-origin",
  });
  return res.json();
}
