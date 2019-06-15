/*
Example params object

const params = {
  method: "GET",
  apiurl: "http://api.conductortech.com/api/v1",
  webtoken: "abc123",
  path: "/accounts/:id",
  filters: [

    
  ]
    status: "active",
    role: 2
  }
  limit: 200,
  fields: ["lastname", "firstname"],
  pageToken: "token",
  body: { somekey: "somevalue" }
};
*/

function constructQuery(params) {
  let result = "";
  if (!params) {
    return result;
  }
  const flat = {};
  const { filters, limit, fields, pageToken } = params;

  if (filters && Object.keys(filters).length > 0) {
    flat.filter = Object.keys(filters)
      .map(k => `${k}_eq_${filters[k]}`)
      .join(",");
  }

  if (fields) flat.fields = fields.join(",");
  if (limit) flat.limit = limit;
  if (pageToken) flat.pageToken = pageToken;

  if (flat && Object.keys(flat).length) {
    result = Object.keys(flat)
      .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(flat[k])}`)
      .join("&");
    result = `?${result}`;
  }
  return result;
}

function createRequestUrl(state, params) {
  const query = constructQuery(params);
  const cleanPath = params.path.replace(/^\/+/g, "");
  const apiurl =
    (params && params.apiurl) ||
    `${state.environment.project.apiServer}/api/v1`;
  return `${apiurl}/${cleanPath}${query}`;
}

function createRequestOptions(state, params) {
  const token =
    (params && params.access_token) || state.profile.credentials.access_token;

  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    method: params && params.method ? params.method.toUpperCase() : "GET"
  };

  if (params && params.body) {
    options.body = JSON.stringify(params.body);
  }
  return options;
}

export const createRequestParams = (state, params) => ({
  url: createRequestUrl(state, params),
  options: createRequestOptions(state, params)
});

/* 
fetchResource() is a THUNK 
Its gets stuff by making API calls, described in params object.
It responds by dispatching other standard actionCreators or thunks.

1. Before anything happens, it can dispatch an actionCreator
to set a looading spinner for example.

2. On success it can dispatch an actionCreator to do 
something with the JSON in the response.

3. On failure it can dispatch an actionCreator that accepts
the error and an object with all the request details so
the cause of the error can be relayed back to the user.
 
Use url and options separately - not new Request()) because :
https://github.com/wheresrhys/fetch-mock/issues/156

*/

export function fetchResource(params, onRequest, onSuccess, onError) {
  return function(dispatch, getState) {
    if (typeof onRequest === "function") {
      dispatch(onRequest());
    }

    const { url, options } = createRequestParams(getState(), params);
    return fetch(url, options)
      .then(response => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then(json => {
        if (typeof json.status_code === "number" && json.status_code >= 400) {
          throw new Error(`Error ${json}`);
        }
        if (typeof onSuccess === "function") {
          dispatch(onSuccess(json));
        }
      })
      .catch(function(error) {
        if (typeof onError === "function") {
          dispatch(onError(error, { url, options }));
        }
      });
  };
}
