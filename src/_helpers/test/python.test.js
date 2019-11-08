import { resolvePythonLocation } from "../python";

describe("python helper", () => {
  let exec = jest.fn();

  describe("on windows", () => {
    it("returns client tools' python path", async () => {
      const executorResult = { stdout: "conductor\\path" };
      exec.mockImplementationOnce((cmd, cb) => {
        expect(cmd).toBe("echo $CONDUCTOR_LOCATION");
        cb(null, executorResult);
      });

      const path = await resolvePythonLocation(exec, "win32");

      expect(path).toBe("conductor\\path\\python\\python2.7.exe");
    });

    it("returns default python path if client tools are not installed", async () => {
      exec.mockImplementationOnce((cmd, cb) => cb(null, { stdout: "" }));

      const path = await resolvePythonLocation(exec, "win32");

      expect(path).toBe("C:\\Python27\\python.exe");
    });
  });

  describe("on linux and mac", () => {
    it("returns client tools' python path", async () => {
      const executorResult = { stdout: "conductor/path" };
      exec
        .mockImplementationOnce((_, cb) => cb(null, executorResult))
        .mockImplementationOnce((_, cb) => cb(null, { stdout: "" }));

      const path = await resolvePythonLocation(exec, "darwin");

      expect(path).toBe("conductor/path/python/bin/python2.7");
    });

    it("returns default python path if client tools are not installed", async () => {
      exec
        .mockImplementationOnce((_, cb) => cb(null, { stdout: "" }))
        .mockImplementationOnce((cmd, cb) => {
          expect(cmd).toBe("which python2.7");
          cb(null, { stdout: "/usr/bin" });
        });

      const path = await resolvePythonLocation(exec, "linux");

      expect(path).toBe("/usr/bin");
    });
  });
});
