import { createAction } from "redux-starter-kit";
import AppStorage from "../_helpers/storage";
import { selectedPresetSelector } from "../selectors/entities";
import { setNotification } from "../_actions/notification";

const loadPresetsSuccess = createAction("entities/loadPresetsSuccess");
const selectPreset = createAction("entities/selectPreset");

const loadPresets = (storage = new AppStorage()) => async dispatch => {
  const templates = await storage.loadPresets();
  dispatch(loadPresetsSuccess(templates));
};

const savePreset = (
  { name, command },
  storage = new AppStorage()
) => async dispatch => {
  await storage.savePresets({
    [name]: { command, readonly: false }
  });
  await dispatch(loadPresets());
  dispatch(selectPreset(name));
  dispatch(
    setNotification({
      type: "success",
      snackbar: `${name} preset successfully saved.`
    })
  );
};

const deletePreset = (storage = new AppStorage()) => async (
  dispatch,
  getState
) => {
  const { key } = selectedPresetSelector(getState());
  await storage.deletePreset(key);
  dispatch(loadPresets());
  dispatch(
    setNotification({
      type: "success",
      snackbar: `${key} preset successfully deleted.`
    })
  );
};

export {
  loadPresetsSuccess,
  loadPresets,
  savePreset,
  selectPreset,
  deletePreset
};
