export default {
  default: { HTTP_PROXY_DEBUG_LEVEL: "info" },
  development: {
    PROJECT_URL: "https://eloquent-vector-104019.appspot.com",
    DASHBOARD_URL: "https://dashboard.dev-conductortech.com",
    APISERVER: "https://api.dev-conductortech.com",
    ONBOARDING: "https://id.dev-conductortech.com"
  },
  production: {
    PROJECT_URL: "https://atomic-light-001.appspot.com",
    DASHBOARD_URL: "https://dashboard.dev-conductortech.com",
    APISERVER: "https://api.conductortech.com",
    ONBOARDING: "https://id.conductortech.com"
  }
};
