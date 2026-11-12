import { After, AfterStep, Before, setDefaultTimeout } from "@cucumber/cucumber";
import { readFile } from "node:fs/promises";
import { SalesforceWorld } from "./world";

setDefaultTimeout(120000);

Before(async function (this: SalesforceWorld) {
  await this.ensureInitialized();
});

AfterStep(async function (this: SalesforceWorld, step) {
  if (!this.page) {
    return;
  }

  const stepText = step.pickleStep?.text ?? "Step";

  try {
    const screenshot = await this.page.screenshot({
      fullPage: true,
      animations: "disabled",
    });

    await this.attach(screenshot, {
      mediaType: "image/png",
      fileName: `Step - ${stepText}.png`,
    });
  } catch {
    // Ignore screenshot attachment errors to avoid masking the step outcome.
  }
});

After(async function (this: SalesforceWorld, scenario) {
  if (!this.page) {
    return;
  }

  try {
    const video = this.page.video();
    if (video) {
      const videoPath = await video.path();
      const buffer = await readFile(videoPath);
      await this.attach(buffer, {
        mediaType: "video/webm",
        fileName: "Scenario recording.webm",
      });
    }

    if (scenario.result && scenario.result.status === "FAILED") {
      const screenshot = await this.page.screenshot({ fullPage: true });
      await this.attach(screenshot, {
        mediaType: "image/png",
        fileName: "failure screenshot.png",
      });
    }
  } catch {
    // Ignore video/screenshot attachment errors.
  } finally {
    await this.closeBrowser();
  }
});
