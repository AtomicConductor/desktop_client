import { connect } from "react-redux";
import CtDrawer from "./CtDrawer";

const mapStateToProps = state => ({ profile: state.profile });

const CtDrawerContainer = connect(mapStateToProps)(CtDrawer);

export { mapStateToProps };

export default CtDrawerContainer;
