const createRequestOptions = token => {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json"
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return { headers };
};

export { createRequestOptions };
