import { ToastContainer } from "react-toastify";

import Routes from "./Routes";
import RootContextProvider from "./context/RootContext";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <ToastContainer />
      <div className="app">
        <RootContextProvider>
          <Routes />
        </RootContextProvider>
      </div>
    </>
  );
}

export default App;
