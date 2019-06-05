import { connect } from "react-redux";
import CtDownloaderAppBar from "./CtDownloaderAppBar";
import { toggleDrawer } from "../../_actions/downloader";

const mapStateToProps = (state, ownProps) => {
    return {
        drawerIsOpen: state.downloader.drawerOpen
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onToggleDrawer: () => {
            dispatch(toggleDrawer());
        }
    };
};

const CtDownloaderAppBarContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(CtDownloaderAppBar);

export default CtDownloaderAppBarContainer;
