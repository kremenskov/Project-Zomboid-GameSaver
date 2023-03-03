const fs = require('fs');
const path = require('path');

// determines day and time for name of the foulder
const currentDate = new Date();
const year = currentDate.getFullYear().toString();
const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
const day = currentDate.getDate().toString().padStart(2, '0');
const dateString = day + '.' + month + '.' + year;
const timeString = currentDate.toLocaleTimeString().replace(/:/g, '.');;

const fileName = ('savefile-'+ dateString +'-'+ timeString);

console.log("Finding last save...")


// find last modified folder that will be duplicated
const findLastModifiedFolder = (dir) => {
  let lastModifiedFolder = null;
  let lastModifiedTime = 0;

  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    const stats = fs.statSync(fullPath);
  
    if (stats.isDirectory()) {
      const currentModifiedTime = stats.mtimeMs;

      if (currentModifiedTime > lastModifiedTime) {
        lastModifiedFolder = fullPath;
        lastModifiedTime = currentModifiedTime;
      }
    }
  });

  return lastModifiedFolder;
}

dir = path.dirname(process.execPath)
const lastModifiedFolder = findLastModifiedFolder(dir); 

console.log("Creating new save file...")

// create new save foulder
const copyRecursive = (src, dest) => {
  const exist = fs.existsSync(src)
  const stats = exist && fs.statSync(src)
  const isDirectory = stats && stats.isDirectory();

  if(isDirectory) {
    if(!fs.existsSync(dest))
        fs.mkdirSync(dest);

      fs.readdirSync(src).forEach(childItemName => {
        copyRecursive(path.join(src,childItemName), path.join(dest, childItemName));
      });
  } else {
    if(!fs.existsSync(dest))
    fs.copyFileSync(src,dest)
  }
}

copyRecursive(lastModifiedFolder, (dir + '/' + fileName));

console.log("Game was saved")


