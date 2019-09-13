import { connect } from "react-redux";
import Drawer from "./Drawer";

const mapStateToProps = state => {
  const { user } = state.profile;
  const userData = user.data;
  const email = (userData && userData.email) || "";
  const accountName =
    (userData && state.entities.accounts[userData.account].accountName) || "";
  const loggedIn = !!(accountName && email);

  return {
    loggedIn,
    email,
    accountName
  };
};

export { mapStateToProps };

export default connect(mapStateToProps)(
  Drawer
);;
