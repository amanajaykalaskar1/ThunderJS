const express = require('express');
const path = require('path');
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


// Define a route to list JSON files in the "Modules" folder
app.get('/list-json', (req, res) => {
  const directoryPath = './Modules'; // Specify the "Modules" directory
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    const jsonFiles = files.filter(file => file.endsWith('.json'));

    // Read and send the JSON data from each file
    const jsonData = {};
    jsonFiles.forEach(fileName => {
      const jsonFilePath = path.join(directoryPath, fileName);
      const jsonDataContent = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));
      jsonData[fileName] = jsonDataContent;
    });

    res.json(jsonData);
  });
});


const ssh = require('./public/ssh');














// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
