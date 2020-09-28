import { selectedPresetSelector } from "../entities";
describe("selectedPresetSelector", () => {
  it("returns selected preset", () => {
    const state = {
      entities: {
        presets: {
          cmd1: { command: "command 1", selected: false },
          cmd2: { command: "command 2", selected: true }
        }
      }
    };

    expect(selectedPresetSelector(state)).toEqual({
      key: "cmd2",
      command: "command 2",
      selected: true
    });
  });
});
