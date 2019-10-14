import {
  accountsSelector,
  currentAccountSelector,
  emailSelector,
  signedInSelector,
  tokenSelector
} from '../account';

describe('account selectors', () => {
  let state = {
    user: {
      accounts: [
        {
          id: 1,
          email: 'account1@email.com',
          token: 'token 1',
          selected: true
        },
        {
          id: 2,
          email: 'account2@email.com',
          token: 'token 2',
          selected: false
        }
      ]
    }
  }

  describe('signedInSelector', () => {
    it('return true when accounts are present', () => {
      expect(signedInSelector(state)).toBe(true);
    });

    it('returns false when there are no accounts', () => {
      expect(signedInSelector({ user: { accounts: [] } })).toBe(false);
    });
  });

  describe('emailSelector', () => {
    it('returns email of selected account', () => {
      expect(emailSelector(state)).toBe('account1@email.com');
    });

    it('returns null when accounts are empty', () => {
      expect(emailSelector({ user: { accounts: [] } })).toBe(null);
    });
  });

  describe('currentAccountSelector', () => {
    it('returns selected account', () => {
      expect(currentAccountSelector(state)).toEqual({
        id: 1,
        email: 'account1@email.com'
      });
    });
  });

  describe('tokenSelector', () => {
    it('returns token of selected account', () => {
      expect(tokenSelector(state)).toBe('token 1');
    });
  });

  describe('accountsSelector', () => {
    it('returns all accounts data', () => {
      expect(accountsSelector(state)).toEqual({
        isSignedIn: true,
        selectedAccount: {
          id: 1,
          email: 'account1@email.com',
          token: 'token 1',
          selected: true
        },
        otherAccounts: [{
          id: 2,
          email: 'account2@email.com',
          token: 'token 2',
          selected: false
        }]
      });
    });
  });
});