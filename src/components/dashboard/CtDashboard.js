import React from "react";

import CtDashboardContent from "./CtDashboardContent";
import CtDashboardAppBarContainer from "./CtDashboardAppBarContainer";

function CtDashboard() {
    return (
        <React.Fragment>
            <CtDashboardAppBarContainer />
            <CtDashboardContent />
 
        </React.Fragment>
    );
}

export default CtDashboard;
