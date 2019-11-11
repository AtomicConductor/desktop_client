import { createReducer } from "redux-starter-kit";

import { loadPresetsSuccess, selectPreset } from "../../_actions/entities";

const initialState = {
  "preset 1": { command: "this is a preset command 1", readonly: true },
  "preset 2": { command: "this is a preset command 2", readonly: true }
};

const presets = createReducer(initialState, {
  [loadPresetsSuccess]: (state, action) => ({
    ...initialState,
    ...action.payload
  }),
  [selectPreset]: (state, { payload }) => {
    Object.keys(state).forEach(preset => {
      state[preset].selected = preset === payload;
    });
  }
});

export default presets;
