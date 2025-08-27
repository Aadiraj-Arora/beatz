const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

// Enable CORS for all routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Serve static files from the current directory
app.use(express.static(__dirname));

// Route to list files in a directory
app.get('/:folder/', (req, res) => {
  const folderPath = path.join(__dirname, req.params.folder);
  
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      return res.status(500).send(`Error reading directory: ${err.message}`);
    }
    
    let fileList = '<ul>';
    files.forEach(file => {
      const filePath = path.join(req.params.folder, file);
      fileList += `<li><a href="${filePath}">${file}</a></li>`;
    });
    fileList += '</ul>';
    
    res.send(fileList);
  });
});

// Route to list subdirectories in songs directory
app.get('/songs/', (req, res) => {
  const songsPath = path.join(__dirname, 'songs');
  
  fs.readdir(songsPath, (err, files) => {
    if (err) {
      return res.status(500).send(`Error reading songs directory: ${err.message}`);
    }
    
    let dirList = '<ul>';
    files.forEach(file => {
      const filePath = path.join('songs', file);
      const fullPath = path.join(songsPath, file);
      const isDir = fs.statSync(fullPath).isDirectory();
      
      if (isDir) {
        dirList += `<li><a href="${filePath}/">${file}/</a></li>`;
      }
    });
    dirList += '</ul>';
    
    res.send(dirList);
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});