import React, { useEffect } from "react";
import Slider from "react-rangeslider";

import useRootContext from "../../../hooks/useRootContext";
import "./Step3.scss";

const Step3 = ({ inputChangeHandler }) => {
  const { form } = useRootContext();

  useEffect(() => {
    if (form.responseTime < form.displayTime)
      inputChangeHandler({
        target: {
          name: "responseTime",
          value: form.displayTime,
        },
      });
  }, [form.displayTime, form.responseTime, inputChangeHandler]);

  return (
    <div>
      <div className="stimulus">
        <div className="left">
          <div className="custom-form-control mb-30">
            <label htmlFor="" className="mb-30 d-block">
              Display time: {form.displayTime.toFixed(1)}
            </label>
            <Slider
              tooltip={false}
              min={0.1}
              max={4}
              step={0.1}
              value={form.displayTime}
              onChange={(value) =>
                inputChangeHandler({
                  target: {
                    name: "displayTime",
                    value,
                  },
                })
              }
            />
          </div>

          <div className="custom-form-control mb-30">
            <label htmlFor="" className="mb-30 d-block">
              Response time: {form.responseTime.toFixed(1)}
            </label>
            <Slider
              tooltip={false}
              min={0.1}
              max={4}
              step={0.1}
              value={form.responseTime}
              onChange={(value) =>
                inputChangeHandler({
                  target: {
                    name: "responseTime",
                    value,
                  },
                })
              }
            />
          </div>

          <div className="custom-form-control mb-30">
            <label htmlFor="" className="mb-30 d-block">
              Time between dots: {form.delayTime.toFixed(1)}
            </label>
            <Slider
              tooltip={false}
              min={0.1}
              max={3}
              step={0.1}
              value={form.delayTime}
              onChange={(value) =>
                inputChangeHandler({
                  target: {
                    name: "delayTime",
                    value,
                  },
                })
              }
            />
          </div>
        </div>
        <div className="right">
          <div>
            <div>
              The response time should always be equal to or greater than the
              Display Time!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step3;
