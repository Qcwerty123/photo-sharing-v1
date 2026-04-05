import React from 'react';
import { Divider, List, ListItem, ListItemText, Typography } from '@mui/material';
import { Link, useLocation } from 'react-router-dom'; // Thêm useLocation
import models from '../../modelData/models';

function UserList() {
  const users = models.userListModel();
  const location = useLocation(); // Lấy thông tin URL hiện tại

  return (
    <div>
      <Typography variant="h6" style={{ padding: '10px' }}>Danh sách người dùng</Typography>
      <Divider />
      <List component="nav">
        {users.map((user) => {
          // Kiểm tra xem ID của user này có đang xuất hiện trong URL hiện tại không
          // Cách này sẽ highlight đúng cả khi đang ở trang UserDetail lẫn UserPhotos
          const isActive = location.pathname.includes(user._id);

          return (
            <React.Fragment key={user._id}>
              <ListItem 
                button 
                component={Link} 
                to={`/users/${user._id}`}
                selected={isActive} // Thuộc tính của Material-UI tự động highlight màu nền xám nhẹ
                style={{
                  // Thêm màu nền hoặc hiệu ứng tuỳ chỉnh nếu bạn muốn nó nổi bật hơn màu mặc định
                  backgroundColor: isActive ? '#e3f2fd' : 'transparent', 
                  borderRight: isActive ? '4px solid #1976d2' : 'none' // Thêm dải màu xanh bên phải cho đẹp
                }}
              >
                <ListItemText 
                  primary={`${user.first_name} ${user.last_name}`} 
                  // In đậm tên người dùng đang được chọn
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