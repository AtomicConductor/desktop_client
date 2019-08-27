export default {
  production:
  {
    longName: "Atomic Light",
    projectUrl: "https://atomic-light-001.appspot.com",
    dashboardUrl: "https://dashboard.conductortech.com",
    apiServer: "https://api.conductortech.com",
    onboarding: "https://id.conductortech.com",
    googleClientId:
      "367447922845-sofnl08cemfm9rf27idhsuo7rsofqftu.apps.googleusercontent.com"
  },
  development:
  {
    longName: "Eloquent vector",
    projectUrl: "https://eloquent-vector-104019.appspot.com",
    dashboardUrl: "https://dashboard.dev-conductortech.com",
    apiServer: "https://api.dev-conductortech.com",
    onboarding: "https://id.dev-conductortech.com",
    googleClientId:
      "239744134952-fiikjq85kj2t4eibgvvkocmbe07bopcv.apps.googleusercontent.com"
  }
}[process.env.NODE_ENV];