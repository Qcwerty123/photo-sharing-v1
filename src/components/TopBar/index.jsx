import React, { useState, useEffect, useRef } from "react"; // Thêm useRef
import {
  AppBar,
  Toolbar,
  Typography,
  Checkbox,
  FormControlLabel,
  Button,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom"; // Thêm useNavigate
import fetchModel from "../../lib/fetchModelData";

function TopBar({
  advancedFeatures,
  setAdvancedFeatures,
  currentUser,
  setCurrentUser,
}) {
  const location = useLocation();
  const path = location.pathname;
  const navigate = useNavigate(); // Hook dùng để chuyển trang sau khi upload xong

  const [contextText, setContextText] = useState("Trang chủ");

  // Tham chiếu (ref) đến thẻ input file đang bị ẩn
  const uploadInputRef = useRef(null);

  // Xử lý sự kiện đăng xuất
  const handleLogout = async () => {
    try {
      await fetchModel("/api/admin/logout", { method: "POST" });
      setCurrentUser(null);
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    }
  };

  // Dùng useEffect để gọi API lấy tên người dùng mỗi khi URL thay đổi
  useEffect(() => {
    const fetchContext = async () => {
      if (!currentUser) return;
      try {
        if (path.includes("/photos/")) {
          const userId = path.split("/")[2];
          const response = await fetchModel(`/api/user/${userId}`);
          setContextText(
            `Photos of ${response.data.first_name} ${response.data.last_name}`
          );
        } else if (path.includes("/users/")) {
          const userId = path.split("/users/")[1];
          if (userId) {
            const response = await fetchModel(`/api/user/${userId}`);
            setContextText(
              `${response.data.first_name} ${response.data.last_name}`
            );
          } else {
            setContextText("Danh sách người dùng");
          }
        } else if (path.includes("/comments/")) {
          setContextText("Lịch sử bình luận");
        } else {
          setContextText("Trang chủ");
        }
      } catch (error) {
        console.error("Không lấy được ngữ cảnh:", error);
        setContextText("...");
      }
    };

    fetchContext();
  }, [path, currentUser]);

  // ==========================================
  // HÀM MỚI (PROBLEM 3): XỬ LÝ UPLOAD ẢNH
  // ==========================================
  const handlePhotoUpload = async (e) => {
    // Nếu người dùng có chọn file
    if (e.target.files.length > 0) {
      const file = e.target.files[0];

      // Đóng gói file vào FormData
      const formData = new FormData();
      formData.append("photo", file);

      try {
        // Dùng fetch gốc (Native Fetch) thay vì fetchModel để trình duyệt tự tạo Header multipart/form-data
        const response = await fetch(
          "https://s5wc99-8080.csb.app/api/photo/new",
          {
            method: "POST",
            body: formData,
            credentials: "include", // Quan trọng: Đính kèm cookie (session) để Backend biết ai đang upload
          }
        );

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(errText || "Lỗi khi tải ảnh lên");
        }

        alert("Tải ảnh lên thành công!");

        // Điều hướng người dùng về trang xem ảnh của chính họ để thấy ảnh mới
        navigate(`/photos/${currentUser._id}`);
        // Refresh nhẹ trang web để kích hoạt useEffect load lại ảnh
        window.location.reload();
      } catch (error) {
        alert("Upload thất bại: " + error.message);
      } finally {
        // Reset lại value của input để nếu người dùng muốn upload lại đúng tấm ảnh đó thì onChange vẫn kích hoạt
        e.target.value = null;
      }
    }
  };

  return (
    <AppBar className="cs142-topbar-appBar" position="fixed">
      <Toolbar>
        {/* Tên ứng dụng */}
        <Typography
          variant="h6"
          color="inherit"
          style={{ fontWeight: "bold", marginRight: "30px" }}
        >
          PhotoSharingAPP
        </Typography>

        {/* Hiển thị "Hi <firstname>" hoặc "Please Login" */}
        <Typography variant="h6" color="inherit" style={{ flexGrow: 1 }}>
          {currentUser ? `Hi ${currentUser.first_name}` : "Please Login"}
        </Typography>

        {/* CÁC CHỨC NĂNG BÊN PHẢI (Chỉ hiện khi đã đăng nhập) */}
        {currentUser && (
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

            {/* ========================================== */}
            {/* GIAO DIỆN MỚI (PROBLEM 3): NÚT ADD PHOTO */}
            {/* ========================================== */}

            {/* 1. Thẻ input file bị ẩn */}
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              ref={uploadInputRef}
              onChange={handlePhotoUpload}
            />

            {/* 2. Nút bấm hiển thị ra ngoài (khi bấm sẽ kích hoạt cái thẻ input ẩn ở trên) */}
            <Button
              variant="outlined"
              color="inherit"
              style={{ marginLeft: "10px" }}
              onClick={() => uploadInputRef.current.click()}
            >
              Add Photo
            </Button>

            {/* Nút Đăng xuất */}
            <Button
              variant="outlined"
              color="inherit"
              onClick={handleLogout}
              style={{ marginLeft: "10px" }}
            >
              Logout
            </Button>
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
