import packageJson from "../../package.json";

export const drawerWidth = 240;
export const statusLineHeight = 24;
export const appBarHeight = 48;
export const filterDrawerWidth = 210;
export const maxItemsPreviewLimit = 200;

export const credentialsFileName = "credentials.json";
export const presetsFileName = "presets.json";

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

export const appVersion = packageJson.version;

export const paths = {
  resources: "/resources",
  downloader: "/downloader",
  signIn: "/sign-in",
  submitter: "/submitter",
  plugins: "/plugins",
  settings: "/settings",
  log: "/log",
  welcome: "/welcome"
};

export const taskTemplateTokens = [
  "chunk_end",
  "chunk_spec",
  "chunk_start",
  "chunk_step",
  "output_path",
  "sequence_end",
  "sequence_spec",
  "sequence_start",
  "sequence_step",
  "tile"
];

export const settings = {
  pythonLocation: "settings.pythonLocation",
  packageLocation: "settings.packageLocation",
  showSubmitterNotice: "settings.showSubmitterNotice",
  showWelcomePage: "settings.showWelcomePage"
};
