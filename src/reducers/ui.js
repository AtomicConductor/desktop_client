 import {
  DL_TOGGLE_DRAWER
} from "../actions/ui";
   
function ui(state = {downloader: {drawerOpen: false}}, action) {
  switch (action.type) {

    case DL_TOGGLE_DRAWER:
      return Object.assign({}, state, {
        downloader: {
          drawerOpen: !state.downloader.drawerOpen,
        }
      });
    default:
      return state;
  }
}

export default ui;
