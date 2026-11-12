module.exports = {
  default: {
    requireModule: ["ts-node/register"],
    require: ["src/steps/salesforce/*.ts"],
    paths: ["src/features/salesforce/*.feature"],
    format: [
      "progress",
      "summary",
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
