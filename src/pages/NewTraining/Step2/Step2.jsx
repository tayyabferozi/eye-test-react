import React from "react";
import Slider from "react-rangeslider";

import useRootContext from "../../../hooks/useRootContext";
import "./Step2.scss";

const Step2 = ({ inputChangeHandler }) => {
  const { form } = useRootContext();

  return (
    <div>
      <div className="stimulus">
        <div className="left">
          <div className="custom-form-control mb-80">
            <label htmlFor="" className="mb-30 d-block">
              Stimulus Size (dot): {form.stimulusSize}
            </label>
            <Slider
              min={3}
              max={60}
              value={form.stimulusSize}
              onChange={(value) =>
                inputChangeHandler({
                  target: {
                    name: "stimulusSize",
                    value,
                  },
                })
              }
            />
          </div>
          <div className="custom-form-control">
            <label htmlFor="" className="mb-30 d-block">
              Confidence Area (ring): {form.confidenceArea}
            </label>
            <Slider
              min={6}
              max={90}
              value={form.confidenceArea}
              onChange={(value) =>
                inputChangeHandler({
                  target: {
                    name: "confidenceArea",
                    value,
                  },
                })
              }
            />
          </div>
        </div>

        <div className="right">
          <div className="fw-500">Stimulus Preview</div>
          <div className="preview">
            <div
              className="preview-icon"
              style={{
                width: `${form.stimulusSize}mm`,
                height: `${form.stimulusSize}mm`,
              }}
            ></div>
            <div
              className="confidence-icon"
              style={{
                width: `${form.confidenceArea}mm`,
                height: `${form.confidenceArea}mm`,
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step2;
