import { connect } from "react-redux";
import CtSettingsEdit from "./CtSettingsEdit";
import { writeSettings } from "../../_actions/environment";

const mapStateToProps = (state, ownProps) => {
    return {
        settings: state.environment.settings
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onSave: settings => {
            dispatch(writeSettings(settings));
        }
    };
};

const CtSettingsEditContainerContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(CtSettingsEdit);

export default CtSettingsEditContainerContainer;
