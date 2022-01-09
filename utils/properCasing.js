export function properCasing(txt) {
  const tmp = txt.toLowerCase().replace(/ +/g, " ");
  return tmp.charAt(0).toUpperCase() + tmp.slice(1);
}
