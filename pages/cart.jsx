export default function Cart({ user }) {
  return (
    <div>
      <h1>{user.username}</h1>
      <h1>{user.email}</h1>
      <h3>{user.id}</h3>
    </div>
  );
}

export async function getStaticProps() {
  const res = await fetch("http://localhost:3000/api/cart");
  const user = await res.json();

  return {
    props: {
      user,
    },
  };
}
