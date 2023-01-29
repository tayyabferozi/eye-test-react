import React, { useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { toast } from "react-toastify";

import { db } from "../../firebase";
import useRootContext from "../../hooks/useRootContext";
import splitNumber from "../../utils/splitNumber";
import shuffle from "../../utils/shuffle";
import wrong from "../../assets/audio/wrong.mp3";
import right from "../../assets/audio/right.wav";
import end from "../../assets/audio/end.mp3";
import start from "../../assets/audio/start.mp3";
import "./TrainingScreen.scss";
import { useState } from "react";

const opacities = [0.33, 0.66, 1];

const rightAudio = new Audio(right);
const wrongAudio = new Audio(wrong);
const startAudio = new Audio(start);
const endAudio = new Audio(end);

rightAudio.volume = 0.3;
wrongAudio.volume = 0.3;
startAudio.volume = 0.3;
endAudio.volume = 0.3;

const TrainingScreen = () => {
  const navigate = useNavigate();
  const { form } = useRootContext();

  const isFormSavedRef = useRef(false);
  const closeRef = useRef();
  const dotsShownRef = useRef(0);
  const dotsClickedRef = useRef(0);
  const dotsClickedDetailsRef = useRef([]);
  const isCircleClickedRef = useRef(false); // for each cycle, track if already clicked
  const interval1Ref = useRef();
  const interval2Ref = useRef();
  const timeout1Ref = useRef();
  const timeout2Ref = useRef();
  const confidenceRef = useRef();
  const previewWrapRef = useRef();
  const previewRef = useRef();
  const testState = useRef();
  const trainingScreenRef = useRef();
  const opacitiesRef = useRef();
  const currOpacityRef = useRef();
  const splittedRef = useRef([]);
  const lightDotsClickedRef = useRef(0);
  const optimalDotsClickedRef = useRef(0);
  const brightDotsClickedRef = useRef(0);
  const [isGeneratingResults, setIsGeneratingResults] = useState(false);

  const saveData = useCallback(
    async function () {
      if (isFormSavedRef.current) return;
      isFormSavedRef.current = true;
      try {
        setIsGeneratingResults(true);
        const docGenerated = await addDoc(collection(db, "trainings"), {
          ...form,
          totalDots: dotsShownRef.current,
          clickedDots: dotsClickedRef.current,
          date: new Date(),
          opacitiesDistribution: opacitiesRef.current,
          dotsClickedDetails: dotsClickedDetailsRef.current,
          splitted: splittedRef.current,
          lightDotsClicked: lightDotsClickedRef.current,
          optimalDotsClicked: optimalDotsClickedRef.current,
          brightDotsClicked: brightDotsClickedRef.current,
        });
        console.log(docGenerated);
        navigate(`/training-stats/${docGenerated.id}`, { replace: true });
        toast.success("Data saved succesfully!");
      } catch (err) {
        console.log(err);
      } finally {
        // setIsGeneratingResults(false);
      }
    },
    [form, navigate]
  );

  const endTest = useCallback(() => {
    endAudio.play();
    stopTest();
    saveData();
  }, [saveData]);

  const stopTest = () => {
    testState.current = "stopped";
    clearInterval(interval1Ref.current);
    clearInterval(interval2Ref.current);
    clearTimeout(timeout1Ref.current);
    clearTimeout(timeout2Ref.current);
  };

  const startTest = useCallback(() => {
    testState.current = "started";
    startAudio.play();

    let totalTime = 0;
    const cycleTime = form.responseTime + form.delayTime;

    let splitted;

    if (form.durationOn === "dots") {
      const totalTimeSec = (+form.maxTrainingDots + 1) * cycleTime;

      totalTime = totalTimeSec * 1000;

      splitted = splitNumber(+form.maxTrainingDots, 3);
    } else {
      totalTime = form.maxTrainingDuration * 60 * 1000;

      splitted = splitNumber(
        (+form.maxTrainingDuration * 60) / +form.displayTime +
          +form.responseTime,
        3
      );
    }

    splittedRef.current = splitted;

    let opacitiesArray = [];

    splitted.forEach((el, idx) => {
      const op = new Array(el).fill(opacities[idx]);
      opacitiesArray = [...opacitiesArray, ...op];
    });

    const shuffledArr = shuffle(opacitiesArray);

    opacitiesRef.current = shuffledArr;

    timeout2Ref.current = setTimeout(function () {
      endTest();
      // stopTest();
    }, totalTime);

    interval1Ref.current = setInterval(function () {
      previewRef.current.style.display = "block";
      currOpacityRef.current =
        (opacitiesRef.current && opacitiesRef.current[dotsShownRef.current]) ||
        1;
      previewRef.current.style.opacity = currOpacityRef.current;
      confidenceRef.current.style.display = "block";
      isCircleClickedRef.current = false;

      const randomPercentage1 = Math.floor(Math.random() * (75 - 26 + 1) + 26);
      const randomPercentage2 = Math.floor(Math.random() * 101);

      previewWrapRef.current.style.left = randomPercentage1 + "%";
      previewWrapRef.current.style.top = randomPercentage2 + "%";
      previewWrapRef.current.style.transform = `translate(-${randomPercentage1}%, -${randomPercentage2}%)`;

      dotsShownRef.current += 1;

      timeout1Ref.current = setTimeout(function () {
        previewRef.current.style.display = "none";
      }, form.displayTime * 1000);

      timeout1Ref.current = setTimeout(function () {
        if (!isCircleClickedRef.current) wrongAudio.play();
        confidenceRef.current.style.display = "none";
      }, form.responseTime * 1000);
    }, cycleTime * 1000);
  }, [form, endTest]);

  const circleClickHandler = () => {
    if (!isCircleClickedRef.current) {
      rightAudio.play();
      isCircleClickedRef.current = true;
      dotsClickedRef.current += 1;
      dotsClickedDetailsRef.current.push(currOpacityRef.current);

      if (currOpacityRef.current === 0.33) lightDotsClickedRef.current += 1;
      else if (currOpacityRef.current === 0.66)
        optimalDotsClickedRef.current += 1;
      else if (currOpacityRef.current === 1) brightDotsClickedRef.current += 1;
      previewRef.current.style.display = "none";
    } else {
      wrongAudio.play();
    }
  };

  useEffect(() => {
    if (previewRef && confidenceRef && testState.current !== "started")
      startTest();
  }, [previewRef, confidenceRef, startTest, testState]);

  useEffect(() => {
    const elem = trainingScreenRef.current;

    if (!elem) return;

    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      /* Safari */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      /* IE11 */
      elem.msRequestFullscreen();
    }
  }, [trainingScreenRef]);

  useEffect(() => {
    return () => {
      stopTest();
    };
  }, []);

  useEffect(() => {
    const ev = (e) => {
      if (e.target !== confidenceRef.current && e.target !== closeRef.current) {
        wrongAudio.play();
      }
    };

    const screenEl = trainingScreenRef.current;

    if (screenEl) {
      screenEl.addEventListener("click", ev);

      return () => {
        if (screenEl) screenEl.removeEventListener("click", ev);
      };
    }
  }, [trainingScreenRef]);

  if (isGeneratingResults) {
    return (
      <div className="gen-res">
        <div>Generating results...</div>
      </div>
    );
  }

  return (
    <>
      {/* <div className={clsx("exit-modal")}>
        <h5>Do you really want to exit the training?</h5>
        <h5>Your progress will not be saved.</h5>


        <div className="d-flex justify-content-center gap-10 mt-30">
          <Button red>No</Button>
          <Button primary>Yes</Button>
        </div>
      </div> */}

      <div id="training-screen" ref={trainingScreenRef}>
        <div
          onClick={() => {
            endAudio.play();
            stopTest();
            navigate("/");
          }}
          className="close"
          ref={closeRef}
        >
          ❌
        </div>

        <div className="small-dot"></div>

        <div className="preview" ref={previewWrapRef}>
          <div
            ref={previewRef}
            className="preview-icon"
            style={{
              width: `${form.stimulusSize}mm`,
              height: `${form.stimulusSize}mm`,
            }}
          ></div>
          <div
            ref={confidenceRef}
            onClick={circleClickHandler}
            className="confidence-icon"
            style={{
              width: `${form.confidenceArea}mm`,
              height: `${form.confidenceArea}mm`,
            }}
          ></div>
        </div>
      </div>
    </>
  );
};

export default TrainingScreen;
