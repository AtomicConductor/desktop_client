import { credentialsFileName } from "../_helpers/constants";
import * as fs from "fs";
import { promisify } from "util";
import { join } from "path";

export default class AppStorage {
  constructor(appProvider = nw, fileProvider = fs) {
    this.dataPath = appProvider.App.dataPath;
    this.fileProvider = fileProvider;
  }

  async save(path, data) {
    await promisify(this.fileProvider.writeFile)(path, JSON.stringify(data));
  }

  async load(path) {
    const data = await promisify(this.fileProvider.readFile)(path);
    return JSON.parse(data.toString());
  }

  async saveCredentials(data) {
    const credentials = await this.readCredentials();
    const mergedCredentials = { ...credentials, ...data };
    const path = join(this.dataPath, credentialsFileName);
    await this.save(path, mergedCredentials);
  }

  async readCredentials() {
    const path = join(this.dataPath, credentialsFileName);

    const { exists } = this.fileProvider;
    if (!(await promisify(exists)(path))) {
      return undefined;
    }
    return await this.load(path);
  }
}
