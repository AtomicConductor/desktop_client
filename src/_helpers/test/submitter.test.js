import {
  resolveTasks,
  resolvePackages,
  resolveEnvironment
} from "../submitter";

describe("submitter helpers", () => {
  describe("resolveTasks", () => {
    it("renders a single task", () => {
      const result = resolveTasks("command -s <chunk_start>", "1");
      expect(result).toEqual([{ command: "command -s 1", frames: "1" }]);
    });

    it("renders a task with no tokens", () => {
      const result = resolveTasks("command", "1");
      expect(result).toEqual([{ command: "command", frames: "1" }]);
    });

    it("renders many of the same tokens", () => {
      const result = resolveTasks(
        "command -s <chunk_start> <chunk_start>",
        "1"
      );
      expect(result).toEqual([{ command: "command -s 1 1", frames: "1" }]);
    });

    it("renders many tokens", () => {
      const result = resolveTasks(
        "command -s <chunk_start> -e <chunk_end>",
        "1"
      );
      expect(result).toEqual([{ command: "command -s 1 -e 1", frames: "1" }]);
    });

    it("renders inclusive range", () => {
      const result = resolveTasks("command -s <chunk_start>", "1-3");
      expect(result).toEqual([
        { command: "command -s 1", frames: "1" },
        { command: "command -s 2", frames: "2" },
        { command: "command -s 3", frames: "3" }
      ]);
    });

    it("renders range with step", () => {
      const result = resolveTasks("command -s <chunk_start>", "1-5x2");
      expect(result).toEqual([
        { command: "command -s 1", frames: "1" },
        { command: "command -s 3", frames: "3" },
        { command: "command -s 5", frames: "5" }
      ]);
    });

    it("sorts first and last", () => {
      const result = resolveTasks("command -s <chunk_start>", "3-1");
      expect(result).toEqual([
        { command: "command -s 1", frames: "1" },
        { command: "command -s 2", frames: "2" },
        { command: "command -s 3", frames: "3" }
      ]);
    });

    it("handles many progressions separated by commas and or white space", () => {
      const result = resolveTasks(
        "command -s <chunk_start>",
        "1, 4-10 20-30x3"
      );
      expect(result).toHaveLength(12);
      expect(result[0]).toEqual({ command: "command -s 1", frames: "1" });
      expect(result[11]).toEqual({ command: "command -s 29", frames: "29" });
    });

    it("removes duplicates", () => {
      const result = resolveTasks("command -s <chunk_start>", "4-8 , 7-10");
      expect(result).toHaveLength(7);
    });

    it("creates chunks", () => {
      const result = resolveTasks(
        "command -s <chunk_start> -e <chunk_end>",
        "1-6",
        2
      );
      expect(result).toHaveLength(3);
      expect(result[2]).toEqual({
        command: "command -s 5 -e 6",
        frames: "5-6"
      });
    });

    it("creates chunks with step", () => {
      const result = resolveTasks(
        "command -s <chunk_start> -e <chunk_end>",
        "1-6x2",
        2
      );
      expect(result).toHaveLength(2);
      expect(result).toEqual([
        {
          command: "command -s 1 -e 3",
          frames: "1-3x2"
        },
        {
          command: "command -s 5 -e 5",
          frames: "5"
        }
      ]);
    });

    it("creates one chunk if chunkSize larger than frames", () => {
      const result = resolveTasks(
        "command -s <chunk_start> -e <chunk_end>",
        "1-4",
        5
      );
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        command: "command -s 1 -e 4",
        frames: "1-4"
      });
    });

    it("makes single tile of single chunk from single frame", () => {
      const result = resolveTasks(
        "command -s <chunk_start> -e <chunk_end> -t <tile>",
        "1",
        1,
        "1"
      );
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        command: "command -s 1 -e 1 -t 1",
        frames: "1"
      });
    });

    it("makes many tiles", () => {
      const result = resolveTasks(
        "command -s <chunk_start> -e <chunk_end> -t <tile>",
        "1",
        1,
        "1-4"
      );
      expect(result).toHaveLength(4);
      expect(result[3].command).toBe("command -s 1 -e 1 -t 4");
    });

    it("makes many tiles of many chunks", () => {
      const result = resolveTasks(
        "command -s <chunk_start> -e <chunk_end> -t <tile>",
        "1-2",
        1,
        "1-2"
      );
      expect(result).toHaveLength(4);
      expect(result).toEqual([
        { command: "command -s 1 -e 1 -t 1", frames: "1" },
        { command: "command -s 1 -e 1 -t 2", frames: "1" },
        { command: "command -s 2 -e 2 -t 1", frames: "2" },
        { command: "command -s 2 -e 2 -t 2", frames: "2" }
      ]);
    });

    it("makes many tiles of many chunks", () => {
      const result = resolveTasks(
        "command -s <chunk_start> -e <chunk_end>",
        "1-10x2",
        2
      );
      expect(result).toHaveLength(3);
      expect(result).toEqual([
        { command: "command -s 1 -e 3", frames: "1-3x2" },
        { command: "command -s 5 -e 7", frames: "5-7x2" },
        { command: "command -s 9 -e 9", frames: "9" }
      ]);
    });
  });

  describe("resolvePackages", () => {
    it("extracts unique packade IDs", () => {
      const softwarePackages = [
        {
          softwareKey: "maya",
          package: { id: "1" }
        },
        {
          softwareKey: "maya",
          package: { id: "1" }
        },
        {
          softwareKey: "cara-vr",
          package: { id: "3" }
        },
        {
          softwareKey: "miarmy",
          package: null
        },
        { softwareKey: "", package: {} },
        {}
      ];

      expect(resolvePackages(softwarePackages)).toEqual(["1", "3"]);
    });

    it("gives empty array if package has no id", () => {
      const softwarePackages = [
        {
          softwareKey: "",
          package: {}
        }
      ];

      expect(resolvePackages(softwarePackages)).toEqual([]);
    });
  });

  describe("resolve environment", () => {
    it("exclusively adds package environment variable", () => {
      const softwarePackages = [
        {
          package: {
            environment: [
              {
                merge_policy: "exclusive",
                name: "maya_var",
                value: "maya_value"
              }
            ]
          }
        },
        {
          package: {
            environment: [
              {
                merge_policy: "exclusive",
                name: "miarmy_var",
                value: "miarmy_value"
              }
            ]
          }
        }
      ];

      expect(resolveEnvironment(softwarePackages)).toEqual({
        maya_var: "maya_value",
        miarmy_var: "miarmy_value"
      });
    });

    it("appends package environment variables", () => {
      const softwarePackages = [
        {
          package: {
            environment: [
              {
                merge_policy: "append",
                name: "maya_var",
                value: "maya_value"
              },
              {
                merge_policy: "append",
                name: "maya_var_2",
                value: "maya_value_2"
              }
            ]
          }
        }
      ];

      expect(
        resolveEnvironment(softwarePackages, { maya_var: "existing_value" })
      ).toEqual({
        maya_var: "existing_value:maya_value",
        maya_var_2: "maya_value_2"
      });
    });

    it("ignores invalid merge policies", () => {
      const softwarePackages = [
        {
          package: {
            environment: [
              {
                merge_policy: "invalid policy",
                name: "maya_var",
                value: "maya_value"
              }
            ]
          }
        }
      ];
      expect(resolveEnvironment(softwarePackages, {})).toEqual({});
    });

    it("handles resolving empty environment", () => {
      const softwarePackages = [
        {
          package: {}
        }
      ];
      expect(resolveEnvironment(softwarePackages, {})).toEqual({});
    });
  });
});
