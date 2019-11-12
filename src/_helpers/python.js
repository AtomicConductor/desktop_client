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
  const conductorLocation = await tryExecute(
    executor,
    "echo $CONDUCTOR_LOCATION"
  );

  if (platform === "win32") {
    return conductorLocation
      ? `${conductorLocation}\\python\\python2.7.exe`
      : "C:\\Python27\\python.exe";
  }

  const python27Location = await tryExecute(executor, "which python2.7");
  return conductorLocation
    ? `${conductorLocation}/python/bin/python2.7`
    : python27Location;
};

const runPythonShell = async (script, options, shell = PythonShell) => {
  const scriptName = path.basename(script);
  let scriptPath = path.dirname(script);
  const pythonPath = options.pythonPath;

  try {
    await shell.getVersion(pythonPath);
  } catch (e) {
    throw new DesktopClientError("Invalid python location", e);
  }

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
    pythonOptions: ["-u"],
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

export { resolvePythonLocation, runPythonShell };
