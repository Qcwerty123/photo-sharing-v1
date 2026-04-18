import React, { useState, useEffect } from "react";
import { Typography, Paper, Divider, Box, Avatar } from "@mui/material";
import { useParams, Link } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";

function UserComments() {
  const { userId } = useParams();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const response = await fetchModel(`/api/user/comments/${userId}`);
        setComments(response.data);
      } catch (error) {
        console.error("Lỗi lấy bình luận:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [userId]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading)
    return (
      <Typography style={{ padding: "20px" }}>Đang tải bình luận...</Typography>
    );
  if (comments.length === 0)
    return (
      <Typography style={{ padding: "20px" }}>
        Người dùng này chưa viết bình luận nào.
      </Typography>
    );

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Lịch sử bình luận
      </Typography>
      <Divider style={{ marginBottom: "20px" }} />

      {comments.map((comment) => (
        <Paper
          key={comment._id}
          elevation={2}
          style={{
            padding: "15px",
            marginBottom: "15px",
            display: "flex",
            gap: "20px",
            alignItems: "center",
            transition: "0.3s",
          }}
        >
          {/* Ảnh Thumbnail: Click vào sẽ dẫn đến ảnh chi tiết */}
          <Link to={`/photos/${comment.photo_owner_id}/${comment.photo_id}`}>
            <Avatar
              variant="rounded"
              src={require(`../../images/${comment.photo_file_name}`)}
              alt="Thumbnail"
              style={{
                width: 80,
                height: 80,
                cursor: "pointer",
                border: "1px solid #ddd",
              }}
            />
          </Link>

          {/* Nội dung bình luận */}
          <Box flex={1}>
            <Typography
              variant="body2"
              color="textSecondary"
              style={{ marginBottom: "5px" }}
            >
              Đã bình luận vào lúc: {formatDate(comment.date_time)}
            </Typography>
            {/* Click vào chữ cũng dẫn tới trang ảnh chi tiết */}
            <Link
              to={`/photos/${comment.photo_owner_id}/${comment.photo_id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Typography
                variant="body1"
                style={{
                  backgroundColor: "#f5f5f5",
                  padding: "10px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                "{comment.comment}"
              </Typography>
            </Link>
          </Box>
        </Paper>
      ))}
    </div>
  );
}

export default UserComments;
