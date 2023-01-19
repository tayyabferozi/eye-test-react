import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import NewTraining from "./pages/NewTraining";
import Trainings from "./pages/Trainings";
import TrainingScreen from "./pages/TrainingScreen";
import TrainingStats from "./pages/TrainingStats/TrainingStats";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route path="/" element={<Trainings />} />
          <Route path="new-training" element={<NewTraining />} />
          <Route path="training-start" element={<TrainingScreen />} />
          <Route path="training-stats">
            <Route index element={<TrainingStats />} />
            <Route path=":id" element={<TrainingStats single />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
