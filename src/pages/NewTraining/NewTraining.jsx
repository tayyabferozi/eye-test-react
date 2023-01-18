import React, { useEffect, useState } from "react";
import { CheckIcon } from "@primer/octicons-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import clsx from "clsx";

import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Section from "../../components/Section";
import GridContainer from "../../components/GridContainer";
import useRootContext from "../../hooks/useRootContext";
import isEmpty from "../../utils/is-empty";
import Button from "../../components/Button";
import * as actionTypes from "../../context/actionTypes";
import "./NewTraining.scss";

const steps = [
  "General",
  // "Training Area",
  // "Fixation Area",
  "Stimulus Size",
  "Stimulus Times",
  "Duration",
];

const stepComps = [Step1, Step2, Step3, Step4];

const initialErrorState = {
  name: "",
};

const NewTraining = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { form, dispatch } = useRootContext();
  const [isModalActive, setIsModalActive] = useState(false);

  const [stepState, setStepState] = useState(1);
  const [errorsState, setErrorsState] = useState(initialErrorState);

  const setError = (name, val) =>
    setErrorsState((prevState) => ({ ...prevState, [name]: val }));

  const resetErrors = (names) => {
    names.forEach((name) => {
      setErrorsState((prevState) => ({ ...prevState, [name]: "" }));
    });
  };

  const decStep = () => {
    if (stepState === 1) {
      navigate("/");
    }

    setStepState((prevState) => {
      return prevState > 1 ? --prevState : prevState;
    });
  };

  const incStep = () => {
    let hasErrors = false;

    if (stepState === 1) {
      resetErrors(["name"]);

      if (isEmpty(form.name)) {
        hasErrors = true;
        setError("name", "Please choose a name");
      }
    }

    if (hasErrors) {
      return;
    }

    if (stepState === steps.length) {
      setIsModalActive(true);
      return;
    }

    setStepState((prevState) => {
      return prevState < steps.length ? ++prevState : prevState;
    });
  };

  const inputChangeHandler = (e) => {
    const { name, value } = e.target;

    dispatch({ type: actionTypes.ADD_FORM_VALUES, payload: { [name]: value } });
  };

  useEffect(() => {
    if (searchParams.get("form") === "edit") return;
    dispatch({ type: actionTypes.RESET_FORM });
  }, []);

  return (
    <>
      {isModalActive && (
        <>
          {" "}
          <div
            className="modal-overlay"
            onClick={() => {
              setIsModalActive(false);
            }}
          ></div>
          <div className="pre-training-modal">
            <h5>Before you start the TRAINING</h5>

            <GridContainer className="mt-20 text-start">
              <div className="col-md-6">
                <h6>System Settings</h6>
                <ol className="">
                  <li>
                    The brightness should be between 35 and 75% to protect your
                    eyes during the TRAINING.
                  </li>
                  <li>The browser zoom must be at 100%</li>
                </ol>
              </div>
              <div className="col-md-6">
                <h6>Recommendations</h6>

                <ol className="">
                  <li>
                    Make sure you are in a comfortable position so that you can
                    train well.
                  </li>
                  <li>
                    Make sure you have no distractions for the duraction of the
                    TRAINING.
                  </li>
                </ol>
              </div>
            </GridContainer>

            <div className="d-flex justify-content-center gap-10 mt-20">
              <Button primary onClick={() => navigate("/training-start")}>
                Go To Training
              </Button>
            </div>
          </div>
        </>
      )}
      <Section id="new-training">
        <div className="main-layout">
          <div className="main">
            <div className="progress-bar">
              <h4 className="mb-20">New Training</h4>

              <div className="progress-points">
                {steps.map((el, idx) => {
                  return (
                    <div
                      key={"progress-point" + idx}
                      className={clsx(
                        "point",
                        stepState === idx + 1 && "active"
                      )}
                    >
                      {el}
                      {stepState >= idx + 1 && (
                        <CheckIcon
                          fill={stepState === idx + 1 ? "#0f0" : "#fff"}
                          size={20}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="content">
              {stepComps.map((Comp, idx) => {
                return (
                  stepState === idx + 1 && (
                    <Comp
                      key={"step-comp" + idx}
                      errorsState={errorsState}
                      inputChangeHandler={inputChangeHandler}
                    />
                  )
                );
              })}
            </div>
          </div>

          <div className="d-flex justify-content-center">
            <div className="btns">
              <button onClick={decStep}>Previous</button>
              {/* {stepState < stepComps.length && ( */}
              <button
                className={clsx(stepState === stepComps.length && "active")}
                onClick={incStep}
              >
                {stepState < stepComps.length ? "Next" : "Start"}
              </button>
              {/* )} */}
            </div>
          </div>
        </div>
      </Section>
    </>
  );
};

export default NewTraining;
