import React, { useState, useEffect } from 'react';
import { Typography, Card, CardMedia, CardContent, Divider, Button } from '@mui/material';
import { useParams, Link, useNavigate } from 'react-router-dom';
import fetchModel from '../../lib/fetchModelData';

function UserPhotos({ advancedFeatures }) {
  const { userId, photoId } = useParams();
  const navigate = useNavigate();
  
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPhotos = async () => {
      try {
        setLoading(true);
        const response = await fetchModel(`/photosOfUser/${userId}`);
        setPhotos(response.data);
      } catch (error) {
        console.error("Lỗi lấy ảnh:", error);
      } finally {
        setLoading(false);
      }
    };
    loadPhotos();
  }, [userId]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', { 
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
  };

  if (loading) return <Typography style={{ padding: '20px' }}>Đang tải ảnh...</Typography>;
  if (photos.length === 0) return <Typography style={{ padding: '20px' }}>Chưa có bức ảnh nào.</Typography>;

  // === EXTRA CREDIT: CHẾ ĐỘ STEPPER ===
  if (advancedFeatures) {
    let currentIndex = photos.findIndex(p => p._id === photoId);
    if (currentIndex === -1) currentIndex = 0;
    
    const currentPhoto = photos[currentIndex];

    return (
      <Card style={{ maxWidth: '800px', margin: '20px auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px' }}>
          <Button variant="contained" disabled={currentIndex === 0} 
            onClick={() => navigate(`/photos/${userId}/${photos[currentIndex - 1]._id}`)}>
            Back
          </Button>
          <Typography variant="body1" style={{ alignSelf: 'center', fontWeight: 'bold' }}>
            Ảnh {currentIndex + 1} / {photos.length}
          </Typography>
          <Button variant="contained" disabled={currentIndex === photos.length - 1} 
            onClick={() => navigate(`/photos/${userId}/${photos[currentIndex + 1]._id}`)}>
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
          <Typography variant="caption" color="textSecondary">Đăng lúc: {formatDate(currentPhoto.date_time)}</Typography>
          <Divider style={{ margin: '10px 0' }} />
          <Typography variant="h6">Bình luận:</Typography>
          {currentPhoto.comments?.map((comment) => (
            <div key={comment._id} style={{ marginTop: '10px', backgroundColor: '#f9f9f9', padding: '10px', borderRadius: '5px' }}>
              <Typography variant="body2">
                <Link to={`/users/${comment.user._id}`} style={{ textDecoration: 'none', fontWeight: 'bold', color: '#1976d2' }}>
                  {comment.user.first_name} {comment.user.last_name}
                </Link>
                {' - '}<span style={{ fontSize: '0.8em', color: 'gray' }}>{formatDate(comment.date_time)}</span>
              </Typography>
              <Typography variant="body1" style={{ marginTop: '5px' }}>{comment.comment}</Typography>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  // === CHẾ ĐỘ HIỂN THỊ TẤT CẢ ===
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
            <Typography variant="caption" color="textSecondary">Đăng lúc: {formatDate(photo.date_time)}</Typography>
            <Divider style={{ margin: '10px 0' }} />
            <Typography variant="h6">Bình luận:</Typography>
            {photo.comments?.map((comment) => (
              <div key={comment._id} style={{ marginTop: '10px', backgroundColor: '#f9f9f9', padding: '10px', borderRadius: '5px' }}>
                <Typography variant="body2">
                  <Link to={`/users/${comment.user._id}`} style={{ textDecoration: 'none', fontWeight: 'bold', color: '#1976d2' }}>
                    {comment.user.first_name} {comment.user.last_name}
                  </Link>
                  {' - '}<span style={{ fontSize: '0.8em', color: 'gray' }}>{formatDate(comment.date_time)}</span>
                </Typography>
                <Typography variant="body1" style={{ marginTop: '5px' }}>{comment.comment}</Typography>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default UserPhotos;