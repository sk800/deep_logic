const axios = require("axios");
const express = require("express");
const app = express();
const port = 3000; // You can change the port number if needed
const websiteUrl = "https://time.com";

// Define a GET route
app.get("/",(req,res)=>{
    res.send(`<h1>
        <a href="http://localhost:3000/getTimeStories">Get the top stories</a>
    </h1>`);
})
app.get("/getTimeStories", async (req, res) => {
  try {
    const data = await fetchAndParseHTML(websiteUrl);
    // console.log(data);
    res.send(data);
  } catch (err) {
    console.log(err);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

function parseHTML(html) {
  const elements = [];
  const regex =
    /<li class="latest-stories__item">[\s\S]*?<a href="([^"]+)">[\s\S]*?<h3 class="latest-stories__item-headline">(.*?)<\/h3>/g;

  let match;
  while ((match = regex.exec(html)) !== null) {
    const href = match[1];
    const title = match[2].trim();
    const link = `${websiteUrl}${href}`
    elements.push({  title, link });
  }

  return elements;
}
async function fetchAndParseHTML(url) {
  try {
    // Fetch HTML content
    const response = await axios.get(url);
    const html = response.data;
    const data = parseHTML(html);
    return data;
  } catch (error) {
    console.error("Error fetching or parsing HTML:", error);
    return null;
  }
}