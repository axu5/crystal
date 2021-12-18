const fs = require("fs");
const path = require("path");

const inputFile = fs.readFileSync(
  path.join(__dirname, "langs", "input.tsv"),
  "utf8"
);

const langs = inputFile
  .split(/\n|\r/)
  .map(line => {
    const [variable, ...langs] = line.split("\t");
    return { variable, langs };
  })
  .filter(x => !!x.variable);

// transform from
// [ ... , ... , ... , ... ][0]
// [ ... , ... , ... , ... ][1]
// [ ... , ... , ... , ... ][2]
// [ ... , ... , ... , ... ][3]

// [ ... ][0][ ... ][1][ ... ][2][ ... ][3]
// [ ... ][0][ ... ][1][ ... ][2][ ... ][3]
// [ ... ][0][ ... ][1][ ... ][2][ ... ][3]
// [ ... ][0][ ... ][1][ ... ][2][ ... ][3]

const codes = langs
  .shift()
  .langs.map(lang => lang.match(/\((.*?)\)/)[0])
  .filter(l => !!l)
  .map(l => l.replace(/\(|\)/g, ""));

// parse the rest of the file
const files = {};
for (let i = 0; i < codes.length; ++i) {
  const code = codes[i];

  files[code] = {};

  for (let j = 0; j < langs.length; ++j) {
    const { variable: _variable, langs: _langs } = langs[j];
    const [fileName, variable] = _variable.split(":");
    if (!files[code][fileName]) files[code][fileName] = {};
    const translation = _langs[i];
    if (!translation || !variable) continue;
    files[code][fileName][variable] = translation;
  }
}

// write to disc
for (const [code, folders] of Object.entries(files)) {
  const codePath = path.join(__dirname, "locales", code);
  fs.mkdirSync(codePath, { recursive: true });

  for (const [fileName, data] of Object.entries(folders)) {
    const filePath = path.join(codePath, fileName + ".json");
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
  }
}
