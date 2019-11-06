import {
  instanceTypesSelector,
  instanceTypeNameSelector,
  assetsSelector,
  assetFilenamesSelector,
  taskDataSelector,
  scoutFramesSelector,
  softwarePackageIdsSelector,
  environmentSelector,
  projectSelector,
  jobTitleSelector,
  outputPathSelector,
  submissionSelector,
  submissionValidSelector
} from "../submitter";

const ss = (overrides = {}) => ({
  submitter: {
    submission: {
      jobTitle: "job",
      taskTemplate: "command",
      project: "default",
      outputPath: "/path/to/out",
      frameSpec: "1",
      tileSpec: "1",
      useTiles: true,
      chunkSize: 1,
      scoutFrameSpec: "1",
      useScoutFrames: true,
      assets: {},
      softwarePackages: [],
      environmentOverrides: [],
      uploadOnly: false,
      force: false,
      localUpload: true,
      instanceType: { name: "test", description: "a test" },
      ...overrides
    }
  }
});

describe("submitter selectors", () => {
  describe("instanceTypesSelector", () => {
    it("returns an array of instance types sorted by cores", () => {
      expect(
        instanceTypesSelector({
          entities: {
            instanceTypes: [{ cores: 2 }, { cores: 1 }]
          }
        })[0].cores
      ).toBe(1);
    });
  });

  describe("instanceTypeNameSelector", () => {
    it("returns name of the currently selected instance type", () => {
      expect(instanceTypeNameSelector(ss())).toBe("test");
    });
    it("returns errors if no currently selected instance type", () => {
      expect(
        instanceTypeNameSelector(
          ss({ instanceType: { name: "", description: "" } })
        )
      ).toEqual(
        expect.objectContaining({
          errors: expect.arrayContaining([
            expect.stringMatching(/invalid instance/i)
          ])
        })
      );
    });
  });

  describe("projectSelector", () => {
    it("returns the project", () => {
      expect(projectSelector(ss({ project: "foo" }))).toBe("foo");
    });
    it("returns errors if project name empty", () => {
      expect(projectSelector(ss({ project: " " }))).toEqual(
        expect.objectContaining({
          errors: expect.arrayContaining([
            expect.stringMatching(/invalid project/i)
          ])
        })
      );
    });
  });

  describe("jobTitleSelector", () => {
    it("returns the jobTitle", () => {
      expect(jobTitleSelector(ss({ jobTitle: "foo" }))).toBe("foo");
    });
    it("returns errors if jobTitle name empty", () => {
      expect(jobTitleSelector(ss({ jobTitle: " " }))).toEqual(
        expect.objectContaining({
          errors: expect.arrayContaining([
            expect.stringMatching(/invalid job title/i)
          ])
        })
      );
    });
  });

  describe("outputPathSelector", () => {
    it("returns the output path", () => {
      expect(outputPathSelector(ss({ outputPath: "/foo/bar" }))).toBe(
        "/foo/bar"
      );
    });
    it("returns errors if outputPath is not an absolute path", () => {
      expect(outputPathSelector(ss({ outputPath: "some/path" }))).toEqual(
        expect.objectContaining({
          errors: expect.arrayContaining([
            expect.stringMatching(/not an absolute path/i)
          ])
        })
      );
    });
  });

  describe("asset selectors", () => {
    it("returns empty array", () => {
      const result = assetsSelector(ss({}));
      expect(result).toHaveLength(0);
    });

    it("returns array of 3 assets", () => {
      const result = assetsSelector(
        ss({
          assets: {
            "/pathA": { size: "foo", type: "bar" },
            "/pathD": { size: "foo", type: "bar" },
            "/pathC": { size: "foo", type: "bar" }
          }
        })
      );
      expect(result).toHaveLength(3);
    });

    it("assetFilenamesSelector creates an array of strings", () => {
      const result = assetFilenamesSelector(
        ss({
          assets: {
            "/pathA": { size: "foo", type: "bar" },
            "/pathB": { size: "foo", type: "bar" },
            "/pathC": { size: "foo", type: "bar" }
          }
        })
      );
      expect(result).toHaveLength(3);
      expect(result).toEqual(
        expect.arrayContaining([expect.stringMatching(/pathB/)])
      );
    });

    it("assetFilenamesSelector gives errors object when not all paths are absolute", () => {
      const result = assetFilenamesSelector(
        ss({
          assets: {
            "/pathA": { size: "foo", type: "bar" },
            pathB: { size: "foo", type: "bar" },
            "/pathC": { size: "foo", type: "bar" }
          }
        })
      );

      expect(result).toEqual(
        expect.objectContaining({
          errors: expect.arrayContaining([
            expect.stringMatching(/not an absolute path/)
          ])
        })
      );
    });
  });
});

