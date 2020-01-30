import { statSync, access, accessSync, mkdirSync, constants } from "fs";
import { promisify } from "util";
import md5File from "md5-file";
import DesktopClientError from "../errors/desktopClientError";

export const exactFileExistsSync = (filePath, md5) => {
  try {
    statSync(filePath).isFile();
  } catch (err) {
    return false;
  }
  const calcMd5 = Buffer.from(md5File.sync(filePath), "hex").toString("base64");
  return calcMd5 === md5;
};

export const ensureDirectoryReady = directory => {
  try {
    accessSync(directory, constants.W_OK);
    return true;
  } catch (err) {
    try {
      mkdirSync(directory, { recursive: true });
      // make sure mkdir worked
      accessSync(directory, constants.W_OK);
      return true;
    } catch (err) {
      return false;
    }
  }
};

export const directoryExistsSync = directory => {
  /** exists and is writable */
  try {
    accessSync(directory, constants.W_OK);
    return true;
  } catch (err) {
    return false;
  }
};

export const pathExists = async path => {
  try {
    await promisify(access)(path, constants.F_OK);
    return true;
  } catch (e) {
    const { code } = e;
    if (code === "ENOENT") return false;
    throw new DesktopClientError("File check failed.", e);
  }
};
