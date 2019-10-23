const commonConfig = {
  feedbackHookUrl: "https://hooks.zapier.com/hooks/catch/5792407/o2s3554/",
  supportUrl: "https://support.conductortech.com/hc/en-us",
  documentationUrl: "https://docs.conductortech.com",
  sentryDns: "https://ef2daab1370e4d619f35684888e36ff4@sentry.io/1766140"
};

export default {
  production: {
    ...commonConfig,
    longName: "Atomic Light",
    projectUrl: "https://atomic-light-001.appspot.com",
    dashboardUrl: "https://dashboard.conductortech.com",
    apiServer: "https://api.conductortech.com",
    onboarding: "https://id.conductortech.com",
    googleClientId:
      "367447922845-sofnl08cemfm9rf27idhsuo7rsofqftu.apps.googleusercontent.com",
    googleClientSecret: "0jRwPcGHFBRJ2-gFQj4_9Sd0",
    hubSpot: {
      apiKey: "6ddb097e-9f16-4b9c-8b52-d6e7e3655721",
      contactApiUrl: "https://api.hubapi.com/contacts/v1/contact"
    }
  },
  development: {
    ...commonConfig,
    longName: "Eloquent vector",
    projectUrl: "https://eloquent-vector-104019.appspot.com",
    dashboardUrl: "https://dashboard.dev-conductortech.com",
    apiServer: "https://api.dev-conductortech.com",
    onboarding: "https://id.dev-conductortech.com",
    googleClientId:
      "239744134952-fiikjq85kj2t4eibgvvkocmbe07bopcv.apps.googleusercontent.com",
    googleClientSecret: "z4koSWnIYvSmTKICwGlBB2dT",
    hubSpot: {
      apiKey: "ed177850-e3d7-4c82-83da-d12471afa02b",
      contactApiUrl: "https://api.hubapi.com/contacts/v1/contact"
    }
  },
  test: {
    googleClientId: "",
    googleClientSecret: "",
    feedbackHookUrl: "https://hooks.zapier.com/",
    apiServer: "https://api.test.com",
    dashboardUrl: "https://dashboard.test.com",
    hubSpot: {
      apiKey: "hapikey",
      contactApiUrl: "https://hubspot"
    }
  }
}[process.env.NODE_ENV];
