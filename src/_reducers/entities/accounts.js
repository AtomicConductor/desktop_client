import { createReducer } from "redux-starter-kit";

import { receiveAccounts, signOut } from "../../_actions/profile";

const initialState = {
  "5762244625301504": {
    uid: "ekzVDXZrOBNjYNtOC1N5lELznUM2",
    token:
      "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2lkLmNvbmR1Y3RvcnRlY2guY29tIiwic3ViIjoiNTYzODIwMzAxNzAwMzAwOCIsImF1ZCI6Imh0dHBzOi8vYXBpLmNvbmR1Y3RvcnRlY2guY29tIiwiZXhwIjoxNTYzMTQxNjU0LCJlbWFpbCI6Imp1bGlhbi5tYW5uQGFkbWlvcy1zYS5jb20iLCJpZCI6IjU2MzgyMDMwMTcwMDMwMDgiLCJhY2NvdW50Ijo1NzYyMjQ0NjI1MzAxNTA0LCJyb2xlIjoxLCJzY29wZSI6Im93bmVyIGFkbWluIHVzZXIiLCJpYXQiOjE1NjMwNTUyNTR9.z4HBPUslL0MQfINORnFAkon3pyQyyDvwA1rHuDz6QRVhcRrkoq2ra8eKtIFYKfCyBhIlBsMfYNqV8QqTTXijiONH0ow3rkKSZ67b4Gk8pm_UJ2U_8nK-qpM1sHXZYOMWzfv0ShGSOGHDW9Inf0D6Mi8Iml0I2Z4QtZQ6W5FqvuCj4sqYJywddpc9ov65jdiOvd7oPsbx5agWT3jAU-fvNNe2vfm7uzRMyyVdMY_3e40DRWAxkt44RM6AnZyUXPWOC2gbi3YwOc0aRKASw6V3TCNfbYxTm50mnrn2PxaDyU3PY77nEPHGkeMcNzTxuB4u6OY2he5AlfQSMUKWaedp7Q",
    status: "active",
    role: 1,
    id: "5638203017003008",
    email: "julian.mann@admios-sa.com",
    createdOn: "2017-09-27T01:01:27.769Z",
    accountName: "Admios",
    account: 5762244625301504
  },
  "5669544198668288": {
    uid: "ekzVDXZrOBNjYNtOC1N5lELznUM2",
    token:
      "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2lkLmNvbmR1Y3RvcnRlY2guY29tIiwic3ViIjoiNTY1OTk3NDYwODg3OTYxNiIsImF1ZCI6Imh0dHBzOi8vYXBpLmNvbmR1Y3RvcnRlY2guY29tIiwiZXhwIjoxNTYzMTQxNjU0LCJlbWFpbCI6Imp1bGlhbi5tYW5uQGFkbWlvcy1zYS5jb20iLCJpZCI6IjU2NTk5NzQ2MDg4Nzk2MTYiLCJhY2NvdW50Ijo1NjY5NTQ0MTk4NjY4Mjg4LCJyb2xlIjowLCJzY29wZSI6InN1cGVydXNlciBvd25lciBhZG1pbiB1c2VyIiwiaWF0IjoxNTYzMDU1MjU0fQ.s_XRWOg3biabGnUxfGr7axE4MyFyPkwHNzMM1I-YAhfRm3_7RgbrU1et1rSu9M2NaU8Qwmr69_Eo4WBE-yD8yiRvwQHOfZPU7M3E0dXKwZkSR5BdhQYZW7_-ZpoOZ99Lv9zxRbdPUOcpYS4UxNu2DAjBveStCrs1n1FqL8cSCs8BQtNipmXa-I37TYYGlqabBybIDypWvVb7XZnm-VBS4qPzpui9fLj737kH8Mo_9cZaQOo1GsywXAWHe8e5_g--EVocZhE8ykoelP9pjpb2VSpGKHJ3GKK7rCqUnVbs0jE9JC0vvRpujOXbbhB5aOz8ifhfnZjRdGBtdVyR-1-43w",
    status: "active",
    role: 0,
    id: "5659974608879616",
    email: "julian.mann@admios-sa.com",
    createdOn: "2017-09-27T02:21:04.788Z",
    accountName: "conductor",
    account: 5669544198668288
  }
};

const accounts = createReducer(initialState, {
  [receiveAccounts]: (state, action) => {
    const { accounts } = action.payload;
    if (!accounts) {
      throw Error("Can't sign in");
    }

    accounts.forEach(account => {
      state[account.account] = account;
    });
  },

  [signOut]: (state, action) => {
    for (const k in state) {
      if (state.hasOwnProperty(k)) {
        delete state[k];
      }
    }
  }
});

export default accounts;
