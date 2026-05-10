import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardMedia,
  CardContent,
  Divider,
  Button,
  TextField,
  Box,
} from "@mui/material";
import { useParams, Link, useNavigate } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";

function UserPhotos({ advancedFeatures }) {
  const { userId, photoId } = useParams();
  const navigate = useNavigate();

  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  // STATE MỚI: Quản lý nội dung bình luận đang gõ cho từng bức ảnh
  const [newComments, setNewComments] = useState({});

  // Đưa hàm loadPhotos ra ngoài useEffect để có thể gọi lại sau khi thêm comment
  const loadPhotos = async () => {
    try {
      setLoading(true);
      const response = await fetchModel(`/api/photo/photosOfUser/${userId}`);
      setPhotos(response.data);
    } catch (error) {
      console.error("Lỗi lấy ảnh:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPhotos();
  }, [userId]);

  // HÀM MỚI: Cập nhật state khi người dùng gõ phím
  const handleCommentChange = (currentPhotoId, text) => {
    setNewComments((prev) => ({
      ...prev,
      [currentPhotoId]: text,
    }));
  };

  // HÀM MỚI: Gửi API khi người dùng nhấn nút Gửi
  const handleAddComment = async (currentPhotoId) => {
    const commentText = newComments[currentPhotoId];

    // Kiểm tra rỗng theo yêu cầu đề bài
    if (!commentText || commentText.trim() === "") {
      alert("Vui lòng nhập nội dung bình luận!");
      return;
    }

    try {
      // Gọi API POST để lưu comment
      await fetchModel(`/api/photo/commentsOfPhoto/${currentPhotoId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment: commentText }),
      });

      // Nếu thành công: Xóa ô text của ảnh đó đi
      setNewComments((prev) => ({
        ...prev,
        [currentPhotoId]: "",
      }));

      // Gọi lại API lấy danh sách ảnh để giao diện cập nhật ngay lập tức (Yêu cầu đề bài)
      loadPhotos();
    } catch (error) {
      alert("Lỗi khi thêm bình luận: " + error.message);
    }
  };

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
    return <Typography style={{ padding: "20px" }}>Đang tải ảnh...</Typography>;
  if (photos.length === 0)
    return (
      <Typography style={{ padding: "20px" }}>Chưa có bức ảnh nào.</Typography>
    );

  const getImageSrc = (fileName) => {
    // Nếu tên file bắt đầu bằng số (định dạng Date.now() của ảnh mới upload)
    // hoặc không có trong danh sách file mẫu cũ
    const isNewUpload = /^\d+/.test(fileName);

    if (isNewUpload) {
      // Lấy từ Backend
      return `https://s5wc99-8080.csb.app/images/${fileName}`;
    } else {
      // Lấy từ thư mục ảnh cục bộ của Frontend (các ảnh mẫu của Lab)
      try {
        return require(`../../images/${fileName}`);
      } catch (err) {
        // Phòng hờ nếu require lỗi thì gọi thử qua Backend
        return `https://s5wc99-8080.csb.app/images/${fileName}`;
      }
    }
  };

  // ==========================================
  // === EXTRA CREDIT: CHẾ ĐỘ STEPPER ===
  // ==========================================
  if (advancedFeatures) {
    let currentIndex = photos.findIndex((p) => p._id === photoId);
    if (currentIndex === -1) currentIndex = 0;

    const currentPhoto = photos[currentIndex];

    return (
      <Card style={{ maxWidth: "800px", margin: "20px auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "15px",
          }}
        >
          <Button
            variant="contained"
            disabled={currentIndex === 0}
            onClick={() =>
              navigate(`/photos/${userId}/${photos[currentIndex - 1]._id}`)
            }
          >
            Back
          </Button>
          <Typography
            variant="body1"
            style={{ alignSelf: "center", fontWeight: "bold" }}
          >
            Ảnh {currentIndex + 1} / {photos.length}
          </Typography>
          <Button
            variant="contained"
            disabled={currentIndex === photos.length - 1}
            onClick={() =>
              navigate(`/photos/${userId}/${photos[currentIndex + 1]._id}`)
            }
          >
            Next
          </Button>
        </div>

        <CardMedia
          component="img"
          //src={require(`../../images/${currentPhoto.file_name}`)}
          src={getImageSrc(currentPhoto.file_name)}
          alt="User photo"
          style={{
            maxHeight: "600px",
            objectFit: "contain",
            backgroundColor: "#f0f0f0",
          }}
        />

        <CardContent>
          <Typography variant="caption" color="textSecondary">
            Đăng lúc: {formatDate(currentPhoto.date_time)}
          </Typography>
          <Divider style={{ margin: "10px 0" }} />
          <Typography variant="h6">Bình luận:</Typography>

          {/* Hiển thị bình luận */}
          {currentPhoto.comments?.map((comment) => (
            <div
              key={comment._id}
              style={{
                marginTop: "10px",
                backgroundColor: "#f9f9f9",
                padding: "10px",
                borderRadius: "5px",
              }}
            >
              <Typography variant="body2">
                <Link
                  to={`/users/${comment.user._id}`}
                  style={{
                    textDecoration: "none",
                    fontWeight: "bold",
                    color: "#1976d2",
                  }}
                >
                  {comment.user.first_name} {comment.user.last_name}
                </Link>
                {" - "}
                <span style={{ fontSize: "0.8em", color: "gray" }}>
                  {formatDate(comment.date_time)}
                </span>
              </Typography>
              <Typography variant="body1" style={{ marginTop: "5px" }}>
                {comment.comment}
              </Typography>
            </div>
          ))}

          {/* KHU VỰC THÊM BÌNH LUẬN MỚI */}
          <Box display="flex" alignItems="center" mt={3}>
            <TextField
              size="small"
              fullWidth
              variant="outlined"
              label="Viết bình luận..."
              value={newComments[currentPhoto._id] || ""}
              onChange={(e) =>
                handleCommentChange(currentPhoto._id, e.target.value)
              }
              onKeyPress={(e) => {
                if (e.key === "Enter") handleAddComment(currentPhoto._id);
              }}
            />
            <Button
              variant="contained"
              color="primary"
              style={{ marginLeft: "10px", minWidth: "80px" }}
              onClick={() => handleAddComment(currentPhoto._id)}
            >
              GỬI
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  }

  // ==========================================
  // === CHẾ ĐỘ HIỂN THỊ TẤT CẢ (DEFAULT) ===
  // ==========================================
  return (
    <div style={{ padding: "20px" }}>
      {photos.map((photo) => (
        <Card key={photo._id} style={{ marginBottom: "40px" }}>
          <CardMedia
            component="img"
            src={getImageSrc(photo.file_name)}
            alt="User photo"
            style={{
              maxHeight: "600px",
              objectFit: "contain",
              backgroundColor: "#f0f0f0",
            }}
          />
          <CardContent>
            <Typography variant="caption" color="textSecondary">
              Đăng lúc: {formatDate(photo.date_time)}
            </Typography>
            <Divider style={{ margin: "10px 0" }} />
            <Typography variant="h6">Bình luận:</Typography>

            {/* Hiển thị bình luận */}
            {photo.comments?.map((comment) => (
              <div
                key={comment._id}
                style={{
                  marginTop: "10px",
                  backgroundColor: "#f9f9f9",
                  padding: "10px",
                  borderRadius: "5px",
                }}
              >
                <Typography variant="body2">
                  <Link
                    to={`/users/${comment.user._id}`}
                    style={{
                      textDecoration: "none",
                      fontWeight: "bold",
                      color: "#1976d2",
                    }}
                  >
                    {comment.user.first_name} {comment.user.last_name}
                  </Link>
                  {" - "}
                  <span style={{ fontSize: "0.8em", color: "gray" }}>
                    {formatDate(comment.date_time)}
                  </span>
                </Typography>
                <Typography variant="body1" style={{ marginTop: "5px" }}>
                  {comment.comment}
                </Typography>
              </div>
            ))}

            {/* KHU VỰC THÊM BÌNH LUẬN MỚI */}
            <Box display="flex" alignItems="center" mt={3}>
              <TextField
                size="small"
                fullWidth
                variant="outlined"
                label="Viết bình luận..."
                value={newComments[photo._id] || ""}
                onChange={(e) => handleCommentChange(photo._id, e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") handleAddComment(photo._id);
                }}
              />
              <Button
                variant="contained"
                color="primary"
                style={{ marginLeft: "10px", minWidth: "80px" }}
                onClick={() => handleAddComment(photo._id)}
              >
                GỬI
              </Button>
            </Box>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default UserPhotos;
