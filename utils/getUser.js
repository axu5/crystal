export async function getUser() {
  try {
    const res = await fetch(`http://localhost:3000/api/user`);
    const { user } = await res.json();

    return user;
  } catch {
    return null;
  }
}
