import { Stagehand, Page, BrowserContext } from "@browserbasehq/stagehand";
import StagehandConfig from "./stagehand.config.js";
import chalk from "chalk";
import boxen from "boxen";

/**
 * 🤘 Welcome to Stagehand! Thanks so much for trying us out!
 * 🛠️ CONFIGURATION: stagehand.config.ts will help you configure Stagehand
 *
 * 📝 Check out our docs for more fun use cases, like building agents
 * https://docs.stagehand.dev/
 *
 * 💬 If you have any feedback, reach out to us on Slack!
 * https://stagehand.dev/slack
 *
 * 📚 You might also benefit from the docs for Zod, Browserbase, and Playwright:
 * - https://zod.dev/
 * - https://docs.browserbase.com/
 * - https://playwright.dev/docs/intro
 */

// --- Target URL & Data ---
const targetUrl = "https://preview-b0a646ab--health-insight-form.lovable.app/";
const vitalsData = {
    heartRate: "80",
    bpSystolic: "125",
    bpDiastolic: "75",
    temperature: "98.9",
    respiratoryRate: "16",
    o2Saturation: "98",
};
const admissionData = {
    diagnosis: "Patient is suffering from unexplained Epistaxis and Neurological Symptoms, alongside extreme heart rate variability.",
    bed: "420-A"
};

async function main({
  page,
  context,
  stagehand,
}: {
  page: Page; // Playwright Page with act, extract, and observe methods
  context: BrowserContext; // Playwright BrowserContext
  stagehand: Stagehand; // Stagehand instance
}) {
  try {
    console.log(`Attempting to navigate to URL: ${targetUrl}`);
    // Increase timeout if the page loads slowly
    await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 60000 });
    console.log(`Navigated to ${targetUrl}`);

    // --- Interact with Vital Signs Tab ---
    console.log(chalk.yellow("--- Filling Vital Signs ---"));

    // Wait briefly for elements to potentially render if needed
    await page.waitForTimeout(1000);

    // Fill Heart Rate
    await page.act(`Type '${vitalsData.heartRate}' into the 'Heart Rate (bpm)' input field`);

    // Fill Blood Pressure (Systolic and Diastolic) - Using labels from new screenshot
    await page.act(`Type '${vitalsData.bpSystolic}' into the 'Systolic (mmHg)' input field`);
    await page.act(`Type '${vitalsData.bpDiastolic}' into the 'Diastolic (mmHg)' input field`);

    // Fill Temperature
    await page.act(`Type '${vitalsData.temperature}' into the 'Temperature (°F)' input field`);

    // Fill Respiratory Rate
    await page.act(`Type '${vitalsData.respiratoryRate}' into the 'Respiratory Rate (breaths/min)' input field`);

    // Fill O2 Saturation - Using label from new screenshot
    await page.act(`Type '${vitalsData.o2Saturation}' into the 'Oxygen Saturation (%)' input field`);

    console.log("Vital signs fields filled.");


    // --- Interact with Admission Tab ---
    console.log(chalk.yellow("\n--- Switching to Admission Tab ---"));
    await page.waitForTimeout(500); // Small pause before switching tab

    console.log("Clicking the 'Admission' tab...");
    await page.act("Click the 'Admission' tab"); // Adjust prompt if the clickable element is different

    // Wait for Admission tab content to potentially load/render
    console.log("Waiting for Admission tab content...");
    await page.waitForTimeout(2000); // Adjust timeout as needed

    console.log(chalk.yellow("\n--- Filling Admitting Diagnosis ---"));

    // Update Admitting Diagnosis
    // Assuming the field is labeled 'Admitting Diagnosis'. Adjust if necessary.
    console.log(`Updating Admitting Diagnosis to: ${admissionData.diagnosis}`);
    await page.act(`Type '${admissionData.diagnosis}' into the 'Admitting Diagnosis' input field`); // Adjust prompt/selector if needed

    // Update Bed
    // Assuming the field is labeled 'Bed'. Adjust if necessary.
    console.log(`Updating Room/Bed to: ${admissionData.bed}`);
    await page.act(`Type '${admissionData.bed}' into the 'Room/Bed' input field`);

    console.log("Admission details filled.");

    console.log("Clicking 'Save Changes' for Admission...");
    await page.act("Click the 'Save Changes' button");

    console.log(chalk.green("\nAutomation script finished successfully."));

  } catch (error) {
      console.error(chalk.red(`An error occurred during automation`));
  };
};

/**
 * This is the main function that runs when you do npm run start
 *
 * YOU PROBABLY DON'T NEED TO MODIFY ANYTHING BELOW THIS POINT!
 *
 */
async function run() {
  const stagehand = new Stagehand({
    ...StagehandConfig,
  });
  await stagehand.init();

  if (StagehandConfig.env === "BROWSERBASE" && stagehand.browserbaseSessionID) {
    console.log(
      boxen(
        `View this session live in your browser: \n${chalk.blue(
          `https://browserbase.com/sessions/${stagehand.browserbaseSessionID}`,
        )}`,
        {
          title: "Browserbase",
          padding: 1,
          margin: 3,
        },
      ),
    );
  }

  const page = stagehand.page;
  const context = stagehand.context;
  await main({
    page,
    context,
    stagehand,
  });
  await stagehand.close();
  stagehand.log({
    category: "create-browser-app",
    message: `\n🤘 Thanks so much for using Stagehand! Reach out to us on Slack if you have any feedback: ${chalk.blue(
      "https://stagehand.dev/slack",
    )}\n`,
  });
}

run();
