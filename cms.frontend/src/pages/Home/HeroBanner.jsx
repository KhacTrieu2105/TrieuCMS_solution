import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';

const API_URL = "https://localhost:7186";

// Slide mặc định — có thể truyền props.slides để lấy dữ liệu từ API/CMS
const defaultSlides = [
    {
        theme: 'tech',
        icon: 'bi-cpu',
        eyebrow: 'CÔNG NGHỆ MỚI VỀ',
        title: 'Laptop & điện thoại chính hãng',
        subtitle: 'Trả góp 0% lãi suất, bảo hành chính hãng 12 tháng cho mọi sản phẩm.',
        ctaText: 'Khám phá ngay',
        ctaLink: '/cong-nghe',
    },
   
    {
        theme: 'sale',
        icon: 'bi-lightning-charge',
        eyebrow: 'KHUYẾN MÃI TUẦN NÀY',
        title: 'Giảm đến 30% toàn sàn',
        subtitle: 'Áp dụng cho tất cả sản phẩm , số lượng có hạn.',
        ctaText: 'Săn deal ngay',
        ctaLink: '/khuyen-mai',
    },
];

const AUTOPLAY_MS = 5000;

const HeroBanner = ({ slides = defaultSlides, autoplay = true }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const touchStartX = useRef(null);

    const goTo = useCallback((index) => {
        const total = slides.length;
        setActiveIndex(((index % total) + total) % total);
    }, [slides.length]);

    const next = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
    const prev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

    useEffect(() => {
        if (!autoplay || isPaused || slides.length <= 1) return;
        const timer = setInterval(next, AUTOPLAY_MS);
        return () => clearInterval(timer);
    }, [autoplay, isPaused, next, slides.length]);

    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };
    const handleTouchEnd = (e) => {
        if (touchStartX.current === null) return;
        const delta = e.changedTouches[0].clientX - touchStartX.current;
        if (delta > 50) prev();
        else if (delta < -50) next();
        touchStartX.current = null;
    };

    return (
        <div
            className="hero-banner"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <div
                className="hero-track"
                style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
                {slides.map((slide, i) => (
                    <div className={`hero-slide theme-${slide.theme}`} key={i}>
                        {slide.imageUrl ? (
                            <img
                                src={`${API_URL}${slide.imageUrl}`}
                                alt=""
                                className="hero-watermark-img"
                                aria-hidden="true"
                            />
                        ) : (
                            <i className={`bi ${slide.icon} hero-watermark`} aria-hidden="true"></i>
                        )}

                        <div className="hero-content">
                            <span className="hero-eyebrow">
                                <i className={`bi ${slide.icon}`}></i> {slide.eyebrow}
                            </span>
                            <h2 className="hero-title">{slide.title}</h2>
                            <p className="hero-subtitle">{slide.subtitle}</p>
                            <Link to={slide.ctaLink} className="hero-cta">
                                {slide.ctaText} <i className="bi bi-arrow-right"></i>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {slides.length > 1 && (
                <>
                    <button className="hero-arrow prev" onClick={prev} aria-label="Banner trước">
                        <i className="bi bi-chevron-left"></i>
                    </button>
                    <button className="hero-arrow next" onClick={next} aria-label="Banner tiếp theo">
                        <i className="bi bi-chevron-right"></i>
                    </button>

                    <div className="hero-dots">
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                className={`hero-dot ${i === activeIndex ? 'active' : ''}`}
                                onClick={() => goTo(i)}
                                aria-label={`Đến banner ${i + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default HeroBanner;