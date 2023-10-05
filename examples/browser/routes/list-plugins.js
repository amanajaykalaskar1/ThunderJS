const fs = require('fs');
const path = require('path');

function handleListJson(req, res, next) {
  const directoryPath = './routes/Modules'; // Specify the "Modules" directory

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
}

module.exports = handleListJson;