describe("submission selectors", () => {
  describe("scoutFramesSelector", () => {
    it("returns empty string when useScoutFrames is off", () => {
      const result = scoutFramesSelector(ss({ useScoutFrames: false }));
      expect(result).toBe("");
    });

    it("returns comma separated list", () => {
      const result = scoutFramesSelector(ss({ scoutFrameSpec: "1-4" }));
      expect(result).toBe("1,2,3,4");
    });

    it("returns errors when invalid", () => {
      const result = scoutFramesSelector(
        ss({ scoutFrameSpec: "bad", useScoutFrames: true })
      );
      expect(result).toHaveProperty("errors");
    });
  });

  describe("taskDataSelector", () => {
    it("creates a single task command", () => {
      const result = taskDataSelector(
        ss({ taskTemplate: "command -s <chunk_start>", frameSpec: "1" })
      );
      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty("command", "command -s 1");
    });

    it("creates many of the same tokens", () => {
      const result = taskDataSelector(
        ss({ taskTemplate: "command -s <chunk_start> <chunk_start>" })
      );
      expect(result[0]).toHaveProperty("command", "command -s 1 1");
    });

    it("creates start end step and spec", () => {
      const result = taskDataSelector(
        ss({
          taskTemplate:
            "command -s <chunk_start> <chunk_end> <chunk_step> <chunk_spec>",
          frameSpec: "1-10x3",
          chunkSize: 2
        })
      );
      expect(result[0]).toHaveProperty("command", "command -s 1 4 3 1-4x3");
    });

    it("creates inclusive range", () => {
      const result = taskDataSelector(
        ss({
          taskTemplate: "command -s <chunk_start>",
          frameSpec: "1-3"
        })
      );
      expect(result).toEqual([
        { command: "command -s 1", frames: "1" },
        { command: "command -s 2", frames: "2" },
        { command: "command -s 3", frames: "3" }
      ]);
    });

    it("creates range with step", () => {
      const result = taskDataSelector(
        ss({
          taskTemplate: "command -s <chunk_start>",
          frameSpec: "1-5x2"
        })
      );
      expect(result).toEqual([
        { command: "command -s 1", frames: "1" },
        { command: "command -s 3", frames: "3" },
        { command: "command -s 5", frames: "5" }
      ]);
    });

    it("handles many progressions separated by commas and or white space", () => {
      const result = taskDataSelector(
        ss({
          taskTemplate: "command -s <chunk_start>",
          frameSpec: "1, 4-10 20-30x3"
        })
      );
      expect(result).toHaveLength(12);
      expect(result[0]).toEqual({ command: "command -s 1", frames: "1" });
      expect(result[11]).toEqual({ command: "command -s 29", frames: "29" });
    });

    it("removes duplicates", () => {
      const result = taskDataSelector(
        ss({
          taskTemplate: "command -s <chunk_start>",
          frameSpec: "4-8 , 7-10"
        })
      );
      expect(result).toHaveLength(7);
    });

    it("creates errors when chunk_step is used but at least one chunk does not represent a progression", () => {
      const result = taskDataSelector(
        ss({
          taskTemplate: "command -b <chunk_step>",
          frameSpec: "1,2,4",
          chunkSize: 3
        })
      );

      expect(result).toEqual(
        expect.objectContaining({
          errors: expect.arrayContaining([
            expect.stringMatching(/not a progression/)
          ])
        })
      );
    });

    it("creates correct chunk_end if chunkSize larger than frames", () => {
      const result = taskDataSelector(
        ss({
          taskTemplate: "command -s <chunk_start> -e <chunk_end>",
          frameSpec: "1-4",
          chunkSize: 5
        })
      );
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        command: "command -s 1 -e 4",
        frames: "1-4"
      });
    });

    it("makes single tile of single chunk from single frame", () => {
      const result = taskDataSelector(
        ss({
          taskTemplate: "command -s <chunk_start> -e <chunk_end> -t <tile>",
          frameSpec: "1",
          tileSpec: "1"
        })
      );
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        command: "command -s 1 -e 1 -t 1",
        frames: "1"
      });
    });

    it("makes many tiles", () => {
      const result = taskDataSelector(
        ss({
          taskTemplate: "command -s <chunk_start> -e <chunk_end> -t <tile>",
          frameSpec: "1",
          tileSpec: "1-4"
        })
      );
      expect(result).toHaveLength(4);

      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            command: "command -s 1 -e 1 -t 2"
          })
        ])
      );
    });

    it("makes many tiles of many chunks", () => {
      const result = taskDataSelector(
        ss({
          taskTemplate:
            "command -s <chunk_start> -e <chunk_end> -b <chunk_step> -t <tile>",
          frameSpec: "1-4x2",
          tileSpec: "1-4",
          chunkSize: 2
        })
      );
      expect(result).toHaveLength(4);
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            command: "command -s 1 -e 3 -b 2 -t 2"
          })
        ])
      );
    });
  });

  describe("software packages", () => {
    it("selects  unique package IDs", () => {
      const result = softwarePackageIdsSelector(
        ss({
          softwarePackages: [
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
            }
          ]
        })
      );
      expect(result).toEqual(["1", "3"]);
    });

    it("returns empty array if package has no id", () => {
      const softwarePackages = [
        {
          softwareKey: "",
          package: {}
        }
      ];
      const result = softwarePackageIdsSelector(
        ss({
          softwarePackages: [
            {
              softwareKey: "",
              package: {}
            }
          ]
        })
      );
      expect(result).toEqual([]);
    });
  });

  describe("environment", () => {
    it("exclusively adds package environment variable", () => {
      const state = ss({
        softwarePackages: [
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
        ]
      });
      const result = environmentSelector(state);

      expect(result).toEqual(
        expect.objectContaining({
          maya_var: "maya_value"
        })
      );
    });

    it("ignores invalid merge policies", () => {
      const state = ss({
        softwarePackages: [
          { package: { environment: [{ merge_policy: "invalid policy" }] } }
        ]
      });
      const result = environmentSelector(state);
      expect(result).toEqual({});
    });

    it("resolves empty environment", () => {
      const state = ss({
        softwarePackages: [{ package: {} }]
      });
      const result = environmentSelector(state);
      expect(result).toEqual({});
    });

    it("appends overrides", () => {
      const state = ss({
        softwarePackages: [
          {
            package: {
              environment: [
                {
                  merge_policy: "append",
                  name: "maya_var",
                  value: "maya_value"
                }
              ]
            }
          }
        ],
        environmentOverrides: [{ key: "foo", value: "bar" }]
      });
      const result = environmentSelector(state);
      expect(result).toEqual(
        expect.objectContaining({
          maya_var: "maya_value",
          foo: "bar"
        })
      );
    });

    it("appends overrides except empty entries", () => {
      const state = ss({
        softwarePackages: [
          {
            package: {
              environment: [
                {
                  merge_policy: "append",
                  name: "maya_var",
                  value: "maya_value"
                }
              ]
            }
          }
        ],
        environmentOverrides: [
          { key: "foo", value: "bar" },
          { key: " ", value: " " }
        ]
      });
      const result = environmentSelector(state);
      expect(result).toEqual({
        maya_var: "maya_value",
        foo: "bar"
      });
    });

    it("removes variables when the overridden value is blank", () => {
      const state = ss({
        softwarePackages: [
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
                  name: "unwanted_var",
                  value: "unwanted_value"
                }
              ]
            }
          }
        ],
        environmentOverrides: [
          { key: "foo", value: "bar" },
          { key: "unwanted_var", value: " " }
        ]
      });
      const result = environmentSelector(state);
      expect(result).toEqual({
        maya_var: "maya_value",
        foo: "bar"
      });
    });
  });

  describe("submissionValidSelector", () => {
    it("returns true if all fields are valid", () => {
      expect(submissionValidSelector(ss())).toBe(true);
    });
    it("returns false if some fields are invalid", () => {
      expect(submissionValidSelector(ss({ project: "" }))).toBe(false);
    });
  });
});
