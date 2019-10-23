import { credentialsFileName } from "../_helpers/constants";
import * as fs from "fs";
import { promisify } from "util";
import { join } from "path";

export default class AppStorage {
  constructor(appProvider = nw, fileProvider = fs) {
    const dataPath = appProvider.App.dataPath;
    this.fileProvider = fileProvider;
    this.credentialsFilePath = join(dataPath, credentialsFileName);
  }

  async saveCredentials(data) {
    const { writeFile } = this.fileProvider;
    const credentials = await this.readCredentials();
    const mergedCredentials = { ...credentials, ...data };
    await promisify(writeFile)(
      this.credentialsFilePath,
      JSON.stringify(mergedCredentials)
    );
  }

  async readCredentials() {
    const { exists, readFile } = this.fileProvider;
    const credentialsFileExists = await promisify(exists)(
      this.credentialsFilePath
    );
    if (!credentialsFileExists) {
      return undefined;
    }

    const data = await promisify(readFile)(this.credentialsFilePath);
    return JSON.parse(data.toString());
  }
}
