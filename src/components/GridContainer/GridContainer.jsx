import React from "react";
import clsx from "clsx";

const GridContainer = ({ className, children }) => {
  return (
    <div className={clsx(className, "container-fluid px-0")}>
      <div className="row">{children}</div>
    </div>
  );
};

export default GridContainer;
