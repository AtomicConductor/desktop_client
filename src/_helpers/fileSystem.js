import fs from "fs";
import md5File from "md5-file";
import path from "upath";

export const exactFileExistsSync = (filePath, md5) => {
  try {
    fs.statSync(filePath).isFile();
  } catch (err) {
    console.log(filePath + " is not a file");
    return false;
  }
  const calcMd5 = Buffer.from(md5File.sync(filePath), "hex").toString("base64");
  console.log(calcMd5 + " === " + md5);
  return calcMd5 === md5;
};

export const ensureDirectoryReadyFor = filePath => {
  const directory = path.dirname(filePath);
  try {
    fs.accessSync(directory, fs.constants.W_OK);
    return true;
  } catch (err) {
    fs.mkdirSync(directory, { recursive: true });
    try {
      fs.accessSync(directory, fs.constants.W_OK);
      return true;
    } catch (err) {
      return false;
    }
  }
};

export const directoryExistsSync = directory => {
  try {
    fs.accessSync(directory, fs.constants.W_OK);
    return true;
  } catch (err) {
    return false;
  }
};
