import React from 'react';
import { Typography, Card, CardMedia, CardContent, Divider, Button } from '@mui/material';
import { useParams, Link, useNavigate } from 'react-router-dom';
import models from '../../modelData/models';

function UserPhotos({ advancedFeatures }) {
  const { userId, photoId } = useParams();
  const navigate = useNavigate(); // Dùng useNavigate cho React Router v6
  const photos = models.photoOfUserModel(userId);

  // Helper format ngày tháng
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  if (!photos || photos.length === 0) {
    return <Typography style={{ padding: '20px' }}>Người dùng này chưa đăng bức ảnh nào.</Typography>;
  }

  // ==========================================
  // CHẾ ĐỘ: NÂNG CAO (EXTRA CREDIT)
  // ==========================================
  if (advancedFeatures) {
    let currentIndex = photos.findIndex(p => p._id === photoId);
    if (currentIndex === -1) currentIndex = 0; // Mặc định ảnh đầu tiên
    
    const currentPhoto = photos[currentIndex];

    const handlePrev = () => {
      const prevPhoto = photos[currentIndex - 1];
      navigate(`/photos/${userId}/${prevPhoto._id}`);
    };

    const handleNext = () => {
      const nextPhoto = photos[currentIndex + 1];
      navigate(`/photos/${userId}/${nextPhoto._id}`);
    };

    return (
      <Card style={{ maxWidth: '800px', margin: '20px auto' }}>
        {/* Bộ điều khiển Stepper */}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px' }}>
          <Button variant="contained" disabled={currentIndex === 0} onClick={handlePrev}>
            Back
          </Button>
          <Typography variant="body1" style={{ alignSelf: 'center', fontWeight: 'bold' }}>
            Ảnh {currentIndex + 1} / {photos.length}
          </Typography>
          <Button variant="contained" disabled={currentIndex === photos.length - 1} onClick={handleNext}>
            Next
          </Button>
        </div>

        <CardMedia
          component="img"
          src={require(`../../images/${currentPhoto.file_name}`)}
          alt="User photo"
          style={{ maxHeight: '600px', objectFit: 'contain', backgroundColor: '#f0f0f0' }}
        />
    

        <CardContent>
          <Typography variant="caption" color="textSecondary">
            Đăng lúc: {formatDate(currentPhoto.date_time)}
          </Typography>
          <Divider style={{ margin: '10px 0' }} />
          <Typography variant="h6">Bình luận:</Typography>
          {currentPhoto.comments && currentPhoto.comments.length > 0 ? (
            currentPhoto.comments.map((comment) => (
              <div key={comment._id} style={{ marginTop: '10px', backgroundColor: '#f9f9f9', padding: '10px', borderRadius: '5px' }}>
                <Typography variant="body2">
                  <Link to={`/users/${comment.user._id}`} style={{ textDecoration: 'none', fontWeight: 'bold', color: '#1976d2' }}>
                    {comment.user.first_name} {comment.user.last_name}
                  </Link>
                  {' - '}<span style={{ fontSize: '0.8em', color: 'gray' }}>{formatDate(comment.date_time)}</span>
                </Typography>
                <Typography variant="body1" style={{ marginTop: '5px' }}>{comment.comment}</Typography>
              </div>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary">Chưa có bình luận nào.</Typography>
          )}
        </CardContent>
      </Card>
    );
  }

  // ==========================================
  // CHẾ ĐỘ: CƠ BẢN (HIỂN THỊ TẤT CẢ)
  // ==========================================
  return (
    <div style={{ padding: '20px' }}>
      {photos.map((photo) => (
        <Card key={photo._id} style={{ marginBottom: '40px' }}>
          <CardMedia
            component="img"
            src={require(`../../images/${photo.file_name}`)}
            alt="User photo"
            style={{ maxHeight: '600px', objectFit: 'contain', backgroundColor: '#f0f0f0' }}
          />
          <CardContent>
            <Typography variant="caption" color="textSecondary">
              Đăng lúc: {formatDate(photo.date_time)}
            </Typography>
            <Divider style={{ margin: '10px 0' }} />
            
            <Typography variant="h6">Bình luận:</Typography>
            {photo.comments && photo.comments.length > 0 ? (
              photo.comments.map((comment) => (
                <div key={comment._id} style={{ marginTop: '10px', backgroundColor: '#f9f9f9', padding: '10px', borderRadius: '5px' }}>
                  <Typography variant="body2">
                    <Link to={`/users/${comment.user._id}`} style={{ textDecoration: 'none', fontWeight: 'bold', color: '#1976d2' }}>
                      {comment.user.first_name} {comment.user.last_name}
                    </Link>
                    {' - '}<span style={{ fontSize: '0.8em', color: 'gray' }}>{formatDate(comment.date_time)}</span>
                  </Typography>
                  <Typography variant="body1" style={{ marginTop: '5px' }}>{comment.comment}</Typography>
                </div>
              ))
            ) : (
              <Typography variant="body2" color="textSecondary">Chưa có bình luận nào.</Typography>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default UserPhotos;