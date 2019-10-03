const commonConfig = {
  feedbackHookUrl: "https://hooks.zapier.com/hooks/catch/5792407/o2s3554/",
  supportUrl: "https://support.conductortech.com/hc/en-us",
  documentationUrl: "https://docs.conductortech.com"
};

export default {
  production:
  {
    ...commonConfig,
    longName: "Atomic Light",
    projectUrl: "https://atomic-light-001.appspot.com",
    dashboardUrl: "https://dashboard.conductortech.com",
    apiServer: "https://api.conductortech.com",
    onboarding: "https://id.conductortech.com",
    googleClientId: "367447922845-sofnl08cemfm9rf27idhsuo7rsofqftu.apps.googleusercontent.com",
    googleClientSecret: "0jRwPcGHFBRJ2-gFQj4_9Sd0",
  },
  development:
  {
    ...commonConfig,
    longName: "Eloquent vector",
    projectUrl: "https://eloquent-vector-104019.appspot.com",
    dashboardUrl: "https://dashboard.dev-conductortech.com",
    apiServer: "https://api.dev-conductortech.com",
    onboarding: "https://id.dev-conductortech.com",
    googleClientId: "239744134952-fiikjq85kj2t4eibgvvkocmbe07bopcv.apps.googleusercontent.com",
    googleClientSecret: "z4koSWnIYvSmTKICwGlBB2dT",
  },
  test: {
    googleClientId: "",
    googleClientSecret: "",
    feedbackHookUrl: "https://hooks.zapier.com/" 
  }
}[process.env.NODE_ENV];