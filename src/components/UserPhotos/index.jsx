import React from 'react';
import { Typography, Card, CardMedia, CardContent, Divider } from '@mui/material';
import { useParams, Link } from 'react-router-dom';
import fetchModel from '../../modelData/models';
import './styles.css'; 

function UserPhotos() {
  const { userId } = useParams();
  const photos = fetchModel.photoOfUserModel(userId);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  if (!photos || photos.length === 0) {
    return <Typography>Người dùng này chưa đăng bức ảnh nào.</Typography>;
  }

  return (
    <div>
      {photos.map((photo) => (
        <Card key={photo._id} className="photo-card">
          <CardMedia
            component="img"
            src={require(`../../images/${photo.file_name}`)}
            alt="User photo"
            className="photo-media"
          />
          <CardContent>
            <Typography variant="caption" color="textSecondary">
              Đăng lúc: {formatDate(photo.date_time)}
            </Typography>
            <Divider className="photo-divider" />
            
            <Typography variant="h6">Bình luận:</Typography>
            {photo.comments && photo.comments.length > 0 ? (
              photo.comments.map((comment) => (
                <div key={comment._id} className="comment-container">
                  <Typography variant="body2">
                    <Link to={`/users/${comment.user._id}`} className="comment-user-link">
                      {comment.user.first_name} {comment.user.last_name}
                    </Link>
                    {' - '}
                    <span className="comment-date">
                      {formatDate(comment.date_time)}
                    </span>
                  </Typography>
                  <Typography variant="body1" className="comment-text">
                    {comment.comment}
                  </Typography>
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