export default credentials => {
  const required = ["id", "name", "token", "email", "selected", "avatar"];
  const { accounts } = credentials;

  return (
    accounts &&
    accounts.length &&
    accounts.every(account =>
      required.every(property => account.hasOwnProperty(property))
    )
  );
};
