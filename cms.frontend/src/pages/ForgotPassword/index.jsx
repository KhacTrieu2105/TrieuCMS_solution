import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import customerService from "../../services/customerService";

const ForgotPassword = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setMessage("");
        setError("");

        try {
            const res = await customerService.forgotPassword(email);

            console.log(res);

            setMessage(res.message);

            navigate("/reset-password", {
                state: { email }
            });
        }
        catch (err) {
            console.log(err);

            setError(
                err.response?.data?.message ??
                "Không thể gửi OTP."
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
                style={{ maxWidth: "450px", width: "100%" }}
            >
                <div className="card-body p-4">

                    <h2 className="text-center mb-4">
                        Quên mật khẩu
                    </h2>

                    <p className="text-center text-muted">
                        Nhập email đã đăng ký để nhận mã OTP.
                    </p>

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
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Nhập email"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-100"
                            disabled={loading}
                        >
                            {loading
                                ? "Đang gửi..."
                                : "Gửi mã OTP"}
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

export default ForgotPassword;