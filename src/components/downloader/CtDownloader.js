import React from "react";

import CtDownloaderFilestream from "./CtDownloaderFilestream";
import CtDownloaderFormDrawerContainer from "./CtDownloaderFormDrawerContainer";
import CtDownloaderAppBarContainer from "./CtDownloaderAppBarContainer";

function CtDownloader() {
    return (
        <React.Fragment>
            <CtDownloaderAppBarContainer />
            <CtDownloaderFilestream />
            <CtDownloaderFormDrawerContainer />
        </React.Fragment>
    );
}

export default CtDownloader;
