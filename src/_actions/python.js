import { createAction } from "redux-starter-kit";

export const setPythonScriptResponse = createAction(
  "downloader/setPythonScriptResponse"
);
export const pythonScriptFailure = createAction(
  "downloader/pythonScriptFailure"
);
