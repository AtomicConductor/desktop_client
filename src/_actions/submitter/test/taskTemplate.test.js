import { insertTaskTemplateToken } from "../taskTemplate";

describe("task template", () => {
  let dispatch;
  beforeEach(() => {
    dispatch = jest.fn();
    global.localStorage.__proto__ = {
      getItem: jest.fn(),
      setItem: jest.fn()
    };
  });

  describe("insertTaskTemplateToken", () => {
    const getState = jest.fn().mockReturnValue({
      submitter: {
        submission: { taskTemplate: "cmd start param " }
      }
    });

    it("inserts a token at cursor position into a task template", async () => {
      await insertTaskTemplateToken({
        token: "chunk_end",
        start: 16,
        end: 16
      })(dispatch, getState);

      expect(dispatch).toHaveBeenCalledWith({
        type: "submitter/setTaskTemplate",
        payload: "cmd start param <chunk_end>"
      });
    });

    it("overrides highlighted text with selected token", async () => {
      await insertTaskTemplateToken({
        token: "chunk_start",
        start: 4,
        end: 9
      })(dispatch, getState);

      expect(dispatch).toHaveBeenCalledWith({
        type: "submitter/setTaskTemplate",
        payload: "cmd <chunk_start> param "
      });
    });
  });
});
