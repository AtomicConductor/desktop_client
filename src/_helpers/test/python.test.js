import {
  isPythonPathValid,
  resolvePythonLocation,
  runPythonShell
} from "../python";
import DesktopClientError from "../../errors/desktopClientError";

describe("python helper", () => {
  let exec = jest.fn();

  describe("on windows", () => {
    it("returns default python path", async () => {
      exec = jest.fn();
      exec.mockImplementationOnce((cmd, cb) => cb(null, { stdout: "" }));

      const path = await resolvePythonLocation(exec, "win32");

      expect(path).toBe("C:\\Python27\\python.exe");
    });
  });

  describe("on linux and mac", () => {
    it("returns default python path", async () => {
      exec = jest.fn();
      exec.mockImplementationOnce((_, cb) => cb(null, { stdout: "/usr/bin" }));
      const path = await resolvePythonLocation(exec, "linux");
      expect(path).toBe("/usr/bin");
    });
  });

  describe("isPythonPathValid", () => {
    let exec = jest.fn();

    it("returns false when python not in basename", async () => {
      exec = jest.fn();
      exec.mockImplementationOnce((_, cb) => cb(null, { stdout: "3.7.5" }));
      const valid = await isPythonPathValid("/some/location/foo.bar", exec);
      expect(valid).toBe(false);
    });

    it("returns false when exec throws an error", async () => {
      exec = jest.fn();
      exec.mockImplementationOnce(() => {
        throw new Error();
      });
      const valid = await isPythonPathValid("/some/location/python.exe", exec);
      expect(valid).toBe(false);
    });

    it("returns false when exec returns wrong version", async () => {
      exec = jest.fn();
      exec.mockImplementationOnce((_, cb) => cb(null, { stdout: "3.7.5" }));
      const valid = await isPythonPathValid("/some/location/python.exe", exec);
      expect(valid).toBe(false);
    });

    it("returns true when exec returns 2.7.?", async () => {
      exec = jest.fn();
      exec.mockImplementationOnce((_, cb) => cb(null, { stdout: "2.7.5" }));
      const valid = await isPythonPathValid("/some/location/python.exe", exec);

      expect(valid).toBe(true);
    });
  });

  describe("runPythonShell", () => {
    const defaultOpts = (overrides = {}) => ({
      mode: "text",
      pythonOptions: ["-u"],
      pythonPath: "/some/location",
      ...overrides
    });

    const PythonShell = jest.fn().mockImplementation(() => {
      return {
        childProcess: { pid: 1 }
      };
    });

    beforeEach(() => {
      PythonShell.mockClear();
    });

    it("splits an absolute path", async () => {
      await runPythonShell("/path/to/script.py", defaultOpts(), PythonShell);
      expect(PythonShell).toHaveBeenCalledWith(
        "script.py",
        expect.objectContaining({
          scriptPath: "/path/to"
        })
      );
    });

    it("uses default path when given a script name", async () => {
      await runPythonShell("script.py", defaultOpts(), PythonShell);
      expect(PythonShell).toHaveBeenCalledWith(
        "script.py",
        expect.objectContaining({
          scriptPath: expect.stringMatching(/test\/python/)
        })
      );
    });

    it("appends to default path when given a relative script path", async () => {
      await runPythonShell("path/to/script.py", defaultOpts(), PythonShell);
      expect(PythonShell).toHaveBeenCalledWith(
        "script.py",
        expect.objectContaining({
          scriptPath: expect.stringMatching(/test\/python\/path\/to/)
        })
      );
    });

    it("raises DesktopClientError when pid is undefined", async () => {
      PythonShell.mockImplementationOnce(() => {
        return {
          childProcess: { pid: undefined }
        };
      });

      await expect(
        runPythonShell("script", defaultOpts(), PythonShell)
      ).rejects.toThrow(DesktopClientError);
    });

    it("resolves when input is valid", async () => {
      await expect(
        runPythonShell("script", defaultOpts(), PythonShell)
      ).resolves.toEqual({ childProcess: { pid: 1 } });
    });
  });
});
