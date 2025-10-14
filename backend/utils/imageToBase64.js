const fs = require('fs');
const path = require('path');

function imageToBase64(imagePath) {
  try {
    const image = fs.readFileSync(imagePath);
    return `data:image/png;base64,${image.toString('base64')}`;
  } catch (error) {
    console.error('Error reading image:', error);
    return null;
  }
}

module.exports = imageToBase64;
