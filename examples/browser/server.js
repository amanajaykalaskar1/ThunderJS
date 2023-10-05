const express = require('express');
const path = require('path');
const puppeteer = require('puppeteer');
const bodyParser = require('body-parser');

const app = express();

const port = process.env.PORT || 3000;

// const __dirname = './';

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Define a route for the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// // Start the server
// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });





// const express = require('express');
const fs = require('fs');
// const path = require('path');
// const app = express();
// const port = process.env.PORT || 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));




app.use(express.json());

app.post('/generate-pdf', async (req, res) => {
  const { contentToConvert } = req.body;

  try {
    const browser = await puppeteer.launch({ headless: 'new' }); // Set headless to true
    const page = await browser.newPage();


    // Set content to the page
    await page.setContent(contentToConvert);

    // Generate PDF
    const pdfBuffer = await page.pdf({ format: 'A4' });

    // Send the PDF as a response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=generated.pdf');
    res.send(pdfBuffer);

    // Close the browser
    await browser.close();
  } catch (error) {
    console.error(error);
    res.status(500).send('Error generating PDF');
  }
});


// Import the route handler function
const handleListJson = require('./routes/list-plugins');
app.get('/list-json', handleListJson);

// const bodyParser = require('body-parser');

app.use(bodyParser.text());// Middleware to parse plain text data

// Define a POST endpoint to receive the string from the client
app.post('/save-string', (req, res) => {
  const clientString = req.body; // Access the plain text data sent by the client
  // Process the string or save it as needed
  console.log('Received string from client:', clientString);
  res.send('String received and processed successfully.');
});



// const api1Routes = require('./routes/api1') //imported api1

// app.use('./routes/api1', api1Routes);



// const ssh = require('./src/ssh');














// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
