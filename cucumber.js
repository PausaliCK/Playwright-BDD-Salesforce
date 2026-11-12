module.exports = {
  default: {
    requireModule: ["ts-node/register"],
    require: ["src/support/**/*.ts", "src/steps/**/*.ts"],
    paths: ["src/features/**/*.feature"],
    format: ["pretty", "summary", "html:reports/cucumber-report.html"],
    parallel: 0,
  },
  allure: {
    requireModule: ["ts-node/register"],
    require: ["src/support/**/*.ts", "src/steps/**/*.ts"],
    paths: ["src/features/**/*.feature"],
    format: ["pretty", "summary", "allure-cucumberjs/reporter"],
    formatOptions: {
      "allure-cucumberjs/reporter": {
        resultsDir: "allure-results",
      },
    },
    parallel: 0,
  },
};
