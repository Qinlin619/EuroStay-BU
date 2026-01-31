/**
 * 等比缩小并压缩 public/images 下的 PNG/JPG/JPEG 图片
 * - 最大边长 1200px（等比缩放）
 * - JPEG 质量 82，PNG 压缩
 */

const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images');
const MAX_DIMENSION = 1200;
const JPEG_QUALITY = 82;
const PNG_COMPRESSION = 9;

const EXTENSIONS = /\.(png|jpg|jpeg|PNG|JPG|JPEG)$/;

function getAllImagePaths(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      getAllImagePaths(full, files);
    } else if (EXTENSIONS.test(item)) {
      files.push(full);
    }
  }
  return files;
}

async function optimizeImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const isJpeg = ext === '.jpg' || ext === '.jpeg';
  const meta = await sharp(filePath).metadata();
  const { width, height } = meta;
  const needResize = width > MAX_DIMENSION || height > MAX_DIMENSION;

  let pipeline = sharp(filePath);

  if (needResize) {
    const scale = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
    const newW = Math.round(width * scale);
    const newH = Math.round(height * scale);
    pipeline = pipeline.resize(newW, newH, { fit: 'inside', withoutEnlargement: true });
  }

  if (isJpeg) {
    pipeline = pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true });
  } else {
    pipeline = pipeline.png({ compressionLevel: PNG_COMPRESSION });
  }

  const before = fs.statSync(filePath).size;
  const tmpPath = filePath + '.tmp.' + (isJpeg ? 'jpg' : 'png');
  await pipeline.toFile(tmpPath);
  fs.renameSync(tmpPath, filePath);
  const after = fs.statSync(filePath).size;
  const saved = ((1 - after / before) * 100).toFixed(1);
  return { before, after, saved };
}

async function main() {
  const files = getAllImagePaths(IMAGES_DIR);
  console.log(`找到 ${files.length} 张图片，开始处理...\n`);

  let totalBefore = 0;
  let totalAfter = 0;

  for (const filePath of files) {
    try {
      const rel = path.relative(IMAGES_DIR, filePath);
      const result = await optimizeImage(filePath);
      totalBefore += result.before;
      totalAfter += result.after;
      console.log(`${rel} 节省 ${result.saved}%`);
    } catch (err) {
      console.error(`失败 ${filePath}:`, err.message);
    }
  }

  const totalSaved = ((1 - totalAfter / totalBefore) * 100).toFixed(1);
  console.log(`\n完成。总大小: ${(totalBefore / 1024 / 1024).toFixed(2)} MB -> ${(totalAfter / 1024 / 1024).toFixed(2)} MB，节省 ${totalSaved}%`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
