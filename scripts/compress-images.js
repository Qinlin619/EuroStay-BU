const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = path.join(__dirname, '../public/images/stories/历史活动');
const outputDir = path.join(inputDir, 'compressed');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

async function compressImages() {
    const files = fs.readdirSync(inputDir).filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.heic'].includes(ext);
    });

    console.log(`Found ${files.length} images to process.`);

    for (const file of files) {
        const inputPath = path.join(inputDir, file);
        const fileName = path.parse(file).name;
        const outputPath = path.join(outputDir, `${fileName}.jpg`);

        try {
            await sharp(inputPath)
                .resize(1200, 900, {
                    fit: 'cover',
                    position: 'center'
                })
                .jpeg({ quality: 80, progressive: true })
                .toFile(outputPath);
            console.log(`Processed: ${file} -> ${fileName}.jpg`);
        } catch (err) {
            console.error(`Error processing ${file}:`, err.message);
        }
    }
}

compressImages();
