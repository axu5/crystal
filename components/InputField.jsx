export default function InputField({ placeholder, setValue, type }) {
  const id = placeholder.toLowerCase().replace(/ +/g, "_");
  return (
    <div className='mb-4'>
      <label
        className='block text-gray-700 text-sm font-bold mb-2'
        htmlFor={id}
      >
        {placeholder}
      </label>
      <input
        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
        onChange={e => setValue(e.target.value)}
        id={id}
        type={type}
        name={id}
        placeholder={placeholder}
        autoComplete='off'
        required
      />
    </div>
  );
}
