import React from "react";

import CtDownloaderFilestream from "./CtDownloaderFilestream";
import CtDownloaderFormDrawerContainer from "./CtDownloaderFormDrawerContainer";

function CtDownloader() {
    return (
        <React.Fragment>
            <CtDownloaderFilestream />
            <CtDownloaderFormDrawerContainer />
        </React.Fragment>
    );
}

export default CtDownloader;
