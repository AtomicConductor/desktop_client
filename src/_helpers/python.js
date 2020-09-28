import { promisify } from "util";
import { exec } from "child_process";
import { PythonShell } from "python-shell";
import DesktopClientError from "../errors/desktopClientError";
import path from "upath";
import config from "../config";

const PYTHON_VERSION_REGEX = /^2\.7\.(\d+)$/i;

const tryExecute = async (executor, cmd) => {
  try {
    let { stdout } = await promisify(executor)(cmd);
    return stdout.trim() || null;
  } catch (e) {
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

const isPythonPathValid = async (pythonPath, executor = exec) => {
  pythonPath = pythonPath.trim();
  if (!path.basename(pythonPath).includes("python")) {
    return false;
  }

  const version = await tryExecute(
    executor,
    `"${pythonPath}" -c "import platform; print(platform.python_version())"`
  );

  if (!version) {
    return false;
  }

  const match = version.match(PYTHON_VERSION_REGEX);
  if (!match) {
    return false;
  }
  if (Number(match[1]) < 10) {
    return false;
  }

  return true;
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
