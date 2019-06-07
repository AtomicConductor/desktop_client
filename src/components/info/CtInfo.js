import React from "react";

import CtInfoTabs from "./CtInfoTabs";
import CtInfoAppBarContainer from "./CtInfoAppBarContainer";

function CtInfo() {
    return (
        <React.Fragment>
            <CtInfoAppBarContainer />
            <CtInfoTabs />
        </React.Fragment>
    );
}

export default CtInfo;
