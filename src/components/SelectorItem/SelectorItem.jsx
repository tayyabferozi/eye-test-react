import React from "react";

import "./SelectorItem.scss";

const SelectorItem = ({ children, ...rest }) => {
  return (
    <label className="selector-item">
      <input type="radio" {...rest} />
      <div className="checkmark">{children}</div>
    </label>
  );
};

export default SelectorItem;
