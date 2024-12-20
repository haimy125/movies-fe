import { useSearchParams } from "react-router-dom";
import { useState } from "react";

function ResetPassword() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token"); // Lấy token từ URL
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setMessage("Mật khẩu xác nhận không khớp.");
            return;
        }

        try {
            const response = await fetch("http://localhost:1412/api/password-reset/reset", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token, newPassword }),
            });
    
            if (response.ok) {
                setMessage("Mật khẩu đã được thay đổi thành công.");
            } else {
                const data = await response.json();
                setMessage(data.message || "Đã xảy ra lỗi khi đặt lại mật khẩu.");
            }
        } catch (error) {
            setMessage("Không thể kết nối với máy chủ.");
        }
    };

    return (
        <div>
            <h2>Đặt lại mật khẩu</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Mật khẩu mới:</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Xác nhận mật khẩu:</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Đặt lại mật khẩu</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default ResetPassword;
