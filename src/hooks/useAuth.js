// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import api from '../configs/axios';

export const useAuth = () => {
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Kiểm tra localStorage trước
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const { userId, userName } = JSON.parse(storedUser);
          setUserId(userId);
          setUserName(userName);
          return;
        }

        // 2. Lấy userId từ token (nếu có)
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No authentication token found');
          return;
        }

        // 3. Giải mã token để lấy userId (nếu cần)
        // Hoặc sử dụng endpoint phù hợp hơn
        const response = await api.get('/auth/me'); // Thay bằng endpoint chính xác
        
        // 4. Giả sử API trả về data có cấu trúc { id, username }
        const { id: userId, username: userName } = response.data;
        
        setUserId(userId);
        setUserName(userName);
        localStorage.setItem('user', JSON.stringify({ userId, userName }));
      } catch (err) {
        console.error('Error fetching user:', err);
        setError(err.response?.data?.message || 'Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { userId, userName, loading, error };
};