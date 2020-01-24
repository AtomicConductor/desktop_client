import { promisify } from "util";
import { exec } from "child_process";
import { PythonShell } from "python-shell";
import DesktopClientError from "../errors/desktopClientError";
import path from "upath";
import config from "../config";

const tryExecute = async (executor, cmd) => {
  try {
    let { stdout } = await promisify(executor)(cmd);
    return stdout.trim() || null;
  } catch (e) {
    console.log(e);
    return null;
  }
};

const resolvePythonLocation = async (
  executor = exec,
  platform = process.platform
) => {
  if (platform === "win32") {
    return "C:\\Python27\\python.exe";
  }
  return await tryExecute(executor, "which python2.7");
};

const isPythonPathValid = async (pythonPath, shell = PythonShell) => {
  try {
    let result = await shell.getVersion(pythonPath);
    const { stdout, stderr } = result;
    return (stdout || stderr).includes("2.7");
  } catch {
    return false;
  }
};

const runPythonShell = async (script, options, shell = PythonShell) => {
  const scriptName = path.basename(script);
  let scriptPath = path.dirname(script);
  const pythonPath = options.pythonPath;

  if (!path.isAbsolute(scriptPath)) {
    scriptPath = path.join(
      process.cwd(),
      ...config.public,
      "python",
      scriptPath
    );
  }

  const opts = {
    mode: "text",
    scriptPath,
    pythonPath,
    ...options
  };

  let pyshell = new shell(scriptName, opts);
  if (!pyshell.childProcess.pid) {
    throw new DesktopClientError("PythonShell failed to start a child process");
  }

  return pyshell;
};

export { isPythonPathValid, resolvePythonLocation, runPythonShell };
