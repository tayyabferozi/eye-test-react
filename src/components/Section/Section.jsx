import React from "react";
import clsx from "clsx";

import "./Section.scss";

const Section = ({ className, short, children, notCentered, ...rest }) => {
  return (
    <div
      className={clsx(
        "page-section",
        className,
        !notCentered && "vertical-centered"
      )}
      {...rest}
    >
      <div className={clsx("page-container", { short })}>{children}</div>
    </div>
  );
};

export default Section;
