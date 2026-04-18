import React, { useState, useEffect } from "react";
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate(); // Dùng để chuyển hướng khi click bong bóng đỏ

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetchModel("/api/user/list");
        setUsers(response.data);
      } catch (error) {
        console.error("Lỗi tải danh sách người dùng", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading)
    return (
      <Typography style={{ padding: "10px" }}>Đang tải danh sách...</Typography>
    );

  return (
    <div>
      <Typography variant="h6" style={{ padding: "10px" }}>
        Danh sách người dùng
      </Typography>
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
                  backgroundColor: isActive ? "#e3f2fd" : "transparent",
                  borderRight: isActive ? "4px solid #1976d2" : "none",
                  display: "flex",
                  justifyContent: "space-between", // Đẩy nội dung ra 2 bên
                }}
              >
                <ListItemText
                  primary={`${user.first_name} ${user.last_name}`}
                  primaryTypographyProps={{
                    fontWeight: isActive ? "bold" : "normal",
                    color: isActive ? "#1976d2" : "textPrimary",
                  }}
                />

                {/* EXTRA CREDIT: BONG BÓNG ĐẾM */}
                <Box display="flex" gap="8px">
                  {/* Bong bóng xanh: Số lượng ảnh */}
                  <Typography
                    style={{
                      backgroundColor: "#4caf50",
                      color: "white",
                      borderRadius: "12px",
                      padding: "2px 8px",
                      fontSize: "0.75rem",
                      fontWeight: "bold",
                    }}
                  >
                    {user.photoCount || 0}
                  </Typography>

                  {/* Bong bóng đỏ: Số lượng bình luận */}
                  <Typography
                    style={{
                      backgroundColor: "#f44336",
                      color: "white",
                      borderRadius: "12px",
                      padding: "2px 8px",
                      fontSize: "0.75rem",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                    onClick={(e) => {
                      e.preventDefault(); // Ngăn chặn sự kiện click của ListItem
                      e.stopPropagation();
                      navigate(`/comments/${user._id}`); // Chuyển sang trang xem comments
                    }}
                  >
                    {user.commentCount || 0}
                  </Typography>
                </Box>
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
