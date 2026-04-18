import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";

function TopBar({ advancedFeatures, setAdvancedFeatures }) {
  const location = useLocation();
  const path = location.pathname;

  const [contextText, setContextText] = useState("Trang chủ");

  // Dùng useEffect để gọi API lấy tên người dùng mỗi khi URL thay đổi
  useEffect(() => {
    const fetchContext = async () => {
      try {
        if (path.includes("/photos/")) {
          const userId = path.split("/")[2];
          // SỬA Ở ĐÂY: Thêm /api/ vào trước đường dẫn
          const response = await fetchModel(`/api/user/${userId}`);
          setContextText(
            `Photos of ${response.data.first_name} ${response.data.last_name}`
          );
        } else if (path.includes("/users/")) {
          const userId = path.split("/users/")[1];
          if (userId) {
            // SỬA Ở ĐÂY: Thêm /api/ vào trước đường dẫn
            const response = await fetchModel(`/api/user/${userId}`);
            setContextText(
              `${response.data.first_name} ${response.data.last_name}`
            );
          } else {
            setContextText("Danh sách người dùng"); // Cho trang /users
          }
        } else {
          setContextText("Trang chủ");
        }
      } catch (error) {
        console.error("Không lấy được ngữ cảnh:", error);
        setContextText("...");
      }
    };

    fetchContext();
  }, [path]);

  return (
    <AppBar className="cs142-topbar-appBar" position="fixed">
      <Toolbar>
        <Typography
          variant="h6"
          color="inherit"
          style={{ flexGrow: 1, fontWeight: "bold" }}
        >
          PhotoSharingAPP
        </Typography>

        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <Typography variant="h6" color="inherit">
            {contextText}
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={advancedFeatures}
                onChange={(e) => setAdvancedFeatures(e.target.checked)}
                style={{ color: "white" }}
              />
            }
            label="Enable Advanced Features"
            style={{ margin: 0 }}
          />
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
