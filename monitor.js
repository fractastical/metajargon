const puppeteer = require('puppeteer');

async function monitor() {
  // Launch a new browser instance
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  console.log("loading...");

  // Set up event listeners for console logs and errors
  page.on('console', (msg) => console.log('Page log:', msg.text()));
  page.on('pageerror', ({ message }) => console.log('Page error:', message));

  // Navigate to your web app
  await page.goto('http://localhost:3000');

  await page.evaluate(() => {
    window.playJourney();
  });

  // Interact with the cubes and perform checks
  // Example: click a button to start the journey, check if audio is playing, etc.
  await new Promise((resolve) => setTimeout(resolve, 1000 * 60 * 2)); // Wait for 2 minutes

  // Close the browser instance
  await browser.close();
}

// Continuously run the monitoring function
setInterval(async () => {
  console.log('Running monitoring check...');
  await monitor();
}, 1000 * 60 * 5); // Run the monitoring check every 5 minutes
