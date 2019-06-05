import { connect } from "react-redux";
import CtLayout from "./CtLayout";

const mapStateToProps = (state, ownProps) => {
    return {
        profile: state.profile,
        config: state.config
    };
};

const CtLayoutContainer = connect(mapStateToProps)(CtLayout);

export default CtLayoutContainer;
