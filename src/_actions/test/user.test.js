import { signInFromSaved, signIn } from '../user';
import config from '../../config';
import nock from 'nock';

describe('user', () => {
  let dispatch, appStorage;

  beforeEach(() => {
    dispatch = jest.fn();
    appStorage = {
      readCredentials: jest.fn(),
      saveCredentials: jest.fn()
    };
    
    global.localStorage.__proto__ = {
      getItem: jest.fn(),
      setItem: jest.fn()
    };
  });

  describe('signInfromSaved', () => {
    it('signs user in when credentials are in local storage', async () => {
      appStorage.readCredentials.mockResolvedValueOnce({});

      await signInFromSaved(appStorage)(dispatch);

      expect(dispatch).toHaveBeenCalled();
    });

    it('does not sign in user when local storage is empty', async () => {
      appStorage.readCredentials.mockResolvedValueOnce(undefined);

      await signInFromSaved(appStorage)(dispatch);

      expect(dispatch).not.toHaveBeenCalled();
    });
  });

  describe('signIn', () => {
    it('stores credentials in local storage when sign in succeeds', async () => {
      const credentials = { email: 'joe@email.com', password: 'secret' };
      const getState = jest.fn().mockReturnValueOnce({
        user:
          { accounts: [{ selected: true, email: 'joe@email.com' }] }
      });

      nock(config.apiServer)
        .post('/api/auth', credentials)
        .reply(200, {
          accounts: [
            {
              account: 1234567890,
              accountName: 'my account',
              token: 'token',
              email: 'joe@email.com',
              role: 1
            }
          ]
        });

      nock(config.hubSpot.contactApiUrl)
        .post('/email/joe@email.com/profile', {
          properties: [{ property: "beta_user", value: true }]
        })
        .query({ hapikey: config.hubSpot.apiKey })
        .reply(204);

      await signIn(credentials, appStorage)(dispatch, getState);

      const mappedAccounts = [{
        id: 1234567890,
        name: 'my account',
        token: 'token',
        email: 'joe@email.com',
        selected: true,
        avatar: 'J'
      }];

      expect(dispatch).toHaveBeenCalledWith({
        type: 'user/signInRequest',
        payload: undefined
      });
      expect(appStorage.saveCredentials).toHaveBeenCalledWith({ accounts: mappedAccounts });
      expect(localStorage.setItem).toHaveBeenCalledWith('isBetaUser', true);
      expect(dispatch.mock.calls[1][0]).toEqual({
        type: 'user/signInSuccess',
        payload: mappedAccounts
      });
    });

    it('does not set beta user flag if already exists ', async () => {
      const credentials = { email: 'joe@email.com', password: 'secret' };
      const getState = jest.fn().mockReturnValueOnce({
        user:
          { accounts: [{ selected: true, email: 'joe@email.com' }] }
      });

      nock(config.apiServer)
        .post('/api/auth', credentials)
        .reply(200, {
          accounts: [
            {
              account: 1234567890,
              accountName: 'my account',
              token: 'token',
              email: 'joe@email.com',
              role: 1
            }
          ]
        });

      localStorage.getItem.mockReturnValueOnce(true);

      await signIn(credentials, appStorage)(dispatch, getState);

      expect(localStorage.setItem).not.toHaveBeenCalledWith('isBetaUser', true);
    });

    it('throws when there are no active accounts', async () => {
      nock(config.apiServer)
        .post('/api/auth', {})
        .reply(200, {
          accounts: false
        });

      await expect(signIn({}, appStorage)(dispatch)).rejects.toThrow("Can't sign in");

      expect(dispatch.mock.calls[1][0]).toEqual({
        type: 'user/signInError',
        payload: undefined
      });

      expect(localStorage.setItem).not.toHaveBeenCalled();
    });
  });
});
