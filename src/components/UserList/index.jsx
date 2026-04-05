import React, { useState, useEffect } from 'react';
import { Divider, List, ListItem, ListItemText, Typography } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import fetchModel from '../../lib/fetchModelData'; 

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const response = await fetchModel('/user/list');
        setUsers(response.data);
      } catch (error) {
        console.error("Lỗi lấy danh sách:", error);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []); 

  if (loading) return <Typography style={{ padding: '10px' }}>Đang tải danh sách...</Typography>;

  return (
    <div>
      <Typography variant="h6" style={{ padding: '10px' }}>Danh sách người dùng</Typography>
      <Divider />
      <List component="nav">
        {users.map((user) => {
          const isActive = location.pathname.includes(user._id);
          return (
            <React.Fragment key={user._id}>
              <ListItem 
                button 
                component={Link} 
                to={`/users/${user._id}`}
                selected={isActive}
                style={{
                  backgroundColor: isActive ? '#e3f2fd' : 'transparent', 
                  borderRight: isActive ? '4px solid #1976d2' : 'none'
                }}
              >
                <ListItemText 
                  primary={`${user.first_name} ${user.last_name}`} 
                  primaryTypographyProps={{
                    fontWeight: isActive ? 'bold' : 'normal',
                    color: isActive ? '#1976d2' : 'textPrimary'
                  }}
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          );
        })}
      </List>
    </div>
  );
}

export default UserList;