/**
 * Scraper for Udyam Registration Step1 (Aadhaar) and Step2 (PAN)
 * Step1 scraped live from site
 * Step2 parsed from saved HTML file (pan-step.html) to bypass OTP flow
 */

const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const fs = require("fs-extra");
const path = require("path");

async function scrape() {
  console.log("🚀 Starting scrape...");

  // STEP 1: Live scrape Aadhaar step
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto("https://udyamregistration.gov.in/UdyamRegistration.aspx", {
    waitUntil: "networkidle0",
  });

  const step1Fields = await page.evaluate(() => {
    const fields = [];
    const aadhaarInput = document.querySelector(
      'input[placeholder*="Aadhaar"], #ctl00_ContentPlaceHolder1_txtadharno'
    );
    const nameInput = document.querySelector(
      'input[placeholder*="Name"], #ctl00_ContentPlaceHolder1_txtownername'
    );
    const consentCheckbox = document.querySelector(
      "#ctl00_ContentPlaceHolder1_chkDecarationA"
    );

    if (aadhaarInput) {
      fields.push({
        name: aadhaarInput.name || "aadhaarNumber",
        type: "text",
        id: aadhaarInput.id,
        label: "Aadhaar Number",
        required: true,
        maxLength: 12,
        pattern: "^[0-9]{12}$",
      });
    }
    if (nameInput) {
      fields.push({
        name: nameInput.name || "entrepreneurName",
        type: "text",
        id: nameInput.id,
        label: "Name of Entrepreneur",
        required: true,
        maxLength: 100,
      });
    }
    if (consentCheckbox) {
      fields.push({
        name: consentCheckbox.name || "consent",
        type: "checkbox",
        id: consentCheckbox.id,
        label: "Consent",
        required: true,
      });
    }
    return fields;
  });

  await browser.close();

  console.log(`✅ Step 1 fields scraped: ${step1Fields.length} fields`);

  // STEP 2: Parse saved HTML for PAN step
  const panHtmlPath = path.join(__dirname, "pan-step.html");
  if (!fs.existsSync(panHtmlPath)) {
    console.error("❌ pan-step.html not found in scraper folder!");
    process.exit(1);
  }
  const panHtml = await fs.readFile(panHtmlPath, "utf8");
  const $ = cheerio.load(panHtml);

  const step2Fields = [];

  // Example selectors based on your file
  // Organisation type dropdown
  const orgTypeSelect = $("#ctl00_ContentPlaceHolder1_ddlTypeofOrg");
  if (orgTypeSelect.length) {
    step2Fields.push({
      name: orgTypeSelect.attr("name"),
      type: "dropdown",
      id: orgTypeSelect.attr("id"),
      label: "Type of Organisation",
      options: orgTypeSelect
        .find("option")
        .map((i, el) => $(el).text().trim())
        .get()
        .filter((o) => o !== ""),
      required: true,
    });
  }

  // PAN Number
  const panInput = $("#ctl00_ContentPlaceHolder1_txtPan");
  if (panInput.length) {
    step2Fields.push({
      name: panInput.attr("name"),
      type: "text",
      id: panInput.attr("id"),
      label: "PAN Number",
      required: true,
      maxLength: Number(panInput.attr("maxlength")) || 10,
      pattern: "^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$",
    });
  }

  // Name as per PAN
  const namePanInput = $("#ctl00_ContentPlaceHolder1_txtPanName");
  if (namePanInput.length) {
    step2Fields.push({
      name: namePanInput.attr("name"),
      type: "text",
      id: namePanInput.attr("id"),
      label: "Name as per PAN",
      required: true,
      maxLength: Number(namePanInput.attr("maxlength")) || 100,
    });
  }

  // DOB or DOI
  const dobInput = $("#ctl00_ContentPlaceHolder1_txtdob");
  if (dobInput.length) {
    step2Fields.push({
      name: dobInput.attr("name"),
      type: "date",
      id: dobInput.attr("id"),
      label: "DOB or DOI as per PAN",
      required: true,
    });
  }

  // Consent
  const consentCheckbox2 = $("#ctl00_ContentPlaceHolder1_chkDecarationP");
  if (consentCheckbox2.length) {
    step2Fields.push({
      name: consentCheckbox2.attr("name"),
      type: "checkbox",
      id: consentCheckbox2.attr("id"),
      label: "Consent",
      required: true,
    });
  }

  console.log(`✅ Step 2 fields scraped from local HTML: ${step2Fields.length} fields`);

  // Save final schema
  const schema = { step1: { fields: step1Fields }, step2: { fields: step2Fields } };
  const outPath = path.join(__dirname, "../output/udyam-schema.json");
  await fs.ensureDir(path.dirname(outPath));
  await fs.writeJson(outPath, schema, { spaces: 2 });

  console.log(`🎯 Schema saved to ${outPath}`);
}

// Run scraper
scrape().catch((err) => {
  console.error("❌ Scraper failed:", err);
  process.exit(1);
});
