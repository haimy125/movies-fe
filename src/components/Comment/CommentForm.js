import axios from 'axios';
import React, { useState } from 'react';
import { useAuth } from '../../services/authService';
import './CommentForm.css';
const CommentForm = ({ onAddComment, movieid, userid }) => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:1412/api/user/comment/movie/add?movieid=${movieid}&userid=${userid}&content=${comment}`);
      alert('Bạn đã bình luận thành công!');

      window.location.reload();
    } catch (error) {
      alert(error.response.data);
      console.error(error);
    }
  };

  return (
    <form className="comment-form" onSubmit={handleSubmit}>

      <div className="form-group-comment">
        <label htmlFor="comment">Bình luận:</label>
        <textarea
          id="comment"
          className='comment_input'
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        ></textarea>
      </div>
      <button type="submit">Gửi bình luận</button>
    </form>
  );
};

export default CommentForm;
