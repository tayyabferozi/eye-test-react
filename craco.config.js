module.exports = {
  style: {
    sass: {
      loaderOptions: {
        additionalData: `
          @import "src/styles/_colors.scss";
          @import "src/styles/_mixins.scss";
        `,
      },
    },
  },
};
