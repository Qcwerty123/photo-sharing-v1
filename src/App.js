import "./App.css";

import React, { useState } from "react";
import { Grid, Paper } from "@mui/material";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import UserComments from "./components/UserComments";

const App = () => {
  // Trạng thái bật/tắt tính năng nâng cao (Extra Credit)
  const [advancedFeatures, setAdvancedFeatures] = useState(false);

  return (
    <Router>
      <div>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TopBar
              advancedFeatures={advancedFeatures}
              setAdvancedFeatures={setAdvancedFeatures}
            />
          </Grid>

          <div className="main-topbar-buffer" />

          <Grid item sm={3}>
            <Paper className="main-grid-item">
              <UserList />
            </Paper>
          </Grid>

          <Grid item sm={9}>
            <Paper className="main-grid-item">
              <Routes>
                <Route path="/users/:userId" element={<UserDetail />} />

                <Route
                  path="/photos/:userId/:photoId"
                  element={<UserPhotos advancedFeatures={advancedFeatures} />}
                />
                <Route
                  path="/photos/:userId"
                  element={<UserPhotos advancedFeatures={advancedFeatures} />}
                />

                <Route path="/users" element={<UserList />} />

                <Route path="/" element={<Navigate to="/users" />} />

                <Route path="/comments/:userId" element={<UserComments />} />
              </Routes>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </Router>
  );
};

export default App;
