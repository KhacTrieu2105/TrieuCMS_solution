import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import customerService from "../../services/customerService";

const ResetPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [email, setEmail] = useState(location.state?.email || "");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError("");
        setMessage("");

        try {
            const res = await customerService.resetPassword({
                email,
                otp,
                newPassword
            });

            setMessage(res.message || "Đổi mật khẩu thành công.");

            setTimeout(() => {
                navigate("/login");
            }, 2000);
        }
        catch (err) {
            setError(
                err.response?.data?.message ||
                err.response?.data ||
                "Đổi mật khẩu thất bại."
            );
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="container py-5 d-flex justify-content-center align-items-center"
            style={{ minHeight: "70vh" }}
        >
            <div
                className="card shadow"
                style={{ width: "450px" }}
            >
                <div className="card-body p-4">

                    <h2 className="text-center mb-4">
                        Đặt lại mật khẩu
                    </h2>

                    {message &&
                        <div className="alert alert-success">
                            {message}
                        </div>
                    }

                    {error &&
                        <div className="alert alert-danger">
                            {error}
                        </div>
                    }

                    <form onSubmit={handleSubmit}>

                        <div className="mb-3">
                            <label>Email</label>

                            <input
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label>Mã OTP</label>

                            <input
                                className="form-control"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label>Mật khẩu mới</label>

                            <input
                                type="password"
                                className="form-control"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            className="btn btn-success w-100"
                            disabled={loading}
                        >
                            {loading
                                ? "Đang xử lý..."
                                : "Đổi mật khẩu"}
                        </button>

                    </form>

                    <div className="text-center mt-3">
                        <Link to="/login">
                            Quay lại đăng nhập
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ResetPassword;