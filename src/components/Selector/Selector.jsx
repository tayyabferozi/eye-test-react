import React from "react";

import "./Selector.scss";

const Selector = ({ id, label, children }) => {
  return (
    <div className="custom-form-control">
      <label htmlFor={id}>{label}</label>

      <div className="selector">{children}</div>
    </div>
  );
};

export default Selector;
