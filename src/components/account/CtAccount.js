import React from "react";
import PropTypes from "prop-types";

import CtAccountContent from "./CtAccountContent";
import CtAccountSignIn from "./CtAccountSignIn";

const CtAccount = props => {
    const { profile } = props;
    const loggedIn = !!Object.entries(profile.user).length;

    if (loggedIn) {
        return <CtAccountContent />;
    }

    return <CtAccountSignIn />;
};

CtAccount.propTypes = {
    profile: PropTypes.object.isRequired
};

export default CtAccount;
