import React, { useState } from "react";
import { Typography, Paper, TextField, Button, Box, Grid } from "@mui/material";
// 1. Thêm useNavigate vào import
import { useNavigate } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";

function LoginRegister({ onLogin }) {
  // 2. Khởi tạo hook điều hướng
  const navigate = useNavigate();

  // === STATE CHO ĐĂNG NHẬP ===
  const [loginName, setLoginName] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // === STATE CHO ĐĂNG KÝ ===
  const [regData, setRegData] = useState({
    login_name: "",
    password: "",
    password_confirm: "",
    first_name: "",
    last_name: "",
    location: "",
    description: "",
    occupation: "",
  });
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState("");

  // ==========================================
  // XỬ LÝ ĐĂNG NHẬP
  // ==========================================
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetchModel("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          login_name: loginName,
          password: loginPassword,
        }),
      });

      // Cập nhật state currentUser ở App.js
      onLogin(response.data);

      // Xóa lỗi hiển thị (nếu có)
      setLoginError("");

      // 3. TỰ ĐỘNG ĐIỀU HƯỚNG VỀ TRANG CỦA USER VỪA ĐĂNG NHẬP
      navigate(`/users/${response.data._id}`);
    } catch (error) {
      setLoginError(error.message);
    }
  };

  // ==========================================
  // XỬ LÝ ĐĂNG KÝ
  // ==========================================
  const handleRegChange = (e) => {
    setRegData({ ...regData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegError("");
    setRegSuccess("");

    // 1. Kiểm tra 2 mật khẩu có khớp nhau không
    if (regData.password !== regData.password_confirm) {
      return setRegError("Mật khẩu nhập lại không khớp!");
    }

    try {
      // 2. Gọi API Đăng ký
      await fetchModel("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(regData),
      });

      // 3. Đăng ký thành công: Hiển thị thông báo và xóa trắng Form
      setRegSuccess("Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.");
      setRegData({
        login_name: "",
        password: "",
        password_confirm: "",
        first_name: "",
        last_name: "",
        location: "",
        description: "",
        occupation: "",
      });
    } catch (error) {
      // 4. Lỗi: Hiển thị nguyên nhân chi tiết từ Backend
      setRegError(error.message);
    }
  };

  return (
    <Grid
      container
      spacing={4}
      style={{ padding: "40px", maxWidth: "1000px", margin: "0 auto" }}
    >
      {/* CỘT TRÁI: ĐĂNG NHẬP */}
      <Grid item xs={12} md={5}>
        <Paper style={{ padding: "30px", textAlign: "center", height: "100%" }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Đăng nhập
          </Typography>
          <form onSubmit={handleLogin}>
            <TextField
              label="Tên đăng nhập"
              variant="outlined"
              fullWidth
              margin="normal"
              required
              value={loginName}
              onChange={(e) => setLoginName(e.target.value)}
            />
            <TextField
              label="Mật khẩu"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              required
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
            {loginError && (
              <Typography
                color="error"
                variant="body2"
                style={{ marginTop: "10px" }}
              >
                {loginError}
              </Typography>
            )}
            <Box mt={3}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
              >
                Đăng Nhập
              </Button>
            </Box>
          </form>
        </Paper>
      </Grid>

      {/* CỘT PHẢI: ĐĂNG KÝ */}
      <Grid item xs={12} md={7}>
        <Paper style={{ padding: "30px", height: "100%" }}>
          <Typography
            variant="h4"
            gutterBottom
            fontWeight="bold"
            align="center"
          >
            Đăng ký tài khoản mới
          </Typography>
          <form onSubmit={handleRegister}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Tên đăng nhập (*)"
                  name="login_name"
                  variant="outlined"
                  fullWidth
                  required
                  value={regData.login_name}
                  onChange={handleRegChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Tên (First Name) (*)"
                  name="first_name"
                  variant="outlined"
                  fullWidth
                  required
                  value={regData.first_name}
                  onChange={handleRegChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Họ (Last Name) (*)"
                  name="last_name"
                  variant="outlined"
                  fullWidth
                  required
                  value={regData.last_name}
                  onChange={handleRegChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Mật khẩu (*)"
                  name="password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  required
                  value={regData.password}
                  onChange={handleRegChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Nhập lại mật khẩu (*)"
                  name="password_confirm"
                  type="password"
                  variant="outlined"
                  fullWidth
                  required
                  value={regData.password_confirm}
                  onChange={handleRegChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Nơi sống (Location)"
                  name="location"
                  variant="outlined"
                  fullWidth
                  value={regData.location}
                  onChange={handleRegChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Nghề nghiệp (Occupation)"
                  name="occupation"
                  variant="outlined"
                  fullWidth
                  value={regData.occupation}
                  onChange={handleRegChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Mô tả bản thân (Description)"
                  name="description"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={3}
                  value={regData.description}
                  onChange={handleRegChange}
                />
              </Grid>
            </Grid>

            {regError && (
              <Typography
                color="error"
                variant="body2"
                style={{ marginTop: "15px", textAlign: "center" }}
              >
                {regError}
              </Typography>
            )}
            {regSuccess && (
              <Typography
                style={{
                  color: "green",
                  marginTop: "15px",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                {regSuccess}
              </Typography>
            )}

            <Box mt={3}>
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                fullWidth
                size="large"
              >
                Register Me
              </Button>
            </Box>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default LoginRegister;
