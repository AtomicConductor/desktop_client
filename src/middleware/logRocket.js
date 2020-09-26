import LogRocket from "logrocket";
import { currentAccountSelector } from "../_selectors/account";

export const sanitizers = {
  stateSanitizer: state => {
    const accounts = state.user.accounts.map(
      ({ id, name, email, selected }) => ({
        id,
        name,
        email,
        selected
      })
    );

    return {
      ...state,
      entities: null,
      plugins: null,
      notification: null,
      user: { accounts }
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
