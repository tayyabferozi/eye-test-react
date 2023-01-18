import { RootContext } from "../context/RootContext";
import { useContext } from "react";

export default function useRootContext() {
  const context = useContext(RootContext);

  if (!context) {
    throw Error("useRootContext must be used inside an RootContextProvider");
  }

  return context;
}
