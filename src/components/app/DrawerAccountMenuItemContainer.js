import { connect } from "react-redux";
import DrawerAccountMenuItem from "./DrawerAccountMenuItem";

const mapStateToProps = state => {
  const { user } = state.profile;
  const userData = user.data;
  const email = (userData && userData.email) || "";
  const accountName =
    (userData && state.entities.accounts[userData.account].accountName) || "";
  const loggedIn = Boolean(accountName && email);

  return {
    loggedIn,
    email,
    accountName
  };
};
const DrawerAccountMenuItemContainer = connect(mapStateToProps)(
  DrawerAccountMenuItem
);

export { mapStateToProps };

export default DrawerAccountMenuItemContainer;
