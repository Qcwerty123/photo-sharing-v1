import React from 'react';
import { Typography, Button, Paper } from '@mui/material';
import { useParams, Link } from 'react-router-dom';
import fetchModel from '../../modelData/models';
import './styles.css'; 

function UserDetail() {
  const { userId } = useParams();
  const user = fetchModel.userModel(userId);

  if (!user) return <Typography>Người dùng không tồn tại.</Typography>;

  return (
    <Paper className="user-detail-paper">
      <Typography variant="h4" gutterBottom>
        {user.first_name} {user.last_name}
      </Typography>
      <Typography variant="body1"><strong>Location:</strong> {user.location}</Typography>
      <Typography variant="body1"><strong>Occupation:</strong> {user.occupation}</Typography>
      <Typography variant="body1"><strong>Description:</strong> {user.description}</Typography>
      
      <Button 
        variant="contained" 
        color="primary" 
        component={Link} 
        to={`/photos/${user._id}`}
        className="view-photos-button"
      >
        Xem ảnh của {user.first_name}
      </Button>
    </Paper>
  );
}

export default UserDetail;