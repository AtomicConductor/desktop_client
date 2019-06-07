import { connect } from "react-redux";
import CtInfoAppBar from "./CtInfoAppBar";
// import { toggleDrawer } from "../../_actions/ui";

const mapStateToProps = (state, ownProps) => {
    return {
        env: state.environment.data
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        // onToggleDrawer: () => {
        //   dispatch(toggleDrawer());
        // }
    };
};

const CtInfoAppBarContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(CtInfoAppBar);

export default CtInfoAppBarContainer;
