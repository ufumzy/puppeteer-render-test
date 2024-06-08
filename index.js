const express = require("express");
const { scrapeLogic } = require("./scrapeLogic");
const { convertLogic } = require("./convertlogic"); // Import convertLogic
const app = express();

const PORT = process.env.PORT || 4000;

app.get("/scrape", (req, res) => {
  scrapeLogic(res);
});


app.get("/convertcode", async (req, res) => { // New endpoint for convertcode
  try {
    await convertLogic(res);
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
});

app.get("/", (req, res) => {
  res.send("Render Puppeteer server is up and running!");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
