import { connect } from "react-redux";

import CtSnackbar from "./CtSnackbar";
import {
  clearNotification,
  showNotificationDetails
} from "../../_actions/notification";

const mapStateToProps = (state, ownProps) => {
  return {
    content: state.notification.snackbar,
    type: state.notification.type,
    open:
      !!state.notification.snackbar && state.notification.show === "snackbar",
    hasDetails: !!state.notification.details
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    dismiss: () => {
      dispatch(clearNotification());
    },
    showDetail: () => {
      dispatch(showNotificationDetails());
    }
  };
};

const CtSnackbarContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(CtSnackbar);

export default CtSnackbarContainer;
