export default function Error({ error }) {
  return (
    <div className='flex flex-col center'>
      {error !== "" ? (
        <div
          className='
          bg-red-500
          text-white
          font-bold
          py-4 px-4
          my-4
          rounded
          focus:outline-none
          focus:shadow-outline'
        >
          Error: {error}
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}
