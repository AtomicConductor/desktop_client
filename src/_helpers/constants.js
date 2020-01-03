export const drawerWidth = 240;
export const statusLineHeight = 24;
export const appBarHeight = 48;
export const filterDrawerWidth = 210;

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

export const appVersion = process.env.REACT_APP_VERSION;

export const paths = {
  resources: "/resources",
  downloader: "/downloader",
  signIn: "/sign-in",
  submitter: "/submitter",
  log: "/log",
  welcome: "/welcome"
};

export const taskTemplateTokens = [
  "chunk_start",
  "chunk_end",
  "chunk_step",
  "chunk_spec",
  "output_path",
  "sequence_start",
  "sequence_end",
  "sequence_step",
  "sequence_spec"
];

export const settings = {
  pythonLocation: "settings.pythonLocation",
  showSubmitterNotice: "settings.showSubmitterNotice",
  showWelcomePage: "settings.showWelcomePage"
};
