import React from "react";

import useRootContext from "../../../hooks/useRootContext";
import Input from "../../../components/Input";
import Selector from "../../../components/Selector";
import SelectorItem from "../../../components/SelectorItem";

const Step1 = ({ errorsState, inputChangeHandler }) => {
  const { form } = useRootContext();

  console.log(form);

  return (
    <div>
      <div className="form">
        <Input
          error={errorsState.name}
          name="name"
          label="Training plan name"
          value={form.name || ""}
          onChange={inputChangeHandler}
        />

        <Selector label="Target Eye:">
          <SelectorItem
            name="eye"
            value="left"
            checked={form.eye === "left"}
            onChange={inputChangeHandler}
          >
            Left
          </SelectorItem>
          <SelectorItem
            name="eye"
            value="right"
            checked={form.eye === "right"}
            onChange={inputChangeHandler}
          >
            right
          </SelectorItem>
        </Selector>
      </div>
    </div>
  );
};

export default Step1;
