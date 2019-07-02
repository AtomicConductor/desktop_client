const checkResponse = response => {
  if (!response.ok) throw new Error(response.statusText);
};

const createRequestOptions = state => ({
  headers: {
    Authorization: `Bearer ${state.profile.credentials.access_token}`,
    Accept: "application/json",
    "Content-Type": "application/json"
  }
});

export { checkResponse, createRequestOptions };
