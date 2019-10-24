import { credentialsFileName } from "../_helpers/constants";
import * as fs from "fs";
import { promisify } from "util";
import { join } from "path";

export default class AppStorage {
  constructor(appProvider = nw, fileProvider = fs) {
    this.dataPath = appProvider.App.dataPath;
    this.fileProvider = fileProvider;
  }

  async save(file, data) {
    await promisify(this.fileProvider.writeFile)(
      join(this.dataPath, file),
      JSON.stringify(data)
    );
  }

  async load(file) {
    const data = await promisify(this.fileProvider.readFile)(
      join(this.dataPath, file)
    );
    return JSON.parse(data.toString());
  }

  async saveCredentials(data) {
    const credentials = await this.readCredentials();
    const mergedCredentials = { ...credentials, ...data };

    await this.save(credentialsFileName, mergedCredentials);
  }

  async readCredentials() {
    const { exists } = this.fileProvider;
    const credentialsFileExists = await promisify(exists)(
      join(this.dataPath, credentialsFileName)
    );
    if (!credentialsFileExists) {
      return undefined;
    }

    return await this.load(credentialsFileName);
  }
}
