import DisplayItem from "./DisplayItem";

export default function DisplayGrid({ items, callback }) {
  if (!callback) callback = () => {};
  const formattedItems = items.map(item => (
    <DisplayItem
      key={item.slug}
      name={item.name}
      slug={item.slug}
      views={item.views}
      hearts={item.hearts}
      imageSrc={item.images[0]}
      id={item.id}
      price={item.price}
      summary={item.summary}
      callback={callback}
    />
  ));
  return (
    <div className='grid grid-flow-row grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10'>
      {formattedItems}
    </div>
  );
}
