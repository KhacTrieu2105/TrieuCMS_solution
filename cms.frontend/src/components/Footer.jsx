/// <reference path="productcard.jsx" />



const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <footer className="site-footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-col footer-brand">
                        <a className="brand-logo brand-logo-light" href="/">
                            <i className="bi bi-shop"></i>
                            <span>Trieu<strong>CMS</strong></span>
                        </a>
                        <p>
                            Điểm đến cho cả công nghệ — từ laptop, điện thoại.
                           
                        </p>
                        <div className="footer-socials">
                            <a href="#" aria-label="Facebook"><i className="bi bi-facebook"></i></a>
                            <a href="#" aria-label="Instagram"><i className="bi bi-instagram"></i></a>
                            <a href="#" aria-label="Youtube"><i className="bi bi-youtube"></i></a>
                            <a href="#" aria-label="TikTok"><i className="bi bi-tiktok"></i></a>
                        </div>
                    </div>

                    <div className="footer-col">
                        <h6>Danh mục</h6>
                        <ul>
                            <li><a href="/cong-nghe">Công nghệ</a></li>
                          
                            <li><a href="/khuyen-mai">Khuyến mãi</a></li>
                            <li><a href="/blog">Bài viết</a></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h6>Hỗ trợ khách hàng</h6>
                        <ul>
                            <li><a href="/huong-dan-mua-hang">Hướng dẫn mua hàng</a></li>
                            <li><a href="/chinh-sach-doi-tra">Chính sách đổi trả</a></li>
                            <li><a href="/van-chuyen">Vận chuyển &amp; thanh toán</a></li>
                            <li><a href="/cau-hoi-thuong-gap">Câu hỏi thường gặp</a></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h6>Liên hệ</h6>
                        <ul className="footer-contact">
                            <li><i className="bi bi-geo-alt"></i> 123 Đường ABC, Quận 1, TP.HCM</li>
                            <li><i className="bi bi-telephone"></i> 1900 1234</li>
                            <li><i className="bi bi-envelope"></i> support@trieucms.tech</li>
                        </ul>
                    </div>
                </div>

                <hr className="footer-divider" />

                <div className="footer-bottom">
                    <p className="mb-0">© {year} TrieuCMS.Technology. All Rights Reserved.</p>
                    <div className="payment-icons">
                        <i className="bi bi-credit-card"></i>
                        <i className="bi bi-wallet2"></i>
                        <i className="bi bi-cash-coin"></i>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer; // Bắt buộc phải là export default