import { connect } from "react-redux";
import Account from "./Account";
import { chooseAccount, deleteSession } from "../../_actions/profile";

const mapStateToProps = state => {
  const { profile, entities } = state;
  const loggedIn = Boolean(Object.entries(profile.user).length);
  const accountName = loggedIn && state.entities.accounts[profile.user.data.account].accountName;
  const accounts = Object
    .values(entities.accounts)
    .filter(({ accountName: name }) => name !== accountName)
    .map(({ account: accountId, accountName }) => ({ accountId, accountName }));
  return { profile, accounts, loggedIn, accountName };
};

const mapDispatchToProps = dispatch => {
  return {
    setAccount: accountId => {
      dispatch(chooseAccount(accountId));
    },
    signOut: () => {
      dispatch(deleteSession());
    }
  };
};

const AccountContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Account);

export default AccountContainer;
