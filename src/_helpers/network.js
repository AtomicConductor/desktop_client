const MESSAGE_MAP = {
  400: "Bad Request",
  401: "Unauthorized",
  402: "Payment Required",
  403: "Forbidden",
  404: "Not Found",
  405: "Method Not Allowed",
  406: "Not Acceptable",
  407: "Proxy Authentication Required",
  408: "Request Timeout",
  409: "Conflict",
  410: "Gone",
  422: "Unprocessable Entity"
};

const checkResponse = response => {
  if (!response.ok) {
    if (response.statusText) {
      throw new Error(response.statusText);
    }

    if (response.status in MESSAGE_MAP) {
      throw new Error(MESSAGE_MAP[response.status]);
    }
    throw new Error("Unknown error");
  }
};

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

export { checkResponse, createRequestOptions };
