import { ToastContainer } from "react-toastify";

import Routes from "./Routes";
import RootContextProvider from "./context/RootContext";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <ToastContainer />
      <div className="app">
        <div className="main-app">
          <RootContextProvider>
            <Routes />
          </RootContextProvider>
        </div>
        <div className="fallback">
          This website can only be used by desktop or tablet users
        </div>
      </div>
    </>
  );
}

export default App;
