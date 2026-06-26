import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';

const API_URL = "https://localhost:7186";
const AUTOPLAY_MS = 5000;

const HeroBanner = ({ autoplay = true }) => {
    // 1. Khởi tạo state là mảng rỗng []
    const [slides, setSlides] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        fetch(`${API_URL}/api/advertisements`)
            .then(res => {
                if (!res.ok) throw new Error("Network response was not ok");
                return res.json();
            })
            .then(data => {
                // 2. Đảm bảo dữ liệu nhận về là mảng trước khi set
                if (Array.isArray(data)) {
                    setSlides(data);
                } else {
                    console.error("Dữ liệu từ API không phải là mảng:", data);
                    setSlides([]);
                }
            })
            .catch(err => {
                console.error("Lỗi lấy dữ liệu banner:", err);
                setSlides([]); // Reset về mảng rỗng nếu có lỗi
            });
    }, []);

    const goTo = useCallback((index) => {
        const total = slides.length;
        if (total === 0) return;
        setActiveIndex(((index % total) + total) % total);
    }, [slides.length]);

    const next = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
    const prev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

    useEffect(() => {
        if (!autoplay || isPaused || slides.length <= 1) return;
        const timer = setInterval(next, AUTOPLAY_MS);
        return () => clearInterval(timer);
    }, [autoplay, isPaused, next, slides.length]);

    // 3. Kiểm tra an toàn trước khi render
    if (!Array.isArray(slides) || slides.length === 0) return null;

    return (
        <div className="hero-banner"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}>

            <div className="hero-track" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
                {slides.map((slide, i) => (
                    <div className={`hero-slide theme-${slide.theme}`} key={slide.id || i}>
                        {slide.imageUrl ? (
                            <img src={`${API_URL}${slide.imageUrl}`} alt={slide.title} className="hero-watermark-img" />
                        ) : (
                            <i className={`bi ${slide.icon} hero-watermark`}></i>
                        )}

                        <div className="hero-content">
                            <span className="hero-eyebrow">
                                <i className={`bi ${slide.icon}`}></i> {slide.title}
                            </span>
                            <h2 className="hero-title">{slide.title}</h2>
                            <p className="hero-subtitle">{slide.subtitle}</p>
                            <Link to={slide.ctaLink || "#"} className="hero-cta">
                                {slide.ctaText} <i className="bi bi-arrow-right"></i>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {slides.length > 1 && (
                <>
                    <button className="hero-arrow prev" onClick={prev}><i className="bi bi-chevron-left"></i></button>
                    <button className="hero-arrow next" onClick={next}><i className="bi bi-chevron-right"></i></button>
                    <div className="hero-dots">
                        {slides.map((_, i) => (
                            <button key={i} className={`hero-dot ${i === activeIndex ? 'active' : ''}`} onClick={() => goTo(i)} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default HeroBanner;