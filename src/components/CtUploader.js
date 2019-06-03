import React from "react";

import CtUploaderFilestream from "./CtUploaderFilestream";
import CtUploaderFormDrawerContainer from "./CtDownloaderFormDrawerContainer";
import CtDownloaderAppBarContainer from "./CtDownloaderAppBarContainer";

function CtUploader() {
    return (
        <React.Fragment>
            <CtDownloaderAppBarContainer />
            <CtUploaderFilestream />
            <CtUploaderFormDrawerContainer />
        </React.Fragment>
    );
}

export default CtUploader;
