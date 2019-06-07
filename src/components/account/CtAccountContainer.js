import { connect } from "react-redux";
import CtAccount from "./CtAccount";

const mapStateToProps = (state, ownProps) => {
    return {
        profile: state.profile
    };
};

const CtAccountContainer = connect(mapStateToProps)(CtAccount);

export default CtAccountContainer;
