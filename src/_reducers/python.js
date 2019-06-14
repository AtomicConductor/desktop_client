import { createReducer } from "redux-starter-kit";
import { setPythonScriptResponse } from "../_actions/python";

const initialState = {
  response: ""
};

const python = createReducer(initialState, {
  [setPythonScriptResponse]: (state, action) => {
    if (action.payload) {
      state.response = action.payload;
    }
  }
});

export default python;
