module.exports = {
  default: {
    requireModule: ["ts-node/register"],
    require: ["src/steps/**/*.ts"],
    paths: ["src/features/**/*.feature"],
    format: [
      "progress",
      "html:reports/cucumber-report.html",
      "allure-cucumberjs/reporter",
    ],
    formatOptions: {
      "allure-cucumberjs/reporter": {
        resultsDir: "allure-results",
      },
    },
    parallel: 0,
  },
};
