import React, { useState } from 'react';
import {
  Typography,
  Box,
  Link,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  CardHeader,
  Avatar
} from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles";
import {
  LibraryBooksRounded,
  ContactSupportRounded,
  FeedbackRounded,
  CallToActionRounded
} from '@material-ui/icons';

import Feedback from './Feedback';

const useStyles = makeStyles(theme => ({
  container: {
    margin: theme.spacing(4, 10),
    flexGrow: 1
  },
  card: {
    boxShadow: theme.shadows[6],
  },
  cardHeader: {
    color: theme.palette.secondary.main
  },
  ctaItemsGrid: {
    margin: 'auto',
    maxWidth: '800px'
  },
  avatar: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.common.white
  },
  header: {
    textTransform: "uppercase",
    color: theme.palette.secondary.main
  },
  ctaActionArea: {
    height: '190px',
    flexDirection: 'column',
    alignItems: 'baseline'
  }
}));

export default () => {
  const classes = useStyles();
  const [feedbackFormOpen, setFeedbackFormOpen] = useState(false);

  return (
    <Box className={classes.container}>
      <Typography variant="h3">
        Lorem ipsum
      </Typography>
      <br />
      <Typography variant="body1">
        Dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      </Typography>
      <br />
      <Typography variant="body2">
        Have additional questions? Check out the
        <Link>
          {' knowledgebase '}
        </Link>
        {' or submit a ticket to '}
        <Link>
          support
        </Link>
      </Typography>
      <br />

      <Grid className={classes.ctaItemsGrid} container spacing={8}>
        <Grid item sm={12} lg={6}>
          <Card className={classes.card}>
            <CardActionArea className={classes.ctaActionArea}>
              <CardHeader
                className={classes.header}
                title="Documentation"
                titleTypographyProps={{ variant: 'h6' }}
                avatar={
                  <Avatar className={classes.avatar}>
                    <LibraryBooksRounded className={classes.avatar} />
                  </Avatar>
                }
              />
              <CardContent>
                <Typography variant="body2" color="textSecondary" component="p">
                  Dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>

        <Grid item sm={12} lg={6}>
          <Card className={classes.card}>
            <CardActionArea className={classes.ctaActionArea}>
              <CardHeader
                className={classes.header}
                title="Support"
                titleTypographyProps={{ variant: 'h6' }}
                avatar={
                  <Avatar className={classes.avatar}>
                    <ContactSupportRounded className={classes.avatar} />
                  </Avatar>
                }
              />
              <CardContent>
                <Typography variant="body2" color="textSecondary" component="p">
                  Dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>

        <Grid item sm={12} lg={6}>
          <Card className={classes.card}>
            <CardActionArea className={classes.ctaActionArea}>
              <CardHeader
                className={classes.header}
                title="Lorem Ipsum"
                titleTypographyProps={{ variant: 'h6' }}
                avatar={
                  <Avatar className={classes.avatar}>
                    <CallToActionRounded className={classes.avatar} />
                  </Avatar>
                }
              />
              <CardContent>
                <Typography variant="body2" color="textSecondary" component="p">
                  Dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>

        <Grid item sm={12} lg={6}>
          <Card className={classes.card}>
            <CardActionArea className={classes.ctaActionArea} onClick={() => setFeedbackFormOpen(true)}>
              <CardHeader
                className={classes.header}
                title="Feedback"
                titleTypographyProps={{ variant: 'h6' }}
                avatar={
                  <Avatar className={classes.avatar}>
                    <FeedbackRounded className={classes.avatar} />
                  </Avatar>
                }
              />
              <CardContent>
                <Typography variant="body2" color="textSecondary" component="p">
                  Dolor sit amet, consectetur adipis
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        <Feedback feebackFormOpen={feedbackFormOpen} onCloseFeedbackForm={() => setFeedbackFormOpen(false)} />
      </Grid>
    </Box>
  );
};