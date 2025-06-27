
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads'),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

app.post('/upload', upload.single('file'), (req, res) => {
  res.json({ filename: req.file.filename });
});

app.get('/file/:name', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'uploads', req.params.name);
  if (!fs.existsSync(filePath)) return res.status(404).send('File not found');

  const ext = path.extname(filePath);
  if (['.png', '.jpg', '.jpeg', '.gif', '.webp'].includes(ext)) {
    res.sendFile(filePath);
  } else if (['.txt', '.md', '.json', '.js', '.css', '.html'].includes(ext)) {
    res.setHeader('Content-Type', 'text/plain');
    res.send(fs.readFileSync(filePath, 'utf-8'));
  } else {
    res.sendFile(filePath);
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
