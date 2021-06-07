module.exports = {
  client: {
    includes: ["./**/*.{tsx,ts}"],
    tagName: "gql",
    service: {
      name: "instaclone-backend",
      url: process.env.URI_GQL,
    },
  },
};
