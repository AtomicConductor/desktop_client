import { promisify } from "util";
import { exec } from "child_process";

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

export { resolvePythonLocation };
