import LogRocket from "logrocket";
import { currentAccountSelector } from "../selectors/account";

export const sanitizers = {
  stateSanitizer: state => {
    return {
      ...state,
      entities: null,
      plugins: null,
      notification: null
    };
  },
  actionSanitizer: action => {
    if (action.type === "user/signInSuccess") {
      const accounts = action.payload;
      const { id, email } = currentAccountSelector({ user: { accounts } });
      LogRocket.identify(id, { email });
    }

    return action;
  }
};
