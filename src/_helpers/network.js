const checkResponse = response => {
  if (!response.ok) throw new Error(response.statusText);
};

const createRequestOptions = state => {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json"
  };
  try {
    headers["Authorization"] = `Bearer ${
      state.profile.credentials.access_token
    }`;
  } catch (error) {}

  return { headers };
};

export { checkResponse, createRequestOptions };
