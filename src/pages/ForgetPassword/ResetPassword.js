import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Loader from "../../components/Loader/Loader";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // Lấy token từ URL
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [notification, setNotification] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (newPassword !== confirmPassword) {
      setNotification("Mật khẩu xác nhận không khớp.");
      setLoading(false);

      return;
    }

    try {
      const response = await fetch(
        "http://localhost:1412/api/password-reset/reset",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, newPassword }),
        }
      );

      if (response.ok) {
        setLoading(false);
        setNotification("Mật khẩu đã được thay đổi thành công.");
        navigate("/login");
      } else {
        setLoading(false);
        const data = await response.json();
        setError(data.message || "Đã xảy ra lỗi khi đặt lại mật khẩu.");
      }
    } catch (error) {
      setLoading(false);
      setError("Không thể kết nối với máy chủ.");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="font_body">
      <Header />
      <div className="login-container">
        <div className="font_container">
          <form onSubmit={handleSubmit} className="login-form">
            <h2>Đặt lại mật khẩu</h2>

            {/* Nhập tên đăng nhập */}
            <div className="form-group">
              <label>Đặt lại mật khẩu:</label>
              <input
                className="form_input"
                placeholder="Nhập mật khẩu mới!"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            {/* Nhập mật khẩu */}
            <div className="form-group">
              <label>Xác nhận mật khẩu:</label>
              <input
                className="form_input"
                placeholder="Nhập mật khẩu xác nhận"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {/* Tùy chọn nhớ tài khoản */}
            <div className="rememberandforgot">
              <div className="rememberitem">
                {/* <div className="form-group remember">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label htmlFor="remember">Nhớ tài khoản</label>
                </div> */}
                {/* <div className="form-group">
                  <label>
                    <a className="forgotpassword" href="/security/finduser">
                      Quên mật khẩu?
                    </a>
                  </label>
                </div> */}
              </div>
            </div>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            {notification && (
              <div className="alert alert-success" role="alert">
                {notification}
              </div>
            )}
            <button type="submit" disabled={loading} className="login-button">
              {loading ? "Đang reset mật khẩu..." : "Reset Mật khẩu"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ResetPassword;
