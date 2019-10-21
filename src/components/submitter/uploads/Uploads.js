import React from "react";
import Box from "@material-ui/core/Box";

import UploadList from "./UploadList";

import { SelectableGroup } from "react-selectable-fast";

const Uploads = props => {
  const handleSelecting = event => {
    console.log("handleSelecting");
  };

  const handleSelectionClear = event => {
    console.log("handleSelectionClear");
  };
  const handleSelectionFinish = event => {
    console.log("handleSelectionFinish");
  };

  return (
    <Box>
      <SelectableGroup
        className="main"
        clickClassName="tick"
        scrollContainer="#scroll-box"
        enableDeselect
        tolerance={6}
        globalMouse={true}
        allowClickWithoutSelected={false}
        duringSelection={handleSelecting}
        onSelectionClear={handleSelectionClear}
        onSelectionFinish={handleSelectionFinish}
      >
        <UploadList />
      </SelectableGroup>
    </Box>
  );
};

export default Uploads;
