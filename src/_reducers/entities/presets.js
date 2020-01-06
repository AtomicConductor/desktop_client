import { createReducer } from "redux-starter-kit";

import { loadPresetsSuccess, selectPreset } from "../../_actions/entities";

const initialState = {
  "simple modo": {
    command:
      "/path/to/modo_render.py -s <chunk_start> -e <chunk_end> -b 1 /path/to/my_project/test.lxo",
    readonly: true
  },
  "simple silhouette": {
    command:
      "sfxcmd -log -range <chunk_start>-<chunk_end> -all /path/to/my_project/test.sfx",
    readonly: true
  },
  "simple blender": {
    command:
      "blender /path/to/myfile.blend --render-output <output_path>/render. --render-format EXR  --render-frame <chunk_start>  --background -noaudio",
    readonly: true
  }
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
