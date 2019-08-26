export const drawerWidth = 240;

export const statusLineHeight = 24;
export const appBarHeight = 48;
export const filterDrawerWidth = 210;

const googleProjects = {
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
};

export const config = googleProjects[process.env.NODE_ENV];

export const CREDENTIALS_FILENAME = "credentials.json";

export const TIMESPANS = {
  TODAY: "Today",
  THISWEEK: "This Week",
  LASTWEEK: "Last Week",
  THISMONTH: "This Month",
  LASTMONTH: "Last Month",
  THISYEAR: "This Year",
  LASTYEAR: "Last Year",
  ALLTIME: "All Time"
};
