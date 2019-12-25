import {
  instanceTypeNameSelector,
  instanceTypeSelector,
  assetsSelector,
  assetFilenamesSelector,
  taskDataSelector,
  scoutFramesSelector,
  softwarePackageIdsSelector,
  environmentSelector,
  projectSelector,
  jobTitleSelector,
  outputPathSelector,
  submissionValidSelector,
  submissionPreviewSelector
} from "../submitter";

import { instanceTypesSelector } from "../entities";

const ss = (
  submissionOverrides = {},
  entityOverrides = {},
  submitterOverrides = {}
) => ({
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
      ...submissionOverrides
    },
    ...submitterOverrides
  },
  entities: {
    projects: ["p1", "p2", "p3", "default"],
    instanceTypes: {
      a: { name: "a", description: "a desc", cores: 2 },
      b: { name: "b", description: "b desc", cores: 8 },
      c: { name: "c", description: "c desc", cores: 16 }
    },
    ...entityOverrides
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

  describe("instanceTypeSelector", () => {
    it("returns the currently selected instance type if entity exists", () => {
      const state = ss({ instanceType: { name: "b", description: "b desc" } });
      expect(instanceTypeSelector(state)).toBe(state.entities.instanceTypes.b);
    });

    it("returns the weakest (cores) instance type if entity does not exist", () => {
      const state = ss({ instanceType: { name: "d", description: "d desc" } });
      expect(instanceTypeSelector(state)).toBe(state.entities.instanceTypes.a);
    });

    it("returns empty name and description if no instance types exist", () => {
      const state = ss(
        { instanceType: { name: "d", description: "d desc" } },
        { instanceTypes: {} }
      );
      expect(instanceTypeSelector(state)).toEqual(
        expect.objectContaining({ name: "", description: "" })
      );
    });
  });

  describe("instanceTypeNameSelector", () => {
    it("returns name of the currently selected instance type", () => {
      const state = ss({ instanceType: { name: "b", description: "b desc" } });
      expect(instanceTypeNameSelector(state)).toBe("b");
    });

    it("returns errors if no instance types exist", () => {
      const state = ss({}, { instanceTypes: {} });

      expect(instanceTypeNameSelector(state)).toEqual(
        expect.objectContaining({
          errors: expect.arrayContaining([
            expect.stringMatching(/No instance types/i)
          ])
        })
      );
    });
  });

  describe("projectSelector", () => {
    it("returns the project if entity exists", () => {
      expect(projectSelector(ss({ project: "p2" }))).toBe("p2");
    });
    it("returns the default project if entity does not exists", () => {
      expect(projectSelector(ss({ project: "p4" }))).toBe("default");
    });
    it("returns the first project if neither entity or default entity exists", () => {
      const state = ss({ project: "p4" }, { projects: ["p1", "p2", "p3"] });
      expect(projectSelector(state)).toBe("p1");
    });

    it("returns errors if no project entities exist", () => {
      const state = ss({ project: "p4" }, { projects: [] });
      expect(projectSelector(state)).toEqual(
        expect.objectContaining({
          errors: expect.arrayContaining([
            expect.stringMatching(/No projects/i)
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

    it("resolves the output folder when its a posix path", () => {
      const result = taskDataSelector(
        ss({
          taskTemplate: "command -o <output_path>",
          frameSpec: "1",
          outputPath: "/path/to/out"
        })
      );
      expect(result[0]).toHaveProperty("command", "command -o /path/to/out");
    });

    it("resolves the output folder to posix when its a windows path", () => {
      const result = taskDataSelector(
        ss({
          taskTemplate: "command -o <output_path>",
          frameSpec: "1",
          outputPath: "C:\\path\\to\\out"
        })
      );
      expect(result[0]).toHaveProperty("command", "command -o /path/to/out");
    });

    it("creates padded versions of tokens", () => {
      const result = taskDataSelector(
        ss({
          taskTemplate: "command -o file.<pad chunk_start 2>.exr",
          frameSpec: "1,537"
        })
      );
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            command: "command -o file.01.exr"
          }),
          expect.objectContaining({
            command: "command -o file.537.exr"
          })
        ])
      );
    });

    it("handles negative number padding", () => {
      const result = taskDataSelector(
        ss({
          taskTemplate: "command -o file.<pad chunk_start 4>.exr",
          frameSpec: "-20"
        })
      );
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            command: "command -o file.-0020.exr"
          })
        ])
      );
    });

    it("handles multiple same key padding", () => {
      const result = taskDataSelector(
        ss({
          taskTemplate:
            "command -o <pad chunk_start 4> <pad chunk_start 2> <chunk_start>",
          frameSpec: "123"
        })
      );
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            command: "command -o 0123 123 123"
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
    it("returns empty errors array if no fields have errors", () => {
      const { errors } = submissionValidSelector(ss());
      expect(errors).toEqual([]);
    });

    it("returns  errors array if some fields are invalid", () => {
      const { errors } = submissionValidSelector(ss({ jobTitle: "" }));
      expect(errors).toHaveLength(1);
    });

    it("collects errors from many fields", () => {
      const { errors } = submissionValidSelector(
        ss({ jobTitle: "", taskTemplate: "" })
      );
      expect(errors).toHaveLength(2);
    });

    it("returns alerts if no software selected", () => {
      const { alerts } = submissionValidSelector(
        ss({
          softwarePackages: [
            {
              softwareKey: "",
              package: {}
            }
          ]
        })
      );
      expect(alerts).toEqual(
        expect.arrayContaining([expect.stringMatching("No software")])
      );
    });

    it("returns alerts if no files selected", () => {
      const { alerts } = submissionValidSelector(ss({ assets: {} }));
      expect(alerts).toEqual(
        expect.arrayContaining([expect.stringMatching("No files")])
      );
    });

    it("returns many alerts if many fields are found to be alert worthy", () => {
      const { alerts } = submissionValidSelector(
        ss({
          assets: {},
          softwarePackages: [
            {
              softwareKey: "",
              package: {}
            }
          ]
        })
      );
      expect(alerts).toHaveLength(2);
    });
  });

  describe("submissionPreviewSelector", () => {
    it("returns the same submission if file and task counts are within the limits", () => {
      const state = ss(
        {
          assets: { "/f1": {}, "/f2": {} },
          frameSpec: "1-10"
        },
        {},
        { previewLimits: { maxTasks: 20, maxFiles: 20 } }
      );
      const submission = submissionPreviewSelector(state);
      expect(submission.upload_paths).toHaveLength(2);
      expect(submission.tasks_data).toHaveLength(10);
    });

    it("returns submission with condensed task_data if tasks are limited", () => {
      const state = ss(
        { frameSpec: "1-10" },
        {},
        { previewLimits: { maxTasks: 4, maxFiles: 0 } }
      );
      const submission = submissionPreviewSelector(state);
      expect(submission.tasks_data).toHaveLength(4 + 1);
    });

    it("returns submission with condensed upload_paths if files are limited", () => {
      const state = ss(
        {
          assets: {
            "/f1": {},
            "/f2": {},
            "/f3": {},
            "/f4": {},
            "/f5": {},
            "/f6": {},
            "/f7": {}
          }
        },
        {},
        { previewLimits: { maxTasks: 0, maxFiles: 4 } }
      );
      const submission = submissionPreviewSelector(state);
      expect(submission.upload_paths).toHaveLength(4 + 1);
    });
  });
});
