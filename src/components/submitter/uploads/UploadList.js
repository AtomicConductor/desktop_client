import React from "react";
import UploadListItem from "./UploadListItem";

const UploadList = () => {
  const items = Array.from(Array(10).keys()).map(i => ({
    filename: `/Users/tom/projects/potter/maya/images/spiders_map.${i}.exr`,
    size: i * 10 + 500
  }));

  items.push({
    filename:
      "/Users/tom/projects/potter/maya/scenes/testSeqWinAngleBracketsNoAutoConvTx.ma",
    size: 23
  });
  items.push({
    filename: "/tools/arnold/alshaders/ubershaders",
    size: 50
  });
  items.push({
    filename: "/tools/psyop/cryptomatte",
    size: 11
  });

  return (
    <div>
      <br />
      {items.map((item, i) => (
        <UploadListItem
          key={i}
          odd={i % 2 === 0}
          filename={item.filename}
          size={item.size}
        />
      ))}
    </div>
  );
};

export default UploadList;
