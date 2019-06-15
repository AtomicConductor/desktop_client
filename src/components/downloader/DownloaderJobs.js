import React from "react";
import PropTypes from "prop-types";

import { makeStyles, withStyles } from "@material-ui/core/styles";
import ListSubheader from "@material-ui/core/ListSubheader";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";

import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";

import DownloaderFilterDrawerContainer from "./DownloaderFilterDrawerContainer";

import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Box from "@material-ui/core/Box";

import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { classes } from "istanbul-lib-coverage";

// const ExpansionPanel = withStyles({
//   root: {
//     border: "1px solid rgba(0, 0, 0, .3)",
//     boxShadow: "none",
//     "&:not(:last-child)": {
//       borderBottom: 0
//     },
//     "&:before": {
//       display: "none"
//     },
//     "&$expanded": {
//       margin: "auto"
//     }
//   },
//   expanded: {}
// })(MuiExpansionPanel);

// const ExpansionPanelSummary = withStyles({
//   root: {
//     backgroundColor: "rgba(0, 0, 0, .03)",
//     // borderBottom: "1px solid rgba(0, 0, 0, .125)",
//     border: "1px solid #0f0",

//     // marginBottom: -1,
//     height: 26,
//     "&$expanded": {
//       height: 26
//     }
//   },
//   content: {
//     "&$expanded": {
//       margin: "12px 0"
//     }
//   },
//   expanded: {}
// })(MuiExpansionPanelSummary);

// const ExpansionPanelDetails = withStyles(theme => ({
//   root: {
//     padding: theme.spacing(2)
//   }
// }))(MuiExpansionPanelDetails);

const useStyles = makeStyles(theme => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33.33%",
    flexShrink: 0
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary
  },

  root: {
    display: "flex"
  },

  content: {
    marginTop: 48,
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
    // height: `calc(100% - 60px)`,
    borderStyle: "solid"
  },

  toolbar: { height: 48 },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3)
  },
  box: {
    border: "1px solid  #f00",
    marginTop: 48
  }
}));

const DownloaderJobs = props => {
  const { jobs } = props;
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState("panel1");

  const handleChange = panel => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <React.Fragment>
      <Box className={classes.box}>
        {jobs.map(j => (
          <ExpansionPanel
            key={j.jobLabel}
            expanded={expanded === j.jobLabel}
            onChange={handleChange(j.jobLabel)}
          >
            <ExpansionPanelSummary id={`${j.jobLabel}-header`}>
              <Typography>{`${j.jobLabel} - ${j.title}`}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Typography />
            </ExpansionPanelDetails>
          </ExpansionPanel>
        ))}
      </Box>
      <DownloaderFilterDrawerContainer />
    </React.Fragment>
  );
};

DownloaderJobs.propTypes = {
  jobs: PropTypes.array.isRequired
};

// function DownloaderJobs() {
//   const classes = useStyles();

//   return (
//     <React.Fragment>
//       <main className={classes.content}>
//         <div className={classes.toolbar} />

//       </main>

//       <DownloaderFilterDrawerContainer />
//     </React.Fragment>
//   );
// }

export default DownloaderJobs;

// import React from 'react';
// import { withStyles } from '@material-ui/core/styles';
// import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
// import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
// import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
// import Typography from '@material-ui/core/Typography';

// const ExpansionPanel = withStyles({
//   root: {
//     border: '1px solid rgba(0, 0, 0, .125)',
//     boxShadow: 'none',
//     '&:not(:last-child)': {
//       borderBottom: 0,
//     },
//     '&:before': {
//       display: 'none',
//     },
//     '&$expanded': {
//       margin: 'auto',
//     },
//   },
//   expanded: {},
// })(MuiExpansionPanel);

// const ExpansionPanelSummary = withStyles({
//   root: {
//     backgroundColor: 'rgba(0, 0, 0, .03)',
//     borderBottom: '1px solid rgba(0, 0, 0, .125)',
//     marginBottom: -1,
//     minHeight: 56,
//     '&$expanded': {
//       minHeight: 56,
//     },
//   },
//   content: {
//     '&$expanded': {
//       margin: '12px 0',
//     },
//   },
//   expanded: {},
// })(MuiExpansionPanelSummary);

// const ExpansionPanelDetails = withStyles(theme => ({
//   root: {
//     padding: theme.spacing(2),
//   },
// }))(MuiExpansionPanelDetails);

// export default function CustomizedExpansionPanels() {
//   const [expanded, setExpanded] = React.useState('panel1');

//   const handleChange = panel => (event, newExpanded) => {
//     setExpanded(newExpanded ? panel : false);
//   };

//   return (
//     <div>
//       <ExpansionPanel square expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
//         <ExpansionPanelSummary aria-controls="panel1d-content" id="panel1d-header">
//           <Typography>Collapsible Group Item #1</Typography>
//         </ExpansionPanelSummary>
//         <ExpansionPanelDetails>
//           <Typography>
//             Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
//             sit amet blandit leo lobortis eget. Lorem ipsum dolor sit amet, consectetur adipiscing
//             elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.
//           </Typography>
//         </ExpansionPanelDetails>
//       </ExpansionPanel>
//       <ExpansionPanel square expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
//         <ExpansionPanelSummary aria-controls="panel2d-content" id="panel2d-header">
//           <Typography>Collapsible Group Item #2</Typography>
//         </ExpansionPanelSummary>
//         <ExpansionPanelDetails>
//           <Typography>
//             Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
//             sit amet blandit leo lobortis eget. Lorem ipsum dolor sit amet, consectetur adipiscing
//             elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.
//           </Typography>
//         </ExpansionPanelDetails>
//       </ExpansionPanel>
//       <ExpansionPanel square expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
//         <ExpansionPanelSummary aria-controls="panel3d-content" id="panel3d-header">
//           <Typography>Collapsible Group Item #3</Typography>
//         </ExpansionPanelSummary>
//         <ExpansionPanelDetails>
//           <Typography>
//             Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
//             sit amet blandit leo lobortis eget. Lorem ipsum dolor sit amet, consectetur adipiscing
//             elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.
//           </Typography>
//         </ExpansionPanelDetails>
//       </ExpansionPanel>
//     </div>
//   );
// }
