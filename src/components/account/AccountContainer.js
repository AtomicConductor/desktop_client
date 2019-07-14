import { connect } from "react-redux";
import Account from "./Account";
import { chooseAccount, signOut } from "../../_actions/profile";

const mapStateToProps = (state, ownProps) => {
  const { profile, entities } = state;
  const accounts = Object.values(entities.accounts).map(account => ({
    label: account.accountName,
    value: account.account
  }));

  console.log("accounts");
  console.log(accounts);
  return { profile, accounts };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setAccount: accountId => {
      dispatch(chooseAccount(accountId));
    },
    signOut: () => {
      dispatch(signOut());
    }
  };
};

const AccountContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Account);

export default AccountContainer;
