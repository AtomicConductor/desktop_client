import { createSelector } from 'reselect';

const signedIn = state => state.user.accounts.length !== 0;
const otherAccounts = state => state.user.accounts.filter(_ => !_.selected);
const currentAccount = state => state.user.accounts.find(_ => _.selected);

const signedInSelector = createSelector(signedIn, _ => _);

const emailSelector = createSelector(
  signedIn,
  currentAccount,
  (signedIn, selectedAccount) => {
    return signedIn ? selectedAccount.email : null;
  });

const accountsSelector = createSelector(
  signedIn,
  currentAccount,
  otherAccounts,
  (isSignedIn, selectedAccount, otherAccounts) => {
    return {
      isSignedIn,
      selectedAccount,
      otherAccounts
    }
  }
);

const currentAccountSelector = createSelector(
  currentAccount,
  ({ email, id }) => ({ email, id })
);

const tokenSelector = createSelector(
  currentAccount,
  ({ token }) => token
);

export {
  signedInSelector,
  emailSelector,
  accountsSelector,
  currentAccountSelector,
  tokenSelector
}