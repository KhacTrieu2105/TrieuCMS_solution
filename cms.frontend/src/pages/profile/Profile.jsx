import React, { useState, useEffect } from 'react';
import authService from '../../services/customerService';

const Profile = () => {
    const [activeTab, setActiveTab] = useState('info');
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            const data = await authService.getProfile();
            setUser(data);
            setLoading(false);
        };
        fetchProfile();
    }, []);

    if (loading) return <div className="text-center py-5">Đang tải...</div>;

    return (
        <div className="container py-5">
            <div className="row">
                <div className="col-md-3">
                    <div className="list-group">
                        <button className={`list-group-item ${activeTab === 'info' ? 'active' : ''}`} onClick={() => setActiveTab('info')}>Thông tin tài khoản</button>
                        <button className={`list-group-item ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>Lịch sử đơn hàng</button>
                        <button className={`list-group-item ${activeTab === 'password' ? 'active' : ''}`} onClick={() => setActiveTab('password')}>Đổi mật khẩu</button>
                    </div>
                </div>
                <div className="col-md-9">
                    {activeTab === 'info' && <ProfileInfo user={user} />}
                    {activeTab === 'orders' && <OrderHistory />}
                    {activeTab === 'password' && <ChangePassword />}
                </div>
            </div>
        </div>
    );
};

// --- Sub-components ---

const ProfileInfo = ({ user }) => (
    <div className="card p-4">
        <h4>Thông tin tài khoản</h4>
        <p><strong>Họ tên:</strong> {user.fullName}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>SĐT:</strong> {user.phone || 'Chưa cập nhật'}</p>
        <p><strong>Địa chỉ:</strong> {user.address || 'Chưa cập nhật'}</p>
    </div>
);

const OrderHistory = () => (
    <div className="card p-4">
        <h4>Lịch sử đơn hàng</h4>
        <table className="table">
            <thead><tr><th>Mã đơn</th><th>Ngày</th><th>Tổng tiền</th><th>Trạng thái</th></tr></thead>
            <tbody>{/* Render danh sách đơn hàng từ API tại đây */}</tbody>
        </table>
    </div>
);

const ChangePassword = () => {
    const [pass, setPass] = useState({ oldPass: '', newPass: '', confirmPass: '' });

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (pass.newPass !== pass.confirmPass) return alert("Mật khẩu không khớp");
        // Gọi API cập nhật mật khẩu tại đây
    };

    return (
        <form className="card p-4" onSubmit={handleUpdate}>
            <h4>Đổi mật khẩu</h4>
            <input type="password" placeholder="Mật khẩu cũ" className="form-control mb-2" onChange={(e) => setPass({ ...pass, oldPass: e.target.value })} />
            <input type="password" placeholder="Mật khẩu mới" className="form-control mb-2" onChange={(e) => setPass({ ...pass, newPass: e.target.value })} />
            <input type="password" placeholder="Xác nhận mật khẩu mới" className="form-control mb-2" onChange={(e) => setPass({ ...pass, confirmPass: e.target.value })} />
            <button className="btn btn-primary">Cập nhật</button>
        </form>
    );
};

export default Profile;