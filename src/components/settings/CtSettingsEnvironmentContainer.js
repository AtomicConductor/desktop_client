import { connect } from "react-redux";
import CtSettingsEnvironment from "./CtSettingsEnvironment";
// import { toggleDrawer } from "../../_actions/ui";

const mapStateToProps = (state, ownProps) => {
    return {
        environment: state.environment
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        // onToggleDrawer: () => {
        //   dispatch(toggleDrawer());
        // }
    };
};

const CtSettingsEnvironmentContainer = connect(mapStateToProps)(
    CtSettingsEnvironment
);

export default CtSettingsEnvironmentContainer;
