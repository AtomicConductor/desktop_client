// export const DL_CLOSE_DRAWER = "CLOSE_DRAWER";
export const DL_TOGGLE_DRAWER = "TOGGLE_DRAWER";
export const DL_TOGGLE_USE_DAEMON = "TOGGLE_USE_DAEMON";

export const DL_SET_JOB_SUGGESTIONS = "GET_JOB_SUGGESTIONS"
export const DL_CLEAR_JOB_SUGGESTIONS = "CLEAR_JOB_SUGGESTIONS"
export const DL_SET_JOB_SEARCH_INPUT_VALUE = "SET_JOB_SEARCH_INPUT_VALUE"

export const dlToggleDrawer = () => ({
  type: DL_TOGGLE_DRAWER
});
 
export const dlToggleUseDaemon = () => ({
  type: DL_TOGGLE_USE_DAEMON
});
 

export const setJobInputValue = value => ({
  type: DL_SET_JOB_SEARCH_INPUT_VALUE,
  value
});

export const setJobSuggestions = value => ({
  type: DL_SET_JOB_SUGGESTIONS,
  value
});

export const clearJobSuggestions = () => ({
  type: DL_CLEAR_JOB_SUGGESTIONS
});

 