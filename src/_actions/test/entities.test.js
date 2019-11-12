import { savePreset, deletePreset } from "../entities";

describe("entities", () => {
  let storage, dispatch;
  beforeEach(() => {
    storage = {
      loadPresets: jest.fn(),
      savePresets: jest.fn(),
      deletePreset: jest.fn()
    };

    dispatch = jest.fn();
  });

  it("saves a preset", async () => {
    const presets = {};
    const preset = { name: "foo", command: "foo" };
    storage.loadPresets.mockResolvedValueOnce(presets);
    const innerDispatch = jest.fn();
    dispatch.mockImplementationOnce(_ => _(innerDispatch));

    await savePreset(preset, storage)(dispatch);

    expect(innerDispatch).toHaveBeenCalledWith({
      type: "entities/loadPresetsSuccess",
      payload: {}
    });

    expect(dispatch).toHaveBeenNthCalledWith(2, {
      type: "entities/selectPreset",
      payload: "foo"
    });

    expect(dispatch).toHaveBeenNthCalledWith(3, {
      type: "notification/setNotification",
      payload: {
        type: "success",
        message: "foo preset successfully saved."
      }
    });
  });

  it("deletes a preset", async () => {
    const getState = jest.fn().mockReturnValueOnce({
      entities: {
        presets: { foo: { selected: true } }
      }
    });

    await deletePreset(storage)(dispatch, getState);

    expect(dispatch).toHaveBeenNthCalledWith(2, {
      type: "notification/setNotification",
      payload: {
        type: "success",
        message: "foo preset successfully deleted."
      }
    });
  });
});
