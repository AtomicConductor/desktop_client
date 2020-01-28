import { createAction } from "@reduxjs/toolkit";

const setTaskTemplate = createAction("submitter/setTaskTemplate");

const insertTaskTemplateToken = payload => async (dispatch, getState) => {
  const { token, start, end } = payload;
  const { taskTemplate } = getState().submitter.submission;

  const prefix = taskTemplate.substring(0, start);
  const postfix = taskTemplate.substring(end);
  const updatedTemplate = `${prefix}<${token}>${postfix}`;

  dispatch(setTaskTemplate(updatedTemplate));
};

export { setTaskTemplate, insertTaskTemplateToken };
