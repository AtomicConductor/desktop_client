import { createAction } from "redux-starter-kit";

export const clearNotification = createAction("notification/clearNotification");
export const showNotificationDetails = createAction(
    "notification/showNotificationDetails"
);
export const setNotification = createAction("notification/setNotification");
