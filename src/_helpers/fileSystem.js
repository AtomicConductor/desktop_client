import { constants, promises } from "fs";
import md5File from "md5-file";
import DesktopClientError from "../errors/desktopClientError";
import { promisify } from "util";
const { mkdir, access } = promises;

export const exactFileExists = async (filePath, md5) => {
  try {
    const hash = await promisify(md5File)(filePath);
    return md5 === Buffer.from(hash, "hex").toString("base64");
  } catch (err) {
    return false;
  }
};

export const ensureDirectoryReady = async directory => {
  try {
    await mkdir(directory, { recursive: true });
    return true;
  } catch (err) {
    return false;
  }
};

export const pathExists = async path => {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch (e) {
    const { code } = e;
    if (code === "ENOENT") return false;
    throw new DesktopClientError("File check failed.", e);
  }
};
