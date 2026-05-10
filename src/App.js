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
import LoginRegister from "./components/LoginRegister"; // IMPORT COMPONENT MỚI

const App = () => {
  // Trạng thái bật/tắt tính năng nâng cao (Extra Credit)
  const [advancedFeatures, setAdvancedFeatures] = useState(false);

  // Trạng thái lưu trữ thông tin người dùng đang đăng nhập
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <Router>
      <div>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TopBar
              advancedFeatures={advancedFeatures}
              setAdvancedFeatures={setAdvancedFeatures}
              currentUser={currentUser} // Truyền xuống TopBar để hiện tên và nút Logout
              setCurrentUser={setCurrentUser}
            />
          </Grid>

          <div className="main-topbar-buffer" />

          {/* LUỒNG CHƯA ĐĂNG NHẬP: Bắt mọi đường dẫn về trang LoginRegister */}
          {!currentUser ? (
            <Grid item xs={12}>
              <Routes>
                <Route
                  path="*"
                  element={<LoginRegister onLogin={setCurrentUser} />}
                />
              </Routes>
            </Grid>
          ) : (
            /* LUỒNG ĐÃ ĐĂNG NHẬP: Hiển thị giao diện chính như bình thường */
            <>
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
                      element={
                        <UserPhotos advancedFeatures={advancedFeatures} />
                      }
                    />
                    <Route
                      path="/photos/:userId"
                      element={
                        <UserPhotos advancedFeatures={advancedFeatures} />
                      }
                    />

                    <Route path="/users" element={<UserList />} />

                    <Route
                      path="/comments/:userId"
                      element={<UserComments />}
                    />

                    {/* Khi đăng nhập thành công hoặc vào root "/", tự động chuyển về trang detail của chính user đó */}
                    <Route
                      path="/"
                      element={<Navigate to={`/users/${currentUser._id}`} />}
                    />
                  </Routes>
                </Paper>
              </Grid>
            </>
          )}
        </Grid>
      </div>
    </Router>
  );
};

export default App;
