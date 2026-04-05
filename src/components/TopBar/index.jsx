import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import fetchModel from '../../modelData/models';
import './styles.css';

function TopBar() {
  const location = useLocation();
  const path = location.pathname;
  let contextText = "";

  if (path.includes('/users/')) {
    const userId = path.split('/users/')[1];
    const user = fetchModel.userModel(userId);
    if (user) contextText = `${user.first_name} ${user.last_name}`;
  } else if (path.includes('/photos/')) {
    const userId = path.split('/photos/')[1];
    const user = fetchModel.userModel(userId);
    if (user) contextText = `Photos of ${user.first_name} ${user.last_name}`;
  }

  return (
    <AppBar className="cs142-topbar-appBar" position="absolute">
      <Toolbar className="topbar-appBar">
        <Typography variant="h6" color="inherit">
          {contextText}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;