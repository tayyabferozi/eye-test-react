import { createContext, useReducer } from "react";

import * as actionTypes from "./actionTypes";

export const RootContext = createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.ADD_FORM_VALUES:
      return { ...state, form: { ...state.form, ...action.payload } };
    case actionTypes.SET_FORM_VALUES:
      console.log(action.payload);
      return {
        ...state,
        form: { ...action.payload },
      };
    case actionTypes.RESET_FORM:
      return {
        ...state,
        form: {
          name: "",
          eye: "left",
          stimulusSize: 10,
          confidenceArea: 18,
          displayTime: 0.5,
          responseTime: 1,
          delayTime: 1,
          durationOn: "time",
          maxTrainingDuration: 0.5,
          maxTrainingDots: 24,
        },
      };
    default:
      return state;
  }
};

export default function RootContextProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, {
    form: {
      name: "",
      eye: "left",
      stimulusSize: 10,
      confidenceArea: 18,
      displayTime: 0.5,
      responseTime: 1,
      delayTime: 1,
      durationOn: "time",
      maxTrainingDuration: 0.5,
      maxTrainingDots: 24,
    },
  });

  return (
    <RootContext.Provider value={{ ...state, dispatch }}>
      {children}
    </RootContext.Provider>
  );
}
