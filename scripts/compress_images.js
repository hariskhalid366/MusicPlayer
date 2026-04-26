const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const assetDirs = [
  './assets',
  './assets/bootsplash'
];

const optimizeImage = async (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  if (!['.png', '.jpg', '.jpeg'].includes(ext)) return;

  const tempPath = filePath + '.tmp';

  try {
    const s = sharp(filePath);
    if (ext === '.png') {
      await s.png({ quality: 80, compressionLevel: 9 }).toFile(tempPath);
    } else {
      await s.jpeg({ quality: 80, progressive: true }).toFile(tempPath);
    }

    const oldSize = fs.statSync(filePath).size;
    const newSize = fs.statSync(tempPath).size;

    if (newSize < oldSize) {
      fs.renameSync(tempPath, filePath);
      console.log(`Optimized ${path.basename(filePath)}: ${Math.round((1 - newSize / oldSize) * 100)}% reduction`);
    } else {
      fs.unlinkSync(tempPath);
    }
  } catch (err) {
    if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
  }
};

const run = async () => {
  for (const dir of assetDirs) {
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isFile()) await optimizeImage(fullPath);
    }
  }
};

console.log('Compressing images...');
run().then(() => console.log('Done!'));
