import { mapStateToProps } from "../DrawerContainer";

describe("mapStateToProps", () => {
  describe('user logged in', () => {
    it("it maps state to account properties", () => {
      const result = mapStateToProps({
        profile: {
          user: {
            data: {
              email: "user@email.com",
              account: 123
            }
          }
        },
        entities: {
          accounts: {
            "123": {
              accountName: "my account"
            }
          }
        }
      });

      expect(result).toEqual({
        loggedIn: true,
        email: "user@email.com",
        accountName: "my account"
      });
    });
  });

  describe('user not logged in', () => {
    it('if user data is missing', () => {
      const result = mapStateToProps({
        profile: {
          user: {
          }
        }
      });

      expect(result.loggedIn).toBe(false);
    });

    it('if account is not found', () => {
      const result = mapStateToProps({
        profile: {
          user: {
            data: {
              email: "user@email.com",
              account: 123
            }
          }
        },
        entities: {
          accounts: {
            "123": {
            }
          }
        }
      });

      expect(result.loggedIn).toBe(false);
    });
  });
});
