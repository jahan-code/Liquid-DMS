const fs = require('fs');
const path = require('path');

const readTemplate = (relativePath) => {
    const fullPath = path.join(__dirname, '..', relativePath);
    return fs.readFileSync(fullPath, 'utf8');
};

module.exports = readTemplate;
