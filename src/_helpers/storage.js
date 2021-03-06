import { credentialsFileName, presetsFileName } from "../_helpers/constants";
import * as fs from "fs";
import { promisify } from "util";
import { join, dirname, basename } from "path";
import * as os from "os";

export default class AppStorage {
  constructor(appProvider = nw, fileProvider = fs) {
    this.dataPath = appProvider.App.dataPath;
    this.fileProvider = fileProvider;
  }

  async saveRaw(path, content) {
    await promisify(this.fileProvider.writeFile)(path, content);
  }

  async save(path, data) {
    await promisify(this.fileProvider.writeFile)(path, JSON.stringify(data));
  }

  async savePretty(path, data) {
    await promisify(this.fileProvider.writeFile)(
      path,
      JSON.stringify(data, null, "\t")
    );
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
    try {
      return await this.load(path);
    } catch {
      return undefined;
    }
  }

  async exportSubmissionScript(path, script, payload) {
    const payloadPath = `${join(dirname(path), basename(path, ".py"))}.json`;
    await this.savePretty(payloadPath, payload);
    await this.saveRaw(path, script);
  }

  async saveCredentials(data) {
    await this.saveData(data, credentialsFileName);
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
    const { mkdir } = this.fileProvider;

    await promisify(mkdir)(directory, { recursive: true });
    await this.save(path, credentials);
  }
}
