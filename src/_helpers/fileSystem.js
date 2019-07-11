import fs from "fs";
import md5File from "md5-file";
import path from "upath";

export const exactFileExistsSync = (filePath, md5) => {
  try {
    fs.statSync(filePath).isFile();
  } catch (err) {
    // console.log(filePath + " is not a file");
    return false;
  }
  const calcMd5 = Buffer.from(md5File.sync(filePath), "hex").toString("base64");
  // console.log(calcMd5 + " === " + md5);
  return calcMd5 === md5;
};

export const ensureDirectoryReady = directory => {
  try {
    fs.accessSync(directory, fs.constants.W_OK);
    return true;
  } catch (err) {
    try {
      fs.mkdirSync(directory, { recursive: true });
      // make sure mkdir worked
      fs.accessSync(directory, fs.constants.W_OK);
      return true;
    } catch (err) {
      return false;
    }
  }
};

export const ensureDirectoryReadyFor = filePath => {
  return ensureDirectoryReady(path.dirname(filePath));
};

// if (fs.existsSync(filePath) && fs.lstatSync(filePath).isDirectory()) {
//   directory = filePath;
// }

export const directoryExistsSync = directory => {
  /** exists and is writable */
  try {
    fs.accessSync(directory, fs.constants.W_OK);
    return true;
  } catch (err) {
    return false;
  }
};
