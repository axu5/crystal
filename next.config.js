const nextTranslate = require("next-translate");

module.exports = {
  reactStrictMode: true,
  images: {
    domains: ["cdn.discordapp.com"],
  },
  swcMinify: true,
  // @ts-ignore
  ...nextTranslate(),
};
