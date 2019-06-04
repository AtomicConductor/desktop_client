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

function CtDownloaderFilestream() {
    const classes = useStyles();

    return (
        <main className={classes.content}>
            <div className={classes.toolbar} />

            <Typography variant="h6">Downloader form</Typography>
            <Typography paragraph>
                This page will show a stream of files being downloaded.
            </Typography>
            <Typography paragraph>
                Hit the hamburger menu top-right to access a download form.
            </Typography>
            <Typography paragraph>
                The enabled/disabled state of fields will be inter-dependent. For example, If you choose one job-id, the task-id field will be enabled. If instead you make a list of job-ids, it doesn't make sense to specify task-id, so ythey will be disabled. Currently, all fields are disabled when you switch on daemon mode (which is probably wrong).  
            </Typography>
            <Typography paragraph>
                Oly job-id has autosuggest at the moment. Try typing 008. Eventually all fields will assist by providing typeahead or select boxes.
            </Typography>

            <Typography variant="h6">Downloaded files stream</Typography>
            <Typography paragraph>

            /Users/julian/projects/the fish pond/clarisse/renders/render1/image1.00120.exr<br/>
            /Users/julian/projects/the fish pond/clarisse/renders/render2/image2.00120.exr<br/>
            /Users/julian/projects/duck/images/minimal.0002.exr<br/>
            /Users/julian/projects/duck/images/quack.0001.exr<br/>
            /Users/julian/projects/duck/images/quack_no_transp.0001.exr<br/>
            /Users/julian/projects/duck/images/m2017render_quack.0001.exr<br/>
            /Users/julian/projects/duck/images/tmp/quack.0035.exr<br/>
            /Users/julian/projects/duck/images/tmp/minimal.exr<br/>
            /Users/julian/projects/alpha_piranha/images/tmp/untitled.exr<br/>
            /Users/julian/projects/FlamesTest/render/firetest_comp00100.exr<br/>
            /Users/julian/projects/lensd_test/images/quack.0008.exr<br/>
            /Users/julian/projects/lensd_test/images/quack.0009.exr<br/>
            /Users/julian/projects/lensd_test/images/quack.0002.exr<br/>
            /Users/julian/projects/lensd_test/images/quack.0003.exr<br/>
            /Users/julian/projects/lensd_test/images/quack.0001.exr<br/>
            /Users/julian/projects/lensd_test/images/quack.0010.exr<br/>
            /Users/julian/projects/lensd_test/images/quack.0004.exr<br/>
            /Users/julian/projects/lensd_test/images/quack.0005.exr<br/>
            /Users/julian/projects/lensd_test/images/quack.0007.exr<br/>
            /Users/julian/projects/lensd_test/images/quack.0006.exr<br/>
            /Users/julian/projects/fish/clarisse/renders/Z:/projects/fish/clarisse/renders/jobA2/image2.00120.exr<br/>
            /Users/julian/projects/fish/clarisse/renders/Z:/projects/fish/clarisse/renders/jobA1/image1.00120.exr<br/>
            /Users/julian/projects/fish/clarisse_fish/images/jobA/image100100.exr<br/>
            /Users/julian/projects/fish/clarisse_fish/images/jobA/image100101.exr<br/>
            
            </Typography>
           
        </main>
    );
}

export default CtDownloaderFilestream;
