import React from 'react';
import { Typography, Button, Paper } from '@mui/material';
import { useParams, Link } from 'react-router-dom';
import models from '../../modelData/models';

function UserDetail() {
  const { userId } = useParams();
  const user = models.userModel(userId);

  if (!user) return <Typography style={{ padding: '20px' }}>Người dùng không tồn tại.</Typography>;

  return (
    <Paper style={{ padding: '20px', margin: '20px' }} elevation={3}>
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
        style={{ marginTop: '20px' }}
      >
        Xem ảnh của {user.first_name}
      </Button>
    </Paper>
  );
}

export default UserDetail;