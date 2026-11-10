module.exports = {
  default: {
    requireModule: ["ts-node/register"],
    require: ["src/steps/**/*.ts"],
    paths: ["src/features/**/*.feature"],
    format: ["progress", "html:reports/cucumber-report.html"],
    parallel: 0,
  },
};
