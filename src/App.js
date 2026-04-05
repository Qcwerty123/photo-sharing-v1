import './App.css';

import React, { useState } from "react"; // Bổ sung useState
import { Grid, Typography, Paper } from "@mui/material";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";

const App = (props) => {
  // Thêm state để quản lý tính năng Advanced Features (Extra Credit)
  const [advancedFeatures, setAdvancedFeatures] = useState(false);

  return (
      <Router>
        <div>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {/* Truyền state và hàm set xuống TopBar để điều khiển Checkbox */}
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
                  <Route
                      path="/users/:userId"
                      element={<UserDetail />}
                  />
                  
                  {/* Cấu hình 2 Route cho UserPhotos để hỗ trợ Deep Linking.
                      Một cái có photoId, một cái không có, cả hai đều trỏ về 1 Component */}
                  <Route
                      path="/photos/:userId/:photoId"
                      element={<UserPhotos advancedFeatures={advancedFeatures} />}
                  />
                  <Route
                      path="/photos/:userId"
                      element={<UserPhotos advancedFeatures={advancedFeatures} />}
                  />
                  
                  <Route path="/users" element={<UserList />} />
                </Routes>
              </Paper>
            </Grid>
          </Grid>
        </div>
      </Router>
  );
}

export default App;