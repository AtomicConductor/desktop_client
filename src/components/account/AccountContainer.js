import { connect } from "react-redux";
import Account from "./Account";
import { chooseAccount, deleteSession } from "../../_actions/profile";

const mapStateToProps = (state, ownProps) => {
  const { profile, entities } = state;
  const accounts = Object.values(entities.accounts).map(account => ({
    label: account.accountName,
    value: account.account
  }));
  const loggedIn = Boolean(Object.entries(profile.user).length);
  return { profile, accounts, loggedIn };
};

const mapDispatchToProps = (dispatch, ownProps) => {
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
