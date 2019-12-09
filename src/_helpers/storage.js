import { credentialsFileName, presetsFileName } from "../_helpers/constants";
import * as fs from "fs";
import { promisify } from "util";
import { join, dirname } from "path";
import * as os from "os";

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

  async saveData(data, filename) {
    const path = join(this.dataPath, filename);
    await this.save(path, data);
  }

  async loadData(filename) {
    const path = join(this.dataPath, filename);

    const { exists } = this.fileProvider;
    if (!(await promisify(exists)(path))) {
      return undefined;
    }
    return await this.load(path);
  }

  async saveCredentials(data) {
    const credentials = await this.readCredentials();
    const mergedCredentials = { ...credentials, ...data };
    await this.saveData(mergedCredentials, credentialsFileName);
  }

  async readCredentials() {
    return await this.loadData(credentialsFileName);
  }

  async savePresets(data) {
    const templates = await this.loadPresets();
    const mergedTemplates = { ...templates, ...data };
    await this.saveData(mergedTemplates, presetsFileName);
  }

  async loadPresets() {
    return await this.loadData(presetsFileName);
  }

  async deletePreset(key) {
    const templates = await this.loadPresets();
    delete templates[key];
    await this.saveData(templates, presetsFileName);
  }

  async writeClientToolsCredentials(credentials, { homedir } = os) {
    const path = join(homedir(), ".config", "conductor", "credentials");
    const directory = dirname(path);
    const { exists, mkdir } = this.fileProvider;

    const credentialsDirectoryExists = await promisify(exists)(directory);
    if (!credentialsDirectoryExists) {
      await promisify(mkdir)(directory);
    }

    await this.save(path, credentials);
  }
}
