export default function Error({ error }) {
  return (
    <div className='absolute center'>
      {error !== "" ? (
        <div className='flex flex-row justify-center py-5 w-96 absolute rounded-sm border-red-900 bg-red-400 text-center'>
          Error: {error}
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}
