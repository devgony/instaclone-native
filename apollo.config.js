module.exports = {
  client: {
    includes: ["./**/*.{tsx,ts}"],
    tagName: "gql",
    service: {
      name: "instaclone-backend",
      url: "http://localhost:4001/graphql",
      // url: "https://ninstaclone.loca.lt/graphql",
    },
  },
};
