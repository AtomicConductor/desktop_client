import os from "os";

export const drawerWidth = 240;

export const statusLineHeight = 24;
export const appBarHeight = 48;
export const filterDrawerWidth = 210;

export const googleProjects = [
  {
    name: "production",
    longName: "Atomic Light",
    projectUrl: "https://atomic-light-001.appspot.com",
    dashboardUrl: "https://dashboard.conductortech.com",
    apiServer: "https://api.conductortech.com",
    onboarding: "https://id.conductortech.com"
  },
  {
    name: "development",
    longName: "Eloquent vector",
    projectUrl: "https://eloquent-vector-104019.appspot.com",
    dashboardUrl: "https://dashboard.dev-conductortech.com",
    apiServer: "https://api.dev-conductortech.com",
    onboarding: "https://id.dev-conductortech.com"
  }
];

export const SETTINGS_FILENAME = "settings.json";
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

const PLATFORM = os.platform();
const WIN32 = PLATFORM === "win32";
const MAC = PLATFORM === "darwin";
const LINUX = PLATFORM === "linux";

// const ALL_DEFAULT_PLUGIN_INSTALL_PATHS = {
//   win32: {
//     maya: "%APPDATA%\\Conductor\\maya",
//     nuke: "%APPDATA%\\Conductor\\nuke",
//     clarisse: "%APPDATA%\\Conductor\\clarisse",
//     silhouette: "%APPDATA%\\Conductor\\silhouette"
//   },
//   darwin: {
//     maya: "$HOME/Conductor/maya",
//     nuke: "$HOME/Conductor/nuke",
//     clarisse: "$HOME/Conductor/clarisse",
//     silhouette: "$HOME/Conductor/silhouette"
//   },
//   linux: {
//     maya: "$HOME/Conductor/maya",
//     nuke: "$HOME/Conductor/nuke",
//     clarisse: "$HOME/Conductor/clarisse",
//     silhouette: "$HOME/Conductor/silhouette"
//   }
// };

// export const DEFAULT_PLUGIN_INSTALL_PATHS =
//   ALL_DEFAULT_PLUGIN_INSTALL_PATHS[PLATFORM];
