import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";

import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Card from "@material-ui/core/Card";
import Box from "@material-ui/core/Box";
import FilledInput from "@material-ui/core/FilledInput";
import Button from "@material-ui/core/Button";

import { googleProjects } from "../../helpers/constants";

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200
  },
  dense: {
    marginTop: 19
  },
  menu: {
    width: 200
  },
  formControl: {
    margin: theme.spacing(1),
    width: "100%"
  },
  card: {
    width: "700px",
    padding: "80px",
    margin: "auto",
    marginTop: "100px"
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3)
  },
  buttonBox: {
    display: "flex",
    justifyContent: "flex-end"
  }
}));

const CtSettingsEdit = props => {
  const classes = useStyles();

  const { onSave, settings } = props;

  const project = googleProjects.find(
    p => p.name === settings.googleProjectName
  );

  // const [values, setValues] = React.useState(false);

  const [values, setValues] = React.useState({
    googleProjectName: project.name,
    pythonPath: settings.pythonPath
  });

  console.log(`settings.pythonPath ${settings.pythonPath}`);

  console.log(`values.pythonPath ${values.pythonPath}`);

  useEffect(() => {
    setValues({
      googleProjectName: project.name,
      pythonPath: settings.pythonPath
    });
  }, [settings]);

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleSave = event => {
    onSave(values);
  };

  return (
    <main className={classes.content}>
      <Card className={classes.card}>
        <FormControl className={classes.formControl} variant="filled">
          <InputLabel htmlFor="gproject">Google Project</InputLabel>
          <Select
            input={
              <FilledInput
                name="gproject"
                id="gproject"
                onChange={handleChange("googleProjectName")}
              />
            }
            value={values.googleProjectName}
          >
            {googleProjects.map((p, index) => (
              <MenuItem key={index} value={p.name}>
                {`${p.longName} (${p.name})`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
          <TextField
            onChange={handleChange("pythonPath")}
            id="pythonpath"
            label="Python path"
            fullWidth
            variant="filled"
            value={values.pythonPath}
          />
        </FormControl>
        <FormControl className={classes.formControl}>
          <Box className={classes.buttonBox}>
            <Button onClick={handleSave} variant="contained" color="secondary">
              Save
            </Button>
          </Box>
        </FormControl>
      </Card>
    </main>
  );
};

CtSettingsEdit.propTypes = {
  settings: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired
};

export default CtSettingsEdit;
