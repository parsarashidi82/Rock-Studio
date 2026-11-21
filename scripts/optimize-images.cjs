const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function optimize() {
  const projectsDir = path.join(__dirname, '..', 'src', 'assets', 'projects');
  const assetsDir = path.join(__dirname, '..', 'src', 'assets');

  const files = [
    { dir: projectsDir, file: 'uppercapedentistry-full.png', out: 'uppercapedentistry-full.webp', maxW: 1600 },
    { dir: projectsDir, file: 'nik.marketing.png', out: 'nik-marketing-full.webp', maxW: 1600 },
    { dir: projectsDir, file: 'carcareevolution-full.png', out: 'carcareevolution-full.webp', maxW: 1600 },
    { dir: projectsDir, file: 'artamed-full.png', out: 'artamed-full.webp', maxW: 1600 },
    { dir: projectsDir, file: 'DevConnect-full.png', out: 'DevConnect-full.webp', maxW: 1600 },
    { dir: projectsDir, file: 'nik-marketing-thumb.png', out: 'nik-marketing-thumb.webp', maxW: 800 },
    { dir: projectsDir, file: 'jam-42-thumb.png', out: 'jam-42-thumb.webp', maxW: 800 },
    { dir: projectsDir, file: 'motorality-thumb.png', out: 'motorality-thumb.webp', maxW: 800 },
    { dir: projectsDir, file: 'festival-start-thumb.png', out: 'festival-start-thumb.webp', maxW: 800 },
    { dir: projectsDir, file: 'Badam-Fit-img.png', out: 'Badam-Fit-img.webp', maxW: 800 },
    { dir: projectsDir, file: 'babam-fit-cover.png', out: 'babam-fit-cover.webp', maxW: 800 },
    { dir: projectsDir, file: 'national-camp-australia-thumb.png', out: 'national-camp-australia-thumb.webp', maxW: 800 },
    { dir: assetsDir, file: 'team.jpg', out: 'team.webp', maxW: 1400 },
    { dir: assetsDir, file: 'nima.jpg', out: 'nima.webp', maxW: 600 },
    { dir: assetsDir, file: 'parsa.jpg', out: 'parsa.webp', maxW: 600 },
    { dir: assetsDir, file: 'saman.jpg', out: 'saman.webp', maxW: 600 }
  ];

  console.log('Starting optimization of', files.length, 'images...');
  for (const item of files) {
    const inputPath = path.join(item.dir, item.file);
    const outputPath = path.join(item.dir, item.out);
    if (!fs.existsSync(inputPath)) {
      console.log('Skipping missing:', item.file);
      continue;
    }
    const meta = await sharp(inputPath).metadata();
    const origSize = fs.statSync(inputPath).size / 1024;
    let pipeline = sharp(inputPath);
    if (meta.width && meta.width > item.maxW) {
      pipeline = pipeline.resize({ width: item.maxW, withoutEnlargement: true });
    }
    await pipeline
      .webp({ quality: 82, effort: 5 })
      .toFile(outputPath);
    const newSize = fs.statSync(outputPath).size / 1024;
    const saving = Math.round((1 - newSize / origSize) * 100);
    console.log(`[OPTIMIZED] ${item.file} (${Math.round(origSize)}KB) -> ${item.out} (${Math.round(newSize)}KB) [${saving}% reduction]`);
  }
}

optimize().catch(console.error);
