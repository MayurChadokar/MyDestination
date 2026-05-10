const fs = require('fs');
const path = require('path');

function getFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getFiles(fullPath, files);
    } else {
      files.push(fullPath);
    }
  });
  return files;
}

const dir1 = process.argv[2];
const dir2 = process.argv[3];

const files1 = getFiles(dir1).map(f => path.relative(dir1, f));
const files2 = getFiles(dir2).map(f => path.relative(dir2, f));

const set1 = new Set(files1);
const set2 = new Set(files2);

const missingIn2 = files1.filter(f => !set2.has(f));
const missingIn1 = files2.filter(f => !set1.has(f));

console.log("Missing in " + dir2 + ":", missingIn2.length > 0 ? missingIn2 : "None");
console.log("Missing in " + dir1 + ":", missingIn1.length > 0 ? missingIn1 : "None");
