import cookieCutter from "cookie-cutter";

// import fs from "fs";

// import { isServer } from "./isServer";

// const file = fs.readFileSync("../langs/lang.csv").toString();

const file = `variable	German (de)	English (en)	Finnish (fi)	Italian (it)	Korean (kr)	Polish (pl)	Turkish (tr)
main_title	Crystal Cabins	Crystal Cabins	Crystal Cabins	Crystal Cabins	Crystal Cabins	Crystal Cabins	Crystal Cabins
mission_statement		Shop environmentally and fashionable, fast	Shoppaile ymparistöllisesti ja muodikkaasti, nopeasti				
login		Login	Kirjaudu sisään				
signup		Sign up	Tee uusi tili				
logout		Logout	Kirjaudu ulos				
about		about	meistä				
instagram		instagram	instagram				
add_to_bag		add to bag	lisää kassiisi				
remove_from_bag		remove from bag	poista kassistasi				
privacy_policy		privacy policy	Tietosuojakäytöntä				
terms_of_service		terms of service	käyttöehdot				
view_all		view all	näytä kaikki				
home		home	kotisivu				
shop		shop	kauppa				
bag		bag	kassisi				
copyright		Copyright Reserved by {main_title}	{main_title}in tekijänoikeudet pidätetään				
necklaces		necklaces	kaulakorut				
rings		rings	sormukset				
views		views	näkökerrat				
hearts		hearts	tykkäävät				
share		share	jaa				
heart		heart	tykkään				
unheart		remove heart	en tykkää				
welcome		welcome {}	tervetuloa {}				
faq		faq	useimmat kysymykset				
shop_now		shop now	osta nyt				
shipping_statement		{main_title} provides fast shipping for all	{main_title} antaa nopeita ostamis aikoja kaikille				
logo_alt		{main_title} logo	{main_title} logo				
catalogue		catalogue	katalogia				`;

// map fi -> component_name -> word

let table = file.split(/\n/g).map(x => x.split(/	/g));

const langPack = {};

const headers = table[0].map((col, i) => {
  if (i === 0) return;
  const lang = col.replace(/.*\(|\).*/g, "").toLowerCase();

  return lang;
});

const sides = table.map((row, i) => {
  if (i === 0) return;
  const vari = row[0];

  return vari;
});
headers.splice(0, 1);
sides.splice(0, 1);

for (let i = 0; i < headers.length; ++i) {
  langPack[headers[i]] = {};
  for (let k = 0; k < sides.length; ++k) {
    langPack[headers[i]][sides[k]] = table[k + 1][i + 1];
  }
}

export default function getTranslation(locale) {
  // if (!Object.keys(langPack).includes(locale)) locale = "en";
  locale = "en";

  return (key, ...params) => {
    let out = langPack[locale][key];

    for (let i = 0; i < params.length; ++i)
      out = out.replace("{}", params[i]);

    const args = out.match(/\{.+\}/g);

    if (args)
      for (const arg of args)
        out = out.replace(
          arg,
          langPack[locale][arg.replace(/[\{\}]/g, "")]
        );

    return out;
  };
}
