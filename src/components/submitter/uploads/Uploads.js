import React, { useRef, useState } from "react";
import PropTypes from "prop-types";

import UploadListItem from "./UploadListItem";

import Box from "@material-ui/core/Box";
import { Typography } from "@material-ui/core";
import { useSelector } from "react-redux";
import { SelectableGroup } from "react-selectable-fast";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";

import { assetsSelector } from "../../../_selectors/submitter";

import UploadsHeader from "./UploadsHeader";
import { addAssets, removeAssets } from "../../../_actions/submitter";

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%"
  },
  centeredBox: {
    flexDirection: "column",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    margin: "auto"
  },
  scrollBox: {
    minWidth: "100%",
    width: "max-content",
    overflow: "auto",
    height: "100%"
  }
}));

const Uploads = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [selectedTriState, setSelectedTriState] = useState("none");
  const selectableGroupRef = useRef(null);
  const assets = useSelector(state => assetsSelector(state));
  const missingAssets = useSelector(
    state => state.submitter.validationResult.missingAssets
  );

  //used for faster O(1) lookups for missing assets
  const missingAssetsMap = missingAssets.reduce(
    (acc, asset) => ({
      ...acc,
      [asset]: {}
    }),
    {}
  );

  const handleSelectionFinish = e => {
    if (selectableGroupRef.current) {
      const numSelected = [...selectableGroupRef.current.selectedItems].length;
      if (numSelected === 0) {
        setSelectedTriState("none");
        return;
      }
      const numItems = [...selectableGroupRef.current.registry].length;
      if (numSelected === numItems) {
        setSelectedTriState("all");
        return;
      }
      setSelectedTriState("some");
    } else {
      setSelectedTriState("none");
    }
  };

  const handleAddFiles = filelist => {
    dispatch(
      addAssets(
        // filelist is not an array, hence the [...]
        [...filelist].reduce(
          (acc, _) => ({ ...acc, [_.path]: { size: _.size, type: _.type } }),
          {}
        )
      )
    );
    if (selectableGroupRef.current) {
      selectableGroupRef.current.clearSelection();
    }
  };

  const handleRemoveFiles = () => {
    if (!selectableGroupRef.current) return;

    if (Object.keys(missingAssetsMap).length) {
      dispatch(removeAssets(missingAssets));
    }

    dispatch(
      removeAssets(
        [...selectableGroupRef.current.selectedItems].map(_ => _.props.path)
      )
    );
    selectableGroupRef.current.clearSelection();
  };

  const handleTristateSelection = () => {
    if (selectableGroupRef.current) {
      if (selectedTriState === "none") {
        selectableGroupRef.current.selectAll();
      } else {
        selectableGroupRef.current.clearSelection();
      }
    }
  };

  return (
    <Box className={classes.container}>
      <UploadsHeader
        onBrowseEntries={handleAddFiles}
        onRemoveEntries={handleRemoveFiles}
        selectionState={selectedTriState}
        onClickCheckbox={handleTristateSelection}
      />
      {assets.length === 0 ? (
        <Box className={classes.centeredBox}>
          <Typography variant="h6">No assets selected for upload.</Typography>
        </Box>
      ) : (
        <Box className={classes.scrollBox} id="scroll-box">
          <SelectableGroup
            ref={selectableGroupRef}
            clickClassName="tick"
            scrollContainer="#scroll-box"
            enableDeselect
            tolerance={6}
            allowClickWithoutSelected={false}
            onSelectionFinish={handleSelectionFinish}
          >
            {assets.map((_, i) => (
              <UploadListItem
                key={i}
                odd={i % 2 === 0}
                path={_.path}
                missing={missingAssetsMap[_.path] !== undefined}
              />
            ))}
          </SelectableGroup>
        </Box>
      )}
    </Box>
  );
};

Uploads.contextTypes = {
  selectable: PropTypes.func
};

export default Uploads;
