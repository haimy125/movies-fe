import axios from "axios";
import React, { useState } from 'react';
import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';
function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:1412/api/password-reset/request?email=${email}`);
      setMessage(response.data);
    } catch (error) {
      setMessage("Có lỗi xảy ra: " + error.response.data);
    }
  };

  return (
    <div className='font_body'>
      <Header />
      <div className="login-container">
        <div className='font_container'>
          <form onSubmit={handleSubmit} className="login-form">
            <label>
              Email:
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </label>
            <button type="submit">Gửi yêu cầu</button>
          </form>
          {message && <p>{message}</p>}
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default ForgetPassword;

// import axios from 'axios';
// import React, { useState } from 'react';
// import { useParams } from 'react-router-dom';
// import Footer from '../../components/Footer/Footer';
// import Header from '../../components/Header/Header';
// const ForgetPassword = () => {
//     const {id} = useParams();
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [error, setError] = useState('');
//   const [notificationMessage, setNotificationMessage] = useState('');
//   const [showNotification, setShowNotification] = useState(false);
//   const handleSubmit = async(event) => {
//     event.preventDefault();
//     try {
//       const response = await axios.post( `http://localhost:1412/api/changepassword/user?id=${id}&newPassword=${newPassword}&confirmPassword=${confirmPassword}`);
//       setNotificationMessage('bạn đã đổi mật khẩu thành công vui lòng quay lại trang đăng nhập để đăng nhập vào hệ thống!');
//       setShowNotification(true);
//     } catch (error) {
//       setError(error.response.data);
//     }
//   };
// const handleActiontologin =()=>{
//     setShowNotification(false)
//  window.location.href = '/login'
// }
//   return (
//     <div className='font_body'>
//       <Header/>
//       <div className="login-container">
//         <div className='font_container'>
//           <form onSubmit={handleSubmit} className="login-form">
//             <h2>Quên mật khẩu</h2>
//             <div className="form-group">
//               <label>Mật khẩu mới:</label>
//               <input
//                 className='form_input'
//                 placeholder='Nhập mật khẩu mới!'
//                 type="password"
//                 value={newPassword}
//                 onChange={(e) => setNewPassword(e.target.value)}
//                 required
//               />
//             </div>
//             <div className="form-group">
//               <label>Xác nhận mật khẩu:</label>
//               <input
//                 className='form_input'
//                 type="password"
//                 value={confirmPassword}
//                 placeholder='Nhập lại mật khẩu!'
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 required
//               />
//             </div>
//             {error && <p style={{color:'red'}}>{error}</p>}
//             <button type="submit" className="login-button">Đăng nhập</button>
//             <p >Bạn đã có tài khoản.<a href='/login'>Đăng nhập</a>  tài đây!</p>
//           </form>
//         </div>
//       </div>
//       <Footer/>
//       {showNotification && (
//         <>
//           <div className='notification-background'></div>
//           <div className='notification'>
//             <p>{notificationMessage}</p>
//             <button className='notification_button' onClick={() => handleActiontologin()}>Xác nhận</button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default ForgetPassword;

