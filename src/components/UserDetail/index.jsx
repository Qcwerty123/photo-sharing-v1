import React, { useState, useEffect } from 'react';
import { Typography, Button, Paper } from '@mui/material';
import { useParams, Link } from 'react-router-dom';
import fetchModel from '../../lib/fetchModelData';

function UserDetail() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserDetail = async () => {
      try {
        setLoading(true);
        const response = await fetchModel(`/user/${userId}`);
        setUser(response.data);
      } catch (error) {
        console.error("Lỗi lấy thông tin:", error);
      } finally {
        setLoading(false);
      }
    };
    loadUserDetail();
  }, [userId]); 

  if (loading) return <Typography style={{ padding: '20px' }}>Đang tải thông tin...</Typography>;
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