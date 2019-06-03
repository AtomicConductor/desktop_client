import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(theme => ({
    root: {
        display: "flex"
    },

    toolbar: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(3)
    }
}));

function CtUploaderContent() {
    const classes = useStyles();

    return (
        <main className={classes.content}>
            <div className={classes.toolbar} />
            <Typography variant="h5">
                Nothing here
            </Typography>
           
        </main>
    );
}

export default CtUploaderContent;
