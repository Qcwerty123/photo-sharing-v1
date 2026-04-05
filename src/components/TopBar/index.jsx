import React from 'react';
import { AppBar, Toolbar, Typography, Checkbox, FormControlLabel } from '@mui/material';
import { useLocation } from 'react-router-dom';
import models from '../../modelData/models';

function TopBar({ advancedFeatures, setAdvancedFeatures }) {
  const location = useLocation();
  const path = location.pathname;
  let contextText = "Trang chủ";

  // Phân tích URL để lấy ngữ cảnh
  if (path.includes('/photos/')) {
    const parts = path.split('/');
    const userId = parts[2];
    const user = models.userModel(userId);
    if (user) contextText = `Photos of ${user.first_name} ${user.last_name}`;
  } else if (path.includes('/users/')) {
    const userId = path.split('/users/')[1];
    const user = models.userModel(userId);
    if (user) contextText = `${user.first_name} ${user.last_name}`;
  } else if (path === '/users') {
    contextText = "Danh sách người dùng";
  }

  return (
    <AppBar className="cs142-topbar-appBar" position="fixed">
      <Toolbar>
        {/* Tên của bạn */}
        <Typography variant="h6" color="inherit" style={{ flexGrow: 1, fontWeight: 'bold' }}>
          PhotoShare App
        </Typography>

        {/* Cụm Checkbox và Ngữ cảnh nằm bên phải */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Typography variant="h6" color="inherit">
            {contextText}
          </Typography>
          <FormControlLabel
            control={
              <Checkbox 
                checked={advancedFeatures} 
                onChange={(e) => setAdvancedFeatures(e.target.checked)} 
                style={{ color: 'white' }} 
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