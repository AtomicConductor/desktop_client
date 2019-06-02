
import blueGrey from '@material-ui/core/colors/grey';
import orange from '@material-ui/core/colors/orange';
import lightGreen from '@material-ui/core/colors/lightGreen';

import { createMuiTheme } from "@material-ui/core/styles";
 
export default createMuiTheme({
    palette: {
        type: "dark",
        primary: blueGrey,
        secondary: lightGreen ,
        error: orange 
    }   
});
 