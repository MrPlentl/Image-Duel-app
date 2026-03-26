import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';

const app = express();
app.use(cors());
app.use(express.json());

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.tiff', '.bmp']);

// Store the active folder path in memory for this session
let activeFolderPath: string = '';

// POST /api/scan — scan a folder for images
app.post('/api/scan', (req: Request, res: Response) => {
  const { folderPath } = req.body as { folderPath: string };

  if (!folderPath) {
    return res.status(400).json({ error: 'No folder path provided.' });
  }

  const resolved = path.resolve(folderPath);

  if (!fs.existsSync(resolved)) {
    return res.status(404).json({ error: `Folder not found: ${resolved}` });
  }

  const stat = fs.statSync(resolved);
  if (!stat.isDirectory()) {
    return res.status(400).json({ error: 'Path is not a directory.' });
  }

  try {
    const entries = fs.readdirSync(resolved);
    const images = entries
      .filter((file) => {
        const ext = path.extname(file).toLowerCase();
        return IMAGE_EXTENSIONS.has(ext);
      })
      .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

    if (images.length === 0) {
      return res.status(400).json({ error: 'No supported images found in this folder.' });
    }

    activeFolderPath = resolved;
    return res.json({ images, folderPath: resolved, count: images.length });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to read folder contents.' });
  }
});

// GET /api/image?file=filename.jpg — serve an image from the active folder
app.get('/api/image', (req: Request, res: Response) => {
  const filename = req.query.file as string;

  if (!filename || !activeFolderPath) {
    return res.status(400).json({ error: 'No file specified or no active folder.' });
  }

  // Security: prevent directory traversal
  const safeName = path.basename(filename);
  const filePath = path.join(activeFolderPath, safeName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Image not found.' });
  }

  return res.sendFile(filePath);
});

// POST /api/save — copy selected images to a BEST subfolder
app.post('/api/save', (req: Request, res: Response) => {
  const { folderPath, images } = req.body as { folderPath: string; images: string[] };

  if (!folderPath || !images || !Array.isArray(images) || images.length === 0) {
    return res.status(400).json({ error: 'Invalid save request.' });
  }

  const resolved = path.resolve(folderPath);
  const bestFolder = path.join(resolved, 'BEST');

  try {
    if (!fs.existsSync(bestFolder)) {
      fs.mkdirSync(bestFolder, { recursive: true });
    }

    const saved: string[] = [];
    for (const img of images) {
      const safeName = path.basename(img);
      const src = path.join(resolved, safeName);
      const dest = path.join(bestFolder, safeName);
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
        saved.push(safeName);
      }
    }

    return res.json({ success: true, bestFolder, saved });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to save images.' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`\n🖼  Photo Culler server running at http://localhost:${PORT}\n`);
});
