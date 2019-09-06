export default {
  production:
  {
    longName: "Atomic Light",
    projectUrl: "https://atomic-light-001.appspot.com",
    dashboardUrl: "https://dashboard.conductortech.com",
    apiServer: "https://api.conductortech.com",
    onboarding: "https://id.conductortech.com",
    googleClientId: "367447922845-5anoncg81n8driqnutl3nt3n9ggqke6s.apps.googleusercontent.com",
    googleClientSecret: "sFA9K6njCOqm7hZl51Gwy6uh"
  },
  development:
  {
    longName: "Eloquent vector",
    projectUrl: "https://eloquent-vector-104019.appspot.com",
    dashboardUrl: "https://dashboard.dev-conductortech.com",
    apiServer: "https://api.dev-conductortech.com",
    onboarding: "https://id.dev-conductortech.com",
    googleClientId: "239744134952-90ivbdlpj0mc8u8jf0cdds03ejfe24hs.apps.googleusercontent.com",
    googleClientSecret: "0BFpIDCWwUkb5iGtbj1jE9Cr"
  },
  test: {
    googleClientId: "",
    googleClientSecret: ""
  }
}[process.env.NODE_ENV];