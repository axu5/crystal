const nextTranslate = require("next-translate");

module.exports = {
  reactStrictMode: true,
  images: {
    domains: ["cdn.discordapp.com", "media.discordapp.net"],
  },
  swcMinify: true,
  // @ts-ignore
  ...nextTranslate(),
};
