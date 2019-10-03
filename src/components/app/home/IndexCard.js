import React from "react";
import PropTypes from "prop-types";

import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  CardHeader,
  Avatar
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  card: {
    boxShadow: theme.shadows[6]
  },
  cardHeader: {
    color: theme.palette.secondary.main
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
    height: 200,
    flexDirection: "column",
    alignItems: "baseline"
  },

  cardContentText: { margin: theme.spacing(0, 2) }
}));

const IndexCard = props => {
  const classes = useStyles();

  const { onClick, title, body, icon } = props;

  return (
    <Grid item sm={12} lg={6}>
      <Card className={classes.card}>
        <CardActionArea className={classes.ctaActionArea} onClick={onClick}>
          <CardHeader
            className={classes.header}
            title={title}
            titleTypographyProps={{ variant: "h6" }}
            avatar={<Avatar className={classes.avatar}>{icon}</Avatar>}
          />
          <CardContent className={classes.cardContentText}>
            <Typography variant="body1" color="textSecondary" component="p">
              {body}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
};

IndexCard.propTypes = {
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  body: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  icon: PropTypes.element.isRequired
};

export default IndexCard;
