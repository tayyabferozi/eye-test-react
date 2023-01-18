import React from "react";

import Selector from "../../../components/Selector";
import SelectorItem from "../../../components/SelectorItem";
import useRootContext from "../../../hooks/useRootContext";
import secondsToReadable from "../../../utils/secondsToReadable";
import "./Step4.scss";

const Step4 = ({ inputChangeHandler }) => {
  const { form } = useRootContext();

  return (
    <div>
      <div className="form">
        <div className="custom-form-control">
          <label htmlFor="" className="d-block">
            Duration based on: {form.durationOn}
          </label>
          <Selector>
            <SelectorItem
              name="durationOn"
              value="dots"
              checked={form.durationOn === "dots"}
              onChange={inputChangeHandler}
            >
              Dots
            </SelectorItem>
            <SelectorItem
              name="durationOn"
              value="time"
              checked={form.durationOn === "time"}
              onChange={inputChangeHandler}
            >
              Time
            </SelectorItem>
          </Selector>
        </div>

        {form.durationOn === "dots" ? (
          <div className="custom-form-control">
            <label htmlFor="" className="d-block">
              Number of dots:
            </label>

            <div className="inc-dec-timer">
              <button
                onClick={() =>
                  inputChangeHandler({
                    target: {
                      name: "maxTrainingDots",
                      value: --form.maxTrainingDots,
                    },
                  })
                }
              >
                -
              </button>
              <input
                type="number"
                name="maxTrainingDots"
                value={form.maxTrainingDots}
                onChange={inputChangeHandler}
              />
              <button
                onClick={() =>
                  inputChangeHandler({
                    target: {
                      name: "maxTrainingDots",
                      value: ++form.maxTrainingDots,
                    },
                  })
                }
              >
                +
              </button>
            </div>
            <div className="fs-12 mt-10">
              Estimated Training Duration:{" "}
              {secondsToReadable(
                (form.responseTime + form.delayTime) * form.maxTrainingDots
              )}{" "}
            </div>
          </div>
        ) : (
          <div className="custom-form-control">
            <label htmlFor="" className="d-block">
              Maximum Training Duration (in minutes):{" "}
            </label>

            <div className="inc-dec-timer">
              <button
                onClick={() =>
                  inputChangeHandler({
                    target: {
                      name: "maxTrainingDuration",
                      value: --form.maxTrainingDuration,
                    },
                  })
                }
              >
                -
              </button>
              <input
                type="number"
                name="maxTrainingDuration"
                value={form.maxTrainingDuration}
                onChange={inputChangeHandler}
              />
              <button
                onClick={() =>
                  inputChangeHandler({
                    target: {
                      name: "maxTrainingDuration",
                      value: ++form.maxTrainingDuration,
                    },
                  })
                }
              >
                +
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Step4;
