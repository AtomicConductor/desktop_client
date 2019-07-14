import { connect } from "react-redux";
import Drawer from "./Drawer";

const mapStateToProps = state => ({ profile: state.profile });

const DrawerContainer = connect(mapStateToProps)(Drawer);

export { mapStateToProps };

export default DrawerContainer;
